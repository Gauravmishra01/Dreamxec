const uploadToCloudinary = require("../../utils/uploadToCloudinary");
const prisma = require("../../config/prisma");

exports.referClub = async (req, res) => {
  try {
    const {
      clubName,
      collegeName,
      presidentEmail,
      presidentPhone,
      presidentName,
      ficEmail,
      ficPhone,
      ficName,
      instagram,
      linkedIn,
      portfolio
    } = req.body;

    // 1. Create initial referral record
    let referral = await prisma.clubReferralRequest.create({
      data: {
        clubName,
        collegeName,
        presidentEmail,
        presidentPhone,
        presidentName,
        ficEmail,
        ficPhone,
        ficName,
        instagram,
        linkedIn,
        portfolio,
        referrerEmail: req.user.email,
        status: "PENDING",
        referrerId: req.user.id,
      }
    });

    // 2. Handle file upload if present
    if (req.file) {
      try {
        console.log("📄 Processing Referral Document...");
        const validMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
        
        let folder = `dreamxec/club-referrals/${referral.id}`;
        // Verify mime type if strictness is needed, but uploadToCloudinary handles generic uploads.
        
        const url = await uploadToCloudinary(req.file.path, folder);
        console.log("✅ Evidence Uploaded:", url);

        // 3. Update record with URL
        referral = await prisma.clubReferralRequest.update({
          where: { id: referral.id },
          data: {
             evidenceUrls: [url]
          }
        });

      } catch (uploadErr) {
        console.error("❌ Upload failed but referral created:", uploadErr);
      }
    }

    res.status(201).json({
      success: true,
      message: "Club referral submitted successfully",
      data: referral
    });

  } catch (error) {
    console.error("Referral Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.listReferrals = async (req, res) => {
  const referrals = await prisma.clubReferralRequest.findMany({ orderBy: { createdAt: 'desc' }});
  res.json({ success: true, data: referrals });
};

exports.getReferral = async (req, res) => {
  const id = req.params.id;
  const r = await prisma.clubReferralRequest.findUnique({ where: { id }});
  if (!r) return res.status(404).json({ success:false, message:'Not found' });
  res.json({ success:true, data: r });
};

exports.approveReferral = async (req, res) => {
  const id = req.params.id;
  await prisma.clubReferralRequest.update({ where:{ id }, data:{ status: 'APPROVED' }});
  // optionally create Club row or notify president
  res.json({ success:true });
};

exports.rejectReferral = async (req, res) => {
  const id = req.params.id;
  const { reason } = req.body;
  await prisma.clubReferralRequest.update({ where:{ id }, data:{ status: 'REJECTED', rejectionReason: reason }});
  res.json({ success:true });
};
