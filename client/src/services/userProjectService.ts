import apiRequest, { type ApiResponse } from './api';

export interface UserProject {
  id: string;
  title: string;
  description: string;
  companyName: string;
  skillsRequired: string[];
  timeline: string;
  goalAmount: number;
  amountRaised: number;
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;
  bankAccountId?: string | null;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface CreateUserProjectData {
  id?: string;
  title: string;
  description: string;
  companyName: string;
  skillsRequired: string[];
  timeline: string;
  goalAmount: number;
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;
}

export interface UpdateUserProjectData {
  title?: string;
  description?: string;
  companyName?: string;
  skillsRequired?: string[];
  timeline?: string;
  goalAmount?: number;
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;
}

// Get all public user projects (campaigns)
export const getPublicUserProjects = async (): Promise<ApiResponse<{ userProjects: UserProject[] }>> => {
  return apiRequest('/user-projects/public', {
    method: 'GET',
  });
};

// Get specific user project
export const getUserProject = async (id: string): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: 'GET',
  });
};

// Get my user projects
export const getMyUserProjects = async (): Promise<ApiResponse<{ userProjects: UserProject[] }>> => {
  return apiRequest('/user-projects/my', {
    method: 'GET',
  });
};

import axios from 'axios';

// Create user project (supports FormData for file uploads)
export const createUserProject = async (data: FormData | CreateUserProjectData): Promise<ApiResponse<{ userProject: UserProject }>> => {
  // If data is FormData, use axios for multipart/form-data
  if (data instanceof FormData) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user-projects`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Fallback for JSON (legacy support if needed)
  return apiRequest('/user-projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update user project
export const updateUserProject = async (
  id: string,
  data: UpdateUserProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete user project
export const deleteUserProject = async (id: string): Promise<ApiResponse<null>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: 'DELETE',
  });
};
