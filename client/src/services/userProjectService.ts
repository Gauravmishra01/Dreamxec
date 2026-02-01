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
  image?: string; // Cloudinary URL from backend
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

  /* BASIC */
  title: string;
  description: string;
  companyName: string;

  skillsRequired: string[];

  goalAmount: number;
  amountRaised: number;

  /* MEDIA */
  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  /* NEW FIELDS */
  campaignType?: "INDIVIDUAL" | "TEAM";
  teamMembers?: TeamMember[];
  faqs?: FAQ[];
  youtubeUrl?: string;

  /* STATUS */
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;

  /* OWNER */
  userId: string;
  bankAccountId?: string | null;

  createdAt: string;
  updatedAt: string;

  /* TIMELINE */
  milestones: Milestone[];
}

/* =========================================================
   CREATE PAYLOAD
========================================================= */

export interface CreateUserProjectData {
  title: string;
  description: string;
  companyName: string;

  skillsRequired: string[];
  goalAmount: number;

  imageUrl?: string;
  campaignMedia?: string[];
  presentationDeckUrl?: string | null;

  /* NEW */
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
  companyName?: string;

  skillsRequired?: string[];
  goalAmount?: number;

  imageUrl?: string;
  campaignMedia?: string[];
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
  return apiRequest("/user-projects/public", {
    method: "GET",
  });
};

// SINGLE CAMPAIGN
export const getUserProject = async (
  id: string
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: "GET",
  });
};

// MY CAMPAIGNS
export const getMyUserProjects = async (): Promise<
  ApiResponse<{ userProjects: UserProject[] }>
> => {
  return apiRequest("/user-projects/my", {
    method: "GET",
  });
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

  // JSON fallback
  return apiRequest("/user-projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// UPDATE CAMPAIGN
export const updateUserProject = async (
  id: string,
  data: UpdateUserProjectData
): Promise<ApiResponse<{ userProject: UserProject }>> => {
  return apiRequest(`/user-projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
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
