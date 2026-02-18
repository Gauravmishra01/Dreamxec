import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import {
  getCampaignComments,
  createCampaignComment,
  deleteCampaignComment,
  reportCampaignComment,
} from "../../services/commentService";
import type { CampaignComment } from "../../types/comment";

interface CurrentUser {
  id: string;
  role: string;
}

interface Props {
  campaignId: string;
  campaignOwnerId: string;
  currentUser: CurrentUser | null;
  onLogin?: () => void;
}

export default function CommentSection({
  campaignId,
  campaignOwnerId,
  currentUser,
  onLogin,
}: Props) {
  const [comments, setComments] = useState<CampaignComment[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getCampaignComments(campaignId);
      setComments(res.data?.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  /* ---------------- OPTIMISTIC CREATE ---------------- */

  const handleCreate = async (content: string, parentId?: string) => {
    if (!currentUser) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticComment: CampaignComment = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      isFlagged: false,
      parentId: parentId || null,
      author: {
        id: currentUser.id,
        name: "You",
        type: currentUser.role === "DONOR" ? "DONOR" : "USER",
      },
      replies: [],
    };

    /* ---- Immediately update UI ---- */
    if (!parentId) {
      setComments((prev) => [optimisticComment, ...prev]);
    } else {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [...comment.replies, optimisticComment],
              }
            : comment
        )
      );
    }

    try {
      const res = await createCampaignComment(
        campaignId,
        content,
        parentId
      );

      const realComment = res.data?.comment;

      if (realComment) {
        // Replace temp comment with real one
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === tempId ? realComment : comment
          )
        );
      }
    } catch (err) {
      console.error("Failed to create comment", err);

      // Rollback UI if failed
      setComments((prev) =>
        prev.filter((comment) => comment.id !== tempId)
      );
    }
  };

  /* ---------------- OPTIMISTIC DELETE ---------------- */

  const handleDelete = async (commentId: string) => {
    const previous = comments;

    // Immediately remove from UI
    setComments((prev) =>
      prev.filter((comment) => comment.id !== commentId)
    );

    try {
      await deleteCampaignComment(commentId);
    } catch (err) {
      console.error("Failed to delete comment", err);

      // Rollback if failed
      setComments(previous);
    }
  };

  /* ---------------- REPORT ---------------- */

  const handleReport = async (commentId: string) => {
    try {
      await reportCampaignComment(commentId);
      alert("Comment reported successfully");
    } catch (err) {
      console.error("Failed to report comment", err);
    }
  };

  return (
    <section className="mt-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy mb-6 font-display">
        Comments
      </h2>

      <CommentForm
        currentUser={currentUser}
        onLogin={onLogin}
        onSubmit={(content) => handleCreate(content)}
      />

      <div className="mt-8">
        {loading ? (
          <p className="text-dreamxec-navy/60 text-sm">
            Loading comments...
          </p>
        ) : (
          <CommentList
            comments={comments}
            currentUser={currentUser}
            campaignOwnerId={campaignOwnerId}
            onReply={(parentId, content) =>
              handleCreate(content, parentId)
            }
            onDelete={handleDelete}
            onReport={handleReport}
            page={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        )}
      </div>
    </section>
  );
}
