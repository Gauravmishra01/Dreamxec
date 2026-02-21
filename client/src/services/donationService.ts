import apiRequest, { type ApiResponse } from './api';

/* =======================
   TYPES - FIXED!
======================= */
export interface DonorEligibility {
  totalDonated: number;
  perProjectCost: number;
  allowedProjects: number;
  createdProjects: number;
  remainingProjects: number;
  canCreateOpportunity: boolean;
}



// Donation response (unchanged)
export interface Donation {
  id: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  paymentStatus: string;
  donor?: {
    id: string;
    name: string;
    organizationName?: string;
  };
  guestEmail?: string;
  userProject: {
    id: string;
    title: string;
  };
  createdAt: string;
}

// ✅ FIXED: SPLIT INTO 3 CLEAR TYPES
export interface AuthenticatedDonationData {
  amount: number;
  projectId: string;
  message?: string;
  anonymous?: boolean;
}

export interface GuestDonationData {
  amount: number;
  projectId: string;
  email: string;        // REQUIRED for guests
  name?: string;
  message?: string;
  anonymous?: boolean;
}

// Backend still accepts old format for compatibility
export interface CreateOrderData {
  amount: number;
  projectId: string;
  email?: string;
  name?: string;
  message?: string;
  anonymous?: boolean;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface DonationSummary {
  totalAmount: number;
  donationsCount: number;
  projectsSupported: number;
  studentsSupported: number;
}

/* =======================
   API CALLS - FIXED!
======================= */

/**
 * Google/Auth users ONLY - NO EMAIL!
 */
export const createRazorpayOrderAuthenticated = async ({
  amount,
  projectId,
}: {
  amount: number;
  projectId: string;
}) => {
  // 🔥 ADD EMAIL FROM AUTH CONTEXT:
  const token = localStorage.getItem('token');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).email : null;
  
  return apiRequest('/donations/create-order', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      projectId,
      email: userEmail,  // ← THIS FIXES EVERYTHING!
    }),
  });
};


/**
 * Guest users ONLY - WITH EMAIL!
 */
export const createRazorpayOrderGuest = async (
  data: GuestDonationData
): Promise<ApiResponse<{
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}>> => {
  return apiRequest('/donations/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Backward compatibility
export const createRazorpayOrder = async (
  data: CreateOrderData
): Promise<ApiResponse<{
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}>> => {
  return apiRequest('/donations/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Rest unchanged...
export const verifyPayment = async (
  data: VerifyPaymentData
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiRequest('/donations/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMyDonations = async (): Promise<
  ApiResponse<{ donations: Donation[] }>
> => {
  return apiRequest('/donations/my', {
    method: 'GET',
  });
};

export const getProjectDonations = async (
  projectId: string
): Promise<ApiResponse<{ donations: Donation[] }>> => {
  return apiRequest(`/donations/project/${projectId}`, {
    method: 'GET',
  });
};

export const getDonationSummary = async (): Promise<
  ApiResponse<{ summary: DonationSummary }>
> => {
  return apiRequest('/donations/summary', {
    method: 'GET',
  });
};

export const getMyDonorEligibility = async (): Promise<
  ApiResponse<DonorEligibility>
> => {
  return apiRequest('/donations/me/eligibility', {
    method: 'GET',
  });
};

