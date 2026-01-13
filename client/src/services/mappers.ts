// Utility functions to map between backend API types and frontend types
import type { Campaign, Project, UserRole } from '../types';
import type { UserProject } from './userProjectService';
import type { DonorProject } from './donorProjectService';

// Map backend role to frontend role
export const mapBackendRole = (backendRole: 'USER' | 'DONOR' | 'ADMIN'): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'USER': 'student',
    'DONOR': 'donor',
    'ADMIN': 'admin',
  };
  return roleMap[backendRole] || 'student';
};

// Map frontend role to backend role
export const mapFrontendRole = (frontendRole: UserRole): 'USER' | 'DONOR' | 'ADMIN' => {
  const roleMap: Record<UserRole, 'USER' | 'DONOR' | 'ADMIN'> = {
    'student': 'USER',
    'donor': 'DONOR',
    'DONOR': 'DONOR',
    'admin': 'ADMIN'
  };
  return roleMap[frontendRole];
};

// Map backend status to frontend status
export const mapBackendStatus = (backendStatus: 'PENDING' | 'APPROVED' | 'REJECTED'): 'pending' | 'approved' | 'rejected' => {
  return backendStatus.toLowerCase() as 'pending' | 'approved' | 'rejected';
};

// Map frontend status to backend status
export const mapFrontendStatus = (frontendStatus: 'pending' | 'approved' | 'rejected'): 'PENDING' | 'APPROVED' | 'REJECTED' => {
  return frontendStatus.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED';
};

// Map UserProject (backend) to Campaign (frontend)
export const mapUserProjectToCampaign = (userProject: UserProject): Campaign => {
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
    category: 'Technology', // Default category
    createdAt: new Date(userProject.createdAt),
    deadline: new Date(userProject.updatedAt), // You may need to add deadline field to backend
    rejectionReason: userProject.rejectionReason,
  };
};

// Parse timeline string to dates (assuming format like "3 months" or "6 months")
const parseTimeline = (timeline: string): { startDate: Date; endDate: Date } => {
  const startDate = new Date();
  const endDate = new Date();

  // Extract number from timeline string (e.g., "3 months" -> 3)
  const match = timeline.match(/(\d+)\s*(month|week|day)/i);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (unit.startsWith('month')) {
      endDate.setMonth(endDate.getMonth() + value);
    } else if (unit.startsWith('week')) {
      endDate.setDate(endDate.getDate() + (value * 7));
    } else if (unit.startsWith('day')) {
      endDate.setDate(endDate.getDate() + value);
    }
  } else {
    // Default to 3 months if can't parse
    endDate.setMonth(endDate.getMonth() + 3);
  }

  return { startDate, endDate };
};

// Map DonorProject (backend) to Project (frontend)
export const mapDonorProjectToProject = (donorProject: DonorProject): Project => {
  return {
    id: donorProject.id,
    title: donorProject.title,
    companyName: donorProject.organization,
    description: donorProject.description,
    skillsRequired: donorProject.skillsRequired,
    timeline: parseTimeline(donorProject.timeline),
    createdBy: donorProject.donorId,
    createdAt: new Date(donorProject.createdAt),
    interestedUsers: [], // Initialize empty array
    status: mapBackendStatus(donorProject.status),
    rejectionReason: donorProject.rejectionReason,
  };
};

// Map Campaign (frontend) to CreateUserProjectData (backend)
export const mapCampaignToUserProjectData = (campaign: Partial<Campaign>) => {
  return {
    title: campaign.title || '',
    description: campaign.description || '',
    companyName: campaign.clubName || '',
    skillsRequired: [], // Campaigns don't have skills in current frontend
    timeline: '3 months', // Default timeline
    goalAmount: campaign.goalAmount || 0,
    imageUrl: campaign.imageUrl,
  };
};

// Format timeline from dates to string
const formatTimeline = (timeline: { startDate: Date; endDate: Date }): string => {
  const diffTime = Math.abs(timeline.endDate.getTime() - timeline.startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.ceil(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.ceil(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''}`;
  }
};

// Map Project (frontend) to CreateDonorProjectData (backend)
export const mapProjectToDonorProjectData = (project: Partial<Project>) => {
  const timeline = project.timeline
    ? formatTimeline(project.timeline)
    : '3 months';

  return {
    title: project.title || '',
    description: project.description || '',
    organization: project.companyName || '',
    skillsRequired: project.skillsRequired || [],
    timeline,
    totalBudget: 0, // Projects don't have budget in current frontend
    imageUrl: undefined,
  };
};
