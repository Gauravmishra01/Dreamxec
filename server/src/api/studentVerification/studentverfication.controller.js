const razorpay = require("../../services/payment.service");
const prisma = require("../../config/prisma");
const uploadToCloudinary = require('../../utils/uploadToCloudinary');
const redis = require("../../services/redis.service");

/* ───────────────────────────────────────── */
/* CREATE ORDER (requires OTP verification) */
/* ───────────────────────────────────────── */

const createOrder = async (req, res) => {
    try {
        const { studentEmail, officialEmail, mobileNumber } = req.body;

        if (!studentEmail || !officialEmail || !mobileNumber) {
            return res.status(400).json({
                message: "studentEmail, officialEmail and mobileNumber are required",
            });
        }

        // Normalize phone (VERY IMPORTANT)
        const normalizedMobile = mobileNumber.replace(/\D/g, '');

        // Domain check
        if (studentEmail.split("@")[1] !== officialEmail.split("@")[1]) {
            return res.status(400).json({
                message: "Student and Official emails must belong to the same college domain.",
            });
        }

        // 🔑 REDIS OTP CHECK (SOURCE OF TRUTH)
        const emailKey = `verified:email:${studentEmail}`;
        const phoneKey = `verified:phone:${normalizedMobile}`;

        const emailVerified = await redis.get(emailKey);
        const phoneVerified = await redis.get(phoneKey);

        console.log("OTP CHECK", {
            emailKey,
            phoneKey,
            emailVerified,
            phoneVerified,
        });

        if (!emailVerified || !phoneVerified) {
            return res.status(403).json({
                message: "Please verify Email and WhatsApp OTPs before proceeding.",
            });
        }

        const order = await razorpay.orders.create({
            amount: 5 * 100,
            currency: "INR",
            receipt: `${req.user.id}`,
        });

        return res.json({ order });

    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({
            message: "Failed to create order",
            error: error.message,
        });
    }
};



/* ───────────────────────────────────────── */
/* FINAL VERIFICATION SUBMIT */
/* ───────────────────────────────────────── */

const verify = async (req, res) => {
    try {
        const {
            fullName,
            studentEmail,
            officialEmail,
            mobileNumber,
            docType,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        const file = req.file;
        const { user } = req;

        if (!file) {
            return res.status(400).json({ message: "Document file is required" });
        }

        /* ─── OTP VERIFICATION CHECK ─── */
        const emailVerified = await redis.get(`verified:email:${studentEmail}`);
        const phoneVerified = await redis.get(`verified:phone:${mobileNumber}`);

        if (!emailVerified || !phoneVerified) {
            return res.status(403).json({
                message: "Email and WhatsApp OTP verification required before submission."
            });
        }

        /* ─── Upload Document ─── */
        const folder = `dreamxec/verifications/${user.id}`;
        const documentUrl = await uploadToCloudinary(file.path, folder);

        const verification = await prisma.studentVerification.create({
            data: {
                fullName,
                studentEmail,
                officialEmail,
                mobileNumber,
                docType,
                documentUrl,
                razorpayPaymentId: razorpay_payment_id || null,
                razorpayOrderId: razorpay_order_id || null,
                razorpaySignature: razorpay_signature || null,
                userId: user.id,
                status: "PENDING"
            }
        });

        /* ─── Mark user as studentVerified ─── */
        await prisma.user.update({
            where: { id: user.id },
            data: { studentVerified: true }
        });

        return res.json({
            success: true,
            message: "Verification submitted successfully",
            data: verification
        });

    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            message: "Verification failed",
            error: error.message
        });
    }
};

module.exports = { verify, createOrder };
