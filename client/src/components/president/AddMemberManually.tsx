import React, { useState } from "react";
import { addClubMember } from "../../services/clubService";

interface AddMemberManuallyProps {
  clubId: string;
}

export default function AddMemberManually({ clubId }: AddMemberManuallyProps) {
  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);

    if (!member.email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      await addClubMember(clubId, {
        name: member.name || undefined,
        email: member.email,
        phone: member.phone || undefined,
      });

      setMember({ name: "", email: "", phone: "" });
      alert("✅ Member added successfully");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white border-2 border-dreamxec-navy rounded-xl shadow-xl p-8">
      <h1 className="text-2xl font-bold text-dreamxec-navy mb-2">
        Add Club Member
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Manually add a student to your club by email
      </p>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-dreamxec-navy mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full p-3 rounded-lg border-2 border-dreamxec-navy/20 focus:outline-none focus:border-dreamxec-orange"
          placeholder="Full name"
          value={member.name}
          onChange={(e) =>
            setMember({ ...member, name: e.target.value })
          }
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-dreamxec-navy mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="w-full p-3 rounded-lg border-2 border-dreamxec-navy/20 focus:outline-none focus:border-dreamxec-orange"
          placeholder="student@college.ac.in"
          value={member.email}
          onChange={(e) =>
            setMember({ ...member, email: e.target.value })
          }
        />
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-dreamxec-navy mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          className="w-full p-3 rounded-lg border-2 border-dreamxec-navy/20 focus:outline-none focus:border-dreamxec-orange"
          placeholder="+91 9XXXXXXXXX"
          value={member.phone}
          onChange={(e) =>
            setMember({ ...member, phone: e.target.value })
          }
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Action */}
      <button
        onClick={handleAdd}
        disabled={loading}
        className="w-full py-3 rounded-lg font-semibold text-white bg-dreamxec-orange border-2 border-dreamxec-navy hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Adding Member..." : "Add Member"}
      </button>
    </div>
  );
}
