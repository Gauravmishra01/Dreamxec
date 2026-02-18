export type CommentAuthorType = "USER" | "DONOR";

export interface CommentAuthor {
  id: string;
  name: string;
  type: CommentAuthorType;
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
