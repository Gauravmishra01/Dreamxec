import apiRequest, { type ApiResponse } from "./api";
import axios from "axios";

/* =========================================================
   TYPES
========================================================= */

export interface ClubMember {
    id: string;
    clubId: string;
    email: string;
    name?: string | null;
    phone?: string | null;

    isUserRegistered: boolean;
    userId?: string | null;

    isVerified: boolean;
    addedBy?: string | null;

    createdAt: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface ClubCampaign {
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
}

/* =========================================================
   MEMBER MANAGEMENT
========================================================= */

// GET CLUB MEMBERS
export const getClubMembers = async (
    clubId: string
): Promise<ApiResponse<{ members: ClubMember[] }>> => {
    return apiRequest(`/clubs/${clubId}/members`, {
        method: "GET",
    });
};

// ADD SINGLE MEMBER
export const addClubMember = async (
    clubId: string,
    payload: {
        email: string;
        name?: string;
        phone?: string;
    }
): Promise<ApiResponse<{ action: "created" | "updated" | "noop" }>> => {
    return apiRequest(`/clubs/${clubId}/add-member`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

// REMOVE MEMBER
export const removeClubMember = async (
    clubId: string,
    memberId: string
): Promise<ApiResponse<null>> => {
    return apiRequest(`/clubs/${clubId}/members/${memberId}`, {
        method: "DELETE",
    });
};

// BULK UPLOAD MEMBERS (CSV)
export const uploadClubMembers = async (
    clubId: string,
    file: File
): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("membersFile", file);

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}/upload-members`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

/* =========================================================
   PRESIDENT GOVERNANCE
========================================================= */

// CHANGE CLUB PRESIDENT
export const changeClubPresident = async (
    clubId: string,
    payload: {
        memberId?: string;
        email?: string;
        name?: string;
        phone?: string;
    }
): Promise<ApiResponse<null>> => {
    return apiRequest(`/clubs/${clubId}/change-president`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

/* =========================================================
   CLUB CAMPAIGNS
========================================================= */

// APPROVED CAMPAIGNS
export const getApprovedClubCampaigns = async (
    clubId: string
): Promise<ApiResponse<{ campaigns: ClubCampaign[] }>> => {
    return apiRequest(`/clubs/${clubId}/campaigns/approved`, {
        method: "GET",
    });
};

// PENDING CAMPAIGNS
export const getPendingClubCampaigns = async (
    clubId: string
): Promise<ApiResponse<{ campaigns: ClubCampaign[] }>> => {
    return apiRequest(`/clubs/${clubId}/campaigns/pending`, {
        method: "GET",
    });
};

// REJECTED CAMPAIGNS
export const getRejectedClubCampaigns = async (
    clubId: string
): Promise<ApiResponse<{ campaigns: ClubCampaign[] }>> => {
    return apiRequest(`/clubs/${clubId}/campaigns/rejected`, {
        method: "GET",
    });
};
