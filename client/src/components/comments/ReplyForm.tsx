import { useState } from "react";

interface Props {
  onSubmit: (content: string) => Promise<void> | void;
  onCancel: () => void;
}

export default function ReplyForm({ onSubmit, onCancel }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      await onSubmit(content);
      setContent("");
      onCancel(); // close form after reply
    } catch (err) {
      console.error("Reply failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dreamxec-cream p-4 rounded-lg border-2 border-dreamxec-navy mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        rows={3}
        className="w-full p-3 border-2 border-dreamxec-navy rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-dreamxec-orange"
      />

      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-bold border-2 border-dreamxec-navy rounded-md text-dreamxec-navy hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-sm font-bold bg-dreamxec-orange text-white border-2 border-dreamxec-navy rounded-md hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Reply"}
        </button>
      </div>
    </div>
  );
}
