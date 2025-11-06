import apiRequest, { type ApiResponse } from './api';
import type { UserProject } from './userProjectService';
import type { DonorProject } from './donorProjectService';
import type { User } from './authService';

export interface AllProjectsResponse {
  userProjects: {
    results: number;
    projects: UserProject[];
  };
  donorProjects: {
    results: number;
    projects: DonorProject[];
  };
}

export interface VerifyProjectData {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

// Get all projects (admin)
export const getAllProjects = async (): Promise<ApiResponse<AllProjectsResponse>> => {
  return apiRequest('/admin/projects', {
    method: 'GET',
  });
};

// Verify user project
export const verifyUserProject = async (
  id: string,
  data: VerifyProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/admin/projects/user/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Verify donor project
export const verifyDonorProject = async (
  id: string,
  data: VerifyProjectData
): Promise<ApiResponse<{ donorProject: DonorProject }>> => {
  return apiRequest(`/admin/projects/donor/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Get all users
export const getAllUsers = async (): Promise<ApiResponse<{ users: User[] }>> => {
  return apiRequest('/admin/users', {
    method: 'GET',
  });
};

// Get all donors
export const getAllDonors = async (): Promise<ApiResponse<{ donors: User[] }>> => {
  return apiRequest('/admin/donors', {
    method: 'GET',
  });
};
