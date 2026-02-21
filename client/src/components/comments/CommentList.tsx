import CommentItem from "./CommentItem";
import type { CampaignComment } from "../../types/comment";

interface Props {
  comments: CampaignComment[];
  currentUser: any;
  campaignOwnerId: string;
  onReply: any;
  onDelete: any;
  onReport: any;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CommentList({
  comments,
  currentUser,
  campaignOwnerId,
  onReply,
  onDelete,
  onReport,
  page,
  totalPages,
  onPageChange,
}: Props) {
  /* ---------------- EMPTY STATE ---------------- */
  if (!comments || comments.length === 0) {
    return (
      <div className="bg-white border-3 border-dreamxec-navy rounded-xl p-10 text-center shadow-sm">
        <div className="text-4xl mb-4">💬</div>

        <h3 className="text-xl font-bold text-dreamxec-navy font-display">
          No comments yet
        </h3>

        <p className="text-dreamxec-navy/60 mt-2 text-sm max-w-md mx-auto">
          Be the first to support this campaign by starting a conversation.
        </p>
      </div>
    );
  }

  /* ---------------- NORMAL STATE ---------------- */
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          campaignOwnerId={campaignOwnerId}
          onReply={onReply}
          onDelete={onDelete}
          onReport={onReport}
        />
      ))}

      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className={`px-4 py-2 rounded-lg border-2 border-dreamxec-navy font-bold transition-all
              ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-dreamxec-cream hover:bg-dreamxec-orange hover:text-white"
              }`}
          >
            Prev
          </button>

          <span className="font-bold text-dreamxec-navy">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className={`px-4 py-2 rounded-lg border-2 border-dreamxec-navy font-bold transition-all
              ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-dreamxec-cream hover:bg-dreamxec-orange hover:text-white"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
