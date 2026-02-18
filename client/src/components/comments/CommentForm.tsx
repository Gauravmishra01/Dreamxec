import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  currentUser: any;
  onLogin?: () => void;
}

export default function CommentForm({
  onSubmit,
  currentUser,
  onLogin,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await onSubmit(content);
    setContent("");
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="bg-dreamxec-cream border-3 border-dreamxec-navy rounded-xl p-4 text-center">
        <p className="text-dreamxec-navy font-medium">
          Sign in to join the conversation
        </p>
        <button
          onClick={() => navigate("/auth")}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-2 border-dreamxec-navy font-bold hover:scale-105 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-3 border-dreamxec-navy rounded-xl p-2 shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        placeholder="Write your comment..."
        className="w-full border-2 border-dreamxec-navy rounded-lg p-3 resize-none focus:outline-none focus:border-dreamxec-green"
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-dreamxec-navy/60">
          {content.length}/500
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-dreamxec-green text-white rounded-lg border-2 border-dreamxec-navy font-bold hover:scale-105 transition disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
