const catchAsync = require("../../utils/catchAsync");
const service = require("./campaignComment.service");

/**
 * Create Comment
 * POST /api/campaigns/:campaignId/comments
 */
exports.createComment = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  const { content, parentId } = req.body;

  const comment = await service.create({
    campaignId,
    content,
    parentId,
    currentUser: req.user,
  });

  res.status(201).json({
    status: "success",
    data: {
      comment,
    },
  });
});

/**
 * Get Comments For Campaign
 * GET /api/campaigns/:campaignId/comments
 */
exports.getComments = catchAsync(async (req, res) => {
  const { campaignId } = req.params;

  const comments = await service.getByCampaign(campaignId);

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

/**
 * Delete Comment (Soft Delete)
 * DELETE /api/comments/:commentId
 */
exports.deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  await service.delete({
    commentId,
    currentUser: req.user,
  });

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
  });
});

/**
 * Report Comment
 * POST /api/comments/:commentId/report
 */
exports.reportComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  await service.report({ commentId });

  res.status(200).json({
    status: "success",
    message: "Comment reported for review",
  });
});
