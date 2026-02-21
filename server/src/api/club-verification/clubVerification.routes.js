const express = require("express");
const router = express.Router();
const multer = require("multer");

const { protect } = require("../../middleware/auth.middleware");

// Controllers
const { submitClubVerification } = require("./clubVerification.controller");


// Validation
const validate = require("../../middleware/validate.middleware");
const { clubVerificationSchema } = require("./clubVerification.validation");

// File Upload
const upload = multer({ dest: "uploads/" });

/**
 * 1️⃣ Submit Club Verification (President or Member uploads document)
 */
router.post(
  "/verify-president",
  protect,
  upload.single("document"),
  validate(clubVerificationSchema),
  submitClubVerification
);

module.exports = router;
