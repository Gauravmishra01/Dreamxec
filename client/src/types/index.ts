import { Milestone } from "../components/CampaignDetails";

export type UserRole = 'student' | 'admin' | 'donor' | 'DONOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Campaign {
  id: string;
  title: string;
  clubName: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: Date;

  category?: string;
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  createdBy?: string;
  userId?: string;
  rejectionReason?: string;

  // ✅ Milestone-based timeline
  milestones?: Milestone[];
}

export interface Project {
  id: string;
  title: string;
  companyName: string;
  description: string;
  skillsRequired: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
  };
  createdBy: string; // Donor ID
  createdAt: Date;
  interestedUsers: ProjectApplication[];
  status: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string; // Reason for rejection (if rejected)
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  coverLetter: string;
  skills: string[];
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
  appliedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar?: string;
}

