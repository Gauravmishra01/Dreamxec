import { Header } from "../../Header/index";
import { Footer } from "../../Footer/index";
import { RopeDivider } from "../../../components/RopeDivider";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Project",
    text: "Write a compelling project description, set your funding goal (₹5K–₹50L), upload your video/ppt pitch, and explain project milestones and impact vision.",
    accent: "#FF7F00",
    icon: "✏️",
  },
  {
    step: "02",
    title: "Campaign & Community",
    text: "Launch your campaign. Supporters pledge funds. Mentors guide your execution. Build momentum with updates and milestone celebrations.",
    accent: "#003366",
    icon: "🚀",
  },
  {
    step: "03",
    title: "Deliver Impact",
    text: "Once funded, execute with mentor support. Track outcomes—internships, jobs, patents, social impact—and celebrate every milestone.",
    accent: "#0B9C2C",
    icon: "🎯",
  },
];

const WHAT_YOU_GET = [
  {
    title: "Funding",
    range: "₹5K – ₹50L",
    text: "Access capital from passionate supporters. No interference in the research process — you own the journey completely.",
    accent: "#FF7F00",
    icon: "💰",
  },
  {
    title: "Mentorship",
    range: "1,000+ Experts",
    text: "Paired with mentors across engineering, business, social impact, and product design — weekly guidance calls from day one.",
    accent: "#003366",
    icon: "🎓",
  },
  {
    title: "Exposure",
    range: "Build Your Network",
    text: "Featured on platform homepage, media coverage for standout projects, and LinkedIn visibility for your entire team.",
    accent: "#0B9C2C",
    icon: "📡",
  },
];

const SUCCESS_METRICS = [
  { icon: "🚀", text: "Fund over 500 student-led projects by 2026", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg" },
  { icon: "💰", text: "Raise a minimum of ₹10 crore in total funding", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg" },
  { icon: "🧠", text: "Engage more than 1,000 industry and academic mentors", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg" },
  { icon: "📈", text: "Achieve at least a 70% success rate for projects reaching their funding goals", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg" },
  { icon: "🤝", text: "Build strong collaborations between academia, industry, and government to enhance employability", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/18.svg" },
  { icon: "🎓", text: "Enable 50,000+ students to access real-world opportunities through funded projects and mentorship", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/2.svg" },
];

const FAQ = [
  { q: "How long does the campaign run?", a: "30 to 60 days. You choose the duration and goal. If you reach your goal before deadline, celebrate early. If not, you can extend by 30 days." },
  { q: "What happens if I don't reach my funding goal?", a: "With flexible funding enabled (which DreamXec supports), you keep whatever you raised. If all-or-nothing, funds are returned to backers. No penalties to you." },
  { q: "Can I have multiple projects running?", a: "Yes! A club can have multiple research projects. You must report milestones on time. Strong milestone delivery builds donor trust and helps raise funds for future stages." },
  { q: "How do clubs with challenges get supported?", a: "Clubs showing delivery receive higher visibility, while those facing challenges are actively supported by the DreamXec team to move forward." },
  { q: "What does the project lifecycle look like?", a: "List your projects → Outline milestones → Raise funds → Start → Execute → Share outcomes → Raise funds for the next stage of research." },
  { q: "How do I use the mentor marketplace?", a: "Post your project → select mentor matches → weekly mentorship calls begin immediately, even before your campaign launches." },
];

const ELIGIBILITY_YES = [
  "Currently enrolled in any Indian college or university",
  "Team of 1–6 members (mixed backgrounds welcome)",
  "Project in ideation, prototype, or execution stage",
  "Any field: tech, biotech, defence, education, environment, art, social sciences, etc.",
];

const ELIGIBILITY_NO = [
  "Personal expenses or lifestyle funding",
  "Projects violating Indian laws or ethical standards",
];

/* ─────────────────────────────────────────────────────────
   REUSABLE SECTION LABEL
───────────────────────────────────────────────────────── */
function SectionLabel({ children, accent = '#FF7F00' }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-0 mb-5">
      <div className="w-3 h-3 flex-shrink-0" style={{ background: accent }} />
      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white"
        style={{ background: '#003366', border: `2px solid #003366` }}>
        {children}
      </div>
      <div className="w-3 h-3 flex-shrink-0" style={{ background: '#0B9C2C' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
const StartAProject = () => {
  return (
    <>
      <title>Start a Project | DreamXec</title>
      <meta name="description" content="Turn your innovation into reality with DreamXec. Get funded, mentored, and supported to launch your student project." />

      <Header />

      <main className="relative w-full overflow-x-hidden" style={{ background: '#fffbf5' }}>

        {/* ══════════════════════════════════════════════════
            §1 — HERO  (full-width stamp)
            Golden ratio: headline ~61.8% of viewport width
        ══════════════════════════════════════════════════ */}
        <section className="relative w-full pt-28 pb-20 overflow-hidden" style={{ borderBottom: '4px solid #003366' }}>

          {/* Background accent shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 -rotate-12 opacity-[0.04] pointer-events-none" style={{ background: '#FF7F00' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rotate-6 opacity-[0.04] pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            {/* Eyebrow */}
            <div className="flex justify-center mb-8">
              <SectionLabel>🇮🇳 Student Innovation Platform</SectionLabel>
            </div>

            {/* Headline — two stamped slabs */}
            <div className="flex flex-col items-center gap-3 mb-10 text-center">
              {/* Slab 1 */}
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#0B9C2C' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-6 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.8rem,5.5vw,4.2rem)', background: '#FF7F00', border: '4px solid #003366' }}>
                  Turn Your Innovation
                </h1>
              </div>
              {/* Slab 2 */}
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#FF7F00' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-6 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.8rem,5.5vw,4.2rem)', background: '#003366', border: '4px solid #003366' }}>
                  Into Reality
                </h1>
              </div>
            </div>

            {/* Sub — max-width ~61.8% of 7xl container = the golden column */}
            <p className="mx-auto text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-justify mb-10"
              style={{ maxWidth: '680px' }}>
              Get funded. Get mentored. Make an impact. Launch your next big idea with{' '}
              <span className="font-black text-[#003366]">DreamXec</span> — India's fastest-growing student innovation platform dedicated to turning curiosity into real-world change.
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Student-first Platform', 'Funding + Mentorship', 'Built for Real Impact'].map((tag, i) => {
                const bgs = ['#FF7F00', '#003366', '#0B9C2C'];
                return (
                  <div key={tag} className="px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white"
                    style={{ background: bgs[i], border: '2px solid #003366' }}>
                    {tag}
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <a href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 font-black text-sm uppercase tracking-widest text-[#003366] transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#FF7F00', border: '4px solid #003366', boxShadow: '7px 7px 0 #003366' }}>
                Start Your Project →
              </a>
            </div>
          </div>
        </section>

        <RopeDivider />

        {/* ══════════════════════════════════════════════════
            §2 — WHAT IS DREAMXEC
            Golden layout: 61.8% text col + 38.2% feature cards
        ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-start">

            {/* Left: text block */}
            <div>
              <SectionLabel accent="#003366">What Is DreamXec for Innovators?</SectionLabel>
              <h2 className="font-black text-[#003366] uppercase leading-tight mb-6"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                A Platform Built{' '}
                <span className="inline-block px-1" style={{ background: '#FF7F00', color: '#003366' }}>
                  Exclusively
                </span>{' '}
                for Student Innovators
              </h2>
              <div className="space-y-4">
                <p className="text-sm md:text-base font-bold text-[#003366]/70 leading-relaxed text-justify">
                  DreamXec is a crowdfunding platform built exclusively for student innovators. Whether you're working on a research project, building a tech product, creating a social enterprise, or shaping a startup idea — DreamXec connects you with funding, mentors, and a community that believes in your vision.
                </p>
                <p className="text-sm md:text-base font-bold text-[#003366]/70 leading-relaxed text-justify">
                  Your idea doesn't need venture capital backing. It needs a community of believers, a structured funding path, and expert guidance at every step. That's exactly what DreamXec provides — nothing more, nothing less.
                </p>
              </div>

              {/* Tricolor strip */}
              <div className="flex h-1.5 mt-8 w-32">
                <div className="flex-1" style={{ background: '#FF7F00' }} />
                <div className="flex-1" style={{ background: '#003366' }} />
                <div className="flex-1" style={{ background: '#0B9C2C' }} />
              </div>
            </div>

            {/* Right: 3 feature cards stacked */}
            <div className="space-y-4">
              {[
                { title: 'Get Funded', desc: 'Access capital without needing VC backing or investor approval.', accent: '#FF7F00', icon: '💸', vector: '/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg' },
                { title: 'Get Mentored', desc: 'Learn directly from industry & academic experts through weekly calls.', accent: '#003366', icon: '🎓', vector: '/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg' },
                { title: 'Create Impact', desc: 'Turn raw ideas into real-world solutions with measurable outcomes.', accent: '#0B9C2C', icon: '🌍', vector: '/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg' },
              ].map(({ title, desc, accent, icon, vector }) => (
                <div key={title}
                  className="flex items-center gap-4 p-4 bg-white transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accent}` }}>
                  <div className="w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: accent, border: '2px solid #003366' }}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs uppercase tracking-widest text-[#003366] mb-0.5">{title}</p>
                    <p className="text-xs font-bold text-[#003366]/60 leading-snug">{desc}</p>
                  </div>
                  <img src={vector} alt="" className="w-12 h-12 opacity-30 flex-shrink-0 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            §3 — HOW IT WORKS (Numbered steps carousel)
        ══════════════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-0 mb-5">
                <div className="w-3 h-3" style={{ background: '#FF7F00' }} />
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#003366]"
                  style={{ background: '#FF7F00', border: '2px solid #FF7F00' }}>
                  Step by Step
                </div>
                <div className="w-3 h-3" style={{ background: '#0B9C2C' }} />
              </div>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)' }}>
                How It{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Works</span>
              </h2>
            </div>

            {/* Custom nav */}
            <div className="relative">
              <button className="swiper-how-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>←</button>
              <button className="swiper-how-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>→</button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                spaceBetween={20} slidesPerView={1} speed={800}
                navigation={{ prevEl: '.swiper-how-prev', nextEl: '.swiper-how-next' }}
                pagination={{ clickable: true }} keyboard={{ enabled: true }} grabCursor
                autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
                className="!pb-10 !px-10"
              >
                {HOW_IT_WORKS.map(({ step, title, text, accent, icon }) => (
                  <SwiperSlide key={step} className="h-auto">
                    <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                      style={{ border: '3px solid #fff', boxShadow: `6px 6px 0 ${accent}` }}>
                      {/* Top accent bar */}
                      <div className="h-1.5 flex">
                        <div className="flex-1" style={{ background: accent }} />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        {/* Step badge + icon */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-black text-4xl leading-none" style={{ color: `${accent}33` }}>{step}</span>
                          <div className="w-10 h-10 flex items-center justify-center text-xl"
                            style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-tight text-[#003366] mb-3"
                          style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '8px' }}>
                          {title}
                        </h3>
                        <p className="text-xs font-bold text-[#003366]/70 leading-relaxed text-justify mt-auto px-3 py-2"
                          style={{ background: '#fffbf5', border: '2px solid #003366' }}>
                          {text}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            §4 — WHAT YOU GET
            Golden layout: 3-col grid, full bleed cards
        ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20">

          <div className="flex flex-col items-center mb-12">
            <SectionLabel accent="#0B9C2C">Benefits</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)' }}>
              What You{' '}
              <span className="inline-block px-2" style={{ background: '#0B9C2C', color: '#fff' }}>Get</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHAT_YOU_GET.map(({ title, range, text, accent, icon }) => (
              <div key={title}
                className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ border: '3px solid #003366', boxShadow: `7px 7px 0 ${accent}` }}>
                {/* Header */}
                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
                  <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-[#003366] leading-none">{title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: accent }}>{range}</p>
                  </div>
                </div>
                {/* Body */}
                <p className="p-5 text-sm font-bold text-[#003366]/70 leading-relaxed text-justify flex-1">{text}</p>
                {/* Bottom strip */}
                <div className="h-1.5" style={{ background: accent }} />
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            §5 — ELIGIBILITY  (2-col split, golden ratio)
        ══════════════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#fffbf5', borderTop: '4px solid #003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            <div className="flex flex-col items-center mb-12">
              <SectionLabel accent="#FF7F00">Eligibility Snapshot</SectionLabel>
              <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)' }}>
                Who Can{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Apply?</span>
              </h2>
            </div>

            {/* Golden split: 61.8 / 38.2 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6">

              {/* Yes column */}
              <div className="bg-white" style={{ border: '3px solid #003366', boxShadow: '7px 7px 0 #0B9C2C' }}>
                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#f0fdf4' }}>
                  <div className="w-8 h-8 flex items-center justify-center text-base" style={{ background: '#0B9C2C', border: '2px solid #003366', color: '#fff' }}>✓</div>
                  <p className="font-black text-sm uppercase tracking-widest text-[#003366]">Who Can Apply</p>
                </div>
                <ul className="p-5 space-y-3">
                  {ELIGIBILITY_YES.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                        style={{ background: '#0B9C2C', border: '2px solid #003366' }}>✓</span>
                      <span className="text-sm font-bold text-[#003366]/80 leading-snug text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* No column */}
              <div className="bg-white" style={{ border: '3px solid #003366', boxShadow: '7px 7px 0 #dc2626' }}>
                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#fef2f2' }}>
                  <div className="w-8 h-8 flex items-center justify-center text-base" style={{ background: '#dc2626', border: '2px solid #003366', color: '#fff' }}>✕</div>
                  <p className="font-black text-sm uppercase tracking-widest text-[#003366]">Doesn't Qualify</p>
                </div>
                <ul className="p-5 space-y-3">
                  {ELIGIBILITY_NO.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                        style={{ background: '#dc2626', border: '2px solid #003366' }}>✕</span>
                      <span className="text-sm font-bold text-[#003366]/80 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            §6 — SUCCESS METRICS  (3-col grid)
        ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20">

          <div className="flex flex-col items-center mb-12">
            <SectionLabel accent="#003366">Our Goals</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)' }}>
              What Does{' '}
              <span className="inline-block px-2" style={{ background: '#003366', color: '#FF7F00' }}>"Success"</span>{' '}
              Look Like?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUCCESS_METRICS.map(({ icon, text, vector }, i) => {
              const accents = ['#FF7F00', '#0B9C2C', '#003366', '#FF7F00', '#0B9C2C', '#003366'];
              const accent = accents[i];
              return (
                <div key={i}
                  className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accent}` }}>
                  {/* Icon header */}
                  <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '2px solid #003366', background: '#fffbf5' }}>
                    <div className="w-9 h-9 flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-[#003366]/40">Goal {String(i + 1).padStart(2, '0')}</div>
                  </div>
                  {/* Text */}
                  <p className="px-4 py-4 text-sm font-bold text-[#003366]/70 leading-relaxed text-justify flex-1">{text}</p>
                  {/* Illustration */}
                  <div className="flex justify-end px-4 pb-3">
                    <img src={vector} alt="" className="w-16 h-16 opacity-20" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            §7 — FAQ  (3-col grid)
        ══════════════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-0 mb-5">
                <div className="w-3 h-3" style={{ background: '#FF7F00' }} />
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#003366]"
                  style={{ background: '#FF7F00' }}>Frequently Asked Questions</div>
                <div className="w-3 h-3" style={{ background: '#0B9C2C' }} />
              </div>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)' }}>
                Got Questions?{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>We've Got Answers.</span>
              </h2>
              <p className="text-sm font-bold text-orange-200 mt-4 text-center max-w-xl">
                Everything you need to know before launching your project on DreamXec.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FAQ.map(({ q, a }, i) => {
                const accents = ['#FF7F00', '#0B9C2C', '#FF7F00', '#0B9C2C', '#FF7F00', '#0B9C2C'];
                const accent = accents[i];
                return (
                  <div key={i} className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    style={{ border: '3px solid #fff', boxShadow: `5px 5px 0 ${accent}` }}>
                    {/* Top accent */}
                    <div className="h-1.5" style={{ background: accent }} />
                    {/* Q */}
                    <div className="px-4 pt-4 pb-3" style={{ borderBottom: '2px solid #003366' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white px-1.5 py-0.5 flex-shrink-0"
                          style={{ background: accent, border: `2px solid #003366` }}>Q</span>
                        <p className="font-black text-xs uppercase tracking-tight text-[#003366] leading-snug">{q}</p>
                      </div>
                    </div>
                    {/* A */}
                    <div className="px-4 py-4 flex-1">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white px-1.5 py-0.5 flex-shrink-0"
                          style={{ background: '#003366', border: '2px solid #003366' }}>A</span>
                        <p className="text-xs font-bold text-[#003366]/70 leading-relaxed text-justify">{a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            §8 — FINAL CTA BANNER
        ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20"
          style={{ background: '#fffbf5', borderTop: '4px solid #003366' }}>

          {/* Decorative shapes */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rotate-12 opacity-10 pointer-events-none" style={{ background: '#FF7F00', border: '4px solid #003366' }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 -rotate-12 opacity-10 pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
            <SectionLabel accent="#FF7F00">Ready?</SectionLabel>

            <h2 className="font-black text-[#003366] uppercase leading-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem,4.5vw,3.5rem)' }}>
              Your Idea Deserves{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Backing,</span>{' '}
              Not Waiting.
            </h2>

            <p className="text-sm md:text-base font-bold text-[#003366]/70 leading-relaxed text-justify max-w-2xl mx-auto mb-8">
              Thousands of Indian students have already taken the first step. The only thing standing between your idea and its impact is the decision to begin. DreamXec handles the rest — funding, mentors, community, and visibility.
            </p>

            {/* Tricolor strip */}
            <div className="flex h-1.5 max-w-xs mx-auto mb-8">
              <div className="flex-1" style={{ background: '#FF7F00' }} />
              <div className="flex-1" style={{ background: '#003366' }} />
              <div className="flex-1" style={{ background: '#0B9C2C' }} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dashboard"
                className="px-10 py-4 font-black text-sm uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#FF7F00', border: '4px solid #003366', boxShadow: '7px 7px 0 #003366' }}>
                Start Your Project →
              </a>
              <a href="/campaigns"
                className="px-10 py-4 font-black text-sm uppercase tracking-widest text-white transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#003366', border: '4px solid #003366', boxShadow: '7px 7px 0 #FF7F00' }}>
                Explore Campaigns
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default StartAProject;