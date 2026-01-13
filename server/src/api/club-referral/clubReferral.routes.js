const express = require("express");
const { protect } = require("../../middleware/auth.middleware");
const { referClub } = require("./clubReferral.controller");
const validate = require("../../middleware/validate.middleware");
const { clubReferralSchema } = require("./clubReferral.validation");
const router=require("express").Router()

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/refer",
  protect,
  upload.single("document"),
  validate(clubReferralSchema),
  referClub
);

module.exports = router;
