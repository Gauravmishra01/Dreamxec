const Razorpay = require("razorpay");
const crypto = require("crypto");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const { publishEvent } = require('../../services/eventPublisher.service');
const EVENTS = require('../../config/events');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const { getDonorEligibility } = require('../../utils/donorEligibility');

// STEP 1: Create Razorpay Order (UNCHANGED - PERFECT ✅)
exports.createOrder = catchAsync(async (req, res) => {
  const { amount, projectId, message, anonymous, email } = req.body;

  console.log("🔍 FULL REQUEST OBJECT:", {
    hasUser: !!req.user,
    userId: req.user?.id,
    userEmail: req.user?.email,
    cookies: req.cookies,
    headersAuthorization: req.headers.authorization,
    session: req.session
  });

  let userId = null;
  let donorId = null;

  // 🔥 PRIORITY 1: JWT user (Google login)
  if (req.user) {
    userId = req.user.id;
    console.log("✅ JWT USER:", req.user.email, "→", userId);
  }
  // PRIORITY 2: Guest email
  else if (email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      userId = existingUser.id;
      console.log("✅ GUEST EMAIL MATCHED USER:", email, "→", userId);
    } else {
      let donor = await prisma.donor.findUnique({ where: { email } });
      if (!donor) {
        donor = await prisma.donor.create({
          data: { 
            email, 
            name: req.body.name || "Anonymous Donor" 
          }
        });
      }
      donorId = donor.id;
      console.log("✅ NEW DONOR CREATED:", email, "→", donorId);
    }
  }

  const donation = await prisma.donation.create({
    data: {
      amount,
      message: message || null,
      anonymous: anonymous || false,
      userId,
      donorId,
      userProjectId: projectId,
      paymentStatus: "created"
    }
  });

  console.log("💰 NEW DONATION:", donation.id, "userId:", userId, "donorId:", donorId);

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${donation.id}`,
    notes: {
      donationId: donation.id,
      projectId: projectId
    }
  });

  await prisma.donation.update({
    where: { id: donation.id },
    data: { razorpayOrderId: order.id }
  });

  res.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID
  });
});

// STEP 2: VERIFY PAYMENT (unchanged)
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return next(new AppError("Invalid payment signature", 400));
    }

    res.status(200).json({
      success: true,
      message: "Payment verified. Awaiting confirmation.",
    });
  } catch (err) {
    console.error("Verify Error:", err);
    next(new AppError("Verification failed", 500));
  }
};

// STEP 3: WEBHOOK (unchanged)
exports.razorpayWebhook = async (req, res) => {
  console.log("🚀 WEBHOOK HIT ✅", req.body.event);
  const event = req.body;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const amount = payment.amount / 100;

    console.log("💰 UPDATING:", orderId, "₹", amount);

    try {
      await prisma.$transaction(async (tx) => {
        const donations = await tx.donation.updateMany({
          where: {
            razorpayOrderId: orderId,
            paymentStatus: "created",
          },
          data: {
            paymentStatus: "completed",
            razorpayPaymentId: payment.id,
          },
        });

        console.log("✅ Donations updated:", donations.count);

        if (donations.count > 0 && payment.notes?.projectId) {
          const project = await tx.userProject.update({
             where: { id: payment.notes.projectId },
             data: {
               amountRaised: { increment: amount }
             },
             include: { user: true } // Fetch project owner
          });
          console.log("🎉 Project updated! New total: ₹", project.amountRaised);
          
          // --- EMAIL EVENTS ---
          
          // 0. High Value Donation Check
    if (amount >= 10000) {
       await publishEvent(EVENTS.HIGH_VALUE_DONATION, {
           amount: amount,
           currency: "INR",
           transactionId: payment.id,
           donorEmail: payment.email || 'N/A',
           campaignTitle: project.title
       });
    }

    // 1. To Donor (DONATION_SUCCESS)
          // We need to find the specific donation to get donor details (email/name)
          const donationRecord = await tx.donation.findUnique({
              where: { razorpayOrderId: orderId },
              include: { 
                  donor: true, 
                  user: true 
              }
          });
          
          const donorEmail = donationRecord.donor?.email || donationRecord.user?.email || payment.email;
          const donorName = donationRecord.donor?.name || donationRecord.user?.name || 'Valued Donor';
          
          if (donorEmail) {
            await publishEvent(EVENTS.DONATION_SUCCESS, {
                email: donorEmail, // Functionality relies on resolving this in orchestrator or just sending direct
                amount: amount,
                currency: "INR", // Assuming INR based on Razorpay
                transactionId: payment.id,
                campaignTitle: project.title,
                donorName: donorName
            });
          }

          // 2. To Project Owner (DONATION_RECEIVED)
          if (project.user?.email) {
              await publishEvent(EVENTS.DONATION_RECEIVED, {
                  email: project.user.email,
                  amount: amount,
                  currency: "INR",
                  donorName: donationRecord.anonymous ? 'Anonymous' : donorName,
                  campaignTitle: project.title
              });
          }

          // 3. Campaign Milestones & Completion
          if (project.goalAmount > 0) {
             const prevAmount = project.amountRaised - amount;
             const prevPercent = (prevAmount / project.goalAmount) * 100;
             const newPercent = (project.amountRaised / project.goalAmount) * 100;

             const milestones = [25, 50, 75, 100];
             
             for (const milestone of milestones) {
                 if (prevPercent < milestone && newPercent >= milestone) {
                     // 100% -> Completed
                     if (milestone === 100 && project.user?.email) {
                         await publishEvent(EVENTS.CAMPAIGN_COMPLETED, {
                             email: project.user.email,
                             campaignTitle: project.title,
                             totalRaised: project.amountRaised,
                             currency: "INR"
                         });
                     } 
                     
                     // Any milestone -> Milestone Alert
                     if (project.user?.email) {
                        await publishEvent(EVENTS.CAMPAIGN_MILESTONE, {
                            email: project.user.email,
                            percentage: milestone,
                            campaignTitle: project.title
                        });
                     }
                 }
             }
          }
        }
      });
      console.log("✅ WEBHOOK SUCCESS!");
    } catch (error) {
      console.error("💥 Transaction failed (retryable):", error.message);
    }
  }

  res.status(200).json({ status: "ok" });
};

// 🔥 STEP 4: FIXED! UNIFIED DONOR DASHBOARD (Google + Email users)
exports.getMyDonations = catchAsync(async (req, res) => {
  const donations = await prisma.donation.findMany({
    where: {
      OR: [
        { userId: req.user.id },      // Google/registered users
        { donorId: req.user.id }      // Email/password donors
      ],
      paymentStatus: "completed",
    },
    orderBy: { createdAt: "desc" },
    include: {
      userProject: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          amountRaised: true,
          goalAmount: true
        }
      }
    }
  });

  res.json({ success: true, donations });
});

// 🔥 STEP 5: FIXED! UNIFIED SUMMARY (Google + Email users)
exports.getDonationSummary = catchAsync(async (req, res) => {
  const donations = await prisma.donation.findMany({
    where: {
      OR: [
        { userId: req.user.id },      // Google users (YOUR CASE)
        { donorId: req.user.id }      // Email donors
      ],
      paymentStatus: "completed",
    },
    select: {
      amount: true,
      userProjectId: true,
    },
  });

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const projectsSupported = new Set(donations.map(d => d.userProjectId)).size;

  res.status(200).json({
    status: "success",
    data: {
      totalAmount,
      projectsSupported,
      donationsCount: donations.length,
    },
  });
});

// 🔥 DEPRECATED: Remove getCustomDonorDonations() - use getMyDonations instead
exports.getCustomDonorDonations = async (req, res) => {
  res.redirect(307, '/donations/my'); // Redirect to unified endpoint
};

// STEP 6: Project owner donations (unchanged)
exports.getProjectDonations = async (req, res, next) => {
  const projectId = req.params.projectId;

  const project = await prisma.userProject.findUnique({
    where: { id: projectId },
  });

  if (!project) return next(new AppError("Project not found", 404));

  if (req.user.role !== "ADMIN" && req.user.id !== project.userId) {
    return next(new AppError("Not authorized", 403));
  }

  const donations = await prisma.donation.findMany({
    where: {
      userProjectId: projectId,
      paymentStatus: "completed",
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      },
      donor: {
        select: { name: true, email: true }
      }
    }
  });

  res.json({ success: true, donations });
};



// GET /api/donations/me/eligibility
exports.getMyEligibility = catchAsync(async (req, res) => {
  const eligibility = await getDonorEligibility({
    userId: req.user?.id,
    donorId: req.user?.role === 'DONOR' ? req.user.id : null,
  });

  res.status(200).json({
    status: 'success',
    data: eligibility,
  });
});
