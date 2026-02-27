import { Header } from '../../Header'
import { FooterContent } from '../../Footer/components/FooterContent'
import useScrollReveal from '../../../hooks/useScrollReveal'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const steps = [
  { num: "01", icon: "🔍", accent: "#FF7F00", title: "Discover & Research",           text: "Browse projects by category, theme, or creator. Read the project description, watch the team's video, check creator credentials. Read backer comments and mentor feedback — brutal honesty helps. Use the \"Follow\" button if you want to track progress without committing yet." },
  { num: "02", icon: "💸", accent: "#003366", title: "Pledge Your Support",            text: "Choose your pledge amount (₹100 to ₹1L+). Review what you're supporting: the specific milestone or outcome you're backing. Confirm your contact info. Add an optional note to the creator — many backers share personal stories that mean a lot to young teams." },
  { num: "03", icon: "🔒", accent: "#0B9C2C", title: "Secure Payment & Confirmation", text: "Pay via UPI, card, or wallet (Razorpay integration). Your pledge is confirmed. You receive a receipt. The project team is notified. You join a community of supporters on that project's backer page. Now watch as the team executes with mentors' guidance." },
  { num: "04", icon: "📈", accent: "#FF7F00", title: "Track Progress & Impact",        text: "Receive bi-weekly updates from the team via email. See project progress, challenges overcome, milestones hit. Once complete, receive a final report: what they built, what they learned, what impact they created, and what's next — job placement, patent filing, startup launch." },
];

const budgetBreakdown = [
  { category: "Materials & Supplies",       amount: "30–40%", description: "Components, lab materials, equipment rentals",                     accent: "#FF7F00", icon: "🧪" },
  { category: "Team Stipends",              amount: "20–30%", description: "If students need to take time off internships or part-time jobs",   accent: "#003366", icon: "👥" },
  { category: "Mentorship Support",         amount: "5–10%",  description: "Specialized mentors or consultants for domain expertise",           accent: "#0B9C2C", icon: "🎓" },
  { category: "Manufacturing / Production", amount: "15–25%", description: "Prototype to small-scale production costs",                         accent: "#FF7F00", icon: "⚙️" },
  { category: "Platform & Legal",           amount: "5%",     description: "DreamXec fees, compliance, insurance",                              accent: "#003366", icon: "📋" },
];

const impactMetrics = [
  { icon: "🎯", title: "Career Outcomes",  accent: "#FF7F00", description: "Jobs secured, internships landed, and higher education admissions directly linked to project experience.", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"  },
  { icon: "💡", title: "Innovation Impact",accent: "#003366", description: "Patents filed, research published in journals, and startups launched from student-led DreamXec projects.",   vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg"  },
  { icon: "🌍", title: "Social Impact",    accent: "#0B9C2C", description: "Communities directly helped, social problems quantifiably solved, and grassroots change measured.",           vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"  },
  { icon: "📚", title: "Learning Gains",   accent: "#FF7F00", description: "New skills acquired, confidence built, and measurable personal and professional growth documented.",          vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg" },
];

const FAQ = [
  { icon: "💰", q: "What's the minimum pledge amount?",       a: "₹100. Small amounts collectively create big impact — every rupee counts toward a student's breakthrough.",           accent: "#FF7F00" },
  { icon: "🔄", q: "Can I change my pledge or get a refund?", a: "No. Since this is a donation, refunds are not possible once confirmed. Please review carefully before pledging.",      accent: "#0B9C2C" },
  { icon: "⚠️", q: "What if a project fails?",               a: "Research can fail — it's part of the process. If misuse is suspected, DreamXec investigates and takes strict action.", accent: "#FF7F00" },
  { icon: "👤", q: "Can I contribute anonymously?",           a: "Yes. Simply enable the Anonymous Backer option during checkout — your name won't be shown publicly.",                 accent: "#0B9C2C" },
  { icon: "🏆", q: "How often do projects succeed?",          a: "Success includes learning, iteration, and measurable outcomes — not just a polished final product.",                  accent: "#FF7F00" },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function SectionLabel({ children, accent = '#FF7F00', dark = false }: { children: React.ReactNode; accent?: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-0 mb-4">
      <div className="w-3 h-3 flex-shrink-0" style={{ background: accent }} />
      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]"
        style={{ background: dark ? '#FF7F00' : '#003366', color: dark ? '#003366' : '#fff', border: `2px solid ${dark ? '#FF7F00' : '#003366'}` }}>
        {children}
      </div>
      <div className="w-3 h-3 flex-shrink-0" style={{ background: '#0B9C2C' }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const HowItWorksDonors = () => {

  const heroReveal   = useScrollReveal()
  const stepsReveal  = useScrollReveal()
  const budgetReveal = useScrollReveal()
  const impactReveal = useScrollReveal()
  const faqReveal    = useScrollReveal()

  return (
    <>
      {/* ── Scroll-reveal CSS injected once ── */}
      <style>{`
        .sr-fade  { opacity:0; transform:translateY(36px);  transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1); }
        .sr-left  { opacity:0; transform:translateX(-48px); transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1); }
        .sr-scale { opacity:0; transform:scale(.88);        transition:opacity .45s cubic-bezier(.16,1,.3,1),transform .45s cubic-bezier(.16,1,.3,1); }
        .sr-fade.sr-visible,.sr-left.sr-visible,.sr-scale.sr-visible { opacity:1; transform:none; }

        .sr-stagger > * { opacity:0; transform:translateY(28px); transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
        .sr-stagger.sr-visible > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
        .sr-stagger.sr-visible > *:nth-child(2){opacity:1;transform:none;transition-delay:.15s}
        .sr-stagger.sr-visible > *:nth-child(3){opacity:1;transform:none;transition-delay:.25s}
        .sr-stagger.sr-visible > *:nth-child(4){opacity:1;transform:none;transition-delay:.35s}
        .sr-stagger.sr-visible > *:nth-child(5){opacity:1;transform:none;transition-delay:.45s}
      `}</style>

      <title>How It Works for Donors | DreamXec</title>
      <meta name="description" content="Support innovation in 4 simple steps. See how DreamXec turns donations into real-world impact." />

      <Header />

      <main className="relative w-full overflow-x-hidden" style={{ background: '#fffbf5' }}>

        {/* ══════════════════════════════════════
            §1  HERO
        ══════════════════════════════════════ */}
        <section className="relative w-full pt-28 pb-20 overflow-hidden" style={{ borderBottom: '4px solid #003366' }}>
          {/* BG shapes */}
          <div className="absolute top-0 right-0 w-72 h-72 -rotate-12 opacity-[0.04] pointer-events-none" style={{ background: '#FF7F00' }} />
          <div className="absolute bottom-0 left-0 w-56 h-56 rotate-6 opacity-[0.04] pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div ref={heroReveal.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center text-center sr-fade ${heroReveal.isVisible ? 'sr-visible' : ''}`}>

            <SectionLabel>💛 How It Works — Donors</SectionLabel>

            {/* Stamped headline */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#0B9C2C' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.4rem,4.5vw,3.4rem)', background: '#FF7F00', border: '4px solid #003366' }}>
                  Support Innovation
                </h1>
              </div>
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#FF7F00' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.4rem,4.5vw,3.4rem)', background: '#003366', border: '4px solid #003366' }}>
                  in 4 Simple Steps
                </h1>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl font-bold text-[#003366]/70 leading-relaxed max-w-2xl mb-10">
              From discovering a project to seeing real-world impact — here's exactly how DreamXec works for donors.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Min. Pledge ₹100', bg: '#FF7F00' },
                { label: 'Escrow-Protected', bg: '#0B9C2C' },
                { label: 'Bi-Weekly Updates', bg: '#003366' },
                { label: 'Anonymous Option', bg: '#FF7F00' },
              ].map(({ label, bg }) => (
                <div key={label} className="px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white"
                  style={{ background: bg, border: '2px solid #003366' }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            §2  FUNDING FLOW — vertical timeline
        ══════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-20">

          {/* Section heading fades in */}
          <div ref={stepsReveal.ref}
            className={`flex flex-col items-center mb-12 sr-fade ${stepsReveal.isVisible ? 'sr-visible' : ''}`}>
            <SectionLabel accent="#FF7F00">🗺 Funding Flow</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
              Your Journey{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>as a Donor</span>
            </h2>
          </div>

          {/* Timeline spine + stagger cards */}
          <div className="relative">
            <div className="absolute left-8 sm:left-10 top-10 bottom-10 w-0.5 pointer-events-none"
              style={{ background: '#003366', opacity: 0.12 }} />

            <div className={`space-y-0 sr-stagger ${stepsReveal.isVisible ? 'sr-visible' : ''}`}>
              {steps.map(({ num, icon, accent, title, text }) => (
                <div key={num} className="relative flex gap-5 sm:gap-8 pb-5">

                  {/* Step badge */}
                  <div className="flex-shrink-0 z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center"
                      style={{ background: accent, border: '4px solid #003366', boxShadow: '4px 4px 0 #003366' }}>
                      <span className="text-2xl leading-none">{icon}</span>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest mt-0.5">{num}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white mb-5 transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accent}` }}>
                    <div className="px-5 py-3" style={{ borderBottom: '3px solid #003366', background: '#fffbf5' }}>
                      <h3 className="font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-[#003366]">{title}</h3>
                    </div>
                    <p className="px-5 py-4 text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-justify">{text}</p>
                    <div className="h-1.5" style={{ background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            §3  BUDGET TRANSPARENCY  (dark)
        ══════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12">

            <div ref={budgetReveal.ref}
              className={`flex flex-col items-center mb-12 sr-fade ${budgetReveal.isVisible ? 'sr-visible' : ''}`}>
              <SectionLabel dark>📊 Transparency</SectionLabel>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                Where Does Your{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Money Go?</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base font-bold text-orange-200 text-center max-w-xl">
                Every project must specify this breakdown before going live. No vague allocations.
              </p>
            </div>

            {/* Staggered budget rows */}
            <div className={`space-y-4 sr-stagger ${budgetReveal.isVisible ? 'sr-visible' : ''}`}>
              {budgetBreakdown.map(({ category, amount, description, accent, icon }) => (
                <div key={category}
                  className="bg-white flex flex-col sm:flex-row items-stretch transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ border: '3px solid #fff', boxShadow: `5px 5px 0 ${accent}` }}>
                  {/* Icon column */}
                  <div className="flex-shrink-0 flex items-center justify-center w-full sm:w-20 py-4 sm:py-0"
                    style={{ background: accent, borderRight: '3px solid #003366' }}>
                    <span className="text-2xl">{icon}</span>
                  </div>
                  {/* Text */}
                  <div className="flex-1 px-5 py-4">
                    <p className="font-black text-sm sm:text-base uppercase tracking-tight text-[#003366]">{category}</p>
                    <p className="text-xs sm:text-sm font-bold text-[#003366]/60 mt-0.5">{description}</p>
                  </div>
                  {/* Amount */}
                  <div className="flex items-center justify-center px-6 py-4 flex-shrink-0"
                    style={{ borderLeft: '3px solid #003366', background: '#fffbf5', minWidth: '110px' }}>
                    <span className="font-black text-lg sm:text-xl md:text-2xl text-[#003366]">{amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            §4  IMPACT TRACKING
        ══════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20">

          <div ref={impactReveal.ref}
            className={`flex flex-col items-center mb-12 sr-fade ${impactReveal.isVisible ? 'sr-visible' : ''}`}>
            <SectionLabel accent="#0B9C2C">📈 Impact</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
              How We Measure{' '}
              <span className="inline-block px-2" style={{ background: '#0B9C2C', color: '#fff' }}>Your Impact</span>
            </h2>
          </div>

          {/* Carousel scales in */}
          <div className={`sr-scale ${impactReveal.isVisible ? 'sr-visible' : ''}`}>
            <div className="relative">
              <button className="swiper-impact-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-white"
                style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>←</button>
              <button className="swiper-impact-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-white"
                style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>→</button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                spaceBetween={16} slidesPerView={1} speed={800}
                navigation={{ prevEl: '.swiper-impact-prev', nextEl: '.swiper-impact-next' }}
                pagination={{ clickable: true }} keyboard={{ enabled: true }} grabCursor
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 16 } }}
                className="!pb-10 !px-10"
              >
                {impactMetrics.map(({ icon, title, accent, description, vector }) => (
                  <SwiperSlide key={title} className="h-auto">
                    <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                      style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
                      <div className="h-1.5" style={{ background: accent }} />
                      <div className="flex items-center gap-4 px-5 py-4"
                        style={{ borderBottom: '2px solid #003366', background: '#fffbf5' }}>
                        <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                        <h4 className="font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-[#003366]">{title}</h4>
                        <img src={vector} alt="" className="w-10 h-10 opacity-25 ml-auto flex-shrink-0 hidden sm:block" />
                      </div>
                      <p className="px-5 py-5 text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-justify flex-1">{description}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            §5  FAQ  (dark)
        ══════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            {/* Heading slides in from left */}
            <div ref={faqReveal.ref}
              className={`flex flex-col items-center mb-12 sr-left ${faqReveal.isVisible ? 'sr-visible' : ''}`}>
              <SectionLabel dark>❓ FAQ</SectionLabel>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                Common Questions{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Answered</span>
              </h2>
            </div>

            {/* Carousel scales in with slight delay */}
            <div className={`sr-scale ${faqReveal.isVisible ? 'sr-visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
              <div className="relative">
                <button className="swiper-faq-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-[#003366]"
                  style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '3px 3px 0 #fff' }}>←</button>
                <button className="swiper-faq-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-[#003366]"
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
                  {FAQ.map(({ icon, q, a, accent }, i) => (
                    <SwiperSlide key={i} className="h-auto">
                      <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        style={{ border: '3px solid #fff', boxShadow: `5px 5px 0 ${accent}` }}>
                        <div className="h-1.5" style={{ background: accent }} />
                        {/* Q row */}
                        <div className="px-4 pt-4 pb-3" style={{ borderBottom: '2px solid #003366' }}>
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 flex-shrink-0"
                              style={{ background: accent, border: '2px solid #003366' }}>Q</span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg flex-shrink-0">{icon}</span>
                              <p className="font-black text-xs sm:text-sm uppercase tracking-tight text-[#003366] leading-snug">{q}</p>
                            </div>
                          </div>
                        </div>
                        {/* A row */}
                        <div className="px-4 py-4 flex-1">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 flex-shrink-0"
                              style={{ background: '#003366', border: '2px solid #003366' }}>A</span>
                            <p className="text-sm sm:text-base font-bold text-[#003366]/70 leading-relaxed text-justify">{a}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            §6  FINAL CTA
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20" style={{ background: '#fffbf5', borderTop: '4px solid #003366' }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rotate-12 opacity-10 pointer-events-none" style={{ background: '#FF7F00', border: '4px solid #003366' }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 -rotate-12 opacity-10 pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
            <SectionLabel>🚀 Ready to Fund?</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase leading-tight mb-4"
              style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>
              Back a Student.{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Change a Life.</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-justify max-w-xl mx-auto mb-8">
              The best time to back an innovator is before the world knows their name. DreamXec gives you first access to India's brightest student projects — starting at just ₹100.
            </p>
            <div className="flex h-1.5 max-w-xs mx-auto mb-8">
              <div className="flex-1" style={{ background: '#FF7F00' }} />
              <div className="flex-1" style={{ background: '#003366' }} />
              <div className="flex-1" style={{ background: '#0B9C2C' }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/campaigns"
                className="px-10 py-4 font-black text-sm sm:text-base uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#FF7F00', border: '4px solid #003366', boxShadow: '7px 7px 0 #003366' }}>
                Browse Projects →
              </a>
              <a href="/about"
                className="px-10 py-4 font-black text-sm sm:text-base uppercase tracking-widest text-white transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#003366', border: '4px solid #003366', boxShadow: '7px 7px 0 #FF7F00' }}>
                Learn About DreamXec
              </a>
            </div>
          </div>
        </section>

      </main>

      <FooterContent />
    </>
  );
};

export default HowItWorksDonors;