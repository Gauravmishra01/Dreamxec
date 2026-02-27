import { FooterContent } from "@/sections/Footer/components/FooterContent";
import { Header } from "@/sections/Header";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
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
const reasons = [
  {
    num: "01",
    icon: "🎓",
    accent: "#FF7F00",
    title: "For Students",
    text: "A DreamXec pledge is more than money—it's validation. When a 20-year-old sees 100 people believe in their idea enough to fund it, something shifts. Confidence soars. The impossible suddenly seems doable. Many of our backed students tell us: 'Getting DreamXec funding was my turning point. I stopped doubting myself and started building.' Your support is the spark that ignites a lifetime of achievement.",
  },
  {
    num: "02",
    icon: "🇮🇳",
    accent: "#003262",
    title: "For India",
    text: "Student innovation is India's secret superpower. We have 40M college students, yet only 0.1% get funded. Imagine if that number was 1%. Or 5%. The inventions, startups, jobs, and social impact would be transformative. Your support accelerates that shift and helps India claim its rightful place as a global innovation powerhouse, one breakthrough at a time.",
  },
  {
    num: "03",
    icon: "⚙️",
    accent: "#0B9C2C",
    title: "For Systemic Change",
    text: "Every successful student project proves the model works. Investors see it. The government sees it. Colleges see it. More funding flows to innovation. More teachers encourage students. More colleges build maker spaces. One donation creates a ripple effect that compounds across generations of thinkers and builders who shape the future of this nation.",
  },
];

const stories = [
  {
    icon: "💼",
    name: "Sandeep",
    title: "45, Corporate Executive",
    accent: "#FF7F00",
    story: "I backed 12 projects over 2 years. One was an AI app for farmers. Another was a water sensor for rural areas. Seeing those 20-year-old founders execute with confidence—it reminded me why I love India's potential. Three of them reached out later for job interviews. Two are now in my team. Best ROI I've ever made.",
  },
  {
    icon: "👨‍🏫",
    name: "Priya & Raj",
    title: "Retired Teachers",
    accent: "#0B9C2C",
    story: "We give ₹5,000 each month to random projects. We love reading the updates, seeing young minds solve real problems. Our grandchildren know about 'Grandpa's fund' and want to launch projects themselves. We've created a family legacy of supporting innovation that we hope will outlast us and inspire the next generation.",
  },
  {
    icon: "🏢",
    name: "Meera",
    title: "32, Startup Founder",
    accent: "#003262",
    story: "I was once a broke student with a big idea. Nobody funded me back then. Today I fund 5 DreamXec projects a month. I see myself in every one of those students. The platform's transparency—budget breakdowns, bi-weekly updates—gives me the confidence to keep backing new ideas without hesitation.",
  },
];

// const impactStats = [
//   { icon: "🎯", label: "Students Funded",    value: "12,400+", accent: "#FF7F00" },
//   { icon: "💡", label: "Projects Launched",  value: "840+",    accent: "#FF7F00" },
//   { icon: "🌍", label: "States Reached",     value: "28",      accent: "#FF7F00" },
//   { icon: "📚", label: "Crores Disbursed",   value: "₹3Cr+",   accent: "#FF7F00" },
// ];

/* ─────────────────────────────────────────
   HELPERS
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
   STYLES
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fffbf5; font-family: 'Space Grotesk', sans-serif; color: #003262; overflow-x: hidden; }

  .sr-fade  { opacity:0; transform:translateY(36px);  transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1); }
  .sr-left  { opacity:0; transform:translateX(-48px); transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1); }
  .sr-scale { opacity:0; transform:scale(.88);        transition:opacity .45s cubic-bezier(.16,1,.3,1),transform .45s cubic-bezier(.16,1,.3,1); }
  .sr-fade.v,.sr-left.v,.sr-scale.v { opacity:1; transform:none; }
  .sr-stagger > * { opacity:0; transform:translateY(28px); transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-stagger.v > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
  .sr-stagger.v > *:nth-child(2){opacity:1;transform:none;transition-delay:.15s}
  .sr-stagger.v > *:nth-child(3){opacity:1;transform:none;transition-delay:.25s}
  .sr-stagger.v > *:nth-child(4){opacity:1;transform:none;transition-delay:.35s}

  /* HEADER */
  .nb-header { background:#003262; border-bottom:4px solid #003262; padding:1rem 2rem; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .nb-logo { font-size:1.6rem; font-weight:900; color:#FF7F00; letter-spacing:-1px; text-decoration:none; }
  .nb-nav { display:flex; gap:0.5rem; }
  .nb-nav a { font-weight:900; font-size:0.75rem; color:#fff; text-decoration:none; text-transform:uppercase; letter-spacing:2px; padding:0.5rem 1rem; border:2px solid transparent; transition:all .15s; }
  .nb-nav a:hover { border-color:#FF7F00; color:#FF7F00; }

  /* HERO */
  .hero { background:#fffbf5; border-bottom:4px solid #003262; padding:5rem 2rem 4rem; position:relative; overflow:hidden; }
  .hero-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .stamp-block { position:relative; display:inline-block; margin-bottom:0.75rem; }
  .stamp-shadow { position:absolute; inset:0; }
  .stamp-text { position:relative; z-index:1; display:inline-block; padding:0.4rem 1.2rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:-0.5px; line-height:1; border:4px solid #003262; font-size:clamp(1.4rem,4.5vw,3.4rem); }
  .hero-sub { margin-top:1.5rem; font-size:clamp(1rem,2vw,1.25rem); font-weight:700; color:rgba(0,50,98,.65); max-width:640px; line-height:1.7; text-align:justify; }
  .pill-row { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:2rem; }
  .pill { padding:0.5rem 1.1rem; font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:#fff; border:2px solid #003262; }

  /* STATS */
  .stats-band { background:#003262; border-bottom:4px solid #003262; }
  .stats-inner { max-width:1100px; margin:0 auto; padding:2.5rem 2rem; display:grid; grid-template-columns:repeat(4,1fr); }
  @media(max-width:640px){ .stats-inner{ grid-template-columns:1fr 1fr; } }
  .stat-item { text-align:center; padding:1.5rem 1rem; border-right:3px solid rgba(255,255,255,.12); }
  .stat-item:last-child { border-right:none; }
  .stat-icon { font-size:1.75rem; display:block; margin-bottom:0.5rem; }
  .stat-num { font-size:clamp(1.8rem,4vw,2.8rem); font-weight:900; color:#FF7F00; letter-spacing:-2px; line-height:1; }
  .stat-label { font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,.6); margin-top:0.4rem; }

  /* SECTION */
  .section { max-width:1100px; margin:0 auto; padding:5rem 2rem; }
  .section-head { display:flex; flex-direction:column; align-items:center; margin-bottom:3rem; text-align:center; }
  .section-title { font-size:clamp(1.6rem,3.5vw,2.8rem); font-weight:900; color:#003262; text-transform:uppercase; line-height:1.05; letter-spacing:-1px; }
  .section-title-dark { color:#fff; }
  .hl-orange { background:#FF7F00; color:#003262; display:inline-block; padding:0 0.4rem; }
  .hl-green  { background:#0B9C2C; color:#fff;    display:inline-block; padding:0 0.4rem; }

  /* REASON CARDS */
  .reason-card { background:#fff; border:3px solid #003262; margin-bottom:0; transition:transform .15s, box-shadow .15s; }
  .reason-card:hover { transform:translate(-3px,-3px); }
  .reason-header { padding:1rem 1.5rem 0.75rem; border-bottom:3px solid #003262; background:#fffbf5; }
  .reason-title { font-size:clamp(1rem,2.5vw,1.35rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; }
  .reason-desc { padding:1.25rem 1.5rem; font-size:clamp(0.95rem,1.8vw,1.1rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.8; text-align:justify; }
  .reason-bar { height:6px; }

  /* DARK SECTION */
  .dark-section { background:#003262; border-top:4px solid #003262; border-bottom:4px solid #003262; padding:5rem 0; }

  /* STORY CARDS */
  .stories-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  @media(max-width:900px){ .stories-grid{ grid-template-columns:1fr 1fr; } }
  @media(max-width:580px){ .stories-grid{ grid-template-columns:1fr; } }
  .story-card { background:#fff; border:3px solid #fff; display:flex; flex-direction:column; transition:transform .15s, box-shadow .15s; }
  .story-card:hover { transform:translate(-3px,-3px); }
  .story-top-bar { height:6px; }
  .story-meta { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.5rem; border-bottom:2px solid #003262; background:#fffbf5; }
  .story-avatar { width:52px; height:52px; display:flex; align-items:center; justify-content:center; font-size:1.75rem; flex-shrink:0; border:3px solid #003262; }
  .story-name { font-size:1.15rem; font-weight:900; color:#003262; text-transform:uppercase; letter-spacing:-0.5px; }
  .story-role { font-size:0.72rem; font-weight:700; color:rgba(0,50,98,.55); text-transform:uppercase; letter-spacing:1.5px; margin-top:0.2rem; }
  .story-tag { margin-left:auto; font-size:0.65rem; font-weight:900; color:#fff; padding:0.2rem 0.5rem; border:2px solid #003262; text-transform:uppercase; letter-spacing:2px; flex-shrink:0; }
  .story-quote { font-size:4rem; font-weight:900; line-height:0.7; padding:1rem 1.5rem 0.25rem; }
  .story-body { padding:0 1.5rem 1.5rem; font-size:clamp(0.9rem,1.6vw,1.05rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.8; text-align:justify; font-style:italic; flex:1; }

  /* STRIPE */
  .stripe { width:100%; height:16px; background:repeating-linear-gradient(-45deg,#003262 0px,#003262 12px,#FF7F00 12px,#FF7F00 24px); border-top:3px solid #003262; border-bottom:3px solid #003262; }

  /* CTA */
  .cta-section { background:#fffbf5; border-top:4px solid #003262; padding:5rem 2rem; position:relative; overflow:hidden; }
  .cta-deco-1 { position:absolute; top:-2rem; right:-2rem; width:128px; height:128px; background:#FF7F00; border:4px solid #003262; transform:rotate(12deg); opacity:0.1; pointer-events:none; }
  .cta-deco-2 { position:absolute; bottom:-2rem; left:-2rem; width:96px; height:96px; background:#0B9C2C; transform:rotate(-12deg); opacity:0.1; pointer-events:none; }
  .cta-inner { max-width:800px; margin:0 auto; text-align:center; }
  .cta-title { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:#003262; text-transform:uppercase; line-height:1.1; margin-bottom:1rem; letter-spacing:-1px; }
  .cta-sub { font-size:clamp(0.95rem,2vw,1.2rem); font-weight:600; color:rgba(0,50,98,.65); line-height:1.8; max-width:560px; margin:0 auto 2rem; text-align:justify; }
  .tricolor-bar { display:flex; height:6px; max-width:240px; margin:0 auto 2rem; }
  .tricolor-bar div { flex:1; }
  .cta-buttons { display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; }
  .cta-btn-1 { padding:1.1rem 2.5rem; font-size:clamp(.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#003262; background:#FF7F00; border:4px solid #003262; box-shadow:7px 7px 0 #003262; text-decoration:none; transition:transform .15s,box-shadow .15s; }
  .cta-btn-1:hover { transform:translate(-3px,-3px); box-shadow:10px 10px 0 #003262; }
  .cta-btn-2 { padding:1.1rem 2.5rem; font-size:clamp(.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#fff; background:#003262; border:4px solid #003262; box-shadow:7px 7px 0 #FF7F00; text-decoration:none; transition:transform .15s,box-shadow .15s; }
  .cta-btn-2:hover { transform:translate(-3px,-3px); box-shadow:10px 10px 0 #FF7F00; }

  /* FOOTER */
  .nb-footer { background:#0a0a0a; border-top:4px solid #003262; padding:1.75rem 2rem; text-align:center; font-size:0.8rem; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:2px; }
  .nb-footer span { color:#FF7F00; }
`;

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function WhyDonate() {
  const heroReveal    = useScrollReveal();
  const reasonsReveal = useScrollReveal();
  const storiesReveal = useScrollReveal();
  const ctaReveal     = useScrollReveal();

  return (
    <>
      <style>{CSS}</style>

      {/* HEADER */}
      <Header />

      <main style={{ background: "#fffbf5" }}>

        {/* §1  HERO */}
        <section className="hero">
          <div style={{ position:"absolute",top:0,right:0,width:288,height:288,background:"#FF7F00",transform:"rotate(-12deg)",opacity:0.04,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:0,left:0,width:224,height:224,background:"#0B9C2C",transform:"rotate(6deg)",opacity:0.04,pointerEvents:"none" }} />

          <div ref={heroReveal.ref} className={`hero-inner sr-fade ${heroReveal.isVisible ? "v" : ""}`}>
            <SectionLabel>💛 Support Student Innovation</SectionLabel>

            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem",marginBottom:"2rem" }}>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#0B9C2C" }} />
                <h1 className="stamp-text" style={{ background:"#FF7F00" }}>Change India's Future</h1>
              </div>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#FF7F00" }} />
                <h1 className="stamp-text" style={{ background:"#003262" }}>One Research at a Time</h1>
              </div>
            </div>

            <p className="hero-sub">
              One pledge. One idea. Decades of impact. Here's why supporting student innovation is the highest-leverage move you can make for India's future right now.
            </p>

            <div className="pill-row">
              {[
                { label: "Min. Pledge ₹100", bg: "#FF7F00" },
                { label: "Escrow-Protected",  bg: "#0B9C2C" },
                { label: "Bi-Weekly Updates", bg: "#003262" },
                { label: "Anonymous Option",  bg: "#FF7F00" },
              ].map(({ label, bg }) => (
                <div key={label} className="pill" style={{ background: bg }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* §2  STATS BAND */}
        {/* <div className="stats-band">
          <div className="stats-inner">
            {impactStats.map(({ icon, label, value, accent }) => (
              <div className="stat-item" key={label}>
                <span className="stat-icon">{icon}</span>
                <div className="stat-num" style={{ color: accent }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div> */}

        {/* §3  WHY YOUR SUPPORT MATTERS */}
        <div className="section">
          <div ref={reasonsReveal.ref} className={`section-head sr-fade ${reasonsReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#FF7F00">🗺 Why It Matters</SectionLabel>
            <h2 className="section-title">
              Why Your <span className="hl-orange">Support Matters</span>
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",left:35,top:40,bottom:40,width:2,background:"#003262",opacity:0.1,pointerEvents:"none" }} />

            <div className={`sr-stagger ${reasonsReveal.isVisible ? "v" : ""}`} style={{ display:"flex",flexDirection:"column",gap:0 }}>
              {reasons.map(({ num, icon, accent, title, text }) => (
                <div key={num} style={{ display:"flex",gap:"1.5rem",alignItems:"flex-start",paddingBottom:"1.25rem",position:"relative" }}>
                  {/* Step badge */}
                  <div style={{ flexShrink:0, zIndex:1 }}>
                    <div style={{ width:72,height:72,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:accent,border:"4px solid #003262",boxShadow:"4px 4px 0 #003262",gap:"0.25rem" }}>
                      <span style={{ fontSize:"1.6rem",lineHeight:1 }}>{icon}</span>
                      <span style={{ fontSize:"0.6rem",fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:3 }}>{num}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="reason-card" style={{ flex:1,boxShadow:`5px 5px 0 ${accent}` }}>
                    <div className="reason-header">
                      <h3 className="reason-title">{title}</h3>
                    </div>
                    <p className="reason-desc">{text}</p>
                    <div className="reason-bar" style={{ background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* §4  STRIPE */}
        <div className="stripe" />

        {/* §5  DONOR STORIES — dark bg */}
        <div className="dark-section">
          <div className="section" style={{ padding: "0 2rem" }}>
            <div ref={storiesReveal.ref} className={`section-head sr-fade ${storiesReveal.isVisible ? "v" : ""}`} style={{ marginBottom:"2.5rem" }}>
              <SectionLabel dark>📖 Donor Stories</SectionLabel>
              <h2 className="section-title section-title-dark">
                Real People. <span className="hl-orange">Real Impact.</span>
              </h2>
              <p style={{ marginTop:"0.75rem",fontWeight:700,color:"rgba(255,200,150,.75)",fontSize:"1rem",textAlign:"center" }}>
                Stories from donors who believed before anyone else did.
              </p>
            </div>

            <div className={`stories-grid sr-stagger ${storiesReveal.isVisible ? "v" : ""}`}>
              {stories.map(({ icon, name, title, accent, story }) => (
                <div key={name} className="story-card" style={{ boxShadow:`6px 6px 0 ${accent}` }}>
                  <div className="story-top-bar" style={{ background: accent }} />
                  <div className="story-meta">
                    <div className="story-avatar" style={{ background: accent }}>{icon}</div>
                    <div>
                      <div className="story-name">{name}</div>
                      <div className="story-role">{title}</div>
                    </div>
                    <span className="story-tag" style={{ background: accent }}>Donor</span>
                  </div>
                  <div className="story-quote" style={{ color: accent }}>"</div>
                  <p className="story-body">{story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* §6  STRIPE */}
        <div className="stripe" />

        {/* §7  CTA */}
        <section className="cta-section">
          <div className="cta-deco-1" />
          <div className="cta-deco-2" />
          <div ref={ctaReveal.ref} className={`cta-inner sr-fade ${ctaReveal.isVisible ? "v" : ""}`}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:"1rem" }}>
              <SectionLabel>🚀 Ready to Fund?</SectionLabel>
            </div>
            <h2 className="cta-title">
              Back a Student. <span className="hl-orange">Change a Life.</span>
            </h2>
            <p className="cta-sub">
              The best time to back an innovator is before the world knows their name. DreamXec gives you first access to India's brightest student projects — starting at just ₹100.
            </p>
            <div className="tricolor-bar">
              <div style={{ background:"#FF7F00" }} />
              <div style={{ background:"#fff",border:"1px solid #eee" }} />
              <div style={{ background:"#0B9C2C" }} />
            </div>
            <div className="cta-buttons">
              <a href="/campaigns" className="cta-btn-1">🚀 Start Supporting →</a>
              <a href="/about" className="cta-btn-2">Learn About DreamXec</a>
            </div>
          </div>
        </section>

      </main>

      <FooterContent />
    </>
  );
}