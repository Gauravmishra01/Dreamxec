// src/types/index.ts
// export type UserRole = "student" | "admin" | "DONOR" | "donor" | "STUDENT_PRESIDENT";
export type AccountStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED" | "UNDER_REVIEW";

export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "PAUSED" | "FROZEN" | "pending" | "approved" | "rejected" | "completed" | "paused" | "frozen";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[],
  pagination: PaginationMeta;
}

/* =========================================================
   Club Types
========================================================= */

export interface Club {
  id: string;
  name: string;
  college: string;
  slug: string;
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

  accountStatus: AccountStatus;

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
   Milestones
========================================================= */

export interface MilestoneSubmission {
  id: string;
  milestoneId: string;
  projectId: string;
  proofUrl?: string;
  mediaUrl?: string;
  notes?: string;
  version: number;
  reviewedAt?: string;
  adminFeedback?: string;
  createdAt: string;
}

export type MilestoneStatus =
  | "PENDING"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  durationDays: number;
  budget: number;

  order: number;

  status: MilestoneStatus;

  activatedAt?: string;
  dueDate?: string;
  approvedAt?: string;

  reminder3Sent?: boolean;
  reminder1Sent?: boolean;
  overdueSent?: boolean;
  ratingPenaltyDays?: number;

  submissions?: MilestoneSubmission[];
}

export interface Campaign {
  id: string;
  title: string;
  clubId: string | null;
  club: {
    id: string;
    name: string;
    college: string;
    slug: string;
  };
  description: string;

  goalAmount: number;
  currentAmount: number;

  status: "approved" | "pending" | "rejected";
  createdAt: Date;

  rejectionReason?: string;
  reapprovalCount?: number;

  /* ✅ NEW BACKEND FIELDS */

  campaignType?: "INDIVIDUAL" | "TEAM";

  teamMembers?: TeamMember[];

  faqs?: FAQ[];
  rating?: number;
  youtubeUrl?: string;

  category?: string;
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  createdBy?: string | { id: string };

  userId?: string;



  // ✅ Milestone-based timeline
  milestones?: Milestone[];
}

/* =========================================================
   Donor Project Types
========================================================= */

export interface Project {
  id: string;
  title: string;
  description: string;
  organization?: string; // mapped from organizationName
  companyName?: string; // Alias for organization used by components

  donor?: {
    id: string;
    name: string;
    email: string;
    organizationName: string;
  };

  createdBy?: string; // Donor ID who created the project
  interestedUsers?: Array<{ id: string; name: string; email: string }>; // Users who applied

  skillsRequired: string[];
  timeline: string | { startDate: Date | string; endDate: Date | string } | null; // DB string or parsed object

  totalBudget?: number;
  allocatedFunds?: number;

  status: ProjectStatus;
  rejectionReason?: string;

  createdAt: string | Date;
  updatedAt?: string;
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


/* =========================================================
   Admin Specific Types
========================================================= */

export interface DashboardStats {
  kpi: {
    totalUsers: number;
    totalDonors: number;
    totalClubs: number;
    totalDonations: number;
    campaigns: {
      APPROVED: number;
      PENDING: number;
      REJECTED: number;
      PAUSED: number;
      FROZEN: number;
      total: number;
    };
    milestones?: {
      PENDING: number;
      SUBMITTED: number;
      APPROVED: number;
      REJECTED: number;
      total: number;
    };
    pendingApprovals: number;
    openTickets: number;
  };
  attention: {
    slaBreaches: number;
    frozenCampaigns: number;
    pendingMilestones: number;
  }
}

export interface AuditLog {
  id: string,
  action: string,
  entityType: string,
  entityId: string,
  performedBy: string,
  details?: any;
  createdAt: string;
}