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
    } = req.body;

    let docUrl = null;
    if (req.file) {
      docUrl = await uploadToCloudinary(req.file.path,"dreamxec/club-verification");
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


exports.listVerifications = async (req, res) => {
  const items = await prisma.clubVerification.findMany({ orderBy: { createdAt: 'desc' }});
  res.json({ success:true, data: items });
};

exports.approveVerification = async (req, res) => {
  const id = req.params.id;
  await prisma.clubVerification.update({ where:{ id }, data:{ status: 'APPROVED' }});
  // also mark user.clubVerified = true if you want
  res.json({ success:true });
};

exports.rejectVerification = async (req, res) => {
  const id = req.params.id;
  const { reason } = req.body;
  await prisma.clubVerification.update({ where:{ id }, data:{ status: 'REJECTED', rejectionReason: reason }});
  res.json({ success:true });
};
