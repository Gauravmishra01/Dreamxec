import apiRequest, { type ApiResponse } from './api';

/* ────────────────────────────── */
/* Types */
/* ────────────────────────────── */

export interface GenerateOtpResponse {
    message: string;
    otp?: string; // only in dev/test
}

export interface VerifyOtpResponse {
    message: string;
}

/* ────────────────────────────── */
/* OTP GENERATION */
/* ────────────────────────────── */

export const generateEmailOtp = async (
    email: string
): Promise<ApiResponse<GenerateOtpResponse>> => {
    return apiRequest<GenerateOtpResponse>('/otp/generate-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
        }),
    });
};

export const generateMobileOtp = async (
    phonenumber: string
): Promise<ApiResponse<GenerateOtpResponse>> => {
    return apiRequest<GenerateOtpResponse>('/otp/generate-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phonenumber,
        }),
    });
};

/* ────────────────────────────── */
/* OTP VERIFICATION (DUAL OTP) */
/* ────────────────────────────── */

export const verifyOtp = async (
    type: 'email' | 'phone',
    value: string,
    otp: string
): Promise<ApiResponse<VerifyOtpResponse>> => {
    return apiRequest<VerifyOtpResponse>('/otp/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type,
            value,
            otp,
        }),
    });
};

/* ────────────────────────────── */
/* PAYMENT ORDER (CRITICAL FIX) */
/* ────────────────────────────── */

export const createVerificationPaymentOrder = async (
    studentEmail: string,
    officialEmail: string,
    mobileNumber: string
): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/student-verification/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studentEmail,
            officialEmail,
            mobileNumber, // 🔑 MUST MATCH BACKEND
        }),
    });
};

/* ────────────────────────────── */
/* FINAL VERIFICATION SUBMIT */
/* ────────────────────────────── */

export const submitVerification = async (
    formData: FormData
): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/student-verification/verify`,
        {
            method: 'POST',
            headers,
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Verification submission failed');
    }

    return data;
};
