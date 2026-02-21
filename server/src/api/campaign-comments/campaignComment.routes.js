const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");

const controller = require("./campaignComment.controller");
const {
  createCommentSchema,
  deleteCommentSchema,
  reportCommentSchema,
} = require("./campaignComment.validation");
const commentRateLimit = require("../../middleware/commentRateLimit.middleware");


// ----------------------------
// Public Route
// ----------------------------

// Get comments for a campaign
router.get(
  "/campaigns/:campaignId/comments",
  controller.getComments
);

// ----------------------------
// Protected Routes
// ----------------------------

// Create comment
router.post(
  "/campaigns/:campaignId/comments",
  protect,
  validate(createCommentSchema),
  controller.createComment
);

// Delete comment (soft delete)
router.delete(
  "/comments/:commentId",
  protect,
  validate(deleteCommentSchema),
  controller.deleteComment
);

// Create comment rate limit
router.post(
  "/campaigns/:campaignId/comments",
  protect,
  commentRateLimit,
  validate(createCommentSchema),
  controller.createComment
);

// Report comment
router.post(
  "/comments/:commentId/report",
  protect,
  validate(reportCommentSchema),
  controller.reportComment
);

module.exports = router;