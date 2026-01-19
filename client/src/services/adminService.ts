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

export const getClubVerifications = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest('/admin/club-verifications/verifications', {
    method: 'GET',
  });
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadClubMembers = async (file: File, clubId: string, token?: string) => {
  const form = new FormData();
  form.append('file', file);
  form.append('clubId', clubId);

  const res = await fetch(`${API_BASE}/admin/clubs/members/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Upload failed');
  }
  return res.json();
};