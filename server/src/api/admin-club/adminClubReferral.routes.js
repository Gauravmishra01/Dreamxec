const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../../middleware/auth.middleware");
const {
  listReferrals,
  getReferral,
  approveReferral,
  rejectReferral,
} = require("./adminClubReferral.controller");

// All admin-only
router.use(protect, restrictTo("ADMIN"));

// List all referrals (with optional status filter)
router.get("/", listReferrals);

// Get single referral
router.get("/:id", getReferral);

// Approve / reject
router.post("/:id/approve", approveReferral);
router.post("/:id/reject", rejectReferral);

module.exports = router;
