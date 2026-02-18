import { useState } from "react";
import type { CampaignComment } from "../../types/comment";
import ReplyForm from "./ReplyForm";

interface CurrentUser {
  id: string;
  role: string;
}

interface Props {
  comment: CampaignComment;
  currentUser: CurrentUser | null;
  campaignOwnerId: string;
  onReply: (parentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onReport: (commentId: string) => Promise<void>;
  depth?: number;
}

export default function CommentItem({
  comment,
  currentUser,
  campaignOwnerId,
  onReply,
  onDelete,
  onReport,
  depth = 0,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete =
    currentUser &&
    (currentUser.id === comment.author?.id ||
      currentUser.id === campaignOwnerId ||
      currentUser.role === "ADMIN");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setShowReply(false);
  };

  return (
    <div className="mt-6">
      <div className="bg-white border-3 border-dreamxec-navy rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-dreamxec-navy text-sm sm:text-base">
              {comment.author?.name || "Unknown"}
            </span>

            {comment.author?.type && (
              <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-dreamxec-orange text-white border-2 border-dreamxec-navy rounded-md">
                {comment.author.type}
              </span>
            )}
          </div>

          <span className="text-xs text-dreamxec-navy/60">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Content */}
        <p className="text-dreamxec-navy whitespace-pre-line text-sm sm:text-base">
          {comment.content}
        </p>

        {/* Flagged indicator */}
        {comment.isFlagged && (
          <p className="text-xs text-red-500 mt-2 font-semibold">
            ⚠️ This comment has been reported
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-3 text-xs sm:text-sm font-bold flex-wrap">
          {currentUser && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-dreamxec-orange hover:underline transition"
            >
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:underline disabled:opacity-50 transition"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}

          {currentUser && !canDelete && (
            <button
              onClick={() => onReport(comment.id)}
              className="text-dreamxec-navy/70 hover:underline transition"
            >
              Report
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReply && (
          <div className="mt-4">
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}
      </div>

      {/* Replies (depth limited to 4) */}
      {comment.replies?.length > 0 && depth < 4 && (
        <div className="ml-4 sm:ml-6 pl-4 border-l-2 border-dreamxec-navy/30">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              campaignOwnerId={campaignOwnerId}
              onReply={onReply}
              onDelete={onDelete}
              onReport={onReport}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
