import apiRequest, { type ApiResponse } from './api';

export interface DonorProject {
  id: string;
  title: string;
  description: string;
  organization: string;
  skillsRequired: string[];
  timeline: string;
  totalBudget: number;
  imageUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  donorId: string; // Changed from userId to donorId
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface CreateDonorProjectData {
  title: string;
  description: string;
  organization: string;
  skillsRequired: string[];
  timeline: string;
  totalBudget: number;
  imageUrl?: string;
}

export interface UpdateDonorProjectData {
  title?: string;
  description?: string;
  organization?: string;
  skillsRequired?: string[];
  timeline?: string;
  totalBudget?: number;
  imageUrl?: string;
}

// Get all public donor projects
export const getPublicDonorProjects = async (): Promise<ApiResponse<{ donorProjects: DonorProject[] }>> => {
  return apiRequest('/donor-projects/public', {
    method: 'GET',
  });
};

// Get specific donor project
export const getDonorProject = async (id: string): Promise<ApiResponse<{ donorProject: DonorProject }>> => {
  return apiRequest(`/donor-projects/${id}`, {
    method: 'GET',
  });
};

// Get my donor projects
export const getMyDonorProjects = async (): Promise<ApiResponse<{ donorProjects: DonorProject[] }>> => {
  return apiRequest('/donor-projects/my', {
    method: 'GET',
  });
};

// Create donor project
export const createDonorProject = async (data: CreateDonorProjectData): Promise<ApiResponse<{ donorProject: DonorProject }>> => {
  return apiRequest('/donor-projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update donor project
export const updateDonorProject = async (
  id: string,
  data: UpdateDonorProjectData
): Promise<ApiResponse<{ donorProject: DonorProject }>> => {
  return apiRequest(`/donor-projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete donor project
export const deleteDonorProject = async (id: string): Promise<ApiResponse<null>> => {
  return apiRequest(`/donor-projects/${id}`, {
    method: 'DELETE',
  });
};
