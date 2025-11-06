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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;
  bankAccountId?: string | null;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface CreateUserProjectData {
  title: string;
  description: string;
  companyName: string;
  skillsRequired: string[];
  timeline: string;
  goalAmount: number;
  imageUrl?: string;
}

export interface UpdateUserProjectData {
  title?: string;
  description?: string;
  companyName?: string;
  skillsRequired?: string[];
  timeline?: string;
  goalAmount?: number;
  imageUrl?: string;
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

// Create user project
export const createUserProject = async (data: CreateUserProjectData): Promise<ApiResponse<{ userProject: UserProject }>> => {
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
