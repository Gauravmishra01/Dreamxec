import { useState, useRef, useEffect, useCallback } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import YouTube from "react-youtube";
import toast from 'react-hot-toast';
import apiRequest from '../services/api';
import { getMyClubs, type MyClub } from '../services/clubService';

// Icons
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

interface CreateCampaignProps {
  onBack: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    clubId: string;        // 🆕 REQUIRED
    // collegeName: string;   // 🆕 RENAMED
    goalAmount: number;
    bannerFile: File | null;
    mediaFiles: File[];
    presentationDeckUrl: string;
    campaignType: "INDIVIDUAL" | "TEAM";
    teamMembers?: { name: string; role: string; image?: File | null }[];
    faqs?: { question: string; answer: string }[];
    youtubeUrl?: string;
    milestones: { title: string; timeline: string; budget: string; description?: string }[];
  }) => Promise<void>;
  initialData?: any; // 🆕 EDIT MODE
}

type Milestone = { title: string; timeline: string; budget: string; description?: string };
type ClubOption = {
  id: string;
  name: string;
  college: string;
};

export default function CreateCampaign({ onBack, onSubmit, initialData }: CreateCampaignProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  // const [collegeName, setCollegeName] = useState('');
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [clubId, setClubId] = useState(initialData?.clubId || '');

  const [goalAmount, setGoalAmount] = useState(initialData?.goalAmount?.toString() || '');
  const [presentationDeckUrl, setPresentationDeckUrl] = useState(initialData?.presentationDeckUrl || '');
  const [campaignType, setCampaignType] = useState<"INDIVIDUAL" | "TEAM">(initialData?.campaignType || "INDIVIDUAL");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  // Preview URLs for existing data
  const [bannerPreview, setBannerPreview] = useState(initialData?.imageUrl || '');
  const [mediaPreviews, setMediaPreviews] = useState<string[]>(initialData?.campaignMedia || []);

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(initialData?.faqs || []);

  const [teamMembers, setTeamMembers] = useState<{ name: string; role: string; image: File | null }[]>(
    initialData?.teamMembers?.map((m: any) => ({ ...m, image: null })) || []
  );

  const [milestones, setMilestones] = useState<Milestone[]>(
    initialData?.milestones?.map((m: any) => ({
      title: m.title,
      timeline: m.timeline,
      budget: m.budget.toString(),
      description: m.description || ''
    })) || [{ title: '', timeline: '', budget: '', description: '' }]
  );

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup object URLs but NOT external URLs from initialData
      if (bannerPreview && !bannerPreview.startsWith('http')) URL.revokeObjectURL(bannerPreview);
      mediaPreviews.forEach(url => {
        if (!url.startsWith('http')) URL.revokeObjectURL(url);
      });
    };
  }, [bannerPreview, mediaPreviews]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await apiRequest('/clubs/my', { method: 'GET' });

        console.log('🔥 /clubs/my RAW RESPONSE:', res);

        const data = res.data as { clubs: ClubOption[] };
        setClubs(data.clubs);
      } catch (err) {
        console.error('❌ clubs fetch failed:', err);
        toast.error('Failed to load clubs');
      }
    };

    fetchClubs();
  }, []);



  const getVideoId = useCallback((url: string): string => {
    if (!url) return '';
    const cleanUrl = url.split('?')[0];
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return '';
  }, []);

  const totalMilestoneBudget = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.budget) || 0), 0
  );

  const isFormValid = (() => {
    switch (step) {
      case 1:
        const goalNum = parseFloat(goalAmount);
        return title.trim() &&
          description.trim() &&
          clubId.trim() &&
          goalAmount && !isNaN(goalNum) && goalNum > 0; // ✅ FIXED
      case 2:
        return true; // Step 2 has no required fields

      case 3:
        return (
          (bannerFile || initialData?.imageUrl) && // ✅ Allow if existing image
          milestones.every(
            m =>
              m.title.trim() &&
              m.timeline.trim() &&
              parseFloat(m.budget) > 0
          ) &&
          totalMilestoneBudget <= parseFloat(goalAmount)
        );

      case 4:
        return true;
      default:
        return false;
    }
  })();




  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveMedia = useCallback((index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => {
      const urlToRemove = prev[index];
      if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const addMilestone = () => setMilestones(prev => [...prev, { title: '', timeline: '', budget: '', description: '' }]);
  const removeMilestone = (index: number) => setMilestones(prev => prev.filter((_, i) => i !== index));
  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    setMilestones(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const nextStep = () => {

    // STEP 1 validation
    if (
      step === 1 &&
      (!title.trim() ||
        !description.trim() ||
        !goalAmount.trim() ||
        !clubId.trim() ||
        !parseFloat(goalAmount))
    ) {
      toast.error('Please fill all basic information');
      return;
    }

    // STEP 3 validation (milestones belong here)
    if (
      step === 3 &&
      ((!bannerFile && !initialData?.imageUrl) || // ✅ Check existing
        totalMilestoneBudget > parseFloat(goalAmount) ||
        !milestones.every(
          m =>
            m.title.trim() &&
            m.timeline.trim() &&
            parseFloat(m.budget) > 0
        ))
    ) {
      toast.error('Please complete all milestones and upload a banner image. Ensure total milestone budget does not exceed campaign goal.');
      return;
    }

    if (step < 4) setStep(prev => prev + 1);
  };



  const prevStep = () => { if (step > 1) setStep(prev => prev - 1); };

  const handleSubmit = async () => {  // ✅ Remove e: React.FormEvent
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit({
        title, description,
        goalAmount: parseFloat(goalAmount),
        clubId,
        // collegeName,
        bannerFile,
        mediaFiles,
        presentationDeckUrl,
        campaignType,
        youtubeUrl,
        faqs: faqs.filter(f => f.question.trim() && f.answer.trim()),
        teamMembers: campaignType === 'TEAM' ? teamMembers.filter(m => m.name.trim() && m.role.trim()) : undefined,
        milestones,
      });
      setShowSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
      toast.error(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  // SUCCESS SCREEN
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dreamxec-cream to-white flex items-center justify-center p-4">
        <div className=" rounded-2xl border-2 border-dreamxec-navy shadow-lg p-8 text-center max-w-sm w-full mx-auto">
          <div className="w-20 h-20 bg-dreamxec-green rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-md">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dreamxec-navy mb-2">Success! 🎉</h1>
          <p className="text-base text-dreamxec-navy opacity-80 mb-6">
            Your campaign has been submitted successfully!
          </p>
          <div className="bg-dreamxec-green/20 border-2 border-dreamxec-green rounded-lg p-4">
            <p className="text-dreamxec-green font-semibold text-sm">You'll be notified once approved.</p>
          </div>
        </div>
      </div>
    );
  }

  // Shared input class
  const inputCls = "w-full px-3 py-2 border-2 border-dreamxec-navy rounded-lg text-sm font-medium bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange/20 transition-all";

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute top-10 left-4 opacity-20 pointer-events-none">
        <StarDecoration className="w-10 h-10" color="#FF7F00" />
      </div>
      <div className="absolute top-24 right-8 opacity-20 pointer-events-none">
        <StarDecoration className="w-8 h-8" color="#0B9C2C" />
      </div>

      {/* Header */}
      <div className="bg-dreamxec-navy border-b-4 border-dreamxec-orange shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-dreamxec-orange text-white text-sm font-semibold rounded-lg border-2 border-white hover:scale-105 transition-all shadow-md disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s, idx) => (
            <div key={s} className="flex items-center">
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shadow-sm ${step >= s
                  ? 'bg-dreamxec-orange border-dreamxec-navy text-white'
                  : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                  {step > s ? <CheckCircleIcon className="w-5 h-5" /> : s}
                </div>
                <span className={`mt-1 text-xs font-semibold whitespace-nowrap ${step >= s ? 'text-dreamxec-navy' : 'text-gray-400'}`}>
                  {['Basic Info', 'Team & Media', 'Milestones', 'Review'][idx]}
                </span>
              </div>
              {/* Connector line */}
              {idx < 3 && (
                <div className={`w-8 sm:w-16 h-1 mx-1 rounded-full transition-all ${step > s ? 'bg-dreamxec-orange' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 pb-12">

        {/* 🔴 ADMIN NOTE FOR REJECTED CAMPAIGNS */}
        {initialData?.status === 'REJECTED' && initialData.rejectionReason && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {/* Alert Icon */}
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                  ⚠️ Admin Feedback (Attempt {(initialData.reapprovalCount || 0) + 1}/3)
                </h3>
                <div className="mt-1 text-sm text-red-700 font-medium">
                  {initialData.rejectionReason}
                </div>
                <p className="mt-2 text-xs text-red-600">
                  Please address the issues above and resubmit your campaign. You have {3 - (initialData.reapprovalCount || 0)} attempts remaining.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className=" backdrop-blur-xl rounded-2xl border-2 border-dreamxec-navy shadow-lg p-4 sm:p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* STEP 1: Basic Information */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-dreamxec-navy">📝 Step 1 / 4</h1>
                <h2 className="text-xl font-bold text-dreamxec-navy mt-1">Basic Information</h2>
                <p className="text-sm text-dreamxec-navy/60">Let's start with the basics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Campaign Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Build Solar Car for National Competition"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">
                    Select Club *
                  </label>

                  <select
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select your club</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name} — {club.college}
                      </option>
                    ))}
                  </select>

                </div>

                {/* <div>
                  <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">College Name *</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g., IIT Delhi"
                    className={inputCls}
                  />
                </div> */}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Fundraising Goal *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-dreamxec-navy">₹</span>
                  <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="50000"
                    className={`${inputCls} pl-8 font-bold`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Campaign Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your amazing project..."
                  rows={4}
                  className={`${inputCls} resize-vertical`}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Campaign Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['INDIVIDUAL', 'TEAM'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCampaignType(type as any)}
                      className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${campaignType === type
                        ? 'bg-dreamxec-navy text-white border-dreamxec-navy'
                        : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:border-dreamxec-orange'
                        }`}
                    >
                      {type === 'INDIVIDUAL' ? '👤 Solo Project' : '👥 Team Project'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 2: Team & Media */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-dreamxec-navy">👥 Step 2 / 4</h1>
                <h2 className="text-xl font-bold text-dreamxec-navy mt-1">
                  {campaignType === 'TEAM' ? 'Team Members & Media' : 'Media & Pitch'}
                </h2>
              </div>

              {campaignType === 'TEAM' && (
                <div className="space-y-3 mb-6">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="p-4 border-2 border-dreamxec-navy rounded-lg bg-dreamxec-cream">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-dreamxec-navy">Member {idx + 1}</h3>
                        <button
                          type="button"
                          onClick={() => setTeamMembers(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => {
                            const copy = [...teamMembers];
                            copy[idx].name = e.target.value;
                            setTeamMembers(copy);
                          }}
                          className={inputCls}
                        />
                        <input
                          placeholder="Role"
                          value={member.role}
                          onChange={(e) => {
                            const copy = [...teamMembers];
                            copy[idx].role = e.target.value;
                            setTeamMembers(copy);
                          }}
                          className={inputCls}
                        />
                        <div className="flex flex-col gap-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const copy = [...teamMembers];
                              copy[idx].image = file;
                              setTeamMembers(copy);
                            }}
                            className="text-xs"
                          />

                          {member.image && (
                            <img
                              src={URL.createObjectURL(member.image)}
                              alt="preview"
                              className="w-12 h-12 object-cover rounded-full border"
                            />
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTeamMembers(prev => [...prev, { name: '', role: '', image: null }])}
                    className="w-full p-2.5 bg-dreamxec-orange text-white font-semibold text-sm rounded-lg border-2 border-dreamxec-navy hover:scale-105 transition-all"
                  >
                    + Add Team Member
                  </button>
                </div>
              )}

              {/* YouTube Pitch */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">🎥 Pitch Video</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                  className={inputCls}
                />

                {youtubeUrl && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-dreamxec-navy">
                    <div className="flex items-center gap-2 mb-3">
                      {getVideoId(youtubeUrl) ? (
                        <>
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-semibold text-dreamxec-navy text-sm">✅ Valid video found!</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <XIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-semibold text-red-600 text-sm">❌ Invalid YouTube URL</span>
                        </>
                      )}
                    </div>
                    {getVideoId(youtubeUrl) && (
                      <div className="rounded-lg overflow-hidden border-2 border-dreamxec-navy">
                        <YouTube
                          videoId={getVideoId(youtubeUrl)}
                          opts={{
                            width: "100%",
                            height: "315",
                            playerVars: { modestbranding: 1, rel: 0 }
                          }}
                          onError={(e) => console.log('YouTube error:', e)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-dreamxec-navy">FAQs</label>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 border-2 border-dreamxec-navy rounded-lg bg-white">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm text-dreamxec-navy">FAQ {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setFaqs(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => {
                        const copy = [...faqs];
                        copy[idx].question = e.target.value;
                        setFaqs(copy);
                      }}
                      className={`${inputCls} mb-2`}
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const copy = [...faqs];
                        copy[idx].answer = e.target.value;
                        setFaqs(copy);
                      }}
                      rows={2}
                      className={`${inputCls} resize-vertical`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFaqs(prev => [...prev, { question: '', answer: '' }])}
                  className="w-full p-2.5 bg-dreamxec-green text-white font-semibold text-sm rounded-lg border-2 border-dreamxec-navy hover:scale-105 transition-all"
                >
                  + Add FAQ
                </button>
              </div>
            </div>

            {/* STEP 3: Milestones & Files */}
            <div className={step === 3 ? 'block' : 'hidden'}>
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-dreamxec-navy">🎯 Step 3 / 4</h1>
                <h2 className="text-xl font-bold text-dreamxec-navy mt-1">Project Plan & Media</h2>
              </div>

              {/* Banner Upload */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Main Banner Image *</label>
                <div
                  className="border-2 border-dashed border-dreamxec-navy rounded-lg p-6 text-center cursor-pointer hover:bg-dreamxec-cream transition-all"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={handleBannerSelect} />
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="max-h-40 mx-auto rounded-lg border-2 border-dreamxec-navy" />
                  ) : (
                    <>
                      <UploadIcon className="w-8 h-8 mx-auto mb-2 text-dreamxec-navy" />
                      <p className="text-sm font-semibold text-dreamxec-navy">Upload Banner Image</p>
                      <p className="text-xs text-dreamxec-navy/60">JPG, PNG • Max 10MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Media Upload */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Additional Media *</label>
                <div
                  className="border-2 border-dashed border-dreamxec-navy rounded-lg p-6 text-center cursor-pointer hover:bg-dreamxec-cream transition-all"
                  onClick={() => mediaInputRef.current?.click()}
                >
                  <input ref={mediaInputRef} type="file" multiple accept="image/*" hidden onChange={handleMediaSelect} />
                  <UploadIcon className="w-8 h-8 mx-auto mb-2 text-dreamxec-navy" />
                  <p className="text-sm font-semibold text-dreamxec-navy">{mediaFiles.length} image{mediaFiles.length !== 1 ? 's' : ''} selected</p>
                </div>
                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                    {mediaPreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img src={preview} alt={`Media ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-dreamxec-navy" />
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div>
                <h3 className="text-sm font-bold text-dreamxec-navy mb-3">Project Milestones *</h3>
                <div className="space-y-3">
                  {milestones.map((milestone, idx) => (
                    <div key={idx} className="p-4 border-2 border-dreamxec-navy rounded-lg bg-dreamxec-cream">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-dreamxec-navy">Milestone {idx + 1}</h4>
                        {milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMilestone(idx)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          placeholder="Title"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                          className={inputCls}
                        />
                        <input
                          placeholder="Timeline (e.g. Week 1-2)"
                          value={milestone.timeline}
                          onChange={(e) => updateMilestone(idx, 'timeline', e.target.value)}
                          className={inputCls}
                        />
                        <div className="sm:col-span-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm">₹</span>
                            <input
                              type="number"
                              placeholder="Budget"
                              value={milestone.budget}
                              onChange={(e) => updateMilestone(idx, 'budget', e.target.value)}
                              className={`${inputCls} pl-8`}
                            />
                          </div>
                        </div>
                        <textarea
                          placeholder="Description"
                          value={milestone.description || ''}
                          onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                          rows={2}
                          className={`sm:col-span-2 ${inputCls} resize-vertical`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="mt-3 w-full p-2.5 bg-dreamxec-orange text-white font-semibold text-sm rounded-lg border-2 border-dreamxec-navy hover:scale-105 transition-all"
                >
                  + Add Milestone
                </button>

                {/* Budget Summary */}
                <div className="mt-5 p-4 bg-gradient-to-r from-dreamxec-navy to-dreamxec-orange rounded-lg text-white">
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Total Milestone Budget:</span>
                    <span>₹{totalMilestoneBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs opacity-80">
                    <span>Goal Amount:</span>
                    <span>₹{parseFloat(goalAmount || '0').toLocaleString()}</span>
                  </div>
                  {totalMilestoneBudget > parseFloat(goalAmount || '0') && (
                    <p className="text-red-200 font-semibold text-xs mt-1.5">⚠️ Budget exceeds goal!</p>
                  )}
                </div>
              </div>
            </div>

            {/* STEP 4: Review */}
            <div className={step === 4 ? 'block' : 'hidden'}>
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-dreamxec-navy">✅ Step 4 / 4</h1>
                <h2 className="text-xl font-bold text-dreamxec-navy mt-1">Review & Submit</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border-2 border-dreamxec-green rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <h3 className="text-sm font-bold text-dreamxec-navy mb-3">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-semibold">Title:</span> {title || <span className="text-gray-400 italic">Not set</span>}</div>
                    {/* <div><span className="font-semibold">Club:</span> {clubId || <span className="text-gray-400 italic">Not set</span>}</div> */}
                    <div><span className="font-semibold">Goal:</span> ₹{parseFloat(goalAmount || '0').toLocaleString()}</div>
                    <div><span className="font-semibold">Type:</span> {campaignType}</div>
                    <div><span className="font-semibold">Milestones:</span> {milestones.length}</div>
                    <div><span className="font-semibold">Banner:</span> {bannerFile ? '✅ Uploaded' : <span className="text-red-500">⚠️ Missing</span>}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dreamxec-navy mb-1.5">Pitch Deck Link</label>
                  <input
                    type="url"
                    value={presentationDeckUrl}
                    onChange={(e) => setPresentationDeckUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className={inputCls}
                  />
                  <p className="text-xs text-dreamxec-navy/60 mt-1">Google Drive link with "Anyone with link can view"</p>
                </div>
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <div className="p-3 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-semibold text-sm">
                {submitError}
              </div>
            )}


            {/* Navigation */}
            {/* Navigation - FIXED */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t-2 border-dreamxec-navy">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-4 py-2 border-2 border-dreamxec-navy rounded-lg font-semibold text-sm bg-white hover:bg-dreamxec-cream transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <div className="flex flex-1 gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border-2 border-dreamxec-navy rounded-lg font-semibold text-sm bg-white hover:bg-dreamxec-cream transition-all flex-1"
                  >
                    ← Previous
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isFormValid || isSubmitting}
                    className={`px-4 py-2 border-2 border-dreamxec-navy rounded-lg font-semibold text-sm flex-1 shadow-md transition-all ${isFormValid && !isSubmitting
                      ? 'bg-dreamxec-navy text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    title={`Debug: isFormValid=${isFormValid}, step=${step}`} // DEBUG
                  >
                    {/* DEBUG INFO - REMOVE AFTER FIX */}
                    Next Step →
                    <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded">
                      {isFormValid ? '✅' : '❌'} {step}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"  // ✅ CHANGED from type="submit"
                    onClick={handleSubmit}  // ✅ DIRECT CALL
                    disabled={!isFormValid || isSubmitting}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 border-dreamxec-navy flex-1 shadow-md transition-all ${isFormValid && !isSubmitting
                      ? 'bg-dreamxec-green text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {isSubmitting ? 'Creating...' : '🚀 Launch Campaign'}
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}