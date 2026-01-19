const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const sendEmail = require("../../services/email.service");
const { sendWhatsAppMessage } = require("../../services/whatsapp.service");
const redis = require("../../services/redis.service");

/* ───────────────── CONSTANTS ───────────────── */
const OTP_EXPIRY = 300;           // 5 minutes
const COOLDOWN_PERIOD = 60;       // 60 seconds
const BLOCK_PERIOD = 900;         // 15 minutes
const MAX_ATTEMPTS_PER_WINDOW = 3;
const MAX_VERIFY_ATTEMPTS = 3;

/* ───────────────── HELPERS ───────────────── */

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(otp).digest('hex');

const generateAndStoreOtp = async (type, identifier) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  const hashedOtp = hashOtp(otp);

  await redis.set(`otp:${type}:${identifier}`, hashedOtp, 'EX', OTP_EXPIRY);
  await redis.set(`attempts:${type}:${identifier}`, 0, 'EX', OTP_EXPIRY);

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

    /* ─── Rate limit per identifier ─── */
    const identifier = email || phonenumber;
    const rateLimitKey = `rate_limit:${identifier}`;
    const requestCount = await redis.get(rateLimitKey);

    if (requestCount && parseInt(requestCount) >= MAX_ATTEMPTS_PER_WINDOW) {
      const ttl = await redis.ttl(rateLimitKey);
      return res.status(429).json({
        message: `Too many requests. Try again in ${Math.ceil(ttl / 60)} minutes.`,
      });
    }

    const cooldownKey = `cooldown:${identifier}`;
    if (await redis.get(cooldownKey)) {
      const ttl = await redis.ttl(cooldownKey);
      return res.status(429).json({
        message: `Please wait ${ttl} seconds before requesting again.`,
      });
    }

    await redis.multi()
      .incr(rateLimitKey)
      .expire(rateLimitKey, BLOCK_PERIOD)
      .exec();

    await redis.set(cooldownKey, '1', 'EX', COOLDOWN_PERIOD);

    /* ─── EMAIL OTP ─── */
    if (email) {
      const emailOtp = await generateAndStoreOtp('email', email);

      await sendEmail({
        email,
        subject: "DreamXec Email OTP",
        message: `Your Email OTP is ${emailOtp}. It is valid for 5 minutes.`,
      });
    }

    /* ─── WHATSAPP OTP ─── */
    if (phonenumber) {
      const phoneOtp = await generateAndStoreOtp('phone', phonenumber);

      await sendWhatsAppMessage({
        to: `+91${phonenumber}`,
        message: `Your DreamXec WhatsApp OTP is ${phoneOtp}. Valid for 5 minutes.`,
      });
    }

    return res.json({
      message: "OTP sent successfully to email and WhatsApp",
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
    // type = "email" | "phone"
    // value = email OR phone number

    if (!type || !value || !otp) {
      return res.status(400).json({
        message: "type, value, and otp are required",
      });
    }

    const otpKey = `otp:${type}:${value}`;
    const attemptsKey = `attempts:${type}:${value}`;

    const storedHash = await redis.get(otpKey);
    if (!storedHash) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const attempts = await redis.get(attemptsKey);
    if (attempts && parseInt(attempts) >= MAX_VERIFY_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many failed attempts. Verification locked.",
      });
    }

    const submittedHash = hashOtp(otp);

    if (submittedHash === storedHash) {
      await redis.del(otpKey);
      await redis.del(attemptsKey);
      await redis.set(`verified:${type}:${value}`, 'true', 'EX', 1800);

      return res.json({
        message: `${type.toUpperCase()} OTP verified successfully`,
      });
    }

    await redis.incr(attemptsKey);
    return res.status(401).json({ message: "Invalid OTP" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { generateOtp, verifyOtp };
