import { useRef, useState, useEffect } from "react";
import { Header } from '../../Header';
import { Footer } from '../../Footer';
import { Linkedin, Twitter, Instagram, YoutubeIcon } from 'lucide-react';
import YouTube from "react-youtube";

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const contactCategories = [
  { icon: "🎓", accent: "#FF7F00", title: "Student Support", email: "student@dreamxec.com", details: "For project help, platform issues & student queries" },
  { icon: "💰", accent: "#003262", title: "Donor Relations", email: "donor@dreamxec.com", details: "Pledge queries, impact reports & giving options" },
  { icon: "🤝", accent: "#0B9C2C", title: "Partnerships & CSR", email: "partnerships@dreamxec.com", details: "Corporate tie-ups, sponsorships & co-branding" },
  { icon: "🧑‍🏫", accent: "#FF7F00", title: "Mentorship", email: "mentorship@dreamxec.com", details: "Mentor onboarding, project matching & support" },
  { icon: "🛠️", accent: "#003262", title: "Technical Support", email: "support@dreamxec.com", details: "Reach us for any technical issues or questions campaign creation, donation and so on" },
  { icon: "⚖️", accent: "#0B9C2C", title: "Legal Inquiries", email: "legal@dreamxec.com", details: "Compliance, IP, policy & legal correspondence" },
  { icon: "💬", accent: "#FF7F00", title: "General Inquiries", email: "info@dreamxec.com", details: "Anything else — we read every email" },
  { icon: "📬", accent: "#003262", title: "Main Contact", email: "contact@dreamxec.com", details: "Reaches the whole team at once" },
];

// const founders = [
//   { icon: "👨‍💼", name: "Ashish", email: "ashish@dreamxec.com", accent: "#FF7F00", role: "Founder" },
//   { icon: "👨‍💼", name: "Sanskar Seth", email: "sanskar@dreamxec.com", accent: "#003262", role: "Co-Founder" },
//   { icon: "👨‍💼", name: "Gaurang", email: "gaurang@dreamxec.com", accent: "#0B9C2C", role: "Operations Head" },
// ];

const socials = [
  {  platform: "Instagram", handle: "@dreamxec", url: "https://www.instagram.com/dreamxec", color: "#FF7F00", LucideIcon: Instagram },
  {  platform: "LinkedIn", handle: "linkedin.com/company/dreamxec", url: "https://www.linkedin.com/company/dreamxec", color: "#003262", LucideIcon: Linkedin },
  {  platform: "Twitter", handle: "@DreamXecIndia", url: "", color: "#0B9C2C", LucideIcon: Twitter },
  {  platform: "YouTube", handle: "@dreamxecindia", url: "https://www.youtube.com/@dreamxecindia", color: "#FF0000", LucideIcon: YoutubeIcon },
];

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children, accent = "#FF7F00", dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "1rem" }}>
      <div style={{ width: 12, height: 12, flexShrink: 0, background: accent }} />
      <div style={{
        padding: "0.3rem 0.9rem", fontSize: "0.7rem", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.25em",
        background: dark ? "#FF7F00" : "#003262",
        color: dark ? "#003262" : "#fff",
        border: `2px solid ${dark ? "#FF7F00" : "#003262"}`,
        fontFamily: "inherit",
      }}>
        {children}
      </div>
      <div style={{ width: 12, height: 12, flexShrink: 0, background: "#0B9C2C" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  .nb-page { background:#fffbf5; font-family:'Space Grotesk',sans-serif; color:#003262; }

  .sr-fade  { opacity:0; transform:translateY(36px);  transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1); }
  .sr-scale { opacity:0; transform:scale(.88);        transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-fade.v,.sr-scale.v { opacity:1; transform:none; }
  .sr-stagger > * { opacity:0; transform:translateY(28px); transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-stagger.v > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
  .sr-stagger.v > *:nth-child(2){opacity:1;transform:none;transition-delay:.12s}
  .sr-stagger.v > *:nth-child(3){opacity:1;transform:none;transition-delay:.19s}
  .sr-stagger.v > *:nth-child(4){opacity:1;transform:none;transition-delay:.26s}
  .sr-stagger.v > *:nth-child(5){opacity:1;transform:none;transition-delay:.33s}
  .sr-stagger.v > *:nth-child(6){opacity:1;transform:none;transition-delay:.40s}
  .sr-stagger.v > *:nth-child(7){opacity:1;transform:none;transition-delay:.47s}
  .sr-stagger.v > *:nth-child(8){opacity:1;transform:none;transition-delay:.54s}

  /* ── HERO ── */
  .nb-hero { background:#fffbf5; border-bottom:4px solid #003262; padding:5rem 2rem 4rem; position:relative; overflow:hidden; }
  .nb-hero-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .stamp-block { position:relative; display:inline-block; margin-bottom:0.75rem; }
  .stamp-shadow { position:absolute; inset:0; }
  .stamp-h1 { position:relative; z-index:1; display:inline-block; padding:0.4rem 1.2rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:-0.5px; line-height:1; border:4px solid #003262; font-size:clamp(1.3rem,4vw,3rem); }
  .nb-hero-sub { margin-top:1.5rem; font-size:clamp(1rem,2vw,1.2rem); font-weight:700; color:rgba(0,50,98,.65); max-width:620px; line-height:1.75; text-align:justify; }
  .pill-row { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:2rem; }
  .pill { padding:0.5rem 1.1rem; font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:#fff; border:2px solid #003262; }

  /* ── STATS BAND ── */
  .nb-stats { background:#003262; border-bottom:4px solid #003262; }
  .nb-stats-inner { max-width:1100px; margin:0 auto; padding:2rem 2rem; display:grid; grid-template-columns:repeat(3,1fr); }
  @media(max-width:640px){ .nb-stats-inner{ grid-template-columns:1fr; } }
  .nb-stat { text-align:center; padding:1.25rem 1rem; border-right:3px solid rgba(255,255,255,.12); }
  .nb-stat:last-child { border-right:none; }
  .nb-stat-icon { font-size:1.75rem; display:block; margin-bottom:0.4rem; }
  .nb-stat-num { font-size:clamp(1.6rem,3.5vw,2.5rem); font-weight:900; color:#FF7F00; letter-spacing:-2px; line-height:1; }
  .nb-stat-label { font-size:0.65rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,.55); margin-top:0.35rem; }

  /* ── SECTIONS ── */
  .nb-section { max-width:1100px; margin:0 auto; padding:5rem 2rem; }
  .nb-section-head { display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom:3rem; }
  .nb-title { font-size:clamp(1.6rem,3.5vw,2.8rem); font-weight:900; text-transform:uppercase; line-height:1.05; letter-spacing:-1px; color:#003262; }
  .nb-title-dark { color:#fff; }
  .hl-orange { background:#FF7F00; color:#003262; display:inline-block; padding:0 0.4rem; }
  .hl-green  { background:#0B9C2C; color:#fff;    display:inline-block; padding:0 0.4rem; }

  /* ── CONTACT GRID ── */
  .contact-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.1rem; }
  @media(max-width:1024px){ .contact-grid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:580px) { .contact-grid{ grid-template-columns:1fr; } }

  .contact-card { background:#fff; border:3px solid #003262; display:flex; flex-direction:column; transition:transform .15s,box-shadow .15s; cursor:default; }
  .contact-card:hover { transform:translate(-3px,-3px); }
  .cc-top { height:5px; }
  .cc-header { display:flex; align-items:center; gap:0.65rem; padding:1rem 1.1rem 0.75rem; border-bottom:2px solid #003262; background:#fffbf5; }
  .cc-icon { font-size:1.5rem; flex-shrink:0; width:44px; height:44px; display:flex; align-items:center; justify-content:center; border:3px solid #003262; }
  .cc-title { font-size:clamp(0.82rem,1.4vw,0.95rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.3px; color:#003262; line-height:1.2; }
  .cc-body { padding:0.9rem 1.1rem; flex:1; display:flex; flex-direction:column; gap:0.6rem; }
  .cc-email { font-family:'Space Grotesk',monospace; font-size:clamp(0.78rem,1.3vw,0.88rem); font-weight:700; color:#003262; background:#fffbf5; border:2px solid #003262; padding:0.4rem 0.7rem; text-decoration:none; display:block; transition:background .15s,color .15s; word-break:break-all; }
  .cc-email:hover { background:#003262; color:#FF7F00; }
  .cc-detail { font-size:clamp(0.78rem,1.2vw,0.85rem); font-weight:600; color:rgba(0,50,98,.58); line-height:1.55; }
  .cc-bottom { height:5px; }

  /* ── FOUNDERS ── */
  .founders-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  @media(max-width:900px){ .founders-grid{ grid-template-columns:1fr 1fr; } }
  @media(max-width:580px){ .founders-grid{ grid-template-columns:1fr; } }

  .founder-card { background:#fff; border:3px solid #003262; display:flex; flex-direction:column; transition:transform .15s,box-shadow .15s; }
  .founder-card:hover { transform:translate(-3px,-3px); }
  .fc-top { height:6px; }
  .fc-body { display:grid; grid-template-columns:auto 1fr; gap:0; }
  .fc-left { width:72px; display:flex; flex-direction:column; align-items:center; justify-content:center; border-right:3px solid #003262; font-size:2rem; gap:0.3rem; padding:1.25rem 0; background:#fffbf5; }
  .fc-role { font-size:0.55rem; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; color:#fff; padding:0.15rem 0.35rem; border:2px solid #003262; }
  .fc-content { padding:1.25rem 1.5rem; }
  .fc-name { font-size:clamp(1.1rem,2.5vw,1.4rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; margin-bottom:0.6rem; }
  .fc-email { font-family:'Space Grotesk',monospace; font-size:clamp(0.85rem,1.5vw,1rem); font-weight:700; color:#003262; background:#fffbf5; border:2px solid #003262; padding:0.4rem 0.75rem; text-decoration:none; display:inline-block; transition:background .15s,color .15s; }
  .fc-email:hover { background:#003262; color:#FF7F00; }
  .fc-bottom { height:6px; }

  /* ── PHONE CARD ── */
  .phone-card { background:#fff; border:3px solid #003262; display:grid; grid-template-columns:auto 1fr; gap:0; transition:transform .15s,box-shadow .15s; margin-bottom:1.25rem; }
  .phone-card:hover { transform:translate(-3px,-3px); }
  .pc-left { width:72px; display:flex; align-items:center; justify-content:center; font-size:2rem; border-right:3px solid #003262; background:#fffbf5; }
  .pc-body { padding:1.25rem 1.5rem; }
  .pc-label { font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:rgba(0,50,98,.5); margin-bottom:0.4rem; }
  .pc-number { font-size:clamp(1.3rem,3vw,2rem); font-weight:900; letter-spacing:-0.5px; color:#003262; text-decoration:none; transition:color .15s; display:block; }
  .pc-number:hover { color:#FF7F00; }
  .pc-note { font-size:0.8rem; font-weight:600; color:rgba(0,50,98,.55); margin-top:0.35rem; }
  .pc-bar { height:6px; grid-column:1/-1; }

  /* ── DARK BG ── */
  .nb-dark { background:#003262; border-top:4px solid #003262; border-bottom:4px solid #003262; padding:5rem 0; }

  /* ── SOCIAL CARDS ── */
  .social-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
  @media(max-width:900px){ .social-grid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:580px){ .social-grid{ grid-template-columns:1fr; } }

  .social-card { background:#fff; border:3px solid #fff; display:flex; align-items:center; gap:1.1rem; padding:1.25rem 1.5rem; text-decoration:none; transition:transform .15s,box-shadow .15s; }
  .social-card:hover { transform:translate(-3px,-3px); }
  .sc-icon-box { width:52px; height:52px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; border:3px solid #003262; flex-shrink:0; }
  .sc-platform { font-size:clamp(0.95rem,1.8vw,1.1rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.3px; color:#003262; }
  .sc-handle { font-size:0.78rem; font-weight:700; color:rgba(0,50,98,.55); margin-top:0.2rem; word-break:break-all; }
  .sc-lucide { margin-left:auto; flex-shrink:0; }
  .sc-top { height:5px; }

  /* ── STRIPE ── */
  .nb-stripe { width:100%; height:16px; background:repeating-linear-gradient(-45deg,#003262 0px,#003262 12px,#FF7F00 12px,#FF7F00 24px); border-top:3px solid #003262; border-bottom:3px solid #003262; }

  /* ── CTA ── */
  .nb-cta { background:#fffbf5; border-top:4px solid #003262; padding:5rem 2rem; position:relative; overflow:hidden; }
  .nb-cta-inner { max-width:800px; margin:0 auto; text-align:center; }
  .nb-cta-title { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; text-transform:uppercase; line-height:1.1; letter-spacing:-1px; color:#003262; margin-bottom:1rem; }
  .nb-cta-sub { font-size:clamp(0.95rem,2vw,1.1rem); font-weight:600; color:rgba(0,50,98,.65); line-height:1.8; max-width:560px; margin:0 auto 2rem; text-align:justify; }
  .tricolor { display:flex; height:6px; max-width:240px; margin:0 auto 2rem; }
  .tricolor div { flex:1; }
  .nb-cta-btns { display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; }
  .nb-btn-1 { padding:1.1rem 2.5rem; font-size:clamp(.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#003262; background:#FF7F00; border:4px solid #003262; box-shadow:7px 7px 0 #003262; text-decoration:none; transition:transform .15s,box-shadow .15s; display:inline-block; }
  .nb-btn-1:hover { transform:translate(-3px,-3px); box-shadow:10px 10px 0 #003262; }
  .nb-btn-2 { padding:1.1rem 2.5rem; font-size:clamp(.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#fff; background:#003262; border:4px solid #003262; box-shadow:7px 7px 0 #FF7F00; text-decoration:none; transition:transform .15s,box-shadow .15s; display:inline-block; }
  .nb-btn-2:hover { transform:translate(-3px,-3px); box-shadow:10px 10px 0 #FF7F00; }
`;

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const ContactUs = () => {
  const heroReveal = useScrollReveal();
  const reachReveal = useScrollReveal();
  const foundReveal = useScrollReveal();
  const connectReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  return (
    <>
      <style>{CSS}</style>

      <title>Contact Us | DreamXec</title>
      <meta name="description" content="Have questions? Want to partner with DreamXec? Need support with your project? We're here to help." />

      <Header />

      <main className="nb-page">

        {/* ══════════════════════════════════════
            §1  HERO
        ══════════════════════════════════════ */}
        <section className="nb-hero">
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, background: "#FF7F00", transform: "rotate(-12deg)", opacity: 0.04, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 240, height: 240, background: "#0B9C2C", transform: "rotate(6deg)", opacity: 0.04, pointerEvents: "none" }} />

          <div ref={heroReveal.ref} className={`nb-hero-inner sr-fade ${heroReveal.isVisible ? "v" : ""}`}>
            <SectionLabel>📬 Get in Touch</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background: "#0B9C2C" }} />
                <h1 className="stamp-h1" style={{ background: "#FF7F00" }}>We're Here.</h1>
              </div>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background: "#FF7F00" }} />
                <h1 className="stamp-h1" style={{ background: "#003262" }}>Let's Talk.</h1>
              </div>
            </div>

            <p className="nb-hero-sub">
              Questions about a project? Want to partner or donate? Need mentorship support? Every email goes to a real person — we read and respond to all of them.
            </p>

            <div className="pill-row">
              {[
                { label: "24–48 Hr Response", bg: "#FF7F00" },
                { label: "Real Humans", bg: "#0B9C2C" },
                { label: "+91 99109 09802", bg: "#003262" },
                { label: "8 Inboxes", bg: "#FF7F00" },
              ].map(({ label, bg }) => (
                <div key={label} className="pill" style={{ background: bg }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* §2  STATS BAND */}
        <div className="nb-stats">
          <div className="nb-stats-inner">
            {[
              { icon: "📧", num: "8", label: "Dedicated Inboxes" },
              { icon: "⏱️", num: "24 hrs", label: "Average Response" },
              { icon: "📞", num: "Mon – Fri", label: "Phone Support Hours" },
            ].map(({ icon, num, label }) => (
              <div className="nb-stat" key={label}>
                <span className="nb-stat-icon">{icon}</span>
                <div className="nb-stat-num">{num}</div>
                <div className="nb-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            §3  HOW TO REACH US — 4-col contact grid
        ══════════════════════════════════════ */}
        <div className="nb-section">
          <div ref={reachReveal.ref} className={`nb-section-head sr-fade ${reachReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#FF7F00">📞 How to Reach Us</SectionLabel>
            <h2 className="nb-title">
              Right Inbox. <span className="hl-orange">Right Person.</span>
            </h2>
            <p style={{ marginTop: "0.75rem", fontWeight: 700, color: "rgba(0,50,98,.6)", fontSize: "clamp(0.95rem,1.8vw,1.1rem)", maxWidth: 560, lineHeight: 1.75, textAlign: "justify" }}>
              Every inquiry lands in a dedicated inbox — so the right team member picks it up and responds fast.
            </p>
          </div>

          {/* Phone card */}
          <div className={`sr-fade ${reachReveal.isVisible ? "v" : ""}`} style={{ marginBottom: "1.5rem" }}>
            <div className="phone-card" style={{ boxShadow: "5px 5px 0 #FF7F00" }}>
              <div className="pc-left">📞</div>
              <div className="pc-body">
                <div className="pc-label">Phone — Mon to Fri, 10am – 6pm IST</div>
                <a href="tel:+919910909802" className="pc-number">+91 99109 09802</a>
                <div className="pc-note">For partnerships, urgent project queries & general support</div>
              </div>
              <div className="pc-bar" style={{ background: "#FF7F00" }} />
            </div>
          </div>

          {/* 4-col email grid */}
          <div className={`contact-grid sr-stagger ${reachReveal.isVisible ? "v" : ""}`}>
            {contactCategories.map(({ icon, accent, title, email, details }) => (
              <div key={email} className="contact-card" style={{ boxShadow: `4px 4px 0 ${accent}` }}>
                <div className="cc-top" style={{ background: accent }} />
                <div className="cc-header">
                  <div className="cc-icon" style={{ background: accent }}>{icon}</div>
                  <div className="cc-title">{title}</div>
                </div>
                <div className="cc-body">
                  <a href={`mailto:${email}`} className="cc-email">{email}</a>
                  <div className="cc-detail">{details}</div>
                </div>
                <div className="cc-bottom" style={{ background: accent }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── STRIPE ── */}
        <div className="nb-stripe" />

        {/* ══════════════════════════════════════
            §4  FOUNDERS — direct lines
        ══════════════════════════════════════ */}
        {/* <div className="nb-section" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div ref={foundReveal.ref} className={`nb-section-head sr-fade ${foundReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#0B9C2C">👥 Team Direct</SectionLabel>
            <h2 className="nb-title">
              Reach the <span className="hl-green">Team Directly</span>
            </h2>
            <p style={{ marginTop: "0.75rem", fontWeight: 700, color: "rgba(0,50,98,.6)", fontSize: "clamp(0.95rem,1.8vw,1.1rem)", maxWidth: 520, lineHeight: 1.75, textAlign: "justify" }}>
              For high-priority partnerships, media requests, or anything that needs the team's attention — write directly to the Team.
            </p>
          </div>

          <div className={`founders-grid sr-stagger ${foundReveal.isVisible ? "v" : ""}`}>
            {founders.map(({ icon, name, email, accent, role }) => (
              <div key={name} className="founder-card" style={{ boxShadow: `5px 5px 0 ${accent}` }}>
                <div className="fc-top" style={{ background: accent }} />
                <div className="fc-body">
                  <div className="fc-left" style={{ background: accent + "22" }}>
                    <span style={{ fontSize: "2rem" }}>{icon}</span>
                    <span className="fc-role" style={{ background: accent }}>{role}</span>
                  </div>
                  <div className="fc-content">
                    <div className="fc-name">{name}</div>
                    <a href={`mailto:${email}`} className="fc-email">{email}</a>
                  </div>
                </div>
                <div className="fc-bottom" style={{ background: accent }} />
              </div>
            ))}
          </div>
        </div> */}

        {/* ── STRIPE ── */}
        {/* <div className="nb-stripe" /> */}

        {/* ══════════════════════════════════════
            §5  SOCIALS — dark bg
        ══════════════════════════════════════ */}
        <div className="nb-dark">
          <div className="nb-section" style={{ padding: "0 2rem" }}>
            <div ref={connectReveal.ref} className={`nb-section-head sr-fade ${connectReveal.isVisible ? "v" : ""}`} style={{ marginBottom: "2.5rem" }}>
              <SectionLabel dark>🌐 Connect With Us</SectionLabel>
              <h2 className="nb-title nb-title-dark">
                Follow Along. <span className="hl-orange">Stay Updated.</span>
              </h2>
              <p style={{ marginTop: "0.75rem", fontWeight: 700, color: "rgba(255,200,150,.75)", fontSize: "1rem", textAlign: "center", maxWidth: 480 }}>
                Student launches, donor milestones, mentor spotlights — all happening live on our socials.
              </p>
            </div>

            <div className={`social-grid sr-stagger ${connectReveal.isVisible ? "v" : ""}`}>
              {socials.map(({ platform, handle, url, color, LucideIcon }) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="social-card" style={{ boxShadow: `6px 6px 0 ${color}`, borderColor: "#fff", position: "relative" }}>
                  <div style={{ background: color, position: "absolute", top: 0, left: 0, right: 0, height: 5 }} />
                  
                  <div>
                    <div className="sc-platform">{platform}</div>
                    <div className="sc-handle">{handle}</div>
                  </div>
                  {LucideIcon && (
                    <div className="sc-lucide" style={{ color }}>
                      <LucideIcon size={20} />
                    </div>
                  )}
                  {!LucideIcon && (
                    <div className="sc-lucide" style={{ color, fontWeight: 900, fontSize: "1.1rem" }}>▶</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            §6  CTA
        ══════════════════════════════════════ */}
        <section className="nb-cta">
          <div style={{ position: "absolute", top: "-2rem", right: "-2rem", width: 128, height: 128, background: "#FF7F00", border: "4px solid #003262", transform: "rotate(12deg)", opacity: 0.1, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-2rem", left: "-2rem", width: 96, height: 96, background: "#0B9C2C", transform: "rotate(-12deg)", opacity: 0.1, pointerEvents: "none" }} />

          <div ref={ctaReveal.ref} className={`nb-cta-inner sr-fade ${ctaReveal.isVisible ? "v" : ""}`}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <SectionLabel>✉️ Let's Talk</SectionLabel>
            </div>
            <h2 className="nb-cta-title">
              Have a Question? <span className="hl-orange">We're One Email Away.</span>
            </h2>
            <p className="nb-cta-sub">
              Whether you're a student, donor, mentor, corporate partner, or journalist — we want to hear from you. Every message matters, and every message gets a reply.
            </p>
            <div className="tricolor">
              <div style={{ background: "#FF7F00" }} />
              <div style={{ background: "#fff", border: "1px solid #eee" }} />
              <div style={{ background: "#0B9C2C" }} />
            </div>
            <div className="nb-cta-btns">
              <a href="mailto:contact@dreamxec.com" className="nb-btn-1">✉️ Send Us an Email →</a>
              <a href="/" className="nb-btn-2">🏠 Back to Home</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default ContactUs;