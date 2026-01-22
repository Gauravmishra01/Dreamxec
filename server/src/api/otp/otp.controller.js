const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const sendEmail = require("../../services/email.service");
const { sendWhatsAppMessage } = require("../../services/whatsapp.service");
const redis = require("../../services/redis.service");

/* ───────────────── CONSTANTS ───────────────── */
const OTP_EXPIRY = 300;              // 5 minutes
const COOLDOWN_PERIOD = 60;          // 1 minute
const RATE_LIMIT_WINDOW = 900;       // 15 minutes
const MAX_REQUESTS = 3;
const MAX_VERIFY_ATTEMPTS = 3;
const LOCK_PERIOD = 1800;            // 30 minutes

/* ───────────────── HELPERS ───────────────── */

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// 🟢 FIX: Robust TTL checker that never returns negative numbers
const safeTTL = async (key, fallback) => {
  try {
    const ttl = await redis.ttl(key);
    
    // Case -2: Key does not exist (Expired during race condition)
    if (ttl === -2) {
      return 0; // Allow user to retry immediately or show 0s wait
    }
    
    // Case -1: Key exists but has NO expiry (Stuck key)
    if (ttl === -1) {
      await redis.expire(key, fallback); // Force expiry
      return fallback;
    }

    // Sanity check: If negative for any other reason, return fallback
    if (ttl < 0) {
        await redis.expire(key, fallback);
        return fallback;
    }

    return ttl;
  } catch (err) {
    console.error(`safeTTL Error for ${key}:`, err);
    return fallback; // Fail safe
  }
};

const generateAndStoreOtp = async (type, value) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await redis.multi()
    .set(`otp:${type}:${value}`, hashOtp(otp), "EX", OTP_EXPIRY)
    .set(`attempts:${type}:${value}`, 0, "EX", OTP_EXPIRY)
    .exec();

  return otp;
};

/* ───────────────── GENERATE OTP ───────────────── */

const generateOtp = async (req, res) => {
  try {
    const { email, phonenumber } = req.body;

    if (!email && !phonenumber) {
      return res.status(400).json({
        message: "Email or phone number is required",
      });
    }

    const targets = [];
    if (email) targets.push({ type: "email", value: email });
    if (phonenumber) targets.push({ type: "phone", value: phonenumber });

    for (const { type, value } of targets) {
      const lockKey = `otp_lock:${type}:${value}`;
      const cooldownKey = `cooldown:${value}`;
      const rateLimitKey = `rate_limit:${value}`;

      /* 🔒 BLOCK IF LOCKED */
      if (await redis.get(lockKey)) {
        const ttl = await safeTTL(lockKey, LOCK_PERIOD);
        return res.status(429).json({
          message: `Too many failed attempts. Try again in ${ttl} seconds.`,
        });
      }

      /* ⏳ COOLDOWN (ATOMIC) */
      const cooldownSet = await redis.set(
        cooldownKey,
        "1",
        "EX",
        COOLDOWN_PERIOD,
        "NX"
      );

      if (!cooldownSet) {
        let ttl = await safeTTL(cooldownKey, COOLDOWN_PERIOD);
        
        // 🟢 FIX: Double safety to prevent "-1 seconds"
        if (ttl <= 0) ttl = COOLDOWN_PERIOD;

        return res.status(429).json({
          message: `Please wait ${ttl} seconds before requesting again.`,
        });
      }

      /* 🚦 RATE LIMIT */
      const currentCount = Number(await redis.get(rateLimitKey)) || 0;

      if (currentCount >= MAX_REQUESTS) {
        const ttl = await safeTTL(rateLimitKey, RATE_LIMIT_WINDOW);
        const minutes = Math.ceil(ttl / 60);
        return res.status(429).json({
          message: `Too many requests. Try again in ${minutes > 0 ? minutes : 1} minutes.`,
        });
      }

      await redis.set(
        rateLimitKey,
        currentCount + 1,
        "EX",
        RATE_LIMIT_WINDOW
      );
    }

    /* 📧 EMAIL OTP */
    if (email) {
      const otp = await generateAndStoreOtp("email", email);
      await sendEmail({
        email,
        subject: "DreamXec Email OTP",
        message: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      });
    }

    /* 📱 WHATSAPP OTP */
    if (phonenumber) {
      const otp = await generateAndStoreOtp("phone", phonenumber);
      await sendWhatsAppMessage({
        to: `+91${phonenumber}`,
        message: `Your DreamXec OTP is ${otp}. Valid for 5 minutes.`,
      });
    }

    return res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Generate OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ───────────────── VERIFY OTP ───────────────── */

const verifyOtp = async (req, res) => {
  try {
    const { type, value, otp } = req.body;

    if (!type || !value || !otp) {
      return res.status(400).json({
        message: "type, value and otp are required",
      });
    }

    const otpKey = `otp:${type}:${value}`;
    const attemptsKey = `attempts:${type}:${value}`;
    const lockKey = `otp_lock:${type}:${value}`;

    /* 🔒 BLOCK IF LOCKED */
    if (await redis.get(lockKey)) {
      const ttl = await safeTTL(lockKey, LOCK_PERIOD);
      return res.status(429).json({
        message: `Verification locked. Try again in ${ttl} seconds.`,
      });
    }

    const storedHash = await redis.get(otpKey);
    if (!storedHash) {
      return res.status(400).json({
        message: "OTP expired or invalid",
      });
    }

    const attempts = Number(await redis.get(attemptsKey)) || 0;

    /* 🔐 LOCK AFTER MAX FAILURES */
    if (attempts >= MAX_VERIFY_ATTEMPTS) {
      await redis.multi()
        .del(otpKey)
        .del(attemptsKey)
        .set(lockKey, "1", "EX", LOCK_PERIOD)
        .exec();

      return res.status(429).json({
        message: "Too many failed attempts. Locked for 30 minutes.",
      });
    }

    /* ✅ VERIFY OTP */
    if (hashOtp(otp) === storedHash) {
      await redis.multi()
        .del(otpKey)
        .del(attemptsKey)
        .del(lockKey)
        .set(`verified:${type}:${value}`, "true", "EX", 1800)
        .exec();

      return res.json({
        message: `${type.toUpperCase()} OTP verified successfully`,
      });
    }

    /* ❌ WRONG OTP */
    await redis.incr(attemptsKey);
    return res.status(401).json({
      message: "Invalid OTP",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { generateOtp, verifyOtp };