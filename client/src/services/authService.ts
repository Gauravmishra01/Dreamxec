import apiRequest, { setToken, removeToken, type ApiResponse } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'; // Added STUDENT_PRESIDENT
  organizationName?: string;
  studentVerified?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'; // Added STUDENT_PRESIDENT
  organizationName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

// Register a new user
export const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.token) {
    setToken(response.token);
  }

  return response;
};

// Login user
export const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.token) {
    setToken(response.token);
  }

  return response;
};

// Get current user
export const getCurrentUser = async (): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/auth/me', {
    method: 'GET',
  });
};

// Logout
export const logout = (): void => {
  removeToken();
};

// Forgot password
export const forgotPassword = async (email: string): Promise<ApiResponse<any>> => {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// Reset password
export const resetPassword = async (token: string, password: string): Promise<ApiResponse<any>> => {
  return apiRequest(`/auth/reset-password?token=${token}`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
};

// Google OAuth - Initiate authentication
export const initiateGoogleAuth = (role: 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'): void => { // Added STUDENT_PRESIDENT
  const API_URL = import.meta.env.VITE_API_URL;

  const authUrl = `${API_URL}/auth/google?role=${role}`;
  console.log('🔗 Redirecting to Google OAuth:', authUrl);

  window.location.href = authUrl;
};


// Google OAuth - Handle callback (called after redirect from Google)
export const handleGoogleCallback = async (): Promise<ApiResponse<AuthResponse>> => {
  // Get token from URL params (backend should redirect with token)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    setToken(token);
  }

  // Fetch user data
  return getCurrentUser();
};

// LinkedIn OAuth - Initiate authentication
export const initiateLinkedInAuth = (role: 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'): void => { // Added STUDENT_PRESIDENT
  const API_URL = import.meta.env.VITE_API_URL;
  const authUrl = `${API_URL}/auth/linkedin?role=${role}`;
  console.log('🔗 Redirecting to LinkedIn OAuth:', authUrl);

  window.location.href = authUrl;
};

// LinkedIn OAuth - Handle callback (called after redirect from LinkedIn)
export const handleLinkedInCallback = async (): Promise<ApiResponse<AuthResponse>> => {
  // Get token from URL params (backend should redirect with token)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    setToken(token);
  }

  // Fetch user data
  return getCurrentUser();
};