const prisma = require('../config/prisma');

const PER_PROJECT_COST = 2000;

/**
 * donorIdentity = {
 *   userId?: string | null,
 *   donorId?: string | null
 * }
 *
 * PURE BUSINESS LOGIC
 */
exports.getDonorEligibility = async (donorIdentity, tx = prisma) => {
  const { userId, donorId } = donorIdentity;

  if (!userId && !donorId) {
    throw new Error('Invalid donor identity');
  }

  /* ===============================
     1️⃣ TOTAL DONATIONS
  =============================== */
  const donations = await tx.donation.findMany({
    where: {
      paymentStatus: 'completed',
      OR: [
        userId ? { userId } : undefined,
        donorId ? { donorId } : undefined,
      ].filter(Boolean),
    },
    select: { amount: true },
  });

  const totalDonated = donations.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  /* ===============================
     2️⃣ PROJECT SLOTS
  =============================== */
  const allowedProjects = Math.floor(
    totalDonated / PER_PROJECT_COST
  );

  /* ===============================
     3️⃣ USED SLOTS
     (PENDING + APPROVED consume slots)
     REJECTED auto-frees slot ✔
  =============================== */
  const createdProjects = await tx.donorProject.count({
    where: {
      donorId: userId ?? donorId,
      status: { in: ['PENDING', 'APPROVED'] },
    },
  });

  const remainingProjects = Math.max(
    allowedProjects - createdProjects,
    0
  );

  return {
    totalDonated,
    allowedProjects,
    createdProjects,
    remainingProjects,
    canCreateOpportunity: remainingProjects > 0,
    perProjectCost: PER_PROJECT_COST,
  };
};
