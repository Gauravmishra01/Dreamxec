// src/types/index.ts

import type { Milestone } from "../components/CampaignDetails";


/* =========================================================
   Club Types
========================================================= */

export interface Club {
  id: string;
  name: string;
  college: string;
  verified: boolean;
}

/* =========================================================
   Campaign Sub-Types
========================================================= */

export interface TeamMember {
  name: string;
  role: string;
  image?: string; // Cloudinary URL
}

export interface FAQ {
  question: string;
  answer: string;
}

/* =========================================================
   User & Roles
========================================================= */

export type UserRole =
  | "student"
  | "admin"
  | "donor"
  | "DONOR"
  | "STUDENT_PRESIDENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;

  emailVerified: boolean;
  studentVerified: boolean;

  isClubPresident: boolean;
  isClubMember: boolean;
  clubVerified: boolean;

  clubIds: string[];

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   Campaign Types (User Projects)
========================================================= */

export interface Campaign {
  id: string;
  title: string;
  clubId: string | null;
  club: {
    id: string;
    name: string;
    college: string;
  };
  description: string;

  goalAmount: number;
  currentAmount: number;

  status: "approved" | "pending" | "rejected";
  createdAt: Date;

  /* ✅ NEW BACKEND FIELDS */

  campaignType?: "INDIVIDUAL" | "TEAM";

  teamMembers?: TeamMember[];

  faqs?: FAQ[];

  youtubeUrl?: string;

  category?: string;
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  createdBy?: string | { id: string };

  userId?: string;

  rejectionReason?: string;

  // ✅ Milestone-based timeline
  milestones?: Milestone[];
}

/* =========================================================
   Donor Project Types
========================================================= */

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

  createdBy: string | { id: string };
  createdAt: Date;

  interestedUsers: ProjectApplication[];

  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;

  userId: string;
  userName: string;
  userEmail: string;

  coverLetter: string;
  skills: string[];

  status: "pending" | "accepted" | "rejected";
  rejectionReason?: string;

  appliedAt: Date;
}

/* =========================================================
   Student
========================================================= */

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar?: string;
}
