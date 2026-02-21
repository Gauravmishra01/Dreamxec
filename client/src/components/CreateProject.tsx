import { useEffect, useState } from 'react';
import { StarDecoration } from './icons/StarDecoration';
// import apiRequest from '../services/api';
import { getMyDonorEligibility } from '../services/donationService';

const MIN_DONATION = 2000;

interface CreateProjectProps {
  onBack: () => void;
  onSubmit: (data: {
    title: string;
    companyName: string;
    description: string;
    skillsRequired: string[];
    startDate: Date;
    endDate: Date;
  }) => Promise<void>;
}


export default function CreateProject({ onBack, onSubmit }: CreateProjectProps) {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    skillsInput: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eligibility, setEligibility] = useState<{
    canCreateOpportunity: boolean;
    totalDonated: number;
    allowedProjects: number;
    createdProjects: number;
    remainingProjects: number;
    perProjectCost: number;
  } | null>(null);

  const [loadingEligibility, setLoadingEligibility] = useState(true);

  /* --------------------------------------------------
     FETCH ELIGIBILITY
  -------------------------------------------------- */
  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const res = await getMyDonorEligibility();

        setEligibility({
          canCreateOpportunity: res.data.canCreateOpportunity,
          totalDonated: res.data.totalDonated,
          allowedProjects: res.data.allowedProjects,
          createdProjects: res.data.createdProjects,
          remainingProjects: res.data.remainingProjects,
          perProjectCost: res.data.perProjectCost,
        });
      } catch (err) {
        console.error('Eligibility check failed', err);
      } finally {
        setLoadingEligibility(false);
      }
    };

    fetchEligibility();
  }, []);


 const progress = eligibility
  ? Math.min(
      (eligibility.createdProjects / eligibility.allowedProjects) * 100,
      100
    )
  : 0;

  /* --------------------------------------------------
     FORM HANDLERS
  -------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.skillsInput.trim()) {
      newErrors.skillsInput = 'At least one skill is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (
      formData.startDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eligibility || eligibility.remainingProjects <= 0) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const skills = formData.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSubmit({
        title: formData.title,
        companyName: formData.companyName,
        description: formData.description,
        skillsRequired: skills,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
    } catch (err) {
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative Stars - DreamXec Style */}
      <div className="absolute top-20 left-10 opacity-30">
        <StarDecoration />
      </div>
      <div className="absolute bottom-40 right-20 opacity-20 rotate-12">
        <StarDecoration />
      </div>
      <div className="absolute top-1/2 right-10 opacity-25">
        <StarDecoration />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Back Button - Enhanced */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-6 py-3 bg-white border-2 border-dreamxec-navy 
                     shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                     hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150
                     text-dreamxec-navy font-bold text-lg rounded-xl"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-dreamxec-navy mb-3 
                         [text-shadow:_4px_4px_0_rgb(255_183_3)] tracking-tight">
            Create New Project 🚀
          </h1>
          <p className="text-lg md:text-xl text-dreamxec-navy/80 font-bold">
            Opportunities are reviewed before going live
          </p>
        </div>

        {/* ---------------- ELIGIBILITY CARD ---------------- */}
        <div className="mb-8 rounded-2xl border-2 border-dreamxec-navy bg-white p-6 
                        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {loadingEligibility ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-dreamxec-navy border-t-transparent 
                              rounded-full animate-spin"></div>
              <p className="font-black text-dreamxec-navy text-lg">
                Checking eligibility…
              </p>
            </div>
          ) : eligibility?.canCreateOpportunity ? (
            <div className="flex items-center gap-3 p-4 bg-dreamxec-green/10 
                            border-3 border-dreamxec-green rounded-xl">
              <span className="text-3xl">✅</span>
              <p className="font-black text-dreamxec-green text-xl">
                You are eligible to create a project
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔒</span>
                <p className="font-black text-dreamxec-navy text-lg">
                  ₹{eligibility.perProjectCost.toLocaleString('en-IN')} donation unlocks 1 project.
                </p>
              </div>

              {/* Progress Bar - Neobrutalist Style */}
              <div className="relative w-full h-8 bg-dreamxec-cream border-2 border-dreamxec-navy 
                              rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3">
                <div
                  className="h-full bg-dreamxec-green transition-all duration-500 ease-out
                             border-r-4 border-dreamxec-navy relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-base font-bold text-dreamxec-navy">
                  ₹{(eligibility?.totalDonated || 0).toLocaleString('en-IN')} / ₹{MIN_DONATION.toLocaleString('en-IN')} donated
                </p>
                <p className="text-base font-black text-dreamxec-navy">
                  {progress.toFixed(0)}%
                </p>
                <p className="text-sm font-bold text-dreamxec-navy/70">
                  Projects used: {eligibility.createdProjects} / {eligibility.allowedProjects}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- FORM ---------------- */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-6 rounded-2xl border-2 border-dreamxec-navy bg-white p-8 
                      shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${!eligibility?.canCreateOpportunity
              ? 'opacity-50 pointer-events-none grayscale'
              : ''
            }`}
        >
          {/* Project Title */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-dreamxec-navy uppercase tracking-wide">
              Project Title *
            </label>
            <input
              name="title"
              placeholder="e.g., Build AI-Powered Marketing Tool"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-4 border-2 rounded-xl font-bold text-dreamxec-navy
                         placeholder:text-dreamxec-navy/40 bg-white
                         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                         focus:translate-x-[-2px] focus:translate-y-[-2px]
                         transition-all duration-150 outline-none
                         ${errors.title ? 'border-red-500' : 'border-dreamxec-navy'}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm font-bold flex items-center gap-1">
                ⚠️ {errors.title}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-dreamxec-navy uppercase tracking-wide">
              Company Name *
            </label>
            <input
              name="companyName"
              placeholder="e.g., DreamXec Labs"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full p-4 border-2 rounded-xl font-bold text-dreamxec-navy
                         placeholder:text-dreamxec-navy/40 bg-white
                         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                         focus:translate-x-[-2px] focus:translate-y-[-2px]
                         transition-all duration-150 outline-none
                         ${errors.companyName ? 'border-red-500' : 'border-dreamxec-navy'}`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm font-bold flex items-center gap-1">
                ⚠️ {errors.companyName}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-dreamxec-navy uppercase tracking-wide">
              Project Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe your project, goals, and what makes it exciting..."
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-4 border-2 rounded-xl font-bold text-dreamxec-navy
                         placeholder:text-dreamxec-navy/40 bg-white resize-none
                         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                         focus:translate-x-[-2px] focus:translate-y-[-2px]
                         transition-all duration-150 outline-none
                         ${errors.description ? 'border-red-500' : 'border-dreamxec-navy'}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm font-bold flex items-center gap-1">
                ⚠️ {errors.description}
              </p>
            )}
          </div>

          {/* Skills Required */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-dreamxec-navy uppercase tracking-wide">
              Skills Required *
            </label>
            <input
              name="skillsInput"
              placeholder="e.g., React, Node.js, Python, UI/UX Design"
              value={formData.skillsInput}
              onChange={handleChange}
              className={`w-full p-4 border-2 rounded-xl font-bold text-dreamxec-navy
                         placeholder:text-dreamxec-navy/40 bg-white
                         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                         focus:translate-x-[-2px] focus:translate-y-[-2px]
                         transition-all duration-150 outline-none
                         ${errors.skillsInput ? 'border-red-500' : 'border-dreamxec-navy'}`}
            />
            <p className="text-xs text-dreamxec-navy/60 font-bold">
              💡 Separate skills with commas
            </p>
            {errors.skillsInput && (
              <p className="text-red-500 text-sm font-bold flex items-center gap-1">
                ⚠️ {errors.skillsInput}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-dreamxec-navy uppercase tracking-wide mb-3">
              Project Duration *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-dreamxec-navy/70">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 rounded-xl font-bold text-dreamxec-navy
                             bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                             focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                             focus:translate-x-[-2px] focus:translate-y-[-2px]
                             transition-all duration-150 outline-none
                             ${errors.startDate ? 'border-red-500' : 'border-dreamxec-navy'}`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs font-bold">
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-dreamxec-navy/70">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 rounded-xl font-bold text-dreamxec-navy
                             bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                             focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                             focus:translate-x-[-2px] focus:translate-y-[-2px]
                             transition-all duration-150 outline-none
                             ${errors.endDate ? 'border-red-500' : 'border-dreamxec-navy'}`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs font-bold">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !eligibility?.canCreateOpportunity}
            className="w-full bg-dreamxec-green text-white py-5 px-8 rounded-xl font-black text-xl
                       border-2 border-dreamxec-navy shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[4px] hover:translate-y-[4px]
                       active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       active:translate-x-[6px] active:translate-y-[6px]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                       disabled:hover:translate-x-0 disabled:hover:translate-y-0
                       transition-all duration-150 uppercase tracking-wide"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent 
                                rounded-full animate-spin"></div>
                Creating Project...
              </span>
            ) : (
              '🚀 Create Project'
            )}
          </button>

          {/* Info Footer */}
          <div className="mt-6 p-4 bg-dreamxec-cream border-3 border-dreamxec-navy/30 
                          rounded-xl text-center">
            <p className="text-sm text-dreamxec-navy/70 font-bold">
              💡 Your project will be reviewed by our team within 24-48 hours
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}