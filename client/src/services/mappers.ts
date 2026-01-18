// mapper.ts
// Utility functions to map between backend API types and frontend types

import type { Campaign, Project, UserRole } from '../types';
import type { UserProject } from './userProjectService';
import type { DonorProject } from './donorProjectService';

// Map backend role to frontend role
export const mapBackendRole = (backendRole: 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'USER': 'student',
    'DONOR': 'donor',
    'ADMIN': 'admin',
    'STUDENT_PRESIDENT': 'STUDENT_PRESIDENT', // Must match UserRole type exactly
/* =========================================================
   Shared Types (Campaign-only)

export type Milestone = {
  id?: string;
  title: string;
  timeline: string;
  budget: number;
  description?: string;
};

/* =========================================================
   Role Mapping

export const mapBackendRole = (
  backendRole: 'USER' | 'DONOR' | 'ADMIN'
): UserRole => {
  const roleMap: Record<string, UserRole> = {
    USER: 'student',
    DONOR: 'donor',
    ADMIN: 'admin',
  };

  return roleMap[backendRole] || 'student';
};

// Map frontend role to backend role
export const mapFrontendRole = (frontendRole: UserRole): 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT' => {
  const roleMap: Record<UserRole, 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'> = {
    'student': 'USER',
    'donor': 'DONOR',
    'DONOR': 'DONOR',
    'admin': 'ADMIN',
    'STUDENT_PRESIDENT': 'STUDENT_PRESIDENT'
export const mapFrontendRole = (
  frontendRole: UserRole
): 'USER' | 'DONOR' | 'ADMIN' => {
  const roleMap: Record<UserRole, 'USER' | 'DONOR' | 'ADMIN'> = {
    student: 'USER',
    donor: 'DONOR',
    DONOR: 'DONOR',
    admin: 'ADMIN',
  };

  return roleMap[frontendRole];
};

/* =========================================================
   Status Mapping
========================================================= */

export const mapBackendStatus = (
  backendStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
): 'pending' | 'approved' | 'rejected' => {
  return backendStatus.toLowerCase() as
    | 'pending'
    | 'approved'
    | 'rejected';
};

export const mapFrontendStatus = (
  frontendStatus: 'pending' | 'approved' | 'rejected'
): 'PENDING' | 'APPROVED' | 'REJECTED' => {
  return frontendStatus.toUpperCase() as
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';
};

/* =========================================================
   UserProject (Backend) → Campaign (Frontend)
   ✅ Milestones live ONLY here
========================================================= */

export const mapUserProjectToCampaign = (
  userProject: UserProject
): Campaign => {
  const milestones: Milestone[] = userProject.milestones || [];

  const totalMilestoneBudget = milestones.reduce(
    (sum, m) => sum + (m.budget || 0),
    0
  );

  return {
    id: userProject.id,
    title: userProject.title,
    description: userProject.description,
    clubName: userProject.companyName,
    goalAmount: userProject.goalAmount,
    currentAmount: userProject.amountRaised || 0,
    status: mapBackendStatus(userProject.status),
    createdBy: userProject.userId,
    imageUrl: userProject.imageUrl,
    campaignMedia: userProject.campaignMedia || [],
    presentationDeckUrl: userProject.presentationDeckUrl || null,
    category: 'Technology',
    createdAt: new Date(userProject.createdAt),
    rejectionReason: userProject.rejectionReason,

    // ✅ Campaign-only
    milestones,
   
  };
};

/* =========================================================
   DonorProject (Backend) → Project (Frontend)F
   ❌ NO milestones here
========================================================= */

export const mapDonorProjectToProject = (
  donorProject: DonorProject
): Project => {
  return {
    id: donorProject.id,
    title: donorProject.title,
    companyName: donorProject.organization,
    description: donorProject.description,
    skillsRequired: donorProject.skillsRequired,
    createdBy: donorProject.donorId,
    createdAt: new Date(donorProject.createdAt),
    interestedUsers: [],
    status: mapBackendStatus(donorProject.status),
    rejectionReason: donorProject.rejectionReason,
     timeline: {
      startDate: new Date(donorProject.createdAt),
      endDate: new Date(donorProject.createdAt),
    },
  };
};

/* =========================================================
   Campaign (Frontend) → CreateUserProjectData (Backend)
   ✅ Milestones go to backend ONLY here
========================================================= */

export const mapCampaignToUserProjectData = (
  campaign: Partial<Campaign>
) => {
  return {
    title: campaign.title || '',
    description: campaign.description || '',
    companyName: campaign.clubName || '',
    skillsRequired: [],
    goalAmount: campaign.goalAmount || 0,
    milestones: campaign.milestones || [],
  };
};

/* =========================================================
   Project (Frontend) → CreateDonorProjectData (Backend)
   ❌ NO milestones
========================================================= */

export const mapProjectToDonorProjectData = (
  project: Partial<Project>
) => {
  return {
    title: project.title || '',
    description: project.description || '',
    organization: project.companyName || '',
    skillsRequired: project.skillsRequired || [],
  };
};
