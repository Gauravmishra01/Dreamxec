const AppError = require("../../utils/AppError");
const repository = require("./campaignComment.repository");
const Policy = require("./campaignComment.policy");
const {
  containsProfanity,
  censorProfanity,
} = require("../../utils/profanityFilter");

class CampaignCommentService {
  async create({ campaignId, content, parentId, currentUser }) {
    const campaign = await repository.findCampaignById(campaignId);

    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }

    if (campaign.status !== "APPROVED") {
      throw new AppError("Cannot comment on inactive campaign", 400);
    }

    if (parentId) {
      const parent = await repository.findCommentById(parentId);

      if (!parent || parent.isDeleted) {
        throw new AppError("Invalid parent comment", 400);
      }

      if (parent.campaignId.toString() !== campaignId) {
        throw new AppError("Parent comment mismatch", 400);
      }
    }

    // Normalize content
    let sanitizedContent = content.trim().replace(/\s+/g, " ");

    const hasProfanity = containsProfanity(sanitizedContent);

    if (hasProfanity) {
      sanitizedContent = censorProfanity(sanitizedContent);
    }

    const data = {
      campaignId,
      content: sanitizedContent,
      parentId: parentId || null,
      isFlagged: hasProfanity,
    };

    if (currentUser.role === "DONOR") {
      data.donorId = currentUser.id;
    } else {
      data.userId = currentUser.id;
    }

    return repository.create(data);
  }


  async getByCampaign(campaignId) {
  const campaign = await repository.findCampaignById(campaignId);

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  const comments = await repository.findByCampaign(campaignId);

  const map = {};
  const roots = [];

  // Prepare nodes
  comments.forEach((comment) => {
    const author = comment.user
      ? {
          id: comment.user.id,
          name: comment.user.name,
          type: "USER",
        }
      : comment.donor
      ? {
          id: comment.donor.id,
          name: comment.donor.name,
          type: "DONOR",
        }
      : null;

    map[comment.id] = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      isFlagged: comment.isFlagged,
      parentId: comment.parentId,
      author,
      replies: [],
    };
  });

  // Build tree
  comments.forEach((comment) => {
    if (
      comment.parentId &&
      map[comment.parentId] &&
      comment.parentId !== comment.id // safety self-reference guard
    ) {
      map[comment.parentId].replies.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
}



  async delete({ commentId, currentUser }) {
    const comment = await repository.findCommentById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const campaign = await repository.findCampaignById(comment.campaignId);

    if (!Policy.canDelete({ comment, campaign, currentUser })) {
      throw new AppError("You cannot delete this comment", 403);
    }

    await repository.softDelete(commentId);
  }

  async report({ commentId }) {
    const comment = await repository.findCommentById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    await repository.flag(commentId);
  }
}

module.exports = new CampaignCommentService();
