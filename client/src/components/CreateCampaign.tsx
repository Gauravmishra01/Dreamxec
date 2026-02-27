import { useState, useRef, useEffect, useCallback } from 'react';
import YouTube from "react-youtube";
import toast from 'react-hot-toast';
import apiRequest from '../services/api';

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 flex items-center justify-center text-[9px] font-black text-white leading-none flex-shrink-0"
        style={{ background: '#FF7F00', border: '2px solid #003366' }}
        aria-label="More info"
      >?</button>
      {show && (
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 z-[999] w-60 p-3 text-[11px] font-bold text-white leading-relaxed"
          style={{ background: '#003366', border: '2px solid #FF7F00', boxShadow: '4px 4px 0 #FF7F00' }}
        >
          {text}
          <div className="absolute left-[-7px] top-1/2 -translate-y-1/2 w-0 h-0"
            style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '7px solid #FF7F00' }} />
        </div>
      )}
    </span>
  );
}

// ─── Field Label ──────────────────────────────────────────────────────────────
function FL({ children, required, tip }: { children: React.ReactNode; required?: boolean; tip?: string }) {
  return (
    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#003366]/60 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}{tip && <Tip text={tip} />}
    </label>
  );
}

// ─── Neo Input ────────────────────────────────────────────────────────────────
function NeoInput({ focus, ...props }: any) {
  const [f, setF] = useState(false);
  return (
    <input
      {...props}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      className="w-full px-4 py-2.5 text-sm font-bold text-[#003366] bg-white focus:outline-none transition-all"
      style={f
        ? { border: '2px solid #FF7F00', boxShadow: '3px 3px 0 #003366' }
        : { border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
      onKeyDown={(e) => {
        if (e.key === '-' || e.key === 'e') {
          e.preventDefault();
        }
      }}
    />
  );
}

function NeoTextarea({ rows = 4, ...props }: any) {
  const [f, setF] = useState(false);
  return (
    <textarea
      {...props}
      rows={rows}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      className="w-full px-4 py-2.5 text-sm font-bold text-[#003366] bg-white focus:outline-none transition-all resize-none"
      style={f
        ? { border: '2px solid #FF7F00', boxShadow: '3px 3px 0 #003366' }
        : { border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
    />
  );
}

function NeoSelect({ ...props }: any) {
  const [f, setF] = useState(false);
  return (
    <select
      {...props}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      className="w-full px-4 py-2.5 text-sm font-bold text-[#003366] bg-white focus:outline-none transition-all appearance-none"
      style={f
        ? { border: '2px solid #FF7F00', boxShadow: '3px 3px 0 #003366' }
        : { border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
    />
  );
}

// ─── Background Decorations ───────────────────────────────────────────────────
function BgDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top-left grid pattern */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#003366 0,#003366 1px,transparent 0,transparent 32px),repeating-linear-gradient(90deg,#003366 0,#003366 1px,transparent 0,transparent 32px)', backgroundSize: '32px 32px' }} />

      {/* Top-right orange square */}
      <div className="absolute top-16 right-8 w-20 h-20 rotate-12 opacity-10"
        style={{ background: '#FF7F00', border: '4px solid #003366' }} />
      <div className="absolute top-24 right-24 w-10 h-10 rotate-45 opacity-10"
        style={{ border: '3px solid #0B9C2C' }} />

      {/* Bottom-left green block */}
      <div className="absolute bottom-24 left-8 w-14 h-14 -rotate-6 opacity-10"
        style={{ background: '#0B9C2C', border: '3px solid #003366' }} />
      <div className="absolute bottom-40 left-20 w-6 h-6 rotate-45 opacity-10"
        style={{ background: '#FF7F00' }} />

      {/* Bottom-right navy block */}
      <div className="absolute bottom-20 right-10 w-16 h-16 rotate-6 opacity-10"
        style={{ background: '#003366' }} />

      {/* Mid-left vertical stripe */}
      <div className="absolute top-1/2 left-2 w-1.5 h-32 -translate-y-1/2 opacity-10"
        style={{ background: '#FF7F00' }} />

      {/* Mid-right dots */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute right-6 opacity-10 w-2 h-2"
          style={{ background: '#003366', top: `${30 + i * 8}%` }} />
      ))}

      {/* Bottom-right grid */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#FF7F00 0,#FF7F00 1px,transparent 0,transparent 24px),repeating-linear-gradient(90deg,#FF7F00 0,#FF7F00 1px,transparent 0,transparent 24px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}

// ─── Step Info ────────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, emoji: '📝', label: 'Basic Info', desc: 'Title, goal & club' },
  { num: 2, emoji: '🎬', label: 'Media & Team', desc: 'Videos, FAQs & members' },
  { num: 3, emoji: '🎯', label: 'Milestones', desc: 'Plan & banner upload' },
  { num: 4, emoji: '✅', label: 'Review', desc: 'Final check & submit' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Milestone = { title: string; durationDays: string; budget: string; description?: string };
type ClubOption = { id: string; name: string; college: string };

interface CreateCampaignProps {
  onBack: () => void;
  onSubmit: (data: {
    title: string; description: string; clubId: string; goalAmount: number;
    bannerFile: File | null; mediaFiles: File[]; presentationDeckUrl: string;
    campaignType: 'INDIVIDUAL' | 'TEAM';
    teamMembers?: { name: string; role: string; image?: File | null }[];
    faqs?: { question: string; answer: string }[];
    youtubeUrl?: string;
    milestones: { title: string; durationDays: number; budget: number; description?: string }[];
  }) => Promise<void>;
  initialData?: any;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CreateCampaign({ onBack, onSubmit, initialData }: CreateCampaignProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [clubId, setClubId] = useState(initialData?.clubId || '');
  const [goalAmount, setGoalAmount] = useState(initialData?.goalAmount?.toString() || '');
  const [presentationDeckUrl, setPresentationDeckUrl] = useState(initialData?.presentationDeckUrl || '');
  const [campaignType, setCampaignType] = useState<'INDIVIDUAL' | 'TEAM'>(initialData?.campaignType || 'INDIVIDUAL');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [bannerPreview, setBannerPreview] = useState(initialData?.imageUrl || '');
  const [mediaPreviews, setMediaPreviews] = useState<string[]>(initialData?.campaignMedia || []);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(initialData?.faqs || []);
  const [teamMembers, setTeamMembers] = useState<{ name: string; role: string; image: File | null }[]>(
    initialData?.teamMembers?.map((m: any) => ({ ...m, image: null })) || []
  );
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialData?.milestones?.map((m: any) => ({
      title: m.title, durationDays: m.durationDays?.toString() || '',
      budget: m.budget?.toString() || '', description: m.description || ''
    })) || [{ title: '', durationDays: '', budget: '', description: '' }]
  );
  const [bannerDrag, setBannerDrag] = useState(false);
  const [mediaDrag, setMediaDrag] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (bannerPreview && !bannerPreview.startsWith('http')) URL.revokeObjectURL(bannerPreview);
      mediaPreviews.forEach(url => { if (!url.startsWith('http')) URL.revokeObjectURL(url); });
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest('/clubs/my', { method: 'GET' });
        const data = res.data as { clubs: ClubOption[] };
        setClubs(data.clubs);
      } catch { toast.error('Failed to load clubs'); }
    })();
  }, []);

  const getVideoId = useCallback((url: string): string => {
    if (!url) return '';
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) { const m = url.match(p); if (m?.[1]) return m[1]; }
    return '';
  }, []);

  const totalMilestoneBudget = milestones.reduce((s, m) => s + (parseFloat(m.budget) || 0), 0);

  const isFormValid = (() => {
    if (step === 1) {
      const g = parseFloat(goalAmount);
      return title.trim() && description.trim() && clubId.trim() && goalAmount && !isNaN(g) && g > 0;
    }
    if (step === 2) return true;
    if (step === 3) {
      return (bannerFile || initialData?.imageUrl) &&
        milestones.every(m => m.title.trim() && parseInt(m.durationDays) > 0 && parseFloat(m.budget) > 0) &&
        totalMilestoneBudget <= parseFloat(goalAmount);
    }
    return true;
  })();

  const handleBannerSelect = (file: File) => {
    setBannerFile(file);
    if (bannerPreview && !bannerPreview.startsWith('http')) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleMediaAdd = (files: File[]) => {
    setMediaFiles(prev => [...prev, ...files]);
    setMediaPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleRemoveMedia = useCallback((i: number) => {
    setMediaFiles(prev => prev.filter((_, idx) => idx !== i));
    setMediaPreviews(prev => { const u = prev[i]; if (u && !u.startsWith('http')) URL.revokeObjectURL(u); return prev.filter((_, idx) => idx !== i); });
  }, []);

  const nextStep = () => {
    if (step === 1 && !isFormValid) { toast.error('Please fill all required fields'); return; }
    if (step === 3 && !isFormValid) { toast.error('Complete all milestones and upload a banner. Budget must not exceed goal.'); return; }
    if (step < 4) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); setSubmitError('');
    try {
      await onSubmit({
        title, description, goalAmount: parseFloat(goalAmount), clubId,
        bannerFile, mediaFiles, presentationDeckUrl, campaignType, youtubeUrl,
        faqs: faqs.filter(f => f.question.trim() && f.answer.trim()),
        teamMembers: campaignType === 'TEAM' ? teamMembers.filter(m => m.name.trim() && m.role.trim()) : undefined,
        milestones: milestones.map(m => ({ title: m.title, durationDays: Number(m.durationDays), budget: Number(m.budget), description: m.description })),
      });
      setShowSuccess(true);
      setTimeout(() => onBack(), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setSubmitError(msg); toast.error(msg);
    } finally { setIsSubmitting(false); }
  };

  // ─── Success ───────────────────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#fffbf5' }}>
        <div className="max-w-sm w-full text-center bg-white p-10"
          style={{ border: '4px solid #003366', boxShadow: '10px 10px 0 #0B9C2C' }}>
          <div className="flex h-2 mb-8">
            <div className="flex-1" style={{ background: '#FF7F00' }} />
            <div className="flex-1" style={{ background: '#003366' }} />
            <div className="flex-1" style={{ background: '#0B9C2C' }} />
          </div>
          <div className="w-16 h-16 flex items-center justify-center text-3xl mx-auto mb-5"
            style={{ background: '#f0fdf4', border: '4px solid #0B9C2C', boxShadow: '5px 5px 0 #003366' }}>🚀</div>
          <h1 className="font-black text-2xl text-[#003366] uppercase tracking-tight mb-2">Campaign Submitted!</h1>
          <p className="text-sm font-bold text-[#003366]/60 mb-5">Your campaign is under review. You'll be notified once it's approved by the DreamXec team.</p>
          <div className="px-4 py-3" style={{ background: '#f0fdf4', border: '2px solid #0B9C2C' }}>
            <p className="text-xs font-black text-[#166534] uppercase tracking-widest">✓ Review takes 1–3 business days</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative" style={{ background: '#fffbf5' }}>
      <BgDecorations />

      {/* ── HEADER ── */}
      <div className="relative z-10 top-0" style={{ background: '#003366', borderBottom: '4px solid #FF7F00', boxShadow: '0 4px 0 #FF7F00' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button onClick={onBack} disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-3 py-2 font-black text-xs uppercase tracking-widest text-[#003366] disabled:opacity-50 transition-all hover:translate-x-[-1px]"
            style={{ background: '#FF7F00', border: '2px solid #fff', boxShadow: '3px 3px 0 #fff' }}>
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center font-black text-sm text-[#003366]"
              style={{ background: '#FF7F00', border: '2px solid #fff' }}>D</div>
            <div>
              <p className="font-black text-[10px] text-white uppercase tracking-widest leading-none">DreamXec</p>
              <p className="text-[9px] font-bold text-orange-300 uppercase tracking-[0.2em]">Campaign Creator</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-300">Step {step} of 4</p>
            <p className="text-[11px] font-black text-white uppercase tracking-tight">{STEPS[step - 1].label}</p>
          </div>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          {STEPS.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className="w-10 h-10 flex items-center justify-center font-black text-sm transition-all duration-200"
                  style={step > s.num
                    ? { background: '#0B9C2C', border: '3px solid #003366', color: '#fff', boxShadow: '3px 3px 0 #003366' }
                    : step === s.num
                      ? { background: '#FF7F00', border: '3px solid #003366', color: '#003366', boxShadow: '4px 4px 0 #003366', transform: 'translate(-2px,-2px)' }
                      : { background: '#fff', border: '3px solid #003366', color: '#003366', opacity: 0.4 }}
                >
                  {step > s.num ? <CheckIcon className="w-5 h-5" /> : s.emoji}
                </div>
                <p className={`mt-1.5 text-[9px] font-black uppercase tracking-widest text-center leading-tight ${step >= s.num ? 'text-[#003366]' : 'text-[#003366]/30'}`}>
                  {s.label}
                </p>
                <p className={`text-[8px] font-bold uppercase tracking-widest text-center hidden sm:block ${step === s.num ? 'text-[#FF7F00]' : 'text-[#003366]/30'}`}>
                  {s.desc}
                </p>
              </div>
              {idx < 3 && (
                <div className="flex-1 h-1 mx-2 mb-5"
                  style={{ background: step > s.num ? '#0B9C2C' : '#e5e7eb', border: step > s.num ? 'none' : '1px solid #d1d5db' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── ADMIN REJECTION NOTICE ── */}
      {initialData?.status === 'REJECTED' && initialData.rejectionReason && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 mb-4">
          <div className="p-4 flex items-start gap-3" style={{ background: '#fef2f2', border: '3px solid #dc2626', boxShadow: '5px 5px 0 #003366' }}>
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-red-800 mb-1">
                Admin Feedback — Attempt {(initialData.reapprovalCount || 0) + 1}/3
              </p>
              <p className="text-sm font-bold text-red-700">{initialData.rejectionReason}</p>
              <p className="text-xs font-bold text-red-500 mt-2 uppercase tracking-widest">
                {3 - (initialData.reapprovalCount || 0)} attempt(s) remaining. Address the issues above and resubmit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN FORM CARD ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white" style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}>

          {/* Step header strip */}
          <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
            <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#FF7F00', border: '3px solid #003366' }}>
              {STEPS[step - 1].emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#003366]/40">Step {step} of 4</span>
                <div className="flex h-0.5 flex-1" style={{ background: '#003366', opacity: 0.1 }} />
              </div>
              <h2 className="font-black text-lg text-[#003366] uppercase tracking-tight leading-none">
                {step === 1 && 'Campaign Basics — Set Your Foundation'}
                {step === 2 && 'Media & Team — Show the World Who You Are'}
                {step === 3 && 'Project Plan — Milestones & Visuals'}
                {step === 4 && 'Final Review — One Last Look Before Launch'}
              </h2>
              <p className="text-[10px] font-bold text-[#003366]/50 uppercase tracking-widest mt-0.5">
                {step === 1 && 'Fill in your campaign title, funding goal, and a compelling description'}
                {step === 2 && 'Add a pitch video, team members, and FAQs to build donor trust'}
                {step === 3 && 'Break your project into milestones and upload your campaign visuals'}
                {step === 4 && 'Review everything, add your pitch deck, and launch!'}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">

            {/* ══════════════════════════════
                STEP 1 — BASIC INFO
            ══════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Info tip banner */}
                <div className="flex items-start gap-3 p-4" style={{ background: '#fffbeb', border: '2px solid #FF7F00' }}>
                  <span className="text-lg flex-shrink-0">💡</span>
                  <p className="text-xs font-bold text-[#003366]/80 leading-relaxed">
                    A great campaign title is specific and exciting — instead of "Tech Project", try "Building India's First Student-Made AI Prosthetic Arm".
                    Clear goals raise <strong>3x more funding</strong> than vague ones.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FL required tip="Your campaign title is the first thing donors see. Make it specific, exciting, and outcome-focused. Include what you're building and why it matters. Max 80 characters recommended.">
                      Campaign Title
                    </FL>
                    <NeoInput
                      value={title}
                      onChange={(e: any) => setTitle(e.target.value)}
                      placeholder="e.g., Build Solar-Powered Water Purifier for Villages"
                    />
                    <p className="text-[10px] font-bold text-[#003366]/40 uppercase tracking-widest mt-1">{title.length}/80 recommended</p>
                  </div>

                  <div>
                    <FL required tip="Select the club under which this campaign runs. Your club must be verified on DreamXec. This determines who receives the funds and manages the project.">
                      Select Club
                    </FL>
                    <div className="relative">
                      <NeoSelect value={clubId} onChange={(e: any) => setClubId(e.target.value)}>
                        <option value="">— Choose your verified club —</option>
                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name} · {c.college}</option>)}
                      </NeoSelect>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-black text-[#003366]">▾</div>
                    </div>
                    {clubs.length === 0 && (
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">⚠ No verified clubs found. Get your club verified first.</p>
                    )}
                  </div>
                </div>

                {/* Goal Amount */}
                <div>
                  <FL required tip="Set a realistic, specific goal. Research your actual costs (materials, travel, lab fees, etc.). Campaigns with realistic goals are 40% more likely to succeed. You cannot change this after approval.">
                    Fundraising Goal (₹)
                  </FL>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#003366] text-base">₹</span>
                    <NeoInput
                      type="number"
                      min={0}
                      value={goalAmount}
                      onChange={(e: any) => setGoalAmount(e.target.value)}
                      placeholder="50000"
                      style={{ paddingLeft: '2rem' }}
                    />
                  </div>
                  {goalAmount && parseFloat(goalAmount) > 0 && (
                    <div className="mt-2 flex gap-3">
                      {[25000, 50000, 100000, 200000].map(amt => (
                        <button key={amt} type="button" onClick={() => setGoalAmount(amt.toString())}
                          className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-all"
                          style={parseFloat(goalAmount) === amt
                            ? { background: '#FF7F00', color: '#003366', border: '2px solid #003366' }
                            : { background: '#fff', color: '#003366', border: '2px solid #003366' }}>
                          ₹{(amt / 1000).toFixed(0)}K
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <FL required tip="Write a compelling story: What problem are you solving? Why does it matter? What will the money be used for? What's the expected impact? Aim for 200–400 words. Donors fund stories, not just ideas.">
                    Campaign Description
                  </FL>
                  <NeoTextarea
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    placeholder="Tell your story... What problem are you solving? What will you build? What impact will it create? Be specific and passionate — donors fund people they believe in."
                    rows={6}
                  />
                  <p className="text-[10px] font-bold text-[#003366]/40 uppercase tracking-widest mt-1">
                    {description.split(' ').filter(Boolean).length} words · Recommended: 200–400
                  </p>
                </div>

                {/* Campaign Type */}
                <div>
                  <FL tip="Individual campaigns are run by a single student. Team campaigns let you showcase multiple contributors and build more donor confidence. Team projects receive 25% more funding on average.">
                    Campaign Type
                  </FL>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'INDIVIDUAL', emoji: '👤', label: 'Solo Project', sub: 'Just you driving this' },
                      { val: 'TEAM', emoji: '👥', label: 'Team Project', sub: 'Multiple contributors' },
                    ].map(({ val, emoji, label, sub }) => (
                      <button key={val} type="button" onClick={() => setCampaignType(val as any)}
                        className="flex flex-col items-start gap-1 p-4 text-left transition-all duration-150"
                        style={campaignType === val
                          ? { background: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00', color: '#fff' }
                          : { background: '#fff', border: '3px solid #003366', color: '#003366' }}
                        onMouseEnter={e => { if (campaignType !== val) (e.currentTarget as HTMLElement).style.background = '#fffbeb'; }}
                        onMouseLeave={e => { if (campaignType !== val) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className="font-black text-xs uppercase tracking-widest">{label}</span>
                        <span className="text-[10px] font-bold opacity-60">{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 2 — MEDIA & TEAM
            ══════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-start gap-3 p-4" style={{ background: '#fffbeb', border: '2px solid #FF7F00' }}>
                  <span className="text-lg flex-shrink-0">🎯</span>
                  <p className="text-xs font-bold text-[#003366]/80 leading-relaxed">
                    Campaigns with a pitch video raise <strong>2x more</strong> on average. FAQs reduce donor hesitation.
                    Team profiles build trust. All fields here are <strong>highly recommended</strong>.
                  </p>
                </div>

                {/* YouTube */}
                <div>
                  <FL tip="Paste your YouTube video URL. This should be a 2–3 minute pitch video explaining your project, team, and how the money will be used. Unlisted YouTube videos work too. Strongly recommended.">
                    🎥 Pitch Video (YouTube URL)
                  </FL>
                  <NeoInput
                    type="url"
                    value={youtubeUrl}
                    onChange={(e: any) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {youtubeUrl && (
                    <div className="mt-3">
                      {getVideoId(youtubeUrl) ? (
                        <div className="overflow-hidden" style={{ border: '3px solid #003366', boxShadow: '4px 4px 0 #0B9C2C' }}>
                          <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#f0fdf4', borderBottom: '2px solid #003366' }}>
                            <CheckIcon className="w-4 h-4 text-green-600" />
                            <span className="font-black text-[10px] uppercase tracking-widest text-[#166534]">Valid YouTube video detected</span>
                          </div>
                          <YouTube videoId={getVideoId(youtubeUrl)} opts={{ width: '100%', height: '280', playerVars: { modestbranding: 1, rel: 0 } }} />
                        </div>
                      ) : (
                        <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#fef2f2', border: '2px solid #dc2626' }}>
                          <XIcon className="w-4 h-4 text-red-600" />
                          <span className="font-black text-[10px] uppercase tracking-widest text-red-700">Invalid YouTube URL — paste the full link</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Team Members */}
                {campaignType === 'TEAM' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <FL tip="Add each team member's name and their role in the project (e.g., Lead Engineer, Designer, Researcher). Upload a photo for each — it significantly increases donor trust.">
                        Team Members
                      </FL>
                    </div>
                    <div className="space-y-3">
                      {teamMembers.map((member, idx) => (
                        <div key={idx} className="p-4 space-y-3" style={{ background: '#fffbf5', border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5"
                              style={{ background: '#003366' }}>Member #{idx + 1}</span>
                            <button type="button" onClick={() => setTeamMembers(prev => prev.filter((_, i) => i !== idx))}
                              className="text-[10px] font-black text-red-600 uppercase tracking-widest px-2 py-1"
                              style={{ border: '2px solid #dc2626', background: '#fef2f2' }}>✕ Remove</button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <NeoInput placeholder="Full Name" value={member.name}
                              onChange={(e: any) => { const c = [...teamMembers]; c[idx].name = e.target.value; setTeamMembers(c); }} />
                            <NeoInput placeholder="Role (e.g., Lead Engineer)" value={member.role}
                              onChange={(e: any) => { const c = [...teamMembers]; c[idx].role = e.target.value; setTeamMembers(c); }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50 mb-1">Profile Photo ()</p>
                            <label className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-all"
                              style={{ border: '2px dashed #003366', background: '#fff' }}>
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (!f) return; const c = [...teamMembers]; c[idx].image = f; setTeamMembers(c); }} />
                              {member.image
                                ? <img src={URL.createObjectURL(member.image)} alt="preview" className="w-8 h-8 object-cover" style={{ border: '2px solid #003366' }} />
                                : <UploadIcon className="w-4 h-4 text-[#003366]/40" />}
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50">
                                {member.image ? member.image.name : 'Upload photo'}
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setTeamMembers(prev => [...prev, { name: '', role: '', image: null }])}
                      className="mt-3 flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-1px]"
                      style={{ border: '2px dashed #003366', background: '#fff', width: '100%', justifyContent: 'center' }}>
                      + Add Team Member
                    </button>
                  </div>
                )}

                {/* FAQs */}
                <div>
                  <FL tip="FAQs answer common donor questions before they ask. Good FAQs cover: How will the money be spent? What's the timeline? What happens if you don't reach the goal? What's your team's background?">
                    Frequently Asked Questions (FAQs)
                  </FL>
                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="p-4 space-y-3" style={{ background: '#fffbf5', border: '2px solid #003366', boxShadow: '3px 3px 0 #0B9C2C' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5"
                            style={{ background: '#0B9C2C' }}>FAQ #{idx + 1}</span>
                          <button type="button" onClick={() => setFaqs(prev => prev.filter((_, i) => i !== idx))}
                            className="text-[10px] font-black text-red-600 uppercase tracking-widest px-2 py-1"
                            style={{ border: '2px solid #dc2626', background: '#fef2f2' }}>✕ Remove</button>
                        </div>
                        <NeoInput placeholder="Question (e.g. What happens if you don't hit your goal?)" value={faq.question}
                          onChange={(e: any) => { const c = [...faqs]; c[idx].question = e.target.value; setFaqs(c); }} />
                        <NeoTextarea placeholder="Answer (be honest and detailed — donors appreciate transparency)" value={faq.answer} rows={2}
                          onChange={(e: any) => { const c = [...faqs]; c[idx].answer = e.target.value; setFaqs(c); }} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setFaqs(prev => [...prev, { question: '', answer: '' }])}
                    className="mt-3 flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] transition-all w-full justify-center"
                    style={{ border: '2px dashed #003366', background: '#fff' }}>
                    + Add FAQ
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 3 — MILESTONES & FILES
            ══════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-start gap-3 p-4" style={{ background: '#fffbeb', border: '2px solid #FF7F00' }}>
                  <span className="text-lg flex-shrink-0">📋</span>
                  <p className="text-xs font-bold text-[#003366]/80 leading-relaxed">
                    Break your project into 3–5 milestones. Each milestone shows donors exactly where their money goes.
                    Campaigns with detailed milestones get approved <strong>faster</strong> and receive more trust from donors.
                  </p>
                </div>

                {/* Banner Upload */}
                <div>
                  <FL required tip="Your banner is the thumbnail donors first see. Use a high-quality, landscape (16:9) image that clearly shows your project idea. Avoid text-heavy images — visuals speak louder. JPG/PNG, at least 1200×675px recommended.">
                    Main Banner Image
                  </FL>
                  <div
                    className="w-full flex flex-col items-center justify-center gap-3 py-8 cursor-pointer transition-all"
                    style={{
                      border: bannerDrag ? '3px solid #FF7F00' : '3px dashed #003366',
                      background: bannerDrag ? '#fff7ed' : '#fffbf5',
                      boxShadow: bannerDrag ? '4px 4px 0 #FF7F00' : '4px 4px 0 #003366',
                    }}
                    onClick={() => bannerInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setBannerDrag(true); }}
                    onDragLeave={() => setBannerDrag(false)}
                    onDrop={e => { e.preventDefault(); setBannerDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleBannerSelect(f); }}
                  >
                    <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleBannerSelect(f); }} />
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner" className="max-h-44 w-auto mx-auto" style={{ border: '3px solid #003366' }} />
                    ) : (
                      <>
                        <div className="w-12 h-12 flex items-center justify-center" style={{ background: '#FF7F00', border: '3px solid #003366' }}>
                          <UploadIcon className="w-6 h-6 text-[#003366]" />
                        </div>
                        <p className="font-black text-xs text-[#003366] uppercase tracking-widest">Drag & drop or click to upload</p>
                        <p className="text-[10px] font-bold text-[#003366]/40 uppercase tracking-widest">JPG, PNG · Max 10MB · 16:9 recommended</p>
                      </>
                    )}
                  </div>
                  {bannerFile && (
                    <div className="mt-2 flex items-center justify-between px-3 py-2"
                      style={{ background: '#f0fdf4', border: '2px solid #0B9C2C' }}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#166534]">✓ {bannerFile.name}</span>
                      <button type="button" onClick={() => { setBannerFile(null); setBannerPreview(''); }}
                        className="text-[10px] font-black text-red-600 uppercase tracking-widest">Remove</button>
                    </div>
                  )}
                </div>

                {/* Additional Media */}
                <div>
                  <FL tip="Upload 3–6 additional photos showing your project, team, prototype, or workspace. Donors love seeing behind-the-scenes. More images = more credibility.">
                    Additional Photos
                  </FL>
                  <div
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-all"
                    style={{
                      border: mediaDrag ? '3px solid #FF7F00' : '3px dashed #003366',
                      background: mediaDrag ? '#fff7ed' : '#fffbf5',
                    }}
                    onClick={() => mediaInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setMediaDrag(true); }}
                    onDragLeave={() => setMediaDrag(false)}
                    onDrop={e => { e.preventDefault(); setMediaDrag(false); handleMediaAdd(Array.from(e.dataTransfer.files)); }}
                  >
                    <input ref={mediaInputRef} type="file" multiple accept="image/*" hidden
                      onChange={e => e.target.files && handleMediaAdd(Array.from(e.target.files))} />
                    <UploadIcon className="w-6 h-6 text-[#003366]/40" />
                    <p className="font-black text-xs text-[#003366] uppercase tracking-widest">
                      {mediaFiles.length > 0 ? `${mediaFiles.length} photo(s) added · Click to add more` : 'Add project photos (multiple allowed)'}
                    </p>
                  </div>
                  {mediaPreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                      {mediaPreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img src={preview} alt={`Media ${idx + 1}`} className="w-full h-20 object-cover"
                            style={{ border: '2px solid #003366' }} />
                          <button type="button" onClick={() => handleRemoveMedia(idx)}
                            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                            style={{ background: '#dc2626', border: '2px solid #fff' }}>
                            <XIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div>
                  <FL required tip="Milestones are checkpoints in your project. Each milestone should represent a meaningful deliverable (e.g. 'Purchase Materials', 'Build Prototype', 'Test & Iterate'). Funds are released as milestones are completed.">
                    Project Milestones
                  </FL>

                  <div className="space-y-3">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="p-4 space-y-3" style={{ background: '#fffbf5', border: '2px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5"
                              style={{ background: '#003366' }}>Milestone {idx + 1}</span>
                            {m.title && <span className="text-[10px] font-bold text-[#003366]/50 truncate max-w-[120px]">{m.title}</span>}
                          </div>
                          {milestones.length > 1 && (
                            <button type="button" onClick={() => setMilestones(prev => prev.filter((_, i) => i !== idx))}
                              className="text-[10px] font-black text-red-600 uppercase tracking-widest px-2 py-1"
                              style={{ border: '2px solid #dc2626', background: '#fef2f2' }}>✕ Remove</button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#003366]/40 mb-1">Milestone Title *</p>
                            <NeoInput placeholder="e.g., Procure Materials" value={m.title}
                              onChange={(e: any) => setMilestones(prev => prev.map((ms, i) => i === idx ? { ...ms, title: e.target.value } : ms))} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#003366]/40 mb-1">Duration (days) *</p>
                            <NeoInput type="number" placeholder="e.g., 14" value={m.durationDays}
                              onChange={(e: any) => setMilestones(prev => prev.map((ms, i) => i === idx ? { ...ms, durationDays: e.target.value } : ms))} />
                          </div>
                        </div>

                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#003366]/40 mb-1">Budget Allocated (₹) *</p>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#003366]">₹</span>
                            <NeoInput type="number" placeholder="15000" value={m.budget} min={0}
                              style={{ paddingLeft: '1.75rem' }}
                              onChange={(e: any) => setMilestones(prev => prev.map((ms, i) => i === idx ? { ...ms, budget: e.target.value } : ms))} />
                          </div>
                        </div>

                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#003366]/40 mb-1">Description ()</p>
                          <NeoTextarea placeholder="What will happen in this milestone? What will be delivered?" value={m.description || ''} rows={2}
                            onChange={(e: any) => setMilestones(prev => prev.map((ms, i) => i === idx ? { ...ms, description: e.target.value } : ms))} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={() => setMilestones(prev => [...prev, { title: '', durationDays: '', budget: '', description: '' }])}
                    className="mt-3 flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] transition-all w-full justify-center"
                    style={{ border: '2px dashed #003366', background: '#fff' }}>
                    + Add Milestone
                  </button>

                  {/* Budget summary */}
                  <div className="mt-4 p-4" style={{ background: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-300">Total Milestone Budget</span>
                      <span className="font-black text-white text-lg">₹{totalMilestoneBudget.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <div className="h-full transition-all duration-500"
                        style={{
                          width: `${Math.min((totalMilestoneBudget / (parseFloat(goalAmount) || 1)) * 100, 100)}%`,
                          background: totalMilestoneBudget > parseFloat(goalAmount || '0') ? '#dc2626' : '#0B9C2C',
                        }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">Campaign Goal: ₹{parseFloat(goalAmount || '0').toLocaleString()}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: totalMilestoneBudget > parseFloat(goalAmount || '0') ? '#fca5a5' : '#86efac' }}>
                        {totalMilestoneBudget > parseFloat(goalAmount || '0') ? '⚠ Over budget!' : `₹${(parseFloat(goalAmount || '0') - totalMilestoneBudget).toLocaleString()} remaining`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                STEP 4 — REVIEW
            ══════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-4" style={{ background: '#fffbeb', border: '2px solid #FF7F00' }}>
                  <span className="text-lg flex-shrink-0">🔍</span>
                  <p className="text-xs font-bold text-[#003366]/80 leading-relaxed">
                    Review your campaign before submitting. Once submitted, you <strong>cannot edit</strong> your campaign until the DreamXec team reviews it.
                    Check everything carefully!
                  </p>
                </div>

                {/* Summary grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 space-y-3" style={{ background: '#fffbf5', border: '3px solid #003366', boxShadow: '5px 5px 0 #0B9C2C' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/40 border-b-2 pb-2" style={{ borderColor: '#003366' }}>Campaign Summary</p>
                    {[
                      { label: 'Title', val: title || '—', ok: !!title },
                      { label: 'Goal', val: `₹${parseFloat(goalAmount || '0').toLocaleString()}`, ok: parseFloat(goalAmount) > 0 },
                      { label: 'Type', val: campaignType, ok: true },
                      { label: 'Milestones', val: `${milestones.length} defined`, ok: milestones.length > 0 },
                      { label: 'Banner', val: bannerFile ? '✓ Uploaded' : (initialData?.imageUrl ? '✓ Existing' : '✗ Missing'), ok: !!(bannerFile || initialData?.imageUrl) },
                      { label: 'Pitch Video', val: youtubeUrl ? '✓ Added' : 'Not added', ok: true },
                      { label: 'FAQs', val: faqs.length > 0 ? `${faqs.length} added` : 'None', ok: true },
                    ].map(({ label, val, ok }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50">{label}</span>
                        <span className={`text-xs font-black uppercase tracking-wide ${ok ? 'text-[#003366]' : 'text-red-600'}`}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 space-y-3" style={{ background: '#fffbf5', border: '3px solid #003366', boxShadow: '5px 5px 0 #FF7F00' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/40 border-b-2 pb-2" style={{ borderColor: '#003366' }}>Pitch Deck ()</p>
                    <p className="text-[11px] font-bold text-[#003366]/60 leading-relaxed">
                      Add a Google Drive, Canva, or Notion link to your presentation. Share with "Anyone with link can view". This increases approval chances significantly.
                    </p>
                    <NeoInput
                      type="url"
                      value={presentationDeckUrl}
                      onChange={(e: any) => setPresentationDeckUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                    <p className="text-[9px] font-bold text-[#003366]/40 uppercase tracking-widest">Make sure sharing is set to "Anyone with link"</p>
                  </div>
                </div>

                {/* Description preview */}
                <div className="p-4" style={{ background: '#fffbf5', border: '2px dashed #003366' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/40 mb-2">Description Preview</p>
                  <p className="text-sm font-bold text-[#003366]/70 leading-relaxed line-clamp-4">{description || '—'}</p>
                </div>
              </div>
            )}

            {/* ── Error ── */}
            {submitError && (
              <div className="p-4 flex items-start gap-2" style={{ background: '#fef2f2', border: '3px solid #dc2626', boxShadow: '4px 4px 0 #003366' }}>
                <XIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-black text-red-700 uppercase tracking-wide">{submitError}</p>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex gap-3 pt-5" style={{ borderTop: '3px solid #003366' }}>
              <button type="button" onClick={onBack} disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] disabled:opacity-40 transition-all"
                style={{ border: '3px solid #003366', background: '#fff', boxShadow: '3px 3px 0 #003366' }}>
                Cancel
              </button>

              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-1px]"
                  style={{ border: '3px solid #003366', background: '#fff', boxShadow: '3px 3px 0 #003366' }}>
                  ← Prev
                </button>
              )}

              <div className="flex-1" />

              {step < 4 ? (
                <button type="button" onClick={nextStep} disabled={!isFormValid || isSubmitting}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={isFormValid && !isSubmitting
                    ? { background: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }
                    : { background: '#9ca3af', border: '3px solid #6b7280', cursor: 'not-allowed' }}>
                  Next Step →
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                  className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] disabled:opacity-40 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ background: '#FF7F00', border: '3px solid #003366', boxShadow: '4px 4px 0 #0B9C2C' }}>
                  {isSubmitting ? '⏳ Launching...' : '🚀 Launch Campaign →'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}