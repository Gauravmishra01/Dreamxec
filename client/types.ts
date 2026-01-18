export type UserRole = 'student' | 'admin';

export type ProjectStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  detail: string;
  goalAmount: number;
  amountRaised: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User;
}

export interface Donation {
  id: string;
  amount: number;
  paymentIntentId: string;
  createdAt: string;
  donorId: string;
  donor?: User;
  projectId: string;
  project?: Project;
  donorName?: string;
  donorEmail?: string;
  message?: string;
}

// Legacy types for backward compatibility with existing components
export interface Campaign extends Omit<Project, 'detail' | 'amountRaised' | 'status' | 'createdAt' | 'updatedAt'> {
  description: string;
  currentAmount: number;
  clubName: string;
  imageUrl: string;
  studentId?: string;
  status: CampaignStatus;
  createdAt: Date | string;
  // deadline?: Date | string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export type CampaignStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// Utility functions for type conversion
export function projectToCampaign(project: Project, additionalData?: Partial<Campaign>): Campaign {
  return {
    id: project.id,
    title: project.title,
    description: project.detail,
    goalAmount: project.goalAmount,
    currentAmount: project.amountRaised,
    clubName: project.owner?.name || 'Unknown Club',
    imageUrl: additionalData?.imageUrl || '',
    studentId: project.ownerId,
    status: projectStatusToCampaignStatus(project.status),
    createdAt: project.createdAt,
    // deadline: additionalData?.deadline,
    ownerId: project.ownerId,
    owner: project.owner,
    ...additionalData,
  };
}

export function campaignToProject(campaign: Campaign): Partial<Project> {
  return {
    title: campaign.title,
    detail: campaign.description,
    goalAmount: campaign.goalAmount,
    amountRaised: campaign.currentAmount,
    status: campaignStatusToProjectStatus(campaign.status),
  };
}

export function projectStatusToCampaignStatus(status: ProjectStatus): CampaignStatus {
  const statusMap: Record<ProjectStatus, CampaignStatus> = {
    'PENDING': 'pending',
    'APPROVED': 'approved',
    'REJECTED': 'rejected',
    'COMPLETED': 'completed',
  };
  return statusMap[status];
}

export function campaignStatusToProjectStatus(status: CampaignStatus): ProjectStatus {
  const statusMap: Record<CampaignStatus, ProjectStatus> = {
    'pending': 'PENDING',
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'completed': 'COMPLETED',
  };
  return statusMap[status];
}
