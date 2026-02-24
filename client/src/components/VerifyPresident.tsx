import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/* ─────────────────────────────────────────────
   TOOLTIP COMPONENT
───────────────────────────────────────────── */
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 flex items-center justify-center text-[10px] font-black text-white leading-none"
        style={{ background: '#FF7F00', border: '2px solid #003366' }}
        aria-label="More info"
      >
        ?
      </button>
      {show && (
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-56 p-2.5 text-[11px] font-bold text-white leading-relaxed"
          style={{ background: '#003366', border: '2px solid #FF7F00', boxShadow: '4px 4px 0 #FF7F00' }}
        >
          {text}
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
            style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '6px solid #FF7F00' }} />
        </div>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────
   FIELD LABEL
───────────────────────────────────────────── */
function FieldLabel({ children, required, tooltip }: { children: React.ReactNode; required?: boolean; tooltip?: string }) {
  return (
    <label className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-widest text-[#003366]/70 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
  );
}

/* ─────────────────────────────────────────────
   INPUT STYLES
───────────────────────────────────────────── */
const inputCls = "w-full px-4 py-2.5 text-sm font-bold text-[#003366] bg-white focus:outline-none transition-all";
const inputStyle = { border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' };
const inputFocusStyle = { border: '2px solid #FF7F00', boxShadow: '3px 3px 0 #003366' };

function NeoInput({ name, placeholder, type = 'text', value, onChange, required, className = '' }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`${inputCls} ${className}`}
      style={focused ? inputFocusStyle : inputStyle}
    />
  );
}

function NeoTextarea({ name, placeholder, value, onChange, required, rows = 4 }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`${inputCls} resize-none`}
      style={focused ? inputFocusStyle : inputStyle}
    />
  );
}

/* ─────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────── */
function SectionCard({ number, title, accent, icon, children }: { number: string; title: string; accent: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="bg-white" style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
        <div className="w-8 h-8 flex items-center justify-center text-base flex-shrink-0 font-black"
          style={{ background: accent, border: '2px solid #003366', color: '#003366' }}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]/40">Section {number}</p>
          <h2 className="font-black text-sm text-[#003366] uppercase tracking-tight leading-none mt-0.5">{title}</h2>
        </div>
        <div className="w-6 h-6 flex items-center justify-center font-black text-xs text-white"
          style={{ background: '#003366' }}>{number}</div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function VerifyPresident() {
  const [form, setForm] = useState({
    collegeName: '', studentEmail: '', studentPhone: '',
    presidentName: '', ficName: '', ficEmail: '', ficPhone: '',
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [club, setClub] = useState({
    clubName: '', clubDescription: '', clubInstagram: '', clubLinkedIn: '', clubYouTube: '',
  });
  const [alumni, setAlumni] = useState([{ name: '', phone: '', socialProfile: '' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClubChange = (e: any) => setClub({ ...club, [e.target.name]: e.target.value });

  const addAlumni = () => setAlumni([...alumni, { name: '', phone: '', socialProfile: '' }]);
  const removeAlumni = (i: number) => alumni.length > 1 && setAlumni(alumni.filter((_, idx) => idx !== i));
  const updateAlumni = (i: number, field: string, value: string) => {
    const u = [...alumni]; u[i] = { ...u[i], [field]: value }; setAlumni(u);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    Object.entries(club).forEach(([k, v]) => fd.append(k, v));
    fd.append('alumni', JSON.stringify(alumni));
    if (documentFile) fd.append('document', documentFile);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/club-verification/verify-president`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Your DreamXec profile has been sent for club & president verification.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  /* ── Success State ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#fffbf5' }}>
        <div className="max-w-md w-full text-center bg-white p-10"
          style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #0B9C2C' }}>
          <div className="flex h-2 mb-8">
            <div className="flex-1" style={{ background: '#FF7F00' }} />
            <div className="flex-1" style={{ background: '#003366' }} />
            <div className="flex-1" style={{ background: '#0B9C2C' }} />
          </div>
          <div className="w-16 h-16 flex items-center justify-center text-3xl mx-auto mb-5"
            style={{ background: '#f0fdf4', border: '3px solid #0B9C2C', boxShadow: '4px 4px 0 #003366' }}>
            ✓
          </div>
          <h2 className="font-black text-2xl text-[#003366] uppercase tracking-tight mb-3">Submitted!</h2>
          <p className="text-sm font-bold text-[#003366]/70 leading-relaxed">{success}</p>
          <p className="text-xs font-black text-[#003366]/40 uppercase tracking-widest mt-4">
            DreamXec team will review within 1-2 business days.
          </p>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#fffbf5' }}>
      <div className="max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white"
            style={{ background: '#003366', border: '2px solid #003366' }}>
            🏆 Club Verification
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#003366] uppercase tracking-tight leading-none mb-4">
            Verify as{' '}
            <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>
              Club President
            </span>
          </h1>
          <div
            className="p-4 flex items-start gap-3"
            style={{ background: '#fffbeb', border: '2px solid #FF7F00', boxShadow: '4px 4px 0 #003366' }}
          >
            <span className="text-lg flex-shrink-0">ℹ️</span>
            <p className="text-xs font-bold text-[#003366]/80 leading-relaxed">
              Fill all sections carefully. This information will be reviewed by the DreamXec team.
              Once verified, you'll unlock full club management features — campaign creation, member management, and more.
              Verification typically takes <strong className="text-[#003366]">1–2 business days</strong>.
            </p>
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-2 mt-5">
            {['President Details', 'Club Details', 'Alumni Endorsement'].map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: '#003366', border: '2px solid #003366' }}>{i + 1}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]/60 hidden sm:block">{label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-0.5" style={{ background: '#003366', opacity: 0.2 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ══════ SECTION 1 ══════ */}
          <SectionCard number="01" title="President & College Details" accent="#FF7F00" icon="🎓">

            <div>
              <FieldLabel required tooltip="Enter the full official name of your college/university as registered with UGC or AICTE.">
                College Name
              </FieldLabel>
              <NeoInput name="collegeName" placeholder="e.g. IIT Delhi, NSUT, DTU..." value={form.collegeName} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required tooltip="Use your official college-issued email (e.g. name@iitd.ac.in). This is used to verify your institutional affiliation.">
                  College Email
                </FieldLabel>
                <NeoInput name="studentEmail" type="email" placeholder="you@college.ac.in" value={form.studentEmail} onChange={handleChange} required />
              </div>
              <div>
                <FieldLabel required tooltip="Your personal WhatsApp-enabled phone number. We may contact you for verification purposes.">
                  Phone Number
                </FieldLabel>
                <NeoInput name="studentPhone" placeholder="+91 98765 43210" value={form.studentPhone} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <FieldLabel required tooltip="Your full name as it appears on your college ID card. This should match your college records.">
                President's Full Name
              </FieldLabel>
              <NeoInput name="presidentName" placeholder="e.g. Arjun Sharma" value={form.presidentName} onChange={handleChange} required />
            </div>

            {/* FIC divider */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex-1 h-px" style={{ background: '#003366', opacity: 0.15 }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]/40 px-2"
                style={{ border: '2px solid rgba(0,51,102,0.2)', background: '#fffbf5' }}>
                Faculty Incharge (FIC)
              </span>
              <div className="flex-1 h-px" style={{ background: '#003366', opacity: 0.15 }} />
            </div>

            <div
              className="p-4 space-y-4"
              style={{ background: '#f9fafb', border: '2px dashed #003366' }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50">
                ℹ️ The Faculty Incharge (FIC) is a college professor or staff member officially responsible for your club. DreamXec will contact them to confirm your presidency.
              </p>

              <div>
                <FieldLabel required tooltip="The professor or staff member who officially oversees your club. Must be a current faculty member of your institution.">
                  FIC Full Name
                </FieldLabel>
                <NeoInput name="ficName" placeholder="Prof. Ramesh Kumar" value={form.ficName} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required tooltip="FIC's official college email. We'll send a verification email to confirm your club status.">
                    FIC Email
                  </FieldLabel>
                  <NeoInput name="ficEmail" type="email" placeholder="prof@college.ac.in" value={form.ficEmail} onChange={handleChange} required />
                </div>
                <div>
                  <FieldLabel required tooltip="FIC's direct phone number. Used only for verification in case email confirmation is delayed.">
                    FIC Phone
                  </FieldLabel>
                  <NeoInput name="ficPhone" placeholder="+91 98765 43210" value={form.ficPhone} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Document upload */}
            <div>
              <FieldLabel required tooltip="Upload an official document proving your club's existence — e.g. a college letterhead, club constitution, or official registration certificate. PDF or image formats accepted.">
                Official Document Proof
              </FieldLabel>
              <div
                className={`relative w-full flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-all`}
                style={{
                  border: dragOver ? '3px solid #FF7F00' : '3px dashed #003366',
                  background: dragOver ? '#fff7ed' : '#fffbf5',
                  boxShadow: dragOver ? '4px 4px 0 #FF7F00' : '4px 4px 0 #003366',
                }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) setDocumentFile(f); }}
                onClick={() => document.getElementById('docUpload')?.click()}
              >
                <div className="w-10 h-10 flex items-center justify-center text-2xl"
                  style={{ background: '#FF7F00', border: '2px solid #003366' }}>📄</div>
                <p className="font-black text-xs text-[#003366] uppercase tracking-widest">
                  {documentFile ? documentFile.name : 'Drag & drop or click to upload'}
                </p>
                <p className="text-[10px] font-bold text-[#003366]/40 uppercase tracking-widest">
                  PDF, JPG, PNG — Max 10MB
                </p>
                <input
                  id="docUpload"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={e => setDocumentFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              {documentFile && (
                <div className="mt-2 flex items-center justify-between px-3 py-2"
                  style={{ background: '#f0fdf4', border: '2px solid #0B9C2C' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#166534]">
                    ✓ {documentFile.name}
                  </span>
                  <button type="button" onClick={() => setDocumentFile(null)}
                    className="text-[10px] font-black text-red-600 uppercase tracking-widest">Remove</button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ══════ SECTION 2 ══════ */}
          <SectionCard number="02" title="Club Details" accent="#0B9C2C" icon="🏛️">

            <div>
              <FieldLabel required tooltip="The official name of your club as registered with your college. This will appear publicly on DreamXec.">
                Club Name
              </FieldLabel>
              <NeoInput name="clubName" placeholder="e.g. Robotics Club, E-Cell, CodeClub..." value={club.clubName} onChange={handleClubChange} required />
            </div>

            <div>
              <FieldLabel required tooltip="Describe what your club does, its achievements, and what makes it unique. Minimum 30 characters. This appears on your public club profile.">
                Club Description
              </FieldLabel>
              <NeoTextarea name="clubDescription" placeholder="Tell us about your club — its mission, key achievements, events organized, members count, and impact on campus..." value={club.clubDescription} onChange={handleClubChange} required rows={5} />
              <p className="text-[10px] font-bold text-[#003366]/40 uppercase tracking-widest mt-1">
                {club.clubDescription.length}/30 min characters
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px" style={{ background: '#003366', opacity: 0.15 }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]/40 px-2"
                style={{ border: '2px solid rgba(0,51,102,0.2)', background: '#fffbf5' }}>
                Social Media
              </span>
              <div className="flex-1 h-px" style={{ background: '#003366', opacity: 0.15 }} />
            </div>

            <div>
              <FieldLabel required tooltip="Your club's official Instagram page URL. This is used to verify the club's active presence and credibility. Must be a public profile.">
                Instagram URL <span className="normal-case font-bold text-[9px] text-[#003366]/40">(required)</span>
              </FieldLabel>
              <NeoInput name="clubInstagram" placeholder="https://instagram.com/yourclub" value={club.clubInstagram} onChange={handleClubChange} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel tooltip="LinkedIn page link for your club. Optional but recommended — helps establish professional credibility for donor trust.">
                  LinkedIn URL <span className="normal-case font-bold text-[9px] text-[#003366]/40">(optional)</span>
                </FieldLabel>
                <NeoInput name="clubLinkedIn" placeholder="https://linkedin.com/company/..." value={club.clubLinkedIn} onChange={handleClubChange} />
              </div>
              <div>
                <FieldLabel tooltip="YouTube channel link if your club documents events or projects. Optional but increases your campaign credibility with donors.">
                  YouTube URL <span className="normal-case font-bold text-[9px] text-[#003366]/40">(optional)</span>
                </FieldLabel>
                <NeoInput name="clubYouTube" placeholder="https://youtube.com/@yourclub" value={club.clubYouTube} onChange={handleClubChange} />
              </div>
            </div>
          </SectionCard>

          {/* ══════ SECTION 3 ══════ */}
          <SectionCard number="03" title="Alumni Endorsement" accent="#003366" icon="🎖️">

            <div
              className="p-4 flex items-start gap-3"
              style={{ background: '#fffbeb', border: '2px solid #FF7F00' }}
            >
              <span className="text-base flex-shrink-0">💡</span>
              <p className="text-xs font-bold text-[#003366]/80 leading-relaxed">
                Alumni who were previously part of your club or college community can vouch for its credibility.
                At least <strong>one endorsement</strong> is required. Adding 2–3 increases approval chances significantly.
                Alumni don't need to be DreamXec users — just provide their contact details.
              </p>
            </div>

            <div className="space-y-4">
              {alumni.map((a, i) => (
                <div key={i} className="p-4 space-y-3 relative"
                  style={{ background: '#f9fafb', border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>
                  {/* Alumni number badge */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5"
                      style={{ background: '#003366' }}>
                      Alumni #{i + 1}
                    </span>
                    {alumni.length > 1 && (
                      <button type="button" onClick={() => removeAlumni(i)}
                        className="text-[10px] font-black text-red-600 uppercase tracking-widest px-2 py-1"
                        style={{ border: '2px solid #dc2626', background: '#fef2f2' }}>
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <FieldLabel required tooltip="Full name of the alumni as they'd like to be addressed. DreamXec may reach out to them for a quick confirmation call.">
                      Alumni Full Name
                    </FieldLabel>
                    <NeoInput placeholder="e.g. Priya Mehta" value={a.name}
                      onChange={(e: any) => updateAlumni(i, 'name', e.target.value)} required />
                  </div>

                  <div>
                    <FieldLabel required tooltip="Alumni's WhatsApp-enabled phone number. We may send a brief verification message to confirm their association with your club.">
                      Phone Number
                    </FieldLabel>
                    <NeoInput placeholder="+91 98765 43210" value={a.phone}
                      onChange={(e: any) => updateAlumni(i, 'phone', e.target.value)} required />
                  </div>

                  <div>
                    <FieldLabel tooltip="LinkedIn or Instagram profile URL of the alumni. Helps verify their identity and professional background. Optional but highly recommended.">
                      LinkedIn / Instagram <span className="normal-case font-bold text-[9px] text-[#003366]/40">(optional)</span>
                    </FieldLabel>
                    <NeoInput placeholder="https://linkedin.com/in/..." value={a.socialProfile}
                      onChange={(e: any) => updateAlumni(i, 'socialProfile', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addAlumni}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
              style={{ border: '2px dashed #003366', background: '#fff' }}>
              + Add Another Alumni
            </button>
          </SectionCard>

          {/* ══════ SUBMIT ══════ */}
          <div
            className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: '#003366', border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
          >
            <div>
              <p className="font-black text-sm text-white uppercase tracking-tight">Ready to Submit?</p>
              <p className="text-[10px] font-bold text-orange-300 uppercase tracking-widest mt-0.5">
                Review all sections before submitting. You cannot edit after submission.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 flex items-center gap-2 px-8 py-3 font-black text-sm uppercase tracking-widest text-[#003366] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '4px 4px 0 #fff' }}
            >
              {loading ? (
                <><span className="animate-spin">⏳</span> Submitting...</>
              ) : (
                <>Submit Verification →</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}