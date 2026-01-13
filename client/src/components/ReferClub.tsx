import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReferClub() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clubName: "",
    collegeName: "",
    presidentEmail: "",
    presidentPhone: "",
    presidentName: "",
    ficName: "",
    ficEmail: "",
    ficPhone: "",
    instagram: "",
    linkedIn: "",
    portfolio: ""

  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateUrl = (name: string, value: string) => {
    let error = "";
    if (!value) return "";

    if (name === "instagram") {
      const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
      if (!instagramRegex.test(value)) {
        error = "Please enter a valid Instagram profile URL (e.g., instagram.com/username)";
      }
    } else if (name === "linkedIn") {
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
      if (!linkedinRegex.test(value)) {
        error = "Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username)";
      }
    } else if (name === "portfolio") {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(value)) {
        error = "Please enter a valid URL";
      }
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate on change
    if (["instagram", "linkedIn", "portfolio"].includes(name)) {
      const error = validateUrl(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Final validation before submit
    const newErrors: { [key: string]: string } = {};
    ["instagram", "linkedIn", "portfolio"].forEach(field => {
      // @ts-ignore
      const error = validateUrl(field, form[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // JWT

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (documentFile) {
        data.append("document", documentFile);
      }

      await axios.post(`${API_BASE}/club-referral/refer`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Referral submitted successfully!");
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit referral.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 border-4 border-dreamxec-navy">
        <h1 className="text-3xl font-bold text-dreamxec-navy mb-6">
          Refer Your Club
        </h1>
        <p className="text-gray-600 mb-6">
          Submit your club details so DreamXec can verify the president and faculty in-charge.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* College Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">College Name</label>
            <input
              name="collegeName"
              value={form.collegeName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>
          {/* Club Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">Club Name</label>
            <input
              name="clubName"
              value={form.clubName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>
          {/* Student Email */}
          <div>
            <label className="font-bold text-dreamxec-navy">President College Email</label>
            <input
              name="presidentEmail"
              type="email"
              value={form.presidentEmail}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Student Phone */}
          <div>
            <label className="font-bold text-dreamxec-navy">President Phone Number</label>
            <input
              name="presidentPhone"
              value={form.presidentPhone}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* President Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">Club President Name</label>
            <input
              name="presidentName"
              value={form.presidentName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Faculty In-Charge Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">Faculty In-Charge Name</label>
            <input
              name="ficName"
              value={form.ficName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Faculty Email */}
          <div>
            <label className="font-bold text-dreamxec-navy">Faculty Email</label>
            <input
              name="ficEmail"
              type="email"
              value={form.ficEmail}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Faculty Phone */}
          <div>
            <label className="font-bold text-dreamxec-navy">Faculty Phone</label>
            <input
              name="ficPhone"
              value={form.ficPhone}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="font-bold text-dreamxec-navy">Instagram</label>
            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              required
              className={`w-full mt-2 p-3 border-2 ${errors.instagram ? 'border-red-500' : 'border-dreamxec-navy'} rounded-lg`}
            />
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="font-bold text-dreamxec-navy">LinkedIn</label>
            <input
              name="linkedIn"
              value={form.linkedIn}
              onChange={handleChange}
              required
              className={`w-full mt-2 p-3 border-2 ${errors.linkedIn ? 'border-red-500' : 'border-dreamxec-navy'} rounded-lg`}
            />
            {errors.linkedIn && (
              <p className="text-red-500 text-sm mt-1">{errors.linkedIn}</p>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="font-bold text-dreamxec-navy">Portfolio</label>
            <input
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              required
              className={`w-full mt-2 p-3 border-2 ${errors.portfolio ? 'border-red-500' : 'border-dreamxec-navy'} rounded-lg`}
            />
            {errors.portfolio && (
              <p className="text-red-500 text-sm mt-1">{errors.portfolio}</p>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="font-bold text-dreamxec-navy">Upload Proof Document (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="w-full mt-2"
              onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dreamxec-orange text-white font-bold p-4 rounded-lg border-4 border-dreamxec-navy hover:bg-orange-600 transition"
          >
            {loading ? "Submitting..." : "Submit Referral"}
          </button>

        </form>

      </div>
    </div>
  );
}
