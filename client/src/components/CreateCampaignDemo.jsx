import { useState, useRef, useEffect, useCallback } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const UploadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
const CheckCircleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ─── Colour palette (mirrors dreamxec theme) ─────────────────────────────────
const C = {
  navy: "#0f1f3d",
  orange: "#f58220",
  green: "#0b9c2c",
  cream: "#fdf6ec",
};

// ─── Tiny StarDecoration stub ─────────────────────────────────────────────
const StarDecoration = ({ className, color }) => (
  <svg className={className} viewBox="0 0 40 40" fill={color} opacity="0.3">
    <polygon points="20,2 24,14 37,14 27,22 31,35 20,27 9,35 13,22 3,14 16,14" />
  </svg>
);

// ─── YouTube stub (renders a fake embed so we don't need the package) ────────
const YouTubeStub = ({ videoId }) => (
  <div
    style={{
      width: "100%",
      height: 200,
      background: "#111",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 14,
      gap: 10,
    }}
  >
    <svg width="40" height="28" viewBox="0 0 40 28" fill="#f00">
      <rect rx="5" width="40" height="28" />
      <polygon points="16,6 16,22 30,14" fill="#fff" />
    </svg>
    <span style={{ opacity: 0.7 }}>YouTube Preview — {videoId}</span>
  </div>
);

// ─── Helper: generate a tiny coloured blob as a fake banner / media ──────────
function fakeBlobUrl(hue) {
  const c = `hsl(${hue},60%,70%)`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='400' height='200' fill='${c}'/><text x='200' y='110' text-anchor='middle' font-family='sans-serif' font-size='28' fill='#fff'>Demo Image</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CAMPAIGN FORM (normalised, responsive — same logic as your component)
// ─────────────────────────────────────────────────────────────────────────────
function CreateCampaignDemo({ onBack, onSubmit, prefill }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(prefill?.title ?? "");
  const [description, setDescription] = useState(prefill?.description ?? "");
  const [clubName, setClubName] = useState(prefill?.clubName ?? "");
  const [goalAmount, setGoalAmount] = useState(prefill?.goalAmount ?? "");
  const [presentationDeckUrl, setPresentationDeckUrl] = useState(prefill?.presentationDeckUrl ?? "");
  const [campaignType, setCampaignType] = useState(prefill?.campaignType ?? "INDIVIDUAL");
  const [youtubeUrl, setYoutubeUrl] = useState(prefill?.youtubeUrl ?? "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // fake banner & media (pre-seeded for demo)
  const [bannerPreview, setBannerPreview] = useState(prefill?.bannerPreview ?? "");
  const [hasBanner, setHasBanner] = useState(!!prefill?.bannerPreview);
  const [mediaPreviews, setMediaPreviews] = useState(prefill?.mediaPreviews ?? []);

  const [faqs, setFaqs] = useState(prefill?.faqs ?? []);
  const [teamMembers, setTeamMembers] = useState(prefill?.teamMembers ?? []);
  const [milestones, setMilestones] = useState(prefill?.milestones ?? [{ title: "", timeline: "", budget: "", description: "" }]);

  const bannerInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const getVideoId = useCallback((url) => {
    if (!url) return "";
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return "";
  }, []);

  const totalMilestoneBudget = milestones.reduce((s, m) => s + (parseFloat(m.budget) || 0), 0);

  const isFormValid =
    title.trim() &&
    description.trim() &&
    clubName.trim() &&
    parseFloat(goalAmount) > 0 &&
    hasBanner &&
    milestones.every((m) => m.title.trim() && m.timeline.trim() && parseFloat(m.budget) > 0) &&
    totalMilestoneBudget <= parseFloat(goalAmount);

  // ── file handlers (use fake blobs in demo) ──
  const handleBannerSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasBanner(true);
      setBannerPreview(URL.createObjectURL(file));
    }
  };
  const handleMediaSelect = (e) => {
    if (e.target.files) {
      const newPreviews = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
      setMediaPreviews((p) => [...p, ...newPreviews]);
    }
  };
  const handleRemoveMedia = (i) => setMediaPreviews((p) => p.filter((_, idx) => idx !== i));

  // milestones
  const addMilestone = () => setMilestones((p) => [...p, { title: "", timeline: "", budget: "", description: "" }]);
  const removeMilestone = (i) => setMilestones((p) => p.filter((_, idx) => idx !== i));
  const updateMilestone = (i, field, val) =>
    setMilestones((p) => p.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({ title, description, clubName, goalAmount: parseFloat(goalAmount), campaignType, youtubeUrl, milestones, faqs, teamMembers });
      setShowSuccess(true);
      setTimeout(() => onBack(), 2500);
    } catch (err) {
      setSubmitError(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── shared styles ──
  const input = {
    width: "100%",
    padding: "8px 12px",
    border: `2px solid ${C.navy}`,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  // ── SUCCESS ──
  if (showSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg,${C.cream},#fff)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            border: `4px solid ${C.navy}`,
            boxShadow: "0 8px 32px rgba(0,0,0,.12)",
            padding: 40,
            textAlign: "center",
            maxWidth: 420,
            width: "100%",
          }}
        >
          {/* Success Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              background: C.green,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 22px",
              border: "5px solid #fff",
              boxShadow: "0 6px 16px rgba(0,0,0,.18)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-5" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: C.navy,
              marginBottom: 10,
            }}
          >
            🎉 Demo Complete!
          </h1>

          {/* Tutorial Message */}
          <p
            style={{
              fontSize: 15,
              color: C.navy,
              opacity: 0.75,
              lineHeight: 1.6,
              marginBottom: 22,
            }}
          >
            You just walked through the full campaign creation process on
            DreamXec.
            <br />
            This is exactly how students launch real campaigns.
          </p>

          {/* Learning Summary */}
          <div
            style={{
              background: `${C.orange}12`,
              border: `2px solid ${C.orange}`,
              borderRadius: 12,
              padding: 16,
              textAlign: "left",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: C.navy,
                marginBottom: 8,
                fontSize: 14,
              }}
            >
              🚀 What you learned:
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 13,
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              <li>How to present your project clearly</li>
              <li>How to build donor trust with milestones</li>
              <li>How campaigns are structured for funding</li>
            </ul>
          </div>

          {/* Real-world next step */}
          <div
            style={{
              background: `${C.green}18`,
              border: `2px solid ${C.green}`,
              borderRadius: 10,
              padding: 14,
            }}
          >
            <p
              style={{
                margin: 0,
                color: C.green,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              👉 Next step: Create your own real campaign and start raising
              funds!
            </p>
          </div>

          {/* Auto return note */}
          <p
            style={{
              fontSize: 12,
              opacity: 0.5,
              marginTop: 16,
            }}
          >
            Returning to dashboard...
          </p>
        </div>
      </div>
    );
  }


  // ── MAIN ──
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.cream},#fff)`, position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* decorations */}
      <div style={{ position: "absolute", top: 16, left: 12, opacity: 0.18, pointerEvents: "none" }}>
        <StarDecoration className="" style={{ width: 44, height: 44 }} color={C.orange} />
      </div>
      <div style={{ position: "absolute", top: 60, right: 24, opacity: 0.18, pointerEvents: "none" }}>
        <StarDecoration className="" style={{ width: 32, height: 32 }} color={C.green} />
      </div>

      {/* header */}
      <div style={{ background: C.navy, borderBottom: `4px solid ${C.orange}`, boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 16px" }}>
          <button onClick={onBack} disabled={isSubmitting} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: C.orange, color: "#fff", border: "2px solid #fff", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: isSubmitting ? 0.5 : 1 }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* progress */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${step >= s ? C.navy : "#ccc"}`, background: step >= s ? C.orange : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: step >= s ? "#fff" : "#999", transition: "all .2s", margin: "0 auto" }}>
                  {step > s ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
                  ) : s}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: step >= s ? C.navy : "#999", whiteSpace: "nowrap" }}>
                  {["Basic Info", "Team & Media", "Milestones", "Review"][i]}
                </div>
              </div>
              {i < 3 && <div style={{ width: 32, height: 3, borderRadius: 2, background: step > s ? C.orange : "#ddd", margin: "0 4px", marginBottom: 18 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* card */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 40px" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 18, border: `4px solid ${C.navy}`, boxShadow: "0 8px 32px rgba(0,0,0,.1)", padding: "24px 20px" }}>
          <form onSubmit={handleSubmit}>

            {/* ═══ STEP 1 ═══ */}
            {step === 1 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>📝 Step 1 / 4</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginTop: 2 }}>Tell Us About Your Idea</div>
                  <div style={{ fontSize: 13, color: C.navy, opacity: 0.55 }}> Start by describing your project clearly so donors understand your vision.</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Campaign Title *</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Build Solar Car" style={input} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Club Name *</label>
                    <input value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="e.g., Robotics Club" style={input} />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Fundraising Goal *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontWeight: 700, fontSize: 14, color: C.navy }}>₹</span>
                    <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="50000" style={{ ...input, paddingLeft: 28, fontWeight: 700 }} />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Campaign Description *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about your amazing project..." rows={4} style={{ ...input, resize: "vertical" }} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Campaign Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {["INDIVIDUAL", "TEAM"].map((t) => (
                      <button key={t} type="button" onClick={() => setCampaignType(t)} style={{ padding: "10px 12px", borderRadius: 8, border: `2px solid ${C.navy}`, background: campaignType === t ? C.navy : "#fff", color: campaignType === t ? "#fff" : C.navy, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .15s" }}>
                        {t === "INDIVIDUAL" ? "👤 Solo Project" : "👥 Team Project"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 2 ═══ */}
            {step === 2 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>👥 Step 2 / 4</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginTop: 2 }}>{campaignType === "TEAM" ? "Show Who’s Behind the Project" : "Media & Pitch"}</div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>
                    Donors trust real people. Add your team and a pitch video.
                  </div>
                </div>

                {campaignType === "TEAM" && (
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Team Members</label>
                    {teamMembers.map((m, i) => (
                      <div key={i} style={{ padding: 14, border: `2px solid ${C.navy}`, borderRadius: 10, background: C.cream, marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Member {i + 1}</span>
                          <button type="button" onClick={() => setTeamMembers((p) => p.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#e44", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
                          <input placeholder="Name" value={m.name} onChange={(e) => { const c = [...teamMembers]; c[i].name = e.target.value; setTeamMembers(c); }} style={input} />
                          <input placeholder="Role" value={m.role} onChange={(e) => { const c = [...teamMembers]; c[i].role = e.target.value; setTeamMembers(c); }} style={input} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setTeamMembers((p) => [...p, { name: "", role: "" }])} style={{ width: "100%", padding: "9px 0", background: C.orange, color: "#fff", border: `2px solid ${C.navy}`, borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add Team Member</button>
                  </div>
                )}

                {/* YouTube */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>🎥 Pitch Video (Optional)</label>
                  <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={input} />
                  {youtubeUrl && (
                    <div style={{ marginTop: 10, padding: 12, background: "#f4f4f4", borderRadius: 10, border: `1px solid ${C.navy}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: getVideoId(youtubeUrl) ? C.green : "#e44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {getVideoId(youtubeUrl) ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M9 12l2 2 4-4" /></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                          )}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: getVideoId(youtubeUrl) ? C.navy : "#e44" }}>
                          {getVideoId(youtubeUrl) ? "✅ Valid video found!" : "❌ Invalid YouTube URL"}
                        </span>
                      </div>
                      {getVideoId(youtubeUrl) && <YouTubeStub videoId={getVideoId(youtubeUrl)} />}
                    </div>
                  )}
                </div>

                {/* FAQs */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>FAQs (Optional)</label>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ padding: 14, border: `2px solid ${C.navy}`, borderRadius: 10, background: "#fff", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>FAQ {i + 1}</span>
                        <button type="button" onClick={() => setFaqs((p) => p.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#e44", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
                      </div>
                      <input placeholder="Question" value={faq.question} onChange={(e) => { const c = [...faqs]; c[i].question = e.target.value; setFaqs(c); }} style={{ ...input, marginBottom: 8 }} />
                      <textarea placeholder="Answer" value={faq.answer} onChange={(e) => { const c = [...faqs]; c[i].answer = e.target.value; setFaqs(c); }} rows={2} style={{ ...input, resize: "vertical" }} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setFaqs((p) => [...p, { question: "", answer: "" }])} style={{ width: "100%", padding: "9px 0", background: C.green, color: "#fff", border: `2px solid ${C.navy}`, borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add FAQ</button>
                </div>
              </div>
            )}

            {/* ═══ STEP 3 ═══ */}
            {step === 3 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>🎯 Step 3 / 4</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginTop: 2 }}>Explain How Funds Will Be Used</div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>
                    Break your project into milestones so donors see transparency.
                  </div>

                </div>

                {/* Banner */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Main Banner Image *</label>
                  <div onClick={() => bannerInputRef.current?.click()} style={{ border: `2px dashed ${C.navy}`, borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", background: hasBanner ? "#fff" : C.cream, transition: "background .2s" }}>
                    <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleBannerSelect} />
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner" style={{ maxHeight: 140, borderRadius: 8, border: `2px solid ${C.navy}` }} />
                    ) : (
                      <>
                        <UploadIcon style={{ width: 32, height: 32, color: C.navy, margin: "0 auto 8px" }} />
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Upload Banner Image</div>
                        <div style={{ fontSize: 11, color: C.navy, opacity: 0.55 }}>JPG, PNG • Max 10 MB</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional media */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Additional Media (Optional)</label>
                  <div onClick={() => mediaInputRef.current?.click()} style={{ border: `2px dashed ${C.navy}`, borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", background: C.cream, transition: "background .2s" }}>
                    <input ref={mediaInputRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleMediaSelect} />
                    <UploadIcon style={{ width: 28, height: 28, color: C.navy, margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mediaPreviews.length} image{mediaPreviews.length !== 1 ? "s" : ""} selected</div>
                  </div>
                  {mediaPreviews.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8, marginTop: 10 }}>
                      {mediaPreviews.map((p, i) => (
                        <div key={i} style={{ position: "relative" }}>
                          <img src={p} alt="" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: `2px solid ${C.navy}` }} />
                          <button type="button" onClick={() => handleRemoveMedia(i)} style={{ position: "absolute", top: 4, right: 4, background: "#e44", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
                            <XIcon style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Project Milestones *</label>
                  {milestones.map((ms, i) => (
                    <div key={i} style={{ padding: 14, border: `2px solid ${C.navy}`, borderRadius: 10, background: C.cream, marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Milestone {i + 1}</span>
                        {milestones.length > 1 && (
                          <button type="button" onClick={() => removeMilestone(i)} style={{ background: "none", border: "none", color: "#e44", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
                        <input placeholder="Title" value={ms.title} onChange={(e) => updateMilestone(i, "title", e.target.value)} style={input} />
                        <input placeholder="Timeline (e.g. Week 1–2)" value={ms.timeline} onChange={(e) => updateMilestone(i, "timeline", e.target.value)} style={input} />
                      </div>
                      <div style={{ position: "relative", marginTop: 10 }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontWeight: 700, fontSize: 13 }}>₹</span>
                        <input type="number" placeholder="Budget" value={ms.budget} onChange={(e) => updateMilestone(i, "budget", e.target.value)} style={{ ...input, paddingLeft: 28 }} />
                      </div>
                      <textarea placeholder="Description (optional)" value={ms.description || ""} onChange={(e) => updateMilestone(i, "description", e.target.value)} rows={2} style={{ ...input, marginTop: 10, resize: "vertical" }} />
                    </div>
                  ))}
                  <button type="button" onClick={addMilestone} style={{ width: "100%", padding: "9px 0", background: C.orange, color: "#fff", border: `2px solid ${C.navy}`, borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add Milestone</button>

                  {/* budget summary */}
                  <div style={{ marginTop: 16, padding: "14px 18px", background: `linear-gradient(90deg,${C.navy},${C.orange})`, borderRadius: 10, color: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
                      <span>Total Milestone Budget</span><span>₹{totalMilestoneBudget.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                      <span>Goal Amount</span><span>₹{parseFloat(goalAmount || "0").toLocaleString()}</span>
                    </div>
                    {totalMilestoneBudget > parseFloat(goalAmount || "0") && (
                      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: "#fca" }}>⚠️ Budget exceeds goal!</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 4 ═══ */}
            {step === 4 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>✅ Step 4 / 4</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginTop: 2 }}>Final Review Before Launch</div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>
                    Double-check everything. This is what donors will see.
                  </div>

                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 20 }}>
                  <div style={{ padding: 16, border: `2px solid ${C.green}`, borderRadius: 10, background: "linear-gradient(135deg,#eef9ee,#e6f7ea)" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Campaign Summary</div>
                    {[
                      ["Title", title || "—"],
                      ["Club", clubName || "—"],
                      ["Goal", `₹${parseFloat(goalAmount || "0").toLocaleString()}`],
                      ["Type", campaignType],
                      ["Milestones", milestones.length],
                      ["Banner", hasBanner ? "✅ Uploaded" : "⚠️ Missing"],
                      ["Team Members", campaignType === "TEAM" ? teamMembers.length : "—"],
                      ["FAQs", faqs.length],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #d4edda" }}>
                        <span style={{ fontWeight: 600, color: C.navy }}>{k}</span>
                        <span style={{ color: String(v).includes("⚠") ? "#e44" : C.navy }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Pitch Deck Link (Optional)</label>
                    <input type="url" value={presentationDeckUrl} onChange={(e) => setPresentationDeckUrl(e.target.value)} placeholder="https://drive.google.com/..." style={input} />
                    <div style={{ fontSize: 11, color: C.navy, opacity: 0.5, marginTop: 4 }}>Google Drive link — "Anyone with link can view"</div>

                    {youtubeUrl && getVideoId(youtubeUrl) && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>🎥 Pitch Video Preview</div>
                        <YouTubeStub videoId={getVideoId(youtubeUrl)} />
                      </div>
                    )}
                  </div>
                </div>

                {/* milestone preview */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>📋 Milestone Breakdown</div>
                  {milestones.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: i % 2 === 0 ? C.cream : "#fff", borderRadius: 6, border: `1px solid #ddd`, marginBottom: 4 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{m.title || "Untitled"}</span>
                        <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>{m.timeline || "—"}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>₹{(parseFloat(m.budget) || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* error */}
            {submitError && (
              <div style={{ padding: "10px 14px", background: "#fee", border: "2px solid #e44", borderRadius: 8, color: "#c33", fontWeight: 600, fontSize: 13, marginTop: 16 }}>{submitError}</div>
            )}

            {/* navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 16, borderTop: `2px solid ${C.navy}`, flexWrap: "wrap" }}>
              <button type="button" onClick={onBack} disabled={isSubmitting} style={{ padding: "8px 16px", border: `2px solid ${C.navy}`, borderRadius: 8, background: "#fff", color: C.navy, fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: isSubmitting ? 0.5 : 1 }}>Cancel</button>
              <div style={{ display: "flex", flex: 1, gap: 10, minWidth: 0 }}>
                {step > 1 && (
                  <button type="button" onClick={prevStep} style={{ padding: "8px 16px", border: `2px solid ${C.navy}`, borderRadius: 8, background: "#fff", color: C.navy, fontWeight: 600, fontSize: 13, cursor: "pointer", flex: 1 }}>← Previous</button>
                )}
                {step < 4 ? (
                  <button type="button" onClick={nextStep} style={{ padding: "8px 16px", border: `2px solid ${C.navy}`, borderRadius: 8, background: C.navy, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>Next Step →</button>
                ) : (
                  <button type="submit" disabled={!isFormValid || isSubmitting} style={{ padding: "8px 16px", border: `2px solid ${C.navy}`, borderRadius: 8, background: isFormValid && !isSubmitting ? C.green : "#ccc", color: isFormValid && !isSubmitting ? "#fff" : "#888", fontWeight: 600, fontSize: 13, cursor: isFormValid && !isSubmitting ? "pointer" : "not-allowed", flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
                    {isSubmitting ? "🚀 Creating..." : "🚀 Launch Campaign"}
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

// ─────────────────────────────────────────────────────────────────────────────
// DEMO WRAPPER — switches between "Dashboard" and the form
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_PREFILL = {
  title: "Solar-Powered Campus Water Purifier",
  clubName: "Green Tech Club – IIT Delhi",
  goalAmount: "75000",
  description:
    "We are building a solar-powered water purification system for the campus hostels. The system will use UV + RO filtration powered entirely by a 2 kW solar array on the roof. Goal: provide 500 L / day of clean drinking water at zero running cost.",
  campaignType: "TEAM",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  presentationDeckUrl: "https://drive.google.com/file/d/example",
  bannerPreview: fakeBlobUrl(200),
  mediaPreviews: [fakeBlobUrl(30), fakeBlobUrl(120), fakeBlobUrl(260)],
  teamMembers: [
    { name: "Arjun Mehta", role: "Project Lead" },
    { name: "Priya Sharma", role: "Solar Engineer" },
    { name: "Rahul Das", role: "Mechanical Design" },
  ],
  milestones: [
    { title: "Solar Panel Installation", timeline: "Week 1–2", budget: "25000", description: "Procure and mount 2 kW solar panels on rooftop." },
    { title: "Filtration Unit Assembly", timeline: "Week 3–4", budget: "30000", description: "Assemble UV + RO filtration module and connect to pump." },
    { title: "Testing & Commissioning", timeline: "Week 5", budget: "10000", description: "Full-system test run, water quality certification." },
    { title: "Documentation & Handover", timeline: "Week 6", budget: "10000", description: "Write maintenance manual and hand over to campus admin." },
  ],
  faqs: [
    { question: "How much water can the system produce daily?", answer: "The system is designed to produce approximately 500 litres of purified water per day under average sunlight conditions." },
    { question: "What happens on cloudy days?", answer: "A battery bank stores surplus solar energy, ensuring the system runs even with 4–5 hours of weak sunlight." },
    { question: "Who will maintain the system?", answer: "We will hand over a full maintenance manual to the campus facilities team and provide a 6-month free service window." },
  ],
};

export default function App() {
  const [view, setView] = useState("dashboard"); // "dashboard" | "form"
  const [lastSubmission, setLastSubmission] = useState(null);

  const handleSubmit = (data) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setLastSubmission(data);
        resolve();
      }, 1200); // simulate network delay
    });

  // ── Dashboard ──
  if (view === "dashboard") {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.cream},#fff)`, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* header */}
        <div style={{ background: C.navy, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>DreamXec</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Campaign Management Demo</div>
          </div>
          <button onClick={() => setView("form")} style={{ padding: "10px 22px", background: C.orange, color: "#fff", border: "2px solid #fff", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>
            + Create Demo Campaign
          </button>
        </div>

        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "32px 20px",

            display: "flex",
            flexDirection: "column",
            alignItems: "center", // 👉 centers children horizontally
            gap: 24,
          }}
        >

          {/* info card */}
          <div
            style={{
              width: "100%",
              background: "#fff",
              border: `3px solid ${C.navy}`,
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,.08)"
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              👋 Demo Instructions
            </div>

            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              This is a <strong>guided demo</strong> showing how students create campaigns on DreamXec.

              <br /><br />

              👉 Click <strong style={{ color: C.orange }}>"+ Create Demo Campaign"</strong> to start a step-by-step walkthrough.

              <br /><br />

              ✅ All fields are pre-filled so you can focus on understanding the process.
              ✅ You can still edit anything to experiment.
              ✅ No real data is submitted — this is a safe demo.

              <br /><br />

              By the end, you’ll know exactly how to launch your own campaign 🚀
            </div>

          </div>

          {/* centered button */}
          <button
            onClick={() => setView("form")}
            style={{
              padding: "12px 28px",
              background: C.orange,
              color: "#fff",
              border: "2px solid #fff",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,.2)",
            }}
          >
            + Create Demo Campaign
          </button>

          {/* last submission preview */}
          {lastSubmission && (
            <div
              style={{
                width: "100%",
                background: "#fff",
                border: `2px solid ${C.green}`,
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 10px rgba(0,0,0,.06)"
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 12 }}>
                ✅ Last Submitted Campaign
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "8px 20px",
                  fontSize: 13
                }}
              >
                {[
                  ["Title", lastSubmission.title],
                  ["Club", lastSubmission.clubName],
                  ["Goal", `₹${lastSubmission.goalAmount.toLocaleString()}`],
                  ["Type", lastSubmission.campaignType],
                  ["Milestones", lastSubmission.milestones?.length],
                  ["FAQs", lastSubmission.faqs?.length],
                  ["Team", lastSubmission.teamMembers?.length ?? "—"],
                  ["YouTube", lastSubmission.youtubeUrl ? "Yes" : "No"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontWeight: 600, color: C.navy }}>{k}:</span>
                    <span style={{ color: "#555" }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    );
  }

  // ── Form ──
  return <CreateCampaignDemo onBack={() => setView("dashboard")} onSubmit={handleSubmit} prefill={DEMO_PREFILL} />;
}
