const prisma = require("../../config/prisma");

class CampaignCommentRepository {
  async findCampaignById(id) {
    return prisma.userProject.findUnique({ where: { id } });
  }

  async findCommentById(id) {
    return prisma.campaignComment.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return prisma.campaignComment.create({
      data,
      include: { user: true, donor: true },
    });
  }

  async findByCampaign(campaignId) {
    return prisma.campaignComment.findMany({
      where: { campaignId, isDeleted: false },
      include: { user: true, donor: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async softDelete(id) {
    return prisma.campaignComment.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async flag(id) {
    return prisma.campaignComment.update({
      where: { id },
      data: { isFlagged: true },
    });
  }
}

module.exports = new CampaignCommentRepository();
