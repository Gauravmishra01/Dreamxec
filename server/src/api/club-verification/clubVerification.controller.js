const { success, json } = require("zod");
const prisma = require("../../config/prisma");
const uploadToCloudinary = require("../../utils/uploadToCloudinary");

exports.submitClubVerification = async (req, res) => {
  try {
    const {
      collegeName,
      studentEmail,
      studentPhone,
      presidentName,
      ficName,
      ficEmail,
      ficPhone,

      // club fields
      clubName,
      clubDescription,
      clubInstagram,
      clubLinkedIn,
      clubYouTube,

      //alumni (Stringified JSON)
      alumni,
    } = req.body;

    // DOCUMENT UPLOAD 
    let docUrl = null;
    if (req.file) {
      docUrl = await uploadToCloudinary(req.file.path, "dreamxec/club-verification");
    }

    // Alumni Parsing
    let parsedAlumni = [];
    try {
      parsedAlumni = JSON.parse(alumni);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Alumni Data" });
    }

    const verification = await prisma.clubVerification.create({
      data: {
        collegeName,
        studentEmail,
        studentPhone,
        presidentName,
        ficName,
        ficEmail,
        ficPhone,
        docUrl,

        // Club fields
        clubName,
        clubDescription,
        clubInstagram,
        clubLinkedIn: clubLinkedIn || null,
        clubYouTube: clubYouTube || null,

        // alumni
        alumni: parsedAlumni,
        status: "PENDING",
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Verification request submitted",
      data: verification,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// ADMIN LIST
exports.listVeridications = async (res, req) => {
  try {
    const items = await prisma.clubVerification.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}



exports.approveVerification = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const verification = await tx.clubVerification.findUnique({
        where: { id },
      });

      if (!verification || !verification.userId) {
        throw new Error("Invalid verification");
      }

      // 1. Approve verification
      await tx.clubVerification.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      // 2. Upgrade user role
      await tx.user.update({
        where: { id: verification.userId },
        data: { 
          role: "STUDENT_PRESIDENT",
          canCreateCampaign: true,
          clubVerified: true
        },
      });

      // 3. Create & verify club
      const club = await tx.club.create({
        data: {
          name: verification.clubName,
          college: verification.collegeName,
          description: verification.clubDescription,
          presidentEmail: verification.studentEmail,
          presidentUserId: verification.userId,
          users:{
            connect : { id: verification.userId}
          }
        },
      });

      // 4. Add president as verified club member
      await tx.clubMember.create({
        data: {
          clubId: club.id,
          email: verification.studentEmail,
          name: verification.presidentName,
          isUserRegistered: true,
          userId: verification.userId,
          isVerified: true,
          addedBy: verification.userId,
        },
      });

      return club;
    });

    // Email: approval confirmation
    await sendMail({
      to: result.presidentEmail,
      subject: "You are now a verified Student President on DreamXec",
      text: `Hi,

Congratulations 🎉  
You are now a verified Student President on DreamXec.

You can now:
• Manage club members
• Create & manage campaigns
• Track donations & performance

– DreamXec Team`,
    });

    res.json({
      success: true,
      message: "Verification approved. Student upgraded to President.",
    });
  } catch (error) {
    console.error("Approve Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.rejectVerification = async (req, res) => {
  const id = req.params.id;
  const { reason } = req.body;

  await prisma.clubVerification.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: reason || "Not specified",
    },
  });

  res.json({ success: true });
};
