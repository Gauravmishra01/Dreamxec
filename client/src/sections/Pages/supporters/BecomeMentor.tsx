import { useRef, useState, useEffect } from "react";
import { Header } from '../../Header';
import { Footer } from '../../Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
const mentorTypes = [
  { icon: "👨‍💻", text: "Engineers & technical leaders",          accent: "#FF7F00" },
  { icon: "🚀", text: "Entrepreneurs & startup founders",        accent: "#003262" },
  { icon: "👨‍⚕️", text: "Doctors & healthcare professionals",    accent: "#0B9C2C" },
  { icon: "🎨", text: "Designers & product managers",            accent: "#FF7F00" },
  { icon: "✍️", text: "Writers & communication experts",         accent: "#003262" },
  { icon: "💼", text: "Business & finance professionals",        accent: "#0B9C2C" },
  { icon: "🌍", text: "Social impact leaders & nonprofit founders", accent: "#FF7F00" },
  { icon: "👩‍🏫", text: "Teachers & academic researchers",       accent: "#003262" },
  { icon: "🎭", text: "Artists & creative professionals",        accent: "#0B9C2C" },
  { icon: "🏆", text: "Domain specialists of any kind",          accent: "#FF7F00" },
];

const mentorBenefits = [
  {
    icon: "❤️",
    accent: "#FF7F00",
    category: "Personal",
    points: [
      "Help a student change their life trajectory for good",
      "Stay connected to young minds and fresh ideas",
      "Give back without major time commitment — just 1 hour/week",
      "Build your mentorship reputation across India",
      "Access to a network of 1,000+ mentors on the platform",
    ],
  },
  {
    icon: "💼",
    accent: "#003262",
    category: "Professional",
    points: [
      "Find talent for your team through intern and hire pathways",
      "Get market insights directly from student innovators",
      "Develop leadership and coaching skills that compound",
      "LinkedIn visibility with mentor badge and public profile",
      "Media features — great mentor stories get real coverage",
      "Tax benefits if structured through a registered organization",
    ],
  },
  {
    icon: "🧠",
    accent: "#0B9C2C",
    category: "Intellectual",
    points: [
      "Stay sharp by solving novel student problems every week",
      "Co-publish research alongside student projects",
      "Explore ideas and industries outside your day job",
      "Creative stimulation that feeds back into your own work",
    ],
  },
];

const timeCommitment = [
  {
    icon: "⏱️",
    accent: "#FF7F00",
    title: "Per Mentee: 1 Hour / Week",
    points: [
      "Weekly 30–60 min calls — you choose your own schedule",
      "Async communication via platform (Slack-like chat)",
      "Optional: project reviews and introduction facilitation",
      "Duration: 8–12 weeks per project cycle",
    ],
  },
  {
    icon: "👥",
    accent: "#0B9C2C",
    title: "For Multiple Mentees",
    points: [
      "You choose your capacity — work with 1–5 students simultaneously",
      "Average mentor handles 2–3 mentees (2–3 hours/week total)",
      "Seasonal option: 10 hrs/week intensively for 4 weeks",
      "Fully flexible models — we work around your availability",
    ],
  },
];

const mentorStories = [
  {
    icon: "👨‍💻",
    name: "Arvind",
    title: "Senior Engineer at Google",
    accent: "#FF7F00",
    story: "I mentor 2–3 DreamXec projects every year. It takes ~2 hours/week, and honestly? I learn as much as I teach. These 22-year-olds think about problems differently. One mentee's startup idea made me rethink our team's approach to a product. I now have 3 interns from DreamXec projects in my team. Best talent pipeline I've found.",
  },
  {
    icon: "👩‍⚕️",
    name: "Dr. Priya",
    title: "Doctor & Social Entrepreneur",
    accent: "#003262",
    story: "I mentor healthcare innovation projects. It's deeply meaningful — these students are solving real problems in rural health. I've helped 5 projects get funding. Watching them impact thousands of lives? That's why I became a doctor. Now DreamXec lets me multiply that impact by mentoring others.",
  },
];

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children, accent = "#FF7F00", dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "1rem" }}>
      <div style={{ width: 12, height: 12, flexShrink: 0, background: accent }} />
      <div style={{
        padding: "0.3rem 0.9rem",
        fontSize: "0.7rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.25em",
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
  .sr-left  { opacity:0; transform:translateX(-48px); transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1); }
  .sr-scale { opacity:0; transform:scale(.88);        transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-fade.v,.sr-left.v,.sr-scale.v { opacity:1; transform:none; }
  .sr-stagger > * { opacity:0; transform:translateY(28px); transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-stagger.v > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
  .sr-stagger.v > *:nth-child(2){opacity:1;transform:none;transition-delay:.13s}
  .sr-stagger.v > *:nth-child(3){opacity:1;transform:none;transition-delay:.21s}
  .sr-stagger.v > *:nth-child(4){opacity:1;transform:none;transition-delay:.29s}
  .sr-stagger.v > *:nth-child(5){opacity:1;transform:none;transition-delay:.37s}
  .sr-stagger.v > *:nth-child(6){opacity:1;transform:none;transition-delay:.45s}
  .sr-stagger.v > *:nth-child(7){opacity:1;transform:none;transition-delay:.53s}
  .sr-stagger.v > *:nth-child(8){opacity:1;transform:none;transition-delay:.61s}
  .sr-stagger.v > *:nth-child(9){opacity:1;transform:none;transition-delay:.69s}
  .sr-stagger.v > *:nth-child(10){opacity:1;transform:none;transition-delay:.77s}

  /* ── HERO ── */
  .nb-hero { background:#fffbf5; border-bottom:4px solid #003262; padding:5rem 2rem 4rem; position:relative; overflow:hidden; }
  .nb-hero-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .stamp-block { position:relative; display:inline-block; margin-bottom:0.75rem; }
  .stamp-shadow { position:absolute; inset:0; }
  .stamp-h1 { position:relative; z-index:1; display:inline-block; padding:0.4rem 1.2rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:-0.5px; line-height:1; border:4px solid #003262; font-size:clamp(1.3rem,4vw,3rem); }
  .nb-hero-sub { margin-top:1.5rem; font-size:clamp(1rem,2vw,1.2rem); font-weight:700; color:rgba(0,50,98,.65); max-width:620px; line-height:1.75; text-align:justify; }
  .pill-row { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:2rem; }
  .pill { padding:0.5rem 1.1rem; font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:#fff; border:2px solid #003262; }

  /* ── STATS ── */
  .nb-stats { background:#003262; border-bottom:4px solid #003262; }
  .nb-stats-inner { max-width:1100px; margin:0 auto; padding:2.5rem 2rem; display:grid; grid-template-columns:repeat(4,1fr); }
  @media(max-width:640px){ .nb-stats-inner{ grid-template-columns:1fr 1fr; } }
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
  .hl-navy   { background:#003262; color:#fff;    display:inline-block; padding:0 0.4rem; }

  /* ── WHO CAN MENTOR GRID ── */
  .mentor-type-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1rem; }
  @media(max-width:900px){ .mentor-type-grid{ grid-template-columns:repeat(3,1fr); } }
  @media(max-width:580px){ .mentor-type-grid{ grid-template-columns:repeat(2,1fr); } }

  .mentor-type-card { background:#fff; border:3px solid #003262; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:1.25rem 0.75rem; gap:0.6rem; transition:transform .15s,box-shadow .15s; cursor:default; }
  .mentor-type-card:hover { transform:translate(-3px,-3px); }
  .mentor-type-icon { font-size:2rem; }
  .mentor-type-text { font-size:clamp(0.78rem,1.3vw,0.9rem); font-weight:700; color:#003262; line-height:1.4; }
  .mentor-type-bar { height:4px; width:100%; }

  /* requirement card */
  .req-card { background:#fff; border:3px solid #003262; display:grid; grid-template-columns:auto 1fr; gap:0; transition:transform .15s,box-shadow .15s; margin-top:1.25rem; }
  .req-card:hover { transform:translate(-3px,-3px); }
  .req-left { display:flex; align-items:center; justify-content:center; width:70px; font-size:2rem; border-right:3px solid #003262; background:#fffbf5; }
  .req-body { padding:1.25rem 1.5rem; }
  .req-title { font-size:clamp(0.9rem,1.8vw,1.1rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.3px; color:#003262; margin-bottom:0.5rem; }
  .req-text { font-size:clamp(0.9rem,1.6vw,1.05rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.8; text-align:justify; }
  .req-bar { height:5px; grid-column:1/-1; }

  /* ── DARK BG ── */
  .nb-dark { background:#003262; border-top:4px solid #003262; border-bottom:4px solid #003262; padding:5rem 0; }

  /* ── BENEFIT CARDS ── */
  .benefit-card { background:#fff; border:3px solid #fff; display:flex; flex-direction:column; height:100%; transition:transform .15s,box-shadow .15s; }
  .benefit-card:hover { transform:translate(-3px,-3px); }
  .benefit-top { height:6px; }
  .benefit-header { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.5rem; border-bottom:2px solid #003262; background:#fffbf5; }
  .benefit-icon { font-size:1.75rem; width:52px; height:52px; display:flex; align-items:center; justify-content:center; border:3px solid #003262; flex-shrink:0; }
  .benefit-cat { font-size:clamp(1rem,2vw,1.25rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; }
  .benefit-points { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:0.75rem; flex:1; }
  .benefit-point { display:flex; align-items:flex-start; gap:0.75rem; }
  .benefit-bullet { font-size:0.6rem; font-weight:900; color:#fff; padding:0.15rem 0.4rem; border:2px solid #003262; flex-shrink:0; margin-top:0.2rem; }
  .benefit-text { font-size:clamp(0.88rem,1.5vw,1rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.75; text-align:justify; }

  /* ── TIME COMMITMENT CARDS ── */
  .time-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
  @media(max-width:640px){ .time-grid{ grid-template-columns:1fr; } }

  .time-card { background:#fff; border:3px solid #003262; display:flex; flex-direction:column; transition:transform .15s,box-shadow .15s; }
  .time-card:hover { transform:translate(-3px,-3px); }
  .time-top { height:6px; }
  .time-header { display:flex; align-items:center; gap:1rem; padding:1.1rem 1.5rem; border-bottom:3px solid #003262; background:#fffbf5; }
  .time-icon { font-size:1.75rem; width:52px; height:52px; display:flex; align-items:center; justify-content:center; border:3px solid #003262; flex-shrink:0; }
  .time-title { font-size:clamp(0.95rem,2vw,1.2rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; }
  .time-points { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:0.75rem; flex:1; }
  .time-point { display:flex; align-items:flex-start; gap:0.75rem; }
  .time-bullet { font-size:0.6rem; font-weight:900; color:#fff; padding:0.15rem 0.4rem; border:2px solid #003262; flex-shrink:0; margin-top:0.2rem; }
  .time-text { font-size:clamp(0.88rem,1.5vw,1rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.75; text-align:justify; }
  .time-bottom { height:6px; }

  /* ── STORY CARDS ── */
  .stories-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
  @media(max-width:640px){ .stories-grid{ grid-template-columns:1fr; } }

  .story-card { background:#fff; border:3px solid #fff; display:flex; flex-direction:column; transition:transform .15s,box-shadow .15s; }
  .story-card:hover { transform:translate(-3px,-3px); }
  .story-top { height:6px; }
  .story-meta { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.5rem; border-bottom:2px solid #003262; background:#fffbf5; }
  .story-avatar { width:52px; height:52px; display:flex; align-items:center; justify-content:center; font-size:1.75rem; flex-shrink:0; border:3px solid #003262; }
  .story-name { font-size:1.15rem; font-weight:900; color:#003262; text-transform:uppercase; letter-spacing:-0.5px; }
  .story-role { font-size:0.72rem; font-weight:700; color:rgba(0,50,98,.55); text-transform:uppercase; letter-spacing:1.5px; margin-top:0.2rem; }
  .story-tag { margin-left:auto; font-size:0.65rem; font-weight:900; color:#fff; padding:0.2rem 0.5rem; border:2px solid #003262; text-transform:uppercase; letter-spacing:2px; flex-shrink:0; }
  .story-quote { font-size:4rem; font-weight:900; line-height:0.7; padding:1rem 1.5rem 0.25rem; }
  .story-body { padding:0 1.5rem 1.5rem; font-size:clamp(0.9rem,1.6vw,1.05rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.8; text-align:justify; font-style:italic; flex:1; }

  /* swiper nav */
  .swiper-m-prev,.swiper-m-next { position:absolute; top:50%; transform:translateY(-50%); z-index:10; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-weight:900; cursor:pointer; transition:transform .15s; }
  .swiper-m-prev:hover,.swiper-m-next:hover { transform:translateY(-50%) translate(-2px,-2px); }
  .swiper-m-prev { left:0; }
  .swiper-m-next { right:0; }
  .swiper-s-prev,.swiper-s-next { position:absolute; top:50%; transform:translateY(-50%); z-index:10; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-weight:900; cursor:pointer; transition:transform .15s; }
  .swiper-s-prev:hover,.swiper-s-next:hover { transform:translateY(-50%) translate(-2px,-2px); }
  .swiper-s-prev { left:0; }
  .swiper-s-next { right:0; }

  /* ── STRIPE ── */
  .nb-stripe { width:100%; height:16px; background:repeating-linear-gradient(-45deg,#003262 0px,#003262 12px,#FF7F00 12px,#FF7F00 24px); border-top:3px solid #003262; border-bottom:3px solid #003262; }

  /* ── CTA ── */
  .nb-cta { background:#fffbf5; border-top:4px solid #003262; padding:5rem 2rem; position:relative; overflow:hidden; }
  .nb-cta-inner { max-width:800px; margin:0 auto; text-align:center; }
  .nb-cta-title { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; text-transform:uppercase; line-height:1.1; letter-spacing:-1px; color:#003262; margin-bottom:1rem; }
  .nb-cta-sub { font-size:clamp(0.95rem,2vw,1.15rem); font-weight:600; color:rgba(0,50,98,.65); line-height:1.8; max-width:580px; margin:0 auto 2rem; text-align:justify; }
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
const BecomeMentor = () => {
  const heroReveal    = useScrollReveal();
  const whoReveal     = useScrollReveal();
  const benefitReveal = useScrollReveal();
  const timeReveal    = useScrollReveal();
  const storyReveal   = useScrollReveal();
  const ctaReveal     = useScrollReveal();

  return (
    <>
      <style>{CSS}</style>

      <title>Become a Mentor | DreamXec</title>
      <meta name="description" content="Guide the Next Generation of Indian Innovators. Share your expertise. Unlock student potential. Become a DreamXec mentor." />

      <Header />

      <main className="nb-page">

        {/* ══════════════════════════════════════
            §1  HERO
        ══════════════════════════════════════ */}
        <section className="nb-hero">
          <div style={{ position:"absolute",top:0,right:0,width:320,height:320,background:"#FF7F00",transform:"rotate(-12deg)",opacity:0.04,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:0,left:0,width:240,height:240,background:"#0B9C2C",transform:"rotate(6deg)",opacity:0.04,pointerEvents:"none" }} />

          <div ref={heroReveal.ref} className={`nb-hero-inner sr-fade ${heroReveal.isVisible ? "v" : ""}`}>
            <SectionLabel>🎓 Become a DreamXec Mentor</SectionLabel>

            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem",marginBottom:"2rem" }}>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#0B9C2C" }} />
                <h1 className="stamp-h1" style={{ background:"#FF7F00" }}>Guide the Next Generation</h1>
              </div>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#FF7F00" }} />
                <h1 className="stamp-h1" style={{ background:"#003262" }}>of Indian Innovators</h1>
              </div>
            </div>

            <p className="nb-hero-sub">
              Share your expertise. Unlock student potential. Become a DreamXec mentor and leave a mark on the next generation of builders, researchers, and changemakers across India.
            </p>

            <div className="pill-row">
              {[
                { label: "1 Hour / Week",    bg: "#FF7F00" },
                { label: "8–12 Week Cycles", bg: "#0B9C2C" },
                { label: "1,000+ Mentors",   bg: "#003262" },
                { label: "Talent Pipeline",  bg: "#FF7F00" },
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
              { icon: "🧑‍🏫", num: "1,000+", label: "Active Mentors"     },
              { icon: "🎯",   num: "840+",   label: "Projects Guided"    },
              { icon: "⏱️",  num: "1 hr",   label: "Per Week Commitment" },
              { icon: "🏆",  num: "92%",    label: "Mentor Satisfaction" },
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
            §3  WHO CAN MENTOR
        ══════════════════════════════════════ */}
        <div className="nb-section">
          <div ref={whoReveal.ref} className={`nb-section-head sr-fade ${whoReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#FF7F00">👤 Who Can Mentor</SectionLabel>
            <h2 className="nb-title">
              Any Expert. <span className="hl-orange">Any Domain.</span>
            </h2>
            <p style={{ marginTop:"0.75rem",fontWeight:700,color:"rgba(0,50,98,.6)",fontSize:"clamp(0.95rem,1.8vw,1.1rem)",maxWidth:600,lineHeight:1.75,textAlign:"justify" }}>
              No specific credentials required — just genuine interest in helping students grow, the ability to give 1 hour/week, and willingness to share your real-world learnings.
            </p>
          </div>

          {/* 5-col icon grid */}
          <div className={`mentor-type-grid sr-stagger ${whoReveal.isVisible ? "v" : ""}`}>
            {mentorTypes.map(({ icon, text, accent }) => (
              <div key={text} className="mentor-type-card" style={{ boxShadow:`4px 4px 0 ${accent}` }}>
                <div style={{ height:4,background:accent,width:"100%",marginBottom:"0.5rem" }} />
                <div className="mentor-type-icon">{icon}</div>
                <div className="mentor-type-text">{text}</div>
              </div>
            ))}
          </div>

          {/* Requirement card */}
          <div className={`sr-fade ${whoReveal.isVisible ? "v" : ""}`} style={{ transitionDelay:"0.4s" }}>
            <div className="req-card" style={{ boxShadow:"5px 5px 0 #FF7F00", marginTop:"1.5rem" }}>
              <div className="req-left">📋</div>
              <div className="req-body">
                <div className="req-title">Minimum Requirements</div>
                <p className="req-text">
                  No specific experience required. Just genuine interest in helping students, ability to give 1 hour/week for 8–12 weeks, and willingness to share what you've learned — successes and failures both.
                </p>
              </div>
              <div className="req-bar" style={{ background:"#FF7F00" }} />
            </div>
          </div>
        </div>

        {/* ── STRIPE ── */}
        <div className="nb-stripe" />

        {/* ══════════════════════════════════════
            §4  MENTOR BENEFITS — dark + swiper
        ══════════════════════════════════════ */}
        <div className="nb-dark">
          <div className="nb-section" style={{ padding:"0 2rem" }}>
            <div ref={benefitReveal.ref} className={`nb-section-head sr-fade ${benefitReveal.isVisible ? "v" : ""}`} style={{ marginBottom:"2.5rem" }}>
              <SectionLabel dark>🎁 What You Get</SectionLabel>
              <h2 className="nb-title nb-title-dark">
                Mentor <span className="hl-orange">Benefits</span>
              </h2>
              <p style={{ marginTop:"0.75rem",fontWeight:700,color:"rgba(255,200,150,.75)",fontSize:"1rem",textAlign:"center",maxWidth:540 }}>
                Mentoring pays back far more than you put in — personally, professionally, and intellectually.
              </p>
            </div>

            <div className={`sr-scale ${benefitReveal.isVisible ? "v" : ""}`} style={{ position:"relative" }}>
              <button className="swiper-m-prev" style={{ background:"#FF7F00",border:"3px solid #fff",boxShadow:"3px 3px 0 #fff",color:"#003262" }}>←</button>
              <button className="swiper-m-next" style={{ background:"#FF7F00",border:"3px solid #fff",boxShadow:"3px 3px 0 #fff",color:"#003262" }}>→</button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                spaceBetween={16} slidesPerView={1} speed={800}
                navigation={{ prevEl:".swiper-m-prev", nextEl:".swiper-m-next" }}
                pagination={{ clickable:true }}
                keyboard={{ enabled:true }}
                grabCursor
                autoplay={{ delay:3200, disableOnInteraction:false, pauseOnMouseEnter:true }}
                breakpoints={{ 768:{ slidesPerView:2,spaceBetween:16 }, 1024:{ slidesPerView:3,spaceBetween:16 } }}
                style={{ paddingBottom:"2.5rem",paddingLeft:"2.5rem",paddingRight:"2.5rem" }}
              >
                {mentorBenefits.map(({ icon, accent, category, points }) => (
                  <SwiperSlide key={category} style={{ height:"auto" }}>
                    <div className="benefit-card" style={{ boxShadow:`6px 6px 0 ${accent}` }}>
                      <div className="benefit-top" style={{ background:accent }} />
                      <div className="benefit-header">
                        <div className="benefit-icon" style={{ background:accent }}>{icon}</div>
                        <div className="benefit-cat">{category}</div>
                      </div>
                      <div className="benefit-points">
                        {points.map((pt, i) => (
                          <div key={i} className="benefit-point">
                            <span className="benefit-bullet" style={{ background:accent }}>{i+1}</span>
                            <p className="benefit-text">{pt}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            §5  TIME COMMITMENT
        ══════════════════════════════════════ */}
        <div className="nb-section">
          <div ref={timeReveal.ref} className={`nb-section-head sr-fade ${timeReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#0B9C2C">⏱️ Time Commitment</SectionLabel>
            <h2 className="nb-title">
              Flexible. <span className="hl-green">Low-Effort.</span> High Impact.
            </h2>
          </div>

          <div className={`time-grid sr-stagger ${timeReveal.isVisible ? "v" : ""}`}>
            {timeCommitment.map(({ icon, accent, title, points }) => (
              <div key={title} className="time-card" style={{ boxShadow:`5px 5px 0 ${accent}` }}>
                <div className="time-top" style={{ background:accent }} />
                <div className="time-header">
                  <div className="time-icon" style={{ background:accent }}>{icon}</div>
                  <div className="time-title">{title}</div>
                </div>
                <div className="time-points">
                  {points.map((pt, i) => (
                    <div key={i} className="time-point">
                      <span className="time-bullet" style={{ background:accent }}>{i+1}</span>
                      <p className="time-text">{pt}</p>
                    </div>
                  ))}
                </div>
                <div className="time-bottom" style={{ background:accent }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── STRIPE ── */}
        <div className="nb-stripe" />

        {/* ══════════════════════════════════════
            §6  MENTOR STORIES — dark
        ══════════════════════════════════════ */}
        <div className="nb-dark">
          <div className="nb-section" style={{ padding:"0 2rem" }}>
            <div ref={storyReveal.ref} className={`nb-section-head sr-fade ${storyReveal.isVisible ? "v" : ""}`} style={{ marginBottom:"2.5rem" }}>
              <SectionLabel dark>📖 Mentor Stories</SectionLabel>
              <h2 className="nb-title nb-title-dark">
                Real Mentors. <span className="hl-orange">Real Impact.</span>
              </h2>
              <p style={{ marginTop:"0.75rem",fontWeight:700,color:"rgba(255,200,150,.75)",fontSize:"1rem",textAlign:"center",maxWidth:500 }}>
                Hear from the people already changing lives — one hour at a time.
              </p>
            </div>

            <div className={`stories-grid sr-stagger ${storyReveal.isVisible ? "v" : ""}`}>
              {mentorStories.map(({ icon, name, title, accent, story }) => (
                <div key={name} className="story-card" style={{ boxShadow:`6px 6px 0 ${accent}` }}>
                  <div className="story-top" style={{ background:accent }} />
                  <div className="story-meta">
                    <div className="story-avatar" style={{ background:accent }}>{icon}</div>
                    <div>
                      <div className="story-name">{name}</div>
                      <div className="story-role">{title}</div>
                    </div>
                    <span className="story-tag" style={{ background:accent }}>Mentor</span>
                  </div>
                  <div className="story-quote" style={{ color:accent }}>"</div>
                  <p className="story-body">{story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            §7  CTA
        ══════════════════════════════════════ */}
        <section className="nb-cta">
          <div style={{ position:"absolute",top:"-2rem",right:"-2rem",width:128,height:128,background:"#FF7F00",border:"4px solid #003262",transform:"rotate(12deg)",opacity:0.1,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:"-2rem",left:"-2rem",width:96,height:96,background:"#0B9C2C",transform:"rotate(-12deg)",opacity:0.1,pointerEvents:"none" }} />

          <div ref={ctaReveal.ref} className={`nb-cta-inner sr-fade ${ctaReveal.isVisible ? "v" : ""}`}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:"1rem" }}>
              <SectionLabel>🚀 Ready to Mentor?</SectionLabel>
            </div>
            <h2 className="nb-cta-title">
              Shape a Student. <span className="hl-orange">Shape India.</span>
            </h2>
            <p className="nb-cta-sub">
              The students of today are the founders, scientists, and leaders of tomorrow. Join 1,000+ mentors already on DreamXec and give one hour a week that will matter for a lifetime.
            </p>
            <div className="tricolor">
              <div style={{ background:"#FF7F00" }} />
              <div style={{ background:"#fff",border:"1px solid #eee" }} />
              <div style={{ background:"#0B9C2C" }} />
            </div>
            <div className="nb-cta-btns">
              <a href="/contact" className="nb-btn-1">🎓 Become a Mentor →</a>
              <a href="/campaigns" className="nb-btn-2">Browse Student Projects</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default BecomeMentor;