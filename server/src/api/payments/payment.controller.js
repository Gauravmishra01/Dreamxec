const razorpay = require("../../services/payment.service");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { amount, projectId, type } = req.body; // Added 'type' to distinguish donation vs verification

  if (!amount) {
    return next(new AppError("Amount required", 400));
  }

  // Receipt ID logic
  let receiptId = `rcpt_${Date.now()}`;
  if (projectId) receiptId = `${projectId}-${Date.now()}`;
  if (type === 'verification') receiptId = `verify-${req.user.id}-${Date.now()}`;

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: receiptId,
    notes: {
      type: type || 'donation',
      userId: req.user.id,
      projectId: projectId || ''
    }
  });

  res.json({
    success: true,
    orderId: order.id,
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount, // Return amount in paise
    currency: order.currency
  });
});

exports.verifyWebhook = catchAsync(async (req, res, next) => {
  const crypto = require("crypto");

  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    return next(new AppError("Invalid webhook signature", 400));
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const { order_id, id, amount } = event.payload.payment.entity;

    // 1. Find donation
    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: order_id }
    });

    if (!donation) return res.json({ message: "Donation not found" });

    // 2. Mark donation success
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        paymentStatus: "SUCCESS",
        razorpayPaymentId: id
      }
    });

    // 3. Add amount to project
    await prisma.userProject.update({
      where: { id: donation.userProjectId },
      data: {
        amountRaised: { increment: donation.amount }
      }
    });
  }

  res.json({ status: "ok" });
});

exports.createDonation = catchAsync(async (req, res, next) => {
  const { amount, projectId, message, anonymous } = req.body;

  const donation = await prisma.donation.create({
    data: {
      amount,
      message,
      anonymous,
      donorId: req.user.id,
      userProjectId: projectId,
      paymentStatus: "PENDING"
    }
  });

  res.json({ donationId: donation.id });
});
