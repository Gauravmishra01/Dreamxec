import apiRequest, { type ApiResponse } from "./api";
import axios from "axios";

/* =========================================================
   TYPES
========================================================= */

export interface Milestone {
  id?: string;
  title: string;
  timeline: string;
  budget: number;
  description?: string;
}

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
   USER PROJECT (CAMPAIGN)
========================================================= */

export interface UserProject {
  id: string;
  title: string;
  description: string;

  userId?: string;
  user?: {
    id: string;
    name: string;
  };

  clubId: string | null;
  club?: {
    id: string;
    name: string;
    college: string;
    slug?: string;
  };

  goalAmount: number;
  amountRaised: number;

  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;

  campaignType?: "INDIVIDUAL" | "TEAM";
  teamMembers?: any[];
  faqs?: any[];
  youtubeUrl?: string;

  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  rejectionReason?: string;
  reapprovalCount?: number;
  milestones?: any[];
}


/* =========================================================
   CREATE PAYLOAD
========================================================= */

export interface CreateUserProjectData {
  title: string;
  description: string;

  /** UI field → mapped to companyName */
  collegeName: string;

  /** 🔑 REQUIRED */
  clubId: string;

  skillsRequired: string[];
  goalAmount: number;

  presentationDeckUrl?: string | null;

  campaignType?: "INDIVIDUAL" | "TEAM";
  teamMembers?: TeamMember[];
  faqs?: FAQ[];
  youtubeUrl?: string;

  milestones: Milestone[];
}

/* =========================================================
   UPDATE PAYLOAD
========================================================= */

export interface UpdateUserProjectData {
  title?: string;
  description?: string;

  /** UI field */
  collegeName?: string;

  clubId?: string;
  club?: {
    id: string;
    name: string;
    college: string;
    slug?: string;
  }

  skillsRequired?: string[];
  goalAmount?: number;

  presentationDeckUrl?: string | null;

  campaignType?: "INDIVIDUAL" | "TEAM";
  teamMembers?: TeamMember[];
  faqs?: FAQ[];
  youtubeUrl?: string;

  milestones?: Milestone[];
}

/* =========================================================
   API CALLS
========================================================= */

// PUBLIC CAMPAIGNS
export const getPublicUserProjects = async (): Promise<
  ApiResponse<{ userProjects: UserProject[] }>
> => {
  return apiRequest("/user-projects/public", { method: "GET" });
};

// SINGLE CAMPAIGN
export const getUserProject = async (
  id: string
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, { method: "GET" });
};

// MY CAMPAIGNS
export const getMyUserProjects = async (): Promise<
  ApiResponse<{ userProjects: UserProject[] }>
> => {
  return apiRequest("/user-projects/my", { method: "GET" });
};

// STUDENT ANALYTICS
export const getStudentAnalytics = async (): Promise<
  ApiResponse<{ analytics: { total: number; approved: number; pending: number; rejected: number; fundsRaised: number } }>
> => {
  return apiRequest("/user-projects/analytics", { method: "GET" });
};

// CREATE CAMPAIGN
export const createUserProject = async (
  data: FormData | CreateUserProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  if (data instanceof FormData) {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user-projects`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  // JSON fallback (rare)
  return apiRequest("/user-projects", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      companyName: data.collegeName,
    }),
  });
};

// UPDATE CAMPAIGN
export const updateUserProject = async (
  id: string,
  data: UpdateUserProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...data,
      ...(data.collegeName && { companyName: data.collegeName }),
    }),
  });
};

// DELETE CAMPAIGN
export const deleteUserProject = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: "DELETE",
  });
};
