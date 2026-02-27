import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const eligibleCategories = [
  { category: "STEM & Technology", icon: "🔬", items: "AI/ML applications, robotics, hardware prototypes, biotech, material science, renewable energy, IoT devices, apps, software platforms", accent: "#FF7F00" },
  { category: "Social Impact", icon: "🌍", items: "Education tech, sanitation solutions, financial inclusion tools, healthcare access innovations, community development, environmental conservation, language conservation", accent: "#0B9C2C" },
  { category: "Business & Entrepreneurship", icon: "💼", items: "B2C startups, B2B platforms, D2C brands, service businesses, franchises, marketplaces — if student-led at launch", accent: "#003366" },
  { category: "Research & Academic", icon: "📚", items: "Undergraduate research, independent studies, lab innovations, published research requiring funding, open-source tools, deep tech", accent: "#FF7F00" },
  { category: "Creative & Design", icon: "🎨", items: "Documentaries, art installations, design products, educational content, Generative AI music/media projects with social or commercial potential", accent: "#0B9C2C" },
];

const eligibilityRequirements = [
  "Team members should be part of the club and currently enrolled in an Indian college or university",
  "Project should have real impact in ideation, prototype, or early execution stage",
  "Clear problem statement and measurable solution",
  "Realistic timeline and budget",
  "Commitment to monthly updates and outcome reporting",
];

const ineligibleCategories = [
  { title: "Personal Expenses", icon: "💸", items: "Tuition fees, travel, accommodation, personal loans, wedding, car, fashion/luxury items, individual certifications" },
  { title: "Mature Businesses", icon: "🏢", items: "Companies with ₹10L+ annual revenue, established brands seeking expansion capital, debt repayment" },
  { title: "High-Risk / Unsafe Projects", icon: "⚠️", items: "Weapons, explosives, dangerous drugs, illegal activities, projects violating laws in any jurisdiction, anything that could cause physical or environmental harm" },
  { title: "Speculative Ventures", icon: "🎰", items: "Crypto trading, forex, stock market gambling, multi-level marketing (MLM)" },
  { title: "Political / Religious Projects", icon: "🚫", items: "Partisan political campaigns, sectarian religious activities — interfaith collaboration is welcome" },
  { title: "Duplicate Projects", icon: "📋", items: "If the exact concept is already fully funded on DreamXec, we may decline to avoid backer confusion" },
  { title: "Insufficient Detail", icon: "❓", items: "Projects with vague descriptions, unrealistic goals, or no clear team" },
];

const reviewProcess = [
  { step: "01", title: "Submission → Review", timeline: "24–48 hours", description: "You submit your project. Our team conducts initial screening: eligibility check, content quality review, and potential concerns flagging.", accent: "#FF7F00" },
  { step: "02", title: "Feedback & Revision", timeline: "48–72 hours", description: "If approved: project goes live immediately. If revisions needed: we provide specific feedback. You revise and resubmit — usually approved on the 2nd attempt.", accent: "#0B9C2C" },
];

const reviewChecklist = [
  "Does the project meet our eligibility criteria?",
  "Is the description clear, honest, and compelling?",
  "Is the video high-quality and authentic?",
  "Are the goals realistic and measurable?",
  "Is the team credible and diverse?",
  "Does it avoid red flags (safety, legality, ethics)?",
];

const appealProcess = "If declined, you can appeal within 7 days with additional information or project revisions. Rare declines are discussed directly with the founders by our team.";

const contentRules = [
  {
    title: "Videos", icon: "🎬", accent: "#FF7F00",
    rules: ["2–5 minutes recommended (can be shorter)", "Phone video is fine; clear audio and lighting matter more than equipment", "Show your face and team — authenticity beats production value", "Explain your problem, solution, and why you're the right team"],
  },
  {
    title: "Description", icon: "📝", accent: "#003366",
    rules: ["300–500 words ideal", "Lead with the problem statement — hook readers immediately", "Use bullet points for clarity", "Include 2–3 images of prototype/progress", "Be honest about challenges and unknowns", "End with a clear call-to-action for mentors and backers"],
  },
  {
    title: "Updates", icon: "📢", accent: "#0B9C2C",
    rules: ["Post at least bi-weekly during campaign", "Share milestones, learnings, challenges, team stories", "Respond to comments within 24 hours", "Video updates increase engagement 5×"],
  },
];

const legalItems = [
  { title: "Intellectual Property", icon: "🔒", text: "You retain full IP ownership. DreamXec has no claim on your patents, trademarks, or copyrights.", accent: "#FF7F00" },
  { title: "Funding Legality", icon: "⚖️", text: "DreamXec operates as a crowdfunding platform. Funds received are gifts/donations, not loans or equity sales. No securities laws apply to student projects at this scale.", accent: "#003366" },
  { title: "Taxes & Reporting", icon: "📊", text: "For projects raising >₹5L, consult a CA regarding income tax implications. DreamXec will provide a funding summary for your records. Individual backers should maintain donation receipts.", accent: "#0B9C2C" },
  { title: "Responsibility", icon: "🛡️", text: "You are responsible for using funds legally and ethically. DreamXec reserves the right to pause payouts if illegal activity is suspected.", accent: "#FF7F00" },
];

const FAQ = [
  { q: "Can I launch a for-profit startup?", a: "Yes! Many of our projects become profitable ventures. We welcome commercial projects as long as the student team is leading and the initial focus is on learning and impact." },
  { q: "What if my project scope changes mid-campaign?", a: "Update your backers immediately — transparent communication matters. Minor scope shifts are fine if you explain the rationale. Major pivots may confuse backers; consult our support team." },
  { q: "Can I use DreamXec funds to hire people?", a: "Yes. You can hire other students, freelancers, or contractors. Just be transparent about team composition and use funds efficiently." },
  { q: "What happens if my project fails?", a: "There is no such thing as failure in research — it's a learning on what not to do. Share a transparent post-mortem. Most backers value honesty over success. Highlight key learnings even if your hypothesis failed." },
  { q: "Can international students apply?", a: "If you're studying in India, yes. If you're studying abroad but want to fund a project in India, consult our team — handled case-by-case." },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function SectionLabel({ children, accent = '#FF7F00' }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-0 mb-4">
      <div className="w-3 h-3 flex-shrink-0" style={{ background: accent }} />
      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white"
        style={{ background: '#003366', border: '2px solid #003366' }}>{children}</div>
      <div className="w-3 h-3 flex-shrink-0" style={{ background: '#0B9C2C' }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const ProjectEligibility = () => {
  return (
    <>
      <title>Project Eligibility & Guidelines | DreamXec</title>
      <meta name="description" content="What Projects Can We Fund? Full Eligibility Guide. We support innovation in every field — from biotech to social impact. Here's what qualifies (and what doesn't)." />

      <Header />

      <main className="relative w-full overflow-x-hidden" style={{ background: '#fffbf5' }}>

        {/* ══════════════════════════════════════════
            §1 HERO
        ══════════════════════════════════════════ */}
        <section className="relative w-full pt-28 pb-20 overflow-hidden" style={{ borderBottom: '4px solid #003366' }}>
          <div className="absolute top-0 right-0 w-64 h-64 -rotate-12 opacity-[0.04] pointer-events-none" style={{ background: '#FF7F00' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rotate-6 opacity-[0.04] pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center">
            <SectionLabel>📋 Project Eligibility & Guidelines</SectionLabel>

            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#0B9C2C' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.4rem,4.5vw,3.2rem)', background: '#FF7F00', border: '4px solid #003366' }}>
                  What Projects Can
                </h1>
              </div>
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#FF7F00' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.4rem,4.5vw,3.2rem)', background: '#003366', border: '4px solid #003366' }}>
                  We Fund? Full Guide.
                </h1>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-center max-w-2xl mb-10">
              We support innovation in every field — from biotech to social impact. Here's exactly what qualifies and what doesn't.
            </p>

            {/* Quick stat pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: '5 Eligible Categories', bg: '#FF7F00' },
                { label: '7 Ineligible Types', bg: '#dc2626' },
                { label: '24–72hr Review', bg: '#0B9C2C' },
              ].map(({ label, bg }) => (
                <div key={label} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
                  style={{ background: bg, border: '2px solid #003366' }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §2 ELIGIBLE PROJECTS
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 space-y-10">
          <div className="flex flex-col items-center">
            <SectionLabel accent="#0B9C2C">✅ What We Fund</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
              Eligible{' '}
              <span className="inline-block px-2" style={{ background: '#0B9C2C', color: '#fff' }}>Project Categories</span>
            </h2>
          </div>

          {/* Carousel */}
          <div className="relative">
            <button className="swiper-elig-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-white"
              style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>←</button>
            <button className="swiper-elig-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-white"
              style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>→</button>

            <Swiper
              modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
              spaceBetween={16} slidesPerView={1} speed={800}
              navigation={{ prevEl: '.swiper-elig-prev', nextEl: '.swiper-elig-next' }}
              pagination={{ clickable: true }} keyboard={{ enabled: true }} grabCursor
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }}
              className="!pb-10 !px-10"
            >
              {eligibleCategories.map(({ category, icon, items, accent }, i) => (
                <SwiperSlide key={i} className="h-auto">
                  <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accent}` }}>
                    <div className="h-1.5" style={{ background: accent }} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                        <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-[#003366]">{category}</h3>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-[#003366]/70 leading-relaxed text-justify flex-1 px-4 py-3"
                        style={{ background: '#fffbf5', border: '2px solid #003366' }}>{items}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Eligibility Requirements */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-5">
              <SectionLabel accent="#0B9C2C">Requirements</SectionLabel>
              <h3 className="font-black text-[#003366] uppercase text-center" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.8rem)' }}>
                Eligibility Checklist
              </h3>
            </div>
            <div className="bg-white p-6 sm:p-8" style={{ border: '3px solid #003366', boxShadow: '7px 7px 0 #0B9C2C' }}>
              <div className="flex h-1.5 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6">
                <div className="flex-1" style={{ background: '#FF7F00' }} />
                <div className="flex-1" style={{ background: '#003366' }} />
                <div className="flex-1" style={{ background: '#0B9C2C' }} />
              </div>
              <ul className="space-y-3">
                {eligibilityRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                      style={{ background: '#0B9C2C', border: '2px solid #003366' }}>✓</span>
                    <span className="text-sm font-bold text-[#003366]/80 leading-relaxed text-justify">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §3 INELIGIBLE PROJECTS (dark bg)
        ══════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0 mb-4">
                <div className="w-3 h-3" style={{ background: '#FF7F00' }} />
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#003366]"
                  style={{ background: '#FF7F00' }}>❌ What We Cannot Fund</div>
                <div className="w-3 h-3" style={{ background: '#0B9C2C' }} />
              </div>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                Ineligible{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Categories</span>
              </h2>
            </div>

            <div className="relative">
              <button className="swiper-inelig-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>←</button>
              <button className="swiper-inelig-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>→</button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                spaceBetween={16} slidesPerView={1} speed={800}
                navigation={{ prevEl: '.swiper-inelig-prev', nextEl: '.swiper-inelig-next' }}
                pagination={{ clickable: true }} keyboard={{ enabled: true }} grabCursor
                autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }}
                className="!pb-10 !px-10"
              >
                {ineligibleCategories.map(({ title, icon, items }, i) => (
                  <SwiperSlide key={i} className="h-auto">
                    <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      style={{ border: '3px solid #fff', boxShadow: '5px 5px 0 #dc2626' }}>
                      <div className="h-1.5" style={{ background: '#dc2626' }} />
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                            style={{ background: '#fef2f2', border: '2px solid #dc2626' }}>{icon}</div>
                          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-[#003366]">{title}</h3>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-[#003366]/70 leading-relaxed text-justify flex-1 px-4 py-3"
                          style={{ background: '#fffbf5', border: '2px solid #dc2626' }}>{items}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §4 REVIEW & APPROVAL
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 space-y-10">
          <div className="flex flex-col items-center">
            <SectionLabel accent="#FF7F00">⏱ Process</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
              Review &{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Approval</span>
            </h2>
          </div>

          {/* Two step cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviewProcess.map(({ step, title, timeline, description, accent }) => (
              <div key={step} className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
                <div className="h-1.5" style={{ background: accent }} />
                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
                  <div className="w-10 h-10 flex items-center justify-center font-black text-xl"
                    style={{ background: accent, border: '2px solid #003366', color: '#003366' }}>{step}</div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-[#003366] leading-none">{title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: accent }}>{timeline}</p>
                  </div>
                </div>
                <p className="p-5 text-sm font-bold text-[#003366]/70 leading-relaxed text-justify flex-1">{description}</p>
              </div>
            ))}
          </div>

          {/* Golden ratio split: checklist + appeal */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-5">
            {/* Checklist */}
            <div className="bg-white" style={{ border: '3px solid #003366', boxShadow: '7px 7px 0 #0B9C2C' }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#f0fdf4' }}>
                <div className="w-8 h-8 flex items-center justify-center text-base" style={{ background: '#0B9C2C', border: '2px solid #003366', color: '#fff' }}>✓</div>
                <p className="font-black text-sm uppercase tracking-widest text-[#003366]">What We Check</p>
              </div>
              <ul className="p-5 space-y-3">
                {reviewChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                      style={{ background: '#0B9C2C', border: '2px solid #003366' }}>✓</span>
                    <span className="text-sm font-bold text-[#003366]/80 leading-snug text-justify">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Appeal */}
            <div className="bg-white" style={{ border: '3px solid #003366', boxShadow: '7px 7px 0 #FF7F00' }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#fffbeb' }}>
                <div className="w-8 h-8 flex items-center justify-center text-base" style={{ background: '#FF7F00', border: '2px solid #003366', color: '#003366' }}>⚡</div>
                <p className="font-black text-sm uppercase tracking-widest text-[#003366]">Appeal Process</p>
              </div>
              <p className="p-5 text-sm font-bold text-[#003366]/70 leading-relaxed text-justify">{appealProcess}</p>
              <div className="h-1.5 flex">
                <div className="flex-1" style={{ background: '#FF7F00' }} />
                <div className="flex-1" style={{ background: '#003366' }} />
                <div className="flex-1" style={{ background: '#0B9C2C' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §5 CONTENT RULES
        ══════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#fffbf5', borderTop: '4px solid #003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
            <div className="flex flex-col items-center">
              <SectionLabel accent="#003366">📐 Guidelines</SectionLabel>
              <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                Content{' '}
                <span className="inline-block px-2" style={{ background: '#003366', color: '#FF7F00' }}>Rules</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {contentRules.map(({ title, icon, accent, rules }) => (
                <div key={title} className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
                  <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
                    <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                    <p className="font-black text-sm uppercase tracking-widest text-[#003366]">{title}</p>
                  </div>
                  <ul className="p-5 space-y-3 flex-1">
                    {rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 mt-0.5"
                          style={{ background: accent, border: '2px solid #003366' }}>{i + 1}</span>
                        <span className="text-xs font-bold text-[#003366]/70 leading-snug text-justify">{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="h-1" style={{ background: accent }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §6 LEGAL & COMPLIANCE
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 space-y-10">
          <div className="flex flex-col items-center">
            <SectionLabel accent="#0B9C2C">⚖️ Legal</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
              Legal &{' '}
              <span className="inline-block px-2" style={{ background: '#0B9C2C', color: '#fff' }}>Compliance</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {legalItems.map(({ title, icon, text, accent }) => (
              <div key={title} className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accent}` }}>
                <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
                  <div className="w-9 h-9 flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                  <p className="font-black text-xs uppercase tracking-widest text-[#003366]">{title}</p>
                </div>
                <p className="p-5 text-sm font-bold text-[#003366]/70 leading-relaxed text-justify flex-1">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §7 FAQ (dark bg)
        ══════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0 mb-4">
                <div className="w-3 h-3" style={{ background: '#FF7F00' }} />
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#003366]"
                  style={{ background: '#FF7F00' }}>Frequently Asked Questions</div>
                <div className="w-3 h-3" style={{ background: '#0B9C2C' }} />
              </div>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                Got Questions?{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>We've Got Answers.</span>
              </h2>
            </div>

            <div className="relative">
              <button className="swiper-faq-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>←</button>
              <button className="swiper-faq-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>→</button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                spaceBetween={16} slidesPerView={1} speed={800}
                navigation={{ prevEl: '.swiper-faq-prev', nextEl: '.swiper-faq-next' }}
                pagination={{ clickable: true }} keyboard={{ enabled: true }} grabCursor
                autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }}
                className="!pb-10 !px-10"
              >
                {FAQ.map(({ q, a }, i) => {
                  const accents = ['#FF7F00', '#0B9C2C', '#FF7F00', '#0B9C2C', '#FF7F00'];
                  const accent = accents[i];
                  return (
                    <SwiperSlide key={i} className="h-auto">
                      <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        style={{ border: '3px solid #fff', boxShadow: `5px 5px 0 ${accent}` }}>
                        <div className="h-1.5" style={{ background: accent }} />
                        <div className="px-4 pt-4 pb-3" style={{ borderBottom: '2px solid #003366' }}>
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 flex-shrink-0"
                              style={{ background: accent, border: '2px solid #003366' }}>Q</span>
                            <p className="font-black text-xs uppercase tracking-tight text-[#003366] leading-snug">{q}</p>
                          </div>
                        </div>
                        <div className="px-4 py-4 flex-1">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 flex-shrink-0"
                              style={{ background: '#003366', border: '2px solid #003366' }}>A</span>
                            <p className="text-sm font-bold text-[#003366]/70 leading-relaxed text-justify">{a}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §8 FINAL CTA
        ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20" style={{ background: '#fffbf5', borderTop: '4px solid #003366' }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rotate-12 opacity-10 pointer-events-none" style={{ background: '#FF7F00', border: '4px solid #003366' }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 -rotate-12 opacity-10 pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
            <SectionLabel>🚀 Ready to Apply?</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase leading-tight mb-4"
              style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>
              Your Project{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Belongs Here.</span>
            </h2>
            <p className="text-sm font-bold text-[#003366]/70 leading-relaxed text-justify max-w-xl mx-auto mb-8">
              If your project meets the eligibility criteria above, you're ready to apply. DreamXec handles the community, funding infrastructure, and mentorship — you handle the execution and impact.
            </p>
            <div className="flex h-1.5 max-w-xs mx-auto mb-8">
              <div className="flex-1" style={{ background: '#FF7F00' }} />
              <div className="flex-1" style={{ background: '#003366' }} />
              <div className="flex-1" style={{ background: '#0B9C2C' }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dashboard"
                className="px-10 py-4 font-black text-sm uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#FF7F00', border: '4px solid #003366', boxShadow: '7px 7px 0 #003366' }}>
                🚀 Submit Your Project →
              </a>
              
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default ProjectEligibility;