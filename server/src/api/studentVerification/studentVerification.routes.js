const express = require("express");
const multer = require("multer");
const { protect } = require("../../middleware/auth.middleware");
const {
  verify,
  createOrder
} = require("./studentverfication.controller");

const router = express.Router();

/* ────────────────────────────── */
/* Multer configuration */
/* ────────────────────────────── */
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/* ────────────────────────────── */
/* All routes are protected */
/* ────────────────────────────── */
router.use(protect);

/**
 * Create Razorpay Order
 * REQUIREMENTS:
 * - User logged in
 * - Email OTP verified
 * - WhatsApp OTP verified
 */
router.post("/create-order", createOrder);

/**
 * Submit student verification
 * REQUIREMENTS:
 * - User logged in
 * - Email OTP verified
 * - WhatsApp OTP verified
 * - Payment completed
 * - Document uploaded
 */
router.post(
  "/verify",
  upload.single("document"),
  verify
);

module.exports = router;
