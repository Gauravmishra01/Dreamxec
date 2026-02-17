import React, { useState } from "react";
import axios from "axios";

interface UploadSummary {
  processed: number;
  created: number;
  updated: number;
  matchedUsers: number;
  errors: { member: string; message: string }[];
}

export default function UploadMembers() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_URL;

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSummary(null);

      const token = localStorage.getItem("token");
      const clubId = localStorage.getItem("clubId");

      const formData = new FormData();
      formData.append("membersFile", file);

      const res = await axios.post(
        `${API}/clubs/${clubId}/upload-members`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to upload members"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-dreamxec-navy">
        Upload Members List (CSV) In Bulk
      </h1>

      {/* CSV FORMAT HELP */}
      <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 text-sm">
        <p className="font-semibold mb-1">CSV format:</p>
        <code className="block text-xs bg-white p-2 rounded border">
          email,name,phone
        </code>
      </div>

      {/* FILE INPUT */}
      <div className="space-y-2">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <p className="text-sm text-gray-600">
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* ACTION */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-semibold border-2 border-dreamxec-navy
          ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-dreamxec-orange text-white hover:opacity-90"
          }`}
      >
        {loading ? "Uploading…" : "Upload Members"}
      </button>

      {/* SUMMARY */}
      {summary && (
        <div className="mt-6 bg-white border-2 border-dreamxec-navy rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-bold text-dreamxec-navy">
            Upload Summary
          </h2>

          <ul className="text-sm space-y-1">
            <li>📦 Processed: <b>{summary.processed}</b></li>
            <li>🆕 Created: <b>{summary.created}</b></li>
            <li>✏️ Updated: <b>{summary.updated}</b></li>
            <li>🔗 Matched Users: <b>{summary.matchedUsers}</b></li>
          </ul>

          {summary.errors.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-red-700 mb-2">
                Errors:
              </p>
              <ul className="text-sm list-disc pl-5 text-red-600">
                {summary.errors.map((e, i) => (
                  <li key={i}>
                    {e.member}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
