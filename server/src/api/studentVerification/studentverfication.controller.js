const razorpay = require("../../services/payment.service");
const prisma = require("../../config/prisma");
const uploadToCloudinary = require('../../utils/uploadToCloudinary');
const redis = require("../../services/redis.service");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

/* ───────────────────────────────────────── */
/* CREATE ORDER (requires OTP verification) */
/* ───────────────────────────────────────── */

const createOrder = catchAsync(async (req, res, next) => {
    const { studentEmail, officialEmail, mobileNumber } = req.body;

    if (!studentEmail || !officialEmail || !mobileNumber) {
        return next(new AppError("studentEmail, officialEmail and mobileNumber are required", 400));
    }

    // Normalize phone
    const normalizedMobile = mobileNumber.replace(/\D/g, '');

    // Domain check
    if (studentEmail.split("@")[1] !== officialEmail.split("@")[1]) {
        return next(new AppError("Student and Official emails must belong to the same college domain.", 400));
    }

    // 🔑 REDIS OTP CHECK
    const emailKey = `verified:email:${studentEmail}`;
    const phoneKey = `verified:phone:${normalizedMobile}`;

    const emailVerified = await redis.get(emailKey);
    const phoneVerified = await redis.get(phoneKey);

    if (!emailVerified || !phoneVerified) {
        return next(new AppError("Please verify Email and WhatsApp OTPs before proceeding.", 403));
    }

    const order = await razorpay.orders.create({
        amount: 5 * 100,
        currency: "INR",
        receipt: `${req.user.id}`,
    });

    return res.json({ order });
});

/* ───────────────────────────────────────── */
/* FINAL VERIFICATION SUBMIT (USER SIDE)     */
/* ───────────────────────────────────────── */

const verify = catchAsync(async (req, res, next) => {
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
        return next(new AppError("Document file is required", 400));
    }

    /* ─── OTP VERIFICATION CHECK ─── */
    const emailVerified = await redis.get(`verified:email:${studentEmail}`);
    const phoneVerified = await redis.get(`verified:phone:${mobileNumber}`);

    if (!emailVerified || !phoneVerified) {
        return next(new AppError("Email and WhatsApp OTP verification required before submission.", 403));
    }

    /* ─── Upload Document ─── */
    const folder = `dreamxec/verifications/${user.id}`;
    const documentUrl = await uploadToCloudinary(file.path, folder);

    // Create Verification Request
    // NOTE: We do NOT set user.studentVerified = true here. That happens on Admin Approval.
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
await prisma.user.update({
    where: { id: user.id },
    data: { studentVerified: false }
})
    return res.status(201).json({
        success: true,
        message: "Verification submitted successfully. Please wait for admin approval.",
        data: verification
    });
});

/* ───────────────────────────────────────── */
/* ADMIN: LIST VERIFICATIONS                 */
/* ───────────────────────────────────────── */

const getAllStudentVerifications = catchAsync(async (req, res, next) => {
    const { status } = req.query;
    
    const where = {};
    if (status) where.status = status;

    const verifications = await prisma.studentVerification.findMany({
        where,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
        success: true,
        results: verifications.length,
        data: { verifications }
    });
});

/* ───────────────────────────────────────── */
/* ADMIN: APPROVE VERIFICATION (UPDATED)     */
/* ───────────────────────────────────────── */

const approveStudentVerification = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const verificationRequest = await prisma.studentVerification.findUnique({
        where: { id },
    });

    if (!verificationRequest) {
        return next(new AppError('Verification request not found', 404));
    }

    if (verificationRequest.status === 'VERIFIED') {
        return next(new AppError('This request is already verified', 400));
    }

    // Transaction: Update Request Status AND User Flags
    await prisma.$transaction([
        prisma.studentVerification.update({
            where: { id },
            data: { status: 'VERIFIED', updatedAt: new Date() }
        }),
        prisma.user.update({
            where: { id: verificationRequest.userId },
            data: { 
                studentVerified: true,   // 🟢 Main verification flag
                emailVerified: true,     // 🟢 Email is verified via OTP in this flow
                canCreateCampaign: true  // 🟢 Enable campaign creation capability
            } 
        })
    ]);

    res.status(200).json({
        success: true,
        message: 'Student verified successfully. User privileges updated.'
    });
});

/* ───────────────────────────────────────── */
/* ADMIN: REJECT VERIFICATION                */
/* ───────────────────────────────────────── */

const rejectStudentVerification = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // const { reason } = req.body; // Optional

    const verificationRequest = await prisma.studentVerification.findUnique({
        where: { id },
    });

    if (!verificationRequest) {
        return next(new AppError('Verification request not found', 404));
    }

    // Just update the verification status. We do NOT touch the user flags.
    const updatedVerification = await prisma.studentVerification.update({
        where: { id },
        data: { 
            status: 'REJECTED',
            updatedAt: new Date()
        }
    });

    res.status(200).json({
        success: true,
        message: 'Student verification rejected.',
        data: { verification: updatedVerification }
    });
});

module.exports = { 
    createOrder, 
    verify, 
    getAllStudentVerifications, 
    approveStudentVerification, 
    rejectStudentVerification 
};