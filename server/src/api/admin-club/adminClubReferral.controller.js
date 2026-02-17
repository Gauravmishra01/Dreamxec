const prisma = require("../../config/prisma"); // your prisma client
const AppError = require("../../utils/AppError");

exports.listReferrals = async (req, res) => {
  const { status, skip = 0, take = 50 } = req.query;
  const where = {};
  if (status) where.status = status;
  const referrals = await prisma.clubReferralRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: Number(skip),
    take: Number(take),
  });
  res.json({ success: true, data: referrals });
};

exports.getReferral = async (req, res) => {
  const { id } = req.params;
  const referral = await prisma.clubReferralRequest.findUnique({ where: { id } });
  if (!referral) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: referral });
};

exports.approveReferral = async (req, res) => {
  const { id } = req.params;
  // set status to APPROVED, maybe create Club record etc.
  const updated = await prisma.clubReferralRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });
  res.json({ success: true, data: updated });
};

exports.rejectReferral = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const updated = await prisma.clubReferralRequest.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason || null },
  });
  res.json({ success: true, data: updated });
};
