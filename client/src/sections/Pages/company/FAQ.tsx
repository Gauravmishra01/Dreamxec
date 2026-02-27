import { useRef, useState, useEffect } from "react";
import { Header } from '../../Header';
import { Footer } from '../../Footer';

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
const studentFAQs = [
  {
    q: "How much can I raise?",
    a: "Projects typically range ₹5K–₹50L. We've funded projects as small as ₹5K (small research), as large as ₹1Cr (major prototypes). Your goal should be realistic—cover actual costs + 20% buffer for unexpected expenses."
  },
  {
    q: "What if I miss my deadline?",
    a: "With flexible funding (which we recommend), you keep whatever you've raised by the deadline, even if you didn't hit your goal. With all-or-nothing, funds are returned if you don't reach goal. You can extend your campaign by 30 days if needed (once per project)."
  },
  {
    q: "Can I access funds immediately?",
    a: "No. Funds are held in escrow until your campaign ends (or you hit goal, in flexible funding). Then we verify your identity/bank details (2–3 days), and transfer funds. You'll typically have money within a week of campaign conclusion."
  },
  {
    q: "What if I want to change my project after launching?",
    a: "Minor tweaks (scope, timeline, budget allocation) can be updated with a transparent post to backers explaining the changes. Major pivots (completely different project) are discouraged—backers funded a specific vision. Communicate changes quickly."
  },
  {
    q: "Can I run multiple projects simultaneously?",
    a: "Yes, but we recommend launching your second project only after completing your first. Backers lose trust when creators juggle too many projects at once. Plus, you'll have more credibility and mentorship success to showcase in your next campaign."
  },
];

const donorFAQs = [
  {
    q: "Is my money secure?",
    a: "Yes. Funds are held in an escrow account at our banking partner until the project reaches its goal (or campaign ends, with flexible funding). We conduct compliance checks on every project before it goes live. If a project misuses funds, backers can request refunds within 30 days of campaign end."
  },
  {
    q: "What happens if a project fails to deliver?",
    a: "Projects deliver via milestone updates and a final report. If a creator goes silent or clearly doesn't deliver, backers can raise their concerns with the DX team. Our team investigates and manages the communication with the concerned project lead. If the concerns are real the club may face lower ratings on the platform as well as project removal from platform."
  },
  {
    q: "Can I change my pledge or get a refund?",
    a: "No. Since this is a donation model, refunds are not possible once a pledge is confirmed. Please review the project thoroughly before pledging. In cases of clear misuse or fraud, our team will investigate and take necessary action including potential refunds."
  },
  {
    q: "How do I know my impact is real?",
    a: "We track outcomes: 6-month, 1-year, and 3-year follow-ups. You'll receive impact reports showing what the student actually delivered, whether they got a job/internship, if they filed a patent, how many people their project helped. Not perfect data, but as transparent as we can be."
  },
];

const corporateFAQs = [
  {
    q: "How does CSR on DreamXec work?",
    a: "You allocate CSR budget to support student innovation. Models range from sponsoring 1 specific project to annual innovation grants to long-term partnerships (₹1Cr+). Each comes with different branding, reporting, and talent acquisition benefits. Email partnerships@dreamxec.org to discuss your budget and priorities."
  },
  {
    q: "What's the ROI of DreamXec partnerships?",
    a: "The real ROI lies in the technological advancement of India at the global level by boosting the culture of innovation and research to newer heights. Other benefits include talent acquisition (interns, hires), strategic insights (market trends from student projects), and community goodwill. ₹1Cr CSR spend = meaningful impact on 100–200+ student lives—that's real ROI beyond financial metrics."
  },
  {
    q: "Can DreamXec help us with employee volunteering?",
    a: "Yes. We facilitate employee volunteer mentorship (1–3 hours/month per employee). Your team mentors student projects, reviews pitches, hosts workshops. We coordinate scheduling and match employees with projects. This deepens employee engagement while directly helping students."
  },
];

const faqSections = [
  { id: "students",   label: "For Students",            icon: "🎓", accent: "#FF7F00", faqs: studentFAQs   },
  { id: "donors",     label: "For Supporters & Donors", icon: "💰", accent: "#003262", faqs: donorFAQs     },
  { id: "corporate",  label: "For Corporate Partners",  icon: "🏢", accent: "#0B9C2C", faqs: corporateFAQs },
];

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children, accent = "#FF7F00", dark = false }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:"1rem" }}>
      <div style={{ width:12, height:12, flexShrink:0, background:accent }} />
      <div style={{
        padding:"0.3rem 0.9rem", fontSize:"0.7rem", fontWeight:900,
        textTransform:"uppercase", letterSpacing:"0.25em",
        background: dark ? "#FF7F00" : "#003262",
        color:      dark ? "#003262" : "#fff",
        border:`2px solid ${dark ? "#FF7F00" : "#003262"}`,
        fontFamily:"inherit",
      }}>
        {children}
      </div>
      <div style={{ width:12, height:12, flexShrink:0, background:"#0B9C2C" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────── */
function AccordionItem({ index, question, answer, accent, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        background: "#fff",
        border: "3px solid #003262",
        boxShadow: isOpen ? `5px 5px 0 ${accent}` : "3px 3px 0 #003262",
        transition: "box-shadow 0.15s",
        marginBottom: "0.75rem",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: isOpen ? accent : "transparent", transition: "background 0.2s" }} />

      {/* Question row — clickable */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.1rem 1.5rem",
          background: isOpen ? "#fffbf5" : "#fff",
          border: "none",
          borderBottom: isOpen ? "3px solid #003262" : "3px solid transparent",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        {/* Number badge */}
        <span style={{
          flexShrink: 0,
          width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? accent : "#003262",
          color: isOpen ? "#003262" : "#fff",
          fontSize: "0.75rem", fontWeight: 900,
          border: "3px solid #003262",
          transition: "background 0.15s, color 0.15s",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Q label badge */}
        <span style={{
          flexShrink: 0,
          fontSize: "0.6rem", fontWeight: 900,
          color: "#fff", padding: "0.15rem 0.4rem",
          background: accent, border: "2px solid #003262",
          textTransform: "uppercase", letterSpacing: 2,
        }}>Q</span>

        {/* Question text */}
        <span style={{
          flex: 1,
          fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
          fontWeight: 900,
          color: "#003262",
          textTransform: "uppercase",
          letterSpacing: "-0.3px",
          lineHeight: 1.3,
        }}>
          {question}
        </span>

        {/* Toggle chevron */}
        <span style={{
          flexShrink: 0,
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? accent : "#fffbf5",
          border: "3px solid #003262",
          fontSize: "1rem", fontWeight: 900,
          color: isOpen ? "#003262" : "#003262",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.25s cubic-bezier(.16,1,.3,1), background 0.15s",
        }}>
          +
        </span>
      </button>

      {/* Answer — animated */}
      <div
        style={{
          overflow: "hidden",
          height: height,
          transition: "height 0.35s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div ref={bodyRef} style={{ padding: "0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.25rem 1.5rem" }}>
            {/* A badge */}
            <span style={{
              flexShrink: 0,
              fontSize: "0.6rem", fontWeight: 900,
              color: "#fff", padding: "0.15rem 0.4rem",
              background: "#003262", border: "2px solid #003262",
              textTransform: "uppercase", letterSpacing: 2,
              marginTop: "0.2rem",
            }}>A</span>
            <p style={{
              fontSize: "clamp(0.92rem, 1.7vw, 1.05rem)",
              fontWeight: 600,
              color: "rgba(0,50,98,0.72)",
              lineHeight: 1.8,
              textAlign: "justify",
              margin: 0,
            }}>
              {answer}
            </p>
          </div>
          {/* Bottom accent bar */}
          <div style={{ height: 5, background: accent }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ ACCORDION SECTION
───────────────────────────────────────── */
function FAQAccordion({ faqs, accent }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div>
      {faqs.map((item, i) => (
        <AccordionItem
          key={i}
          index={i}
          question={item.q}
          answer={item.a}
          accent={accent}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  .nb-page { background:#fffbf5; font-family:'Space Grotesk',sans-serif; color:#003262; }

  .sr-fade  { opacity:0; transform:translateY(36px); transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1); }
  .sr-fade.v { opacity:1; transform:none; }
  .sr-stagger > * { opacity:0; transform:translateY(28px); transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-stagger.v > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
  .sr-stagger.v > *:nth-child(2){opacity:1;transform:none;transition-delay:.15s}
  .sr-stagger.v > *:nth-child(3){opacity:1;transform:none;transition-delay:.25s}

  /* ── HERO ── */
  .nb-hero { background:#fffbf5; border-bottom:4px solid #003262; padding:5rem 2rem 4rem; position:relative; overflow:hidden; }
  .nb-hero-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .stamp-block { position:relative; display:inline-block; margin-bottom:0.75rem; }
  .stamp-shadow { position:absolute; inset:0; }
  .stamp-h1 { position:relative; z-index:1; display:inline-block; padding:0.4rem 1.2rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:-0.5px; line-height:1; border:4px solid #003262; font-size:clamp(1.3rem,4vw,3rem); }
  .nb-hero-sub { margin-top:1.5rem; font-size:clamp(1rem,2vw,1.2rem); font-weight:700; color:rgba(0,50,98,.65); max-width:640px; line-height:1.75; text-align:justify; }
  .pill-row { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:2rem; }
  .pill { padding:0.5rem 1.1rem; font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:#fff; border:2px solid #003262; }

  /* ── STATS BAND ── */
  .nb-stats { background:#003262; border-bottom:4px solid #003262; }
  .nb-stats-inner { max-width:1100px; margin:0 auto; padding:2rem; display:grid; grid-template-columns:repeat(3,1fr); }
  @media(max-width:640px){ .nb-stats-inner{ grid-template-columns:1fr; } }
  .nb-stat { text-align:center; padding:1.25rem 1rem; border-right:3px solid rgba(255,255,255,.12); }
  .nb-stat:last-child { border-right:none; }
  .nb-stat-icon { font-size:1.75rem; display:block; margin-bottom:0.4rem; }
  .nb-stat-num { font-size:clamp(1.6rem,3.5vw,2.5rem); font-weight:900; color:#FF7F00; letter-spacing:-2px; line-height:1; }
  .nb-stat-label { font-size:0.65rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,.55); margin-top:0.35rem; }

  /* ── SECTIONS ── */
  .nb-section { max-width:1100px; margin:0 auto; padding:5rem 2rem; }
  .nb-section-head { display:flex; flex-direction:column; align-items:flex-start; margin-bottom:2rem; }
  .nb-title { font-size:clamp(1.6rem,3.5vw,2.8rem); font-weight:900; text-transform:uppercase; line-height:1.05; letter-spacing:-1px; color:#003262; }
  .nb-title-dark { color:#fff; }
  .hl-orange { background:#FF7F00; color:#003262; display:inline-block; padding:0 0.4rem; }
  .hl-green  { background:#0B9C2C; color:#fff;    display:inline-block; padding:0 0.4rem; }
  .hl-navy   { background:#003262; color:#fff;    display:inline-block; padding:0 0.4rem; }

  /* ── SEGMENT TABS ── */
  .tabs-row { display:flex; flex-wrap:wrap; gap:0.75rem; margin-bottom:3rem; }
  .tab-btn { padding:0.65rem 1.5rem; font-size:0.8rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; border:3px solid #003262; cursor:pointer; transition:transform .15s,box-shadow .15s,background .15s,color .15s; background:#fff; color:#003262; }
  .tab-btn:hover { transform:translate(-2px,-2px); }
  .tab-btn.active { color:#fff; }

  /* ── FAQ BLOCK HEADER ── */
  .faq-block { margin-bottom:4rem; }
  .faq-block-header { display:flex; align-items:center; gap:1rem; padding:1rem 1.5rem; border:3px solid #003262; margin-bottom:1.5rem; }
  .faq-block-icon { font-size:1.6rem; width:52px; height:52px; display:flex; align-items:center; justify-content:center; border:3px solid #003262; flex-shrink:0; }
  .faq-block-title { font-size:clamp(1.1rem,2.5vw,1.5rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; }
  .faq-block-count { margin-left:auto; font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#fff; padding:0.3rem 0.7rem; border:2px solid #003262; flex-shrink:0; }

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

  /* accordion button reset */
  button { font-family:inherit; }
`;

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const FAQ = () => {
  const heroReveal   = useScrollReveal();
  const faqReveal    = useScrollReveal();
  const ctaReveal    = useScrollReveal();

  const [activeTab, setActiveTab] = useState("all");

  const visibleSections = activeTab === "all"
    ? faqSections
    : faqSections.filter(s => s.id === activeTab);

  return (
    <>
      <style>{CSS}</style>

      <title>FAQ | DreamXec</title>
      <meta name="description" content="Frequently asked questions from students, supporters, and corporate partners." />

      <Header />

      <main className="nb-page">

        {/* ══════════════════════════════════════
            §1  HERO
        ══════════════════════════════════════ */}
        <section className="nb-hero">
          <div style={{ position:"absolute",top:0,right:0,width:320,height:320,background:"#FF7F00",transform:"rotate(-12deg)",opacity:0.04,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:0,left:0,width:240,height:240,background:"#0B9C2C",transform:"rotate(6deg)",opacity:0.04,pointerEvents:"none" }} />

          <div ref={heroReveal.ref} className={`nb-hero-inner sr-fade ${heroReveal.isVisible ? "v" : ""}`}>
            <SectionLabel>❓ FAQ</SectionLabel>

            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem",marginBottom:"2rem" }}>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#0B9C2C" }} />
                <h1 className="stamp-h1" style={{ background:"#FF7F00" }}>Frequently Asked</h1>
              </div>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#FF7F00" }} />
                <h1 className="stamp-h1" style={{ background:"#003262" }}>Questions</h1>
              </div>
            </div>

            <p className="nb-hero-sub">
              Answers for students, donors, and corporate partners — all in one place. Can't find what you're looking for? Email <strong>support@dreamxec.org</strong> and we'll respond within 24 hours.
            </p>

            <div className="pill-row">
              {[
                { label:"5 Student FAQs",    bg:"#FF7F00" },
                { label:"4 Donor FAQs",      bg:"#003262" },
                { label:"3 Corporate FAQs",  bg:"#0B9C2C" },
                { label:"24hr Response",     bg:"#FF7F00" },
              ].map(({ label, bg }) => (
                <div key={label} className="pill" style={{ background:bg }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* §2  STATS BAND */}
        <div className="nb-stats">
          <div className="nb-stats-inner">
            {[
              { icon:"🎓", num:"5",   label:"Student FAQs"    },
              { icon:"💰", num:"4",   label:"Donor FAQs"      },
              { icon:"🏢", num:"3",   label:"Corporate FAQs"  },
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
            §3  ACCORDION FAQ SECTIONS
        ══════════════════════════════════════ */}
        <div className="nb-section">

          <div ref={faqReveal.ref} className={`nb-section-head sr-fade ${faqReveal.isVisible ? "v" : ""}`}
            style={{ alignItems:"center", textAlign:"center", marginBottom:"2.5rem" }}>
            <SectionLabel accent="#FF7F00">📋 All Questions</SectionLabel>
            <h2 className="nb-title">
              Find Your <span className="hl-orange">Answer</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="tabs-row">
            {[
              { id:"all",       label:"All Questions", accent:"#003262" },
              { id:"students",  label:"🎓 Students",   accent:"#FF7F00" },
              { id:"donors",    label:"💰 Donors",     accent:"#003262" },
              { id:"corporate", label:"🏢 Corporate",  accent:"#0B9C2C" },
            ].map(({ id, label, accent }) => (
              <button
                key={id}
                className={`tab-btn ${activeTab === id ? "active" : ""}`}
                style={activeTab === id
                  ? { background:accent, borderColor:accent, boxShadow:`4px 4px 0 ${accent === "#FF7F00" ? "#003262" : "#FF7F00"}` }
                  : { boxShadow:"3px 3px 0 #003262" }
                }
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* FAQ sections */}
          <div className={`sr-stagger ${faqReveal.isVisible ? "v" : ""}`}>
            {visibleSections.map(({ id, label, icon, accent, faqs }) => (
              <div key={id} className="faq-block">
                {/* Section header bar */}
                <div className="faq-block-header" style={{ background:accent, borderColor:"#003262", boxShadow:`5px 5px 0 ${accent === "#FF7F00" ? "#003262" : "#FF7F00"}` }}>
                  <div className="faq-block-icon" style={{ background:"rgba(255,255,255,0.2)", borderColor:"rgba(255,255,255,0.4)" }}>{icon}</div>
                  <div className="faq-block-title" style={{ color:"#fff" }}>{label}</div>
                  <div className="faq-block-count" style={{ background:"rgba(0,0,0,0.2)", borderColor:"rgba(255,255,255,0.4)" }}>
                    {faqs.length} {faqs.length === 1 ? "Question" : "Questions"}
                  </div>
                </div>

                {/* Accordion */}
                <FAQAccordion faqs={faqs} accent={accent} />
              </div>
            ))}
          </div>

        </div>

        {/* ── STRIPE ── */}
        <div className="nb-stripe" />

        {/* ══════════════════════════════════════
            §4  CTA
        ══════════════════════════════════════ */}
        <section className="nb-cta">
          <div style={{ position:"absolute",top:"-2rem",right:"-2rem",width:128,height:128,background:"#FF7F00",border:"4px solid #003262",transform:"rotate(12deg)",opacity:0.1,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:"-2rem",left:"-2rem",width:96,height:96,background:"#0B9C2C",transform:"rotate(-12deg)",opacity:0.1,pointerEvents:"none" }} />

          <div ref={ctaReveal.ref} className={`nb-cta-inner sr-fade ${ctaReveal.isVisible ? "v" : ""}`}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:"1rem" }}>
              <SectionLabel>💬 Still Have Questions?</SectionLabel>
            </div>
            <h2 className="nb-cta-title">
              Didn't Find Your <span className="hl-orange">Answer?</span>
            </h2>
            <p className="nb-cta-sub">
              Our team reads every email and responds within 24 hours. Whether you're a student, donor, mentor, or corporate partner — we're here to help you navigate DreamXec.
            </p>
            <div className="tricolor">
              <div style={{ background:"#FF7F00" }} />
              <div style={{ background:"#fff",border:"1px solid #eee" }} />
              <div style={{ background:"#0B9C2C" }} />
            </div>
            <div className="nb-cta-btns">
              <a href="mailto:support@dreamxec.org" className="nb-btn-1">✉️ Email Support →</a>
              <a href="/" className="nb-btn-2">🏠 Back to Home</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default FAQ;