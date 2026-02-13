import apiRequest, { type ApiResponse } from "./api";

/* ────────────────────────────── */
/* Types */
/* ────────────────────────────── */

export interface CommentAuthor {
  id: string;
  name: string;
  type: "USER" | "DONOR";
}

export interface CampaignComment {
  id: string;
  content: string;
  createdAt: string;
  isFlagged: boolean;
  parentId: string | null;
  author: CommentAuthor | null;
  replies: CampaignComment[];
}

export interface GetCommentsResponse {
  comments: CampaignComment[];
}

export interface CreateCommentResponse {
  comment: CampaignComment;
}

export interface ReportCommentResponse {
  message: string;
}

/* ────────────────────────────── */
/* GET COMMENTS */
/* ────────────────────────────── */

export const getCampaignComments = async (
  campaignId: string
): Promise<ApiResponse<GetCommentsResponse>> => {
  return apiRequest<GetCommentsResponse>(
    `/campaigns/${campaignId}/comments`,
    {
      method: "GET",
    }
  );
};

/* ────────────────────────────── */
/* CREATE COMMENT */
/* ────────────────────────────── */

export const createCampaignComment = async (
  campaignId: string,
  content: string,
  parentId?: string
): Promise<ApiResponse<CreateCommentResponse>> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return apiRequest<CreateCommentResponse>(
    `/campaigns/${campaignId}/comments`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        content,
        parentId,
      }),
    }
  );
};

/* ────────────────────────────── */
/* DELETE COMMENT */
/* ────────────────────────────── */

export const deleteCampaignComment = async (
  commentId: string
): Promise<ApiResponse<{ message: string }>> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return apiRequest<{ message: string }>(
    `/comments/${commentId}`,
    {
      method: "DELETE",
      headers,
    }
  );
};

/* ────────────────────────────── */
/* REPORT COMMENT */
/* ────────────────────────────── */

export const reportCampaignComment = async (
  commentId: string
): Promise<ApiResponse<ReportCommentResponse>> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return apiRequest<ReportCommentResponse>(
    `/comments/${commentId}/report`,
    {
      method: "POST",
      headers,
    }
  );
};
