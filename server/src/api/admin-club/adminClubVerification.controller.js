const prisma = require("../../config/prisma");

exports.listVerifications = async (req, res) => {
  const { status, skip = 0, take = 50 } = req.query;
  const where = {};
  if (status) where.status = status;
  const list = await prisma.clubVerification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: Number(skip),
    take: Number(take),
  });
  res.json({ success: true, data: list });
};

exports.getVerification = async (req, res) => {
  const { id } = req.params;
  const item = await prisma.clubVerification.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: item });
};


exports.approveVerification = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const verification = await tx.clubVerification.findUnique({
        where: { id },
      });

      if (!verification) {
        throw new Error("Verification not found");
      }

      if (!verification.userId) {
        throw new Error("Verification is not linked to a user");
      }

      // 1️⃣ Approve verification
      await tx.clubVerification.update({
        where: { id },
        data: {
          status: "APPROVED",
        },
      });

      // 2️⃣ Upgrade user role (THIS WAS MISSING)
      await tx.user.update({
        where: { id: verification.userId },
        data: {
          role: "STUDENT_PRESIDENT",
          clubVerified: true,
          isClubPresident: true,
        },
      });

      // 3️⃣ Create Club
      const club = await tx.club.create({
        data: {
          name: verification.clubName,
          college: verification.collegeName,
          description: verification.clubDescription,
          presidentEmail: verification.studentEmail,
          presidentUserId: verification.userId,
        },
      });

      // 4️⃣ Create ClubMember entry for president
      await tx.clubMember.create({
        data: {
          clubId: club.id,
          email: verification.studentEmail,
          name: verification.presidentName,
          userId: verification.userId,
          isUserRegistered: true,
          isVerified: true,
          addedBy: verification.userId,
        },
      });

      return club;
    });

    res.json({
      success: true,
      message: "Verification approved and student upgraded to president",
      data: result,
    });
  } catch (error) {
    console.error("Approve Verification Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Approval failed",
    });
  }
};


exports.rejectVerification = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    // Optional: Check if record exists first (or rely on Prisma's P2025 error)
    // and prevent rejecting already processed requests if needed.
    
    const updated = await prisma.clubVerification.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason || "No reason specified",
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
    });

    res.json({ 
      success: true, 
      message: "Verification rejected successfully",
      data: updated 
    });

  } catch (error) {
    console.error("Reject Verification Error:", error);

    // Handle "Record not found" error from Prisma
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false, 
        message: "Verification request not found" 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Failed to reject verification" 
    });
  }
};