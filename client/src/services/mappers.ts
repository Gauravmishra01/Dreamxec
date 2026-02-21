// mapper.ts
// Utility functions to map between backend API types and frontend types

import type { Campaign, Project, UserRole } from '../types';
import type { UserProject } from './userProjectService';
import type { DonorProject } from './donorProjectService';

/* =========================================================
   Shared Types
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

export const CAMPAIGN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PROJECT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  FROZEN: 'frozen',
} as const;

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
   ✅ Single source of truth = Club Relation
========================================================= */

export const mapUserProjectToCampaign = (
  userProject: UserProject
): Campaign => {
  return {
    id: userProject.id,
    title: userProject.title,
    description: userProject.description,

    // user: userProject.user,

    clubId: userProject.clubId,
    club: userProject.club
      ? {
        id: userProject.club.id,
        name: userProject.club.name,
        college: userProject.club.college,
        slug: userProject.club.slug,
      }
      : undefined,

    goalAmount: userProject.goalAmount,
    currentAmount: userProject.amountRaised || 0,
    userId: userProject.userId,
    status: mapBackendStatus(userProject.status),
    createdAt: new Date(userProject.createdAt),


    campaignType: userProject.campaignType || "INDIVIDUAL",
    teamMembers: userProject.teamMembers || [],
    faqs: userProject.faqs || [],
    youtubeUrl: userProject.youtubeUrl,

    imageUrl: userProject.imageUrl,
    campaignMedia: userProject.campaignMedia || [],
    presentationDeckUrl: userProject.presentationDeckUrl || null,

    rejectionReason: userProject.rejectionReason,
    milestones: userProject.milestones || [],
  };
};


/* =========================================================
   DonorProject (Backend) → Project (Frontend)
========================================================= */

export const mapDonorProjectToProject = (
  donorProject: DonorProject
): Project => {
  return {
    id: donorProject.id,
    title: donorProject.title,
    companyName: donorProject.organization,
    organization: donorProject.organization,
    description: donorProject.description,
    skillsRequired: donorProject.skillsRequired,
    createdBy: donorProject.donorId,
    createdAt: donorProject.createdAt,
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
   🚀 clubId is sent directly (NO names)
========================================================= */

export const mapCampaignToUserProjectData = (
  campaign: Partial<Campaign>
) => {
  return {
    title: campaign.title || '',
    description: campaign.description || '',
    clubId: campaign.club?.id,
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
