const crypto = require("crypto");
const prisma = require("../../config/prisma");

exports.handleRazorpayWebhook = async (req, res) => {
  console.log("🔥3 WEBHOOK HIT", req.body.event);
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== req.headers["x-razorpay-signature"]) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    // Find donation with this orderId
    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: orderId }
    });

    if (!donation) return res.json({ received: true });

    // Mark donation as PAID
    await prisma.donation.update({
      where: { id: donation.id },
      data: { paymentStatus: "PAID" }
    });

    // Increase amountRaised
    await prisma.userProject.update({
      where: { id: donation.userProjectId },
      data: { amountRaised: { increment: donation.amount } }
    });
  }

  res.json({ status: "ok" });
};
