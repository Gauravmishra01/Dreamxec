import apiRequest, { type ApiResponse } from './api';
import axios from 'axios';

/* =========================================================
   Milestone Type (Campaign-only)
========================================================= */

export interface Milestone {
  id?: string;
  title: string;
  timeline: string;
  budget: number;
  description?: string;
}

/* =========================================================
   UserProject (Campaign)
========================================================= */

export interface UserProject {
  id: string;
  title: string;
  description: string;
  companyName: string;
  skillsRequired: string[];

  goalAmount: number;
  amountRaised: number;

  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;

  userId: string;
  bankAccountId?: string | null;

  createdAt: string;
  updatedAt: string;

  // ✅ NEW (campaign-only)
  milestones: Milestone[];
}

/* =========================================================
   Create / Update Payloads (Campaign-only)
========================================================= */

export interface CreateUserProjectData {
  id?: string;
  title: string;
  description: string;
  companyName: string;
  skillsRequired: string[];
  goalAmount: number;

  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  // ✅ NEW
  milestones: Milestone[];
}

export interface UpdateUserProjectData {
  title?: string;
  description?: string;
  companyName?: string;
  skillsRequired?: string[];
  goalAmount?: number;

  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  // ✅ NEW (editable before approval)
  milestones?: Milestone[];
}

/* =========================================================
   API Calls (unchanged endpoints)
========================================================= */

// Get all public campaigns
export const getPublicUserProjects = async (): Promise<
  ApiResponse<{ userProjects: UserProject[] }>
> => {
  return apiRequest('/user-projects/public', {
    method: 'GET',
  });
};

// Get specific campaign
export const getUserProject = async (
  id: string
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: 'GET',
  });
};

// Get my campaigns
export const getMyUserProjects = async (): Promise<
  ApiResponse<{ userProjects: UserProject[] }>
> => {
  return apiRequest('/user-projects/my', {
    method: 'GET',
  });
};

// Create campaign (FormData for files + milestones JSON)
export const createUserProject = async (
  data: FormData | CreateUserProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  if (data instanceof FormData) {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user-projects`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  // JSON fallback (rare)
  return apiRequest('/user-projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update campaign
export const updateUserProject = async (
  id: string,
  data: UpdateUserProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete campaign
export const deleteUserProject = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: 'DELETE',
  });
};
