import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Header } from '../sections/Header';
import { FooterContent } from "../sections/Footer/components/FooterContent";


/* -------------------- Reusable Input -------------------- */
type InputProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, error, ...props }: InputProps) => (
  <div>
    <label className="block font-bold text-dreamxec-navy mb-2">
      {label}
    </label>
    <input
      {...props}
      className={`
        w-full p-3 rounded-lg bg-white
        border-2
        ${error ? "border-red-500" : "border-dreamxec-navy"}
        focus:outline-none focus:ring-2 focus:ring-dreamxec-orange
      `}
    />
    {error && (
      <p className="text-sm text-red-500 mt-1">{error}</p>
    )}
  </div>
);


/* -------------------- Main Component -------------------- */
export default function ReferClub() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

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
    portfolio: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /* -------------------- Validation -------------------- */
  const validateUrl = (name: string, value: string) => {
    if (!value) return "";

    if (name === "instagram") {
      return /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(value)
        ? ""
        : "Enter a valid Instagram profile URL";
    }

    if (name === "linkedIn") {
      return /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(value)
        ? ""
        : "Enter a valid LinkedIn profile URL";
    }

    if (name === "portfolio") {
      return /^(https?:\/\/)?.+\..+/.test(value)
        ? ""
        : "Enter a valid website URL";
    }

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (["instagram", "linkedIn", "portfolio"].includes(name)) {
      const error = validateUrl(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    ["instagram", "linkedIn", "portfolio"].forEach((field) => {
      const error = validateUrl(field, (form as any)[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      alert("Please fix validation errors");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (documentFile) data.append("document", documentFile);

      await axios.post(`${API_BASE}/club-referral/refer`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Club referral submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit referral");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <>
    <Header />
    <div className="min-h-screen bg-dreamxec-cream/80 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-dreamxec-navy">
            Refer Your Club
          </h1>
          <p className="mt-3 text-lg text-dreamxec-navy/70">
            Help DreamXec verify and onboard student clubs
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-pastel rounded-3xl border-2 border-dreamxec-navy p-8 space-y-10"
        >

          {/* Club Info */}
          <section>
            <h2 className="text-xl font-bold text-dreamxec-navy mb-6">
              Club Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="College Name" name="collegeName" value={form.collegeName} onChange={handleChange} required />
              <Input label="Club Name" name="clubName" value={form.clubName} onChange={handleChange} required />
            </div>
          </section>

          {/* President */}
          <section>
            <h2 className="text-xl font-bold text-dreamxec-navy mb-6">
              Club President Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="President Name" name="presidentName" value={form.presidentName} onChange={handleChange} required />
              <Input label="President Phone" name="presidentPhone" value={form.presidentPhone} onChange={handleChange} required />
              <Input label="President College Email" type="email" name="presidentEmail" value={form.presidentEmail} onChange={handleChange} required />
            </div>
          </section>

          {/* Faculty */}
          <section>
            <h2 className="text-xl font-bold text-dreamxec-navy mb-6">
              Faculty In-Charge Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Faculty Name" name="ficName" value={form.ficName} onChange={handleChange} required />
              <Input label="Faculty Phone" name="ficPhone" value={form.ficPhone} onChange={handleChange} required />
              <Input label="Faculty Email" type="email" name="ficEmail" value={form.ficEmail} onChange={handleChange} required />
            </div>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-xl font-bold text-dreamxec-navy mb-6">
              Online Presence
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} error={errors.instagram} required />
              <Input label="LinkedIn" name="linkedIn" value={form.linkedIn} onChange={handleChange} error={errors.linkedIn} required />
              <Input label="Portfolio / Website" name="portfolio" value={form.portfolio} onChange={handleChange} error={errors.portfolio} required />
            </div>
          </section>

          {/* Document */}
          <section>
            <label className="block font-bold text-dreamxec-navy mb-2">
              Proof Document (optional)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
              className="w-full p-3 bg-white border-2 border-dreamxec-navy rounded-lg"
            />
          </section>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-dreamxec-orange text-white
              font-bold text-lg py-4 rounded-full
              border-2 border-dreamxec-navy
              hover:opacity-90 transition
            "
          >
            {loading ? "Submitting…" : "Submit Club Referral"}
          </button>

        </form>
      </div>
    </div>
    <FooterContent />
    </>
  );
}
