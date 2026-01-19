const express = require("express");
const { protect } = require("../../middleware/auth.middleware");
const { generateOtp, verifyOtp } = require("./otp.controller");

const router = express.Router();

/**
 * OTP routes are PROTECTED because:
 * - User is already logged in
 * - OTP is for student verification (not login/signup)
 */
router.use(protect);

/**
 * Generate OTP
 * - Can send Email OTP
 * - Can send WhatsApp OTP
 * - Can send BOTH
 *
 * Body examples:
 * { "email": "student@college.edu" }
 * { "phonenumber": "6201391815" }
 * { "email": "...", "phonenumber": "..." }
 */
router.post("/generate-otp", generateOtp);

/**
 * Verify OTP (one channel at a time)
 *
 * Body:
 * {
 *   "type": "email" | "phone",
 *   "value": "email OR phone",
 *   "otp": "123456"
 * }
 */
router.post("/verify-otp", verifyOtp);

module.exports = router;
