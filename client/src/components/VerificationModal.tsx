import React, { useEffect, useState } from 'react';
import { generateEmailOtp, generateMobileOtp, submitVerification, createVerificationPaymentOrder } from '../services/verificationService';
import { data } from 'react-router-dom';
import apiRequest from '../services/api';
interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type OTPStatus = 'idle' | 'sending' | 'sent' | 'verified' | 'failed';

export const VerificationModal = ({ isOpen, onClose }: VerificationModalProps) => {
    const [fullName, setFullName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [officialEmail, setOfficialEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [docType, setDocType] = useState('Student ID Card');
    const [file, setFile] = useState<File | null>(null);

    const [emailOtp, setEmailOtp] = useState('');
    const [emailOtpStatus, setEmailOtpStatus] = useState<OTPStatus>('idle');
    const [mobileOtp, setMobileOtp] = useState('');
    const [mobileOtpStatus, setMobileOtpStatus] = useState<OTPStatus>('idle');

    const [isSubmitting, setIsSubmitting] = useState(false);
    // Removed token states as they are no longer used
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Timer states
    const [emailTimer, setEmailTimer] = useState(0);
    const [mobileTimer, setMobileTimer] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (emailTimer > 0 || mobileTimer > 0) {
            interval = setInterval(() => {
                setEmailTimer((prev) => (prev > 0 ? prev - 1 : 0));
                setMobileTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [emailTimer, mobileTimer]);

    const resetForm = () => {
        setFullName('');
        setStudentEmail('');
        setOfficialEmail('');
        setMobile('');
        setDocType('Student ID Card');
        setFile(null);
        setEmailOtp('');
        setEmailOtpStatus('idle');
        setMobileOtp('');
        setMobileOtpStatus('idle');
        // Removed token resets
        setIsSubmitting(false);
        setEmailTimer(0);
        setMobileTimer(0);
    };

    if (!isOpen) return null;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const sendEmailOtp = async () => {
        if (!studentEmail) {
            alert("Please enter a student email first.");
            return;
        }
        setEmailOtpStatus('sending');
        try {
            const res = await generateEmailOtp(studentEmail);
            if (res.message) {
                // No token to store
                setEmailOtpStatus('sent');
                setEmailTimer(60); // Start cooldown
                if (res.otp) alert(`OTP sent to ${studentEmail}. ${res.otp} (Dev Mode)`);
                else alert(`OTP sent to ${studentEmail}.`);
            } else {
                throw new Error("Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            setEmailOtpStatus('failed');
            alert("Failed to send Email OTP. Please try again.");
        }
    };

    const verifyEmailOtpHandler = async () => {
        if (!emailOtp) {
            alert("Please enter the OTP sent to your email.");
            return;
        }

        try {
            await apiRequest("/otp/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "email",
                    value: studentEmail,
                    otp: emailOtp,
                }),
            });

            setEmailOtpStatus("verified");
            alert("Email verified successfully!");

        } catch (error) {
            console.error(error);
            setEmailOtpStatus("failed");
            alert("Invalid or expired OTP. Please try again.");
        }
    };


    const sendMobileOtp = async () => {
        if (!mobile) {
            alert("Please enter a mobile number first.");
            return;
        }
        setMobileOtpStatus('sending');
        try {
            const res = await generateMobileOtp(mobile);
            if (res.message) {
                // No token to store
                setMobileOtpStatus('sent');
                setMobileTimer(60); // Start cooldown
                if (res.otp) alert(`OTP sent to ${mobile}. ${res.otp} (Dev Mode)`);
                else alert(`OTP sent to ${mobile}.`);
            } else {
                throw new Error("Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            setMobileOtpStatus('failed');
            alert("Failed to send WhatsApp OTP. Please try again.");
        }
    };

    const verifyMobileOtpHandler = async () => {
        if (!mobileOtp) {
            alert("Please enter the OTP sent to your mobile number.");
            return;
        }

        try {
            await apiRequest("/otp/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "phone",
                    value: mobile,
                    otp: mobileOtp,
                }),
            });


            setMobileOtpStatus("verified");
            alert("Mobile number verified successfully!");

        } catch (error) {
            console.error(error);
            setMobileOtpStatus("failed");
            alert("Invalid or expired OTP. Please try again.");
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName || !studentEmail || !officialEmail || !mobile || !file) {
            alert("Please fill in all required fields.");
            return;
        }

        if (emailOtpStatus !== 'verified' || mobileOtpStatus !== 'verified') {
            alert("Please verify both Email and Mobile Number first.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Create Order
            const orderData = await createVerificationPaymentOrder(studentEmail, officialEmail, mobile) as any;
            console.log(orderData)

            if (!orderData || !orderData.order) {
                throw new Error("Failed to create payment order");
            }

            // 2. Open Razorpay
            await loadRazorpay();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                // ✅ IMPORTANT: Use ONLY order_id when Orders API is used
                order_id: orderData.order.id,

                name: "DreamXec",
                description: "Student Verification",

                handler: async function (response: any) {
                    try {
                        const formData = new FormData();
                        formData.append('fullName', fullName);
                        formData.append('studentEmail', studentEmail);
                        formData.append('officialEmail', officialEmail);
                        formData.append('mobileNumber', mobile);
                        formData.append('docType', docType);
                        formData.append('document', file);

                        formData.append('razorpay_payment_id', response.razorpay_payment_id);
                        formData.append('razorpay_order_id', response.razorpay_order_id);
                        formData.append('razorpay_signature', response.razorpay_signature);

                        await submitVerification(formData);

                        setSubmitStatus('success');
                        setTimeout(() => {
                            onClose();
                            setSubmitStatus('idle');
                            resetForm();
                        }, 2000);

                        alert("Verification Submitted Successfully! 🎉");
                    } catch (error) {
                        console.error("Submission failed", error);
                        alert("Payment successful but verification submission failed. Please contact support.");
                        setIsSubmitting(false);
                    }
                },

                prefill: {
                    name: fullName,
                    email: studentEmail,
                    contact: mobile,
                },

                theme: {
                    color: "#F97316",
                },

                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false);
                    }
                }
            };


            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error: any) {
            console.error('Payment initialization failed:', error);
            alert(error.message || "Failed to initiate payment");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border-4 border-dreamxec-navy overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b-2 border-dashed border-dreamxec-navy/20 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-2xl font-bold text-dreamxec-navy font-display">
                            Student Status Verification
                        </h3>
                        <p className="text-sm text-dreamxec-navy/60">
                            Verify your identity to unlock student benefits.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-dreamxec-navy/50 hover:text-dreamxec-orange transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto">
                    {submitStatus === 'success' ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎉</span>
                            </div>
                            <h4 className="text-2xl font-bold text-dreamxec-navy mb-2">Verification Submitted!</h4>
                            <p className="text-gray-600">Your details are under review. We'll notify you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-bold text-dreamxec-navy mb-1">
                                    Student Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name as per ID"
                                    className="w-full px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Student College Email & OTP */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-dreamxec-navy">
                                    Student College Email ID <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={studentEmail}
                                        onChange={(e) => setStudentEmail(e.target.value)}
                                        placeholder="e.g., student@college.edu"
                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                        disabled={emailOtpStatus === 'verified'}
                                        required
                                    />
                                    {emailOtpStatus !== 'verified' && (
                                        <button
                                            type="button"
                                            onClick={sendEmailOtp}
                                            disabled={emailOtpStatus === 'sending' || (emailOtpStatus === 'sent' && emailTimer > 0)}
                                            className="px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded-lg hover:bg-blue-200 disabled:opacity-50 min-w-[100px] transition-all duration-200"
                                        >
                                            {emailOtpStatus === 'sending' ? 'Sending...' : emailTimer > 0 ? `Resend (${emailTimer}s)` : 'Send OTP'}
                                        </button>
                                    )}
                                    {emailOtpStatus === 'verified' && (
                                        <span className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg flex items-center gap-1">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                                {emailOtpStatus === 'sent' && (
                                    <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            value={emailOtp}
                                            onChange={(e) => setEmailOtp(e.target.value)}
                                            placeholder="Enter OTP (1234)"
                                            className="w-32 px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={verifyEmailOtpHandler}
                                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dreamxec-navy mb-1">
                                    Official College Email ID (FIC) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={officialEmail}
                                    onChange={(e) => setOfficialEmail(e.target.value)}
                                    placeholder="Faulty Coordinator or Admin Email"
                                    className="w-full px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Mobile Number & OTP */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-dreamxec-navy">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="Enter 10-digit mobile number"
                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                        disabled={mobileOtpStatus === 'verified'}
                                        required
                                    />
                                    {mobileOtpStatus !== 'verified' && (
                                        <button
                                            type="button"
                                            onClick={sendMobileOtp}
                                            disabled={mobileOtpStatus === 'sending' || (mobileOtpStatus === 'sent' && mobileTimer > 0)}
                                            className="px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded-lg hover:bg-blue-200 disabled:opacity-50 min-w-[100px] transition-all duration-200"
                                        >
                                            {mobileOtpStatus === 'sending' ? 'Sending...' : mobileTimer > 0 ? `Resend (${mobileTimer}s)` : 'Send OTP'}
                                        </button>
                                    )}
                                    {mobileOtpStatus === 'verified' && (
                                        <span className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg flex items-center gap-1">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                                {mobileOtpStatus === 'sent' && (
                                    <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            value={mobileOtp}
                                            onChange={(e) => setMobileOtp(e.target.value)}
                                            placeholder="Enter OTP (5678)"
                                            className="w-32 px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={verifyMobileOtpHandler}
                                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )}
                            </div>


                            {/* Document Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-dreamxec-navy">
                                    Document Verification <span className="text-red-500">*</span>
                                </label>
                                <div className="relative grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg border-2 border-dashed border-dreamxec-navy/20">
                                    <select
                                        value={docType}
                                        onChange={(e) => setDocType(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none bg-white"
                                    >
                                        <option value="Student ID Card">Student ID Card</option>
                                        <option value="Marksheet">Marksheet</option>
                                        <option value="Admission Letter">Admission Letter</option>
                                    </select>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-dreamxec-orange/10 file:text-dreamxec-orange
                                            hover:file:bg-dreamxec-orange/20"
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                                    </div>
                                    {(emailOtpStatus !== 'verified' || mobileOtpStatus !== 'verified') && (
                                        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[1px] flex items-center justify-center z-10">
                                            <span className="text-xs font-bold text-dreamxec-navy bg-white px-3 py-1 rounded-full shadow-sm border border-dreamxec-navy/10">
                                                Verify OTPs first
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={emailOtpStatus !== 'verified' || mobileOtpStatus !== 'verified' || isSubmitting}
                                    className="w-full py-4 bg-dreamxec-orange disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 font-display text-lg"
                                >
                                    {isSubmitting ? 'Processing Payment...' : 'Pay ₹29 & Verify'}
                                </button>
                                {(emailOtpStatus !== 'verified' || mobileOtpStatus !== 'verified') && (
                                    <p className="text-xs text-orange-600 text-center mt-2 font-bold animate-pulse">
                                        👉 Please verify both Email and Mobile Number to proceed to payment.
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
