// mapper.ts
// Utility functions to map between backend API types and frontend types

import type { Campaign, Project, UserRole } from '../types';
import type { UserProject } from './userProjectService';
import type { DonorProject } from './donorProjectService';

/* =========================================================
   Shared Types (Campaign-only)
========================================================= */

export type Milestone = {
  id?: string;
  title: string;
  timeline: string;
  budget: number;
  description?: string;
};

/* =========================================================
   Role Mapping
========================================================= */

// Backend → Frontend
export const mapBackendRole = (
  backendRole: 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'
): UserRole => {
  const roleMap: Record<
    'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT',
    UserRole
  > = {
    USER: 'student',
    DONOR: 'donor',
    ADMIN: 'admin',
    STUDENT_PRESIDENT: 'STUDENT_PRESIDENT',
  };

  return roleMap[backendRole] ?? 'student';
};

// Frontend → Backend
export const mapFrontendRole = (
  frontendRole: UserRole
): 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT' => {
  const roleMap: Record<
    UserRole,
    'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT'
  > = {
    student: 'USER',
    donor: 'DONOR',
    DONOR: 'DONOR',
    admin: 'ADMIN',
    STUDENT_PRESIDENT: 'STUDENT_PRESIDENT',
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

    category: "Technology",

    createdAt: new Date(userProject.createdAt),

    rejectionReason: userProject.rejectionReason,

    /* ✅ NEW FIELDS */

    campaignType: userProject.campaignType || "INDIVIDUAL",

    teamMembers: userProject.teamMembers || [],

    faqs: userProject.faqs || [],

    youtubeUrl: userProject.youtubeUrl || undefined,

    milestones,
  };
};

/* =========================================================
   DonorProject (Backend) → Project (Frontend)
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
