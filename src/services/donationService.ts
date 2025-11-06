import apiRequest, { type ApiResponse } from './api';

export interface Donation {
  _id: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  donor: {
    _id: string;
    name: string;
    organizationName?: string;
  };
  userProject: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export interface CreateDonationData {
  amount: number;
  userProjectId: string;
  message?: string;
  anonymous?: boolean;
}

export interface PaymentIntentData {
  amount: number;
  projectId: string;
}

// Make a donation
export const createDonation = async (data: CreateDonationData): Promise<ApiResponse<{ donation: Donation }>> => {
  return apiRequest('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Get my donations
export const getMyDonations = async (): Promise<ApiResponse<{ donations: Donation[] }>> => {
  return apiRequest('/donations/my', {
    method: 'GET',
  });
};

// Get donations for a project
export const getProjectDonations = async (projectId: string): Promise<ApiResponse<{ donations: Donation[] }>> => {
  return apiRequest(`/donations/project/${projectId}`, {
    method: 'GET',
  });
};

// Create payment intent for Stripe
export const createPaymentIntent = async (data: PaymentIntentData): Promise<ApiResponse<{ clientSecret: string }>> => {
  return apiRequest('/donations/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
