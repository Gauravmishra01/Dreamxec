class CampaignCommentPolicy {
  static canDelete({ comment, campaign, currentUser }) {
    const isOwner =
      comment.userId?.toString() === currentUser.id ||
      comment.donorId?.toString() === currentUser.id;

    const isCampaignOwner =
      campaign.userId?.toString() === currentUser.id;

    const isAdmin = currentUser.role === "ADMIN";

    return isOwner || isCampaignOwner || isAdmin;
  }
}

module.exports = CampaignCommentPolicy;
