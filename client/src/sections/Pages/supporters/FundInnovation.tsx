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
const discoverMethods = [
  { icon: "📂", title: "Browse by Category", accent: "#FF7F00", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg", description: "AI/ML, Robotics, Biotech, Social Impact, Education Tech, Healthcare, Environment, Arts & Design, and many more fields waiting to be explored." },
  { icon: "🔍", title: "Search by Keywords", accent: "#003366", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg", description: "Looking for \"water conservation\" or \"mental health innovations\"? Our search surfaces projects aligned with exactly what you care about." },
  { icon: "⚙️", title: "Filter by Stage", accent: "#0B9C2C", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg", description: "Ideation (earliest stage), Prototype (proof of concept), Execution (ready to launch). Choose the risk level you're comfortable backing." },
  { icon: "❤️", title: "Follow Favorite Creators", accent: "#FF7F00", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg", description: "Love a team's previous project? Follow them. You'll be notified the moment they launch their next big idea on DreamXec." },
  { icon: "📚", title: "Browse Collections", accent: "#003366", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg", description: "\"Women-Led Innovations,\" \"Social Impact,\" \"Climate Tech\" — curated collections based on impact theme or creator background." },
];

const trustPoints = [
  { icon: "🔒", title: "Your Money is Safe", accent: "#0B9C2C", description: "Funds are held in escrow until the project achieves 100% of its goal or reaches its end date. Disbursements are made strictly as per the milestones specified at the time of project listing." },
  { icon: "📊", title: "You Know Where Your Money Goes", accent: "#FF7F00", description: "Every project specifies exactly how funds will be used — materials %, team stipends %, lab rentals %, and more. No hidden fees, no vague allocations." },
  { icon: "📡", title: "You See Progress", accent: "#003366", description: "Creators post mandatory bi-weekly updates. You see the project evolving, challenges being solved, and outcomes being delivered. No radio silence — ever." },
  { icon: "🤝", title: "No Equity. No Complications.", accent: "#0B9C2C", description: "Your contribution is a gift/donation. You don't own the project, and they don't owe you anything beyond delivery of promised outcomes — documented updates and a final report." },
  { icon: "🛡️", title: "Open Feedback Loop", accent: "#FF7F00", description: "If a project misuses funds or stops updating, report it. Our team investigates every case. Repeat offenders are removed from the platform with no exceptions." },
];

/* ─────────────────────────────────────────
   SECTION LABEL
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
const FundInnovation = () => {
  return (
    <>
      <title>Fund Innovation | DreamXec</title>
      <meta name="description" content="Your Support Powers India's Next Generation of Innovators. Discover projects transforming ideas into impact. Fund the innovations you believe in." />

      <Header />

      <main className="relative w-full overflow-x-hidden" style={{ background: '#fffbf5' }}>

        {/* ══════════════════════════════════════════
            §1 HERO
        ══════════════════════════════════════════ */}
        <section className="relative w-full pt-28 pb-20 overflow-hidden" style={{ borderBottom: '4px solid #003366' }}>
          <div className="absolute top-0 right-0 w-72 h-72 -rotate-12 opacity-[0.04] pointer-events-none" style={{ background: '#FF7F00' }} />
          <div className="absolute bottom-0 left-0 w-56 h-56 rotate-6 opacity-[0.04] pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center text-center">
            <SectionLabel>💛 Fund Innovation</SectionLabel>

            {/* Headline slabs */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#0B9C2C' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.4rem,4.5vw,3.4rem)', background: '#FF7F00', border: '4px solid #003366' }}>
                  Your Support Powers
                </h1>
              </div>
              <div className="relative inline-block">
                <div className="absolute inset-0 translate-x-[7px] translate-y-[7px]" style={{ background: '#FF7F00' }} aria-hidden />
                <h1 className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                  style={{ fontSize: 'clamp(1.4rem,4.5vw,3.4rem)', background: '#003366', border: '4px solid #003366' }}>
                  India's Next Innovators
                </h1>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl font-bold text-[#003366]/70 leading-relaxed max-w-2xl mb-10">
              Discover projects transforming ideas into impact. Fund the innovations you believe in.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: '1.4B Indians Can Support', bg: '#FF7F00' },
                { label: 'Escrow-Protected Funds', bg: '#0B9C2C' },
                { label: 'Bi-Weekly Progress Updates', bg: '#003366' },
              ].map(({ label, bg }) => (
                <div key={label} className="px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white"
                  style={{ background: bg, border: '2px solid #003366' }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §2 INTRO — full-bleed quote card
        ══════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12">

            {/* Big quote card */}
            <div className="relative bg-white p-8 sm:p-12"
              style={{ border: '4px solid #fff', boxShadow: '10px 10px 0 #FF7F00' }}>

              {/* Opening quote mark */}
              <div className="absolute -top-5 -left-4 font-black text-6xl sm:text-8xl leading-none select-none"
                style={{ color: '#FF7F00' }}>"</div>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#003366] leading-relaxed text-justify">
                Every great innovation starts as a student's dream in a dorm room, hostel, or family home. DreamXec connects those dreamers with supporters like you — people who believe in potential <span className="font-black text-[#003366]">before the world knows about it.</span>
              </p>

              <div className="flex h-1.5 mt-8 mb-6">
                <div className="flex-1" style={{ background: '#FF7F00' }} />
                <div className="flex-1" style={{ background: '#003366' }} />
                <div className="flex-1" style={{ background: '#0B9C2C' }} />
              </div>

              <p className="text-base sm:text-lg md:text-xl font-bold text-[#003366]/70 leading-relaxed text-justify">
                When you fund a project on DreamXec, you're not just giving money. You're giving belief, validation, and a platform for a student to change their trajectory. Join <span className="font-black text-[#FF7F00]">1.4 Billion Indians</span> in supporting India's leap into the future.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §3 HOW TO DISCOVER PROJECTS — carousel
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 space-y-10">
          <div className="flex flex-col items-center">
            <SectionLabel accent="#FF7F00">🔍 Discovery</SectionLabel>
            <h2 className="font-black text-[#003366] uppercase text-center leading-tight"
              style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
              How to{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Discover Projects</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base font-bold text-[#003366]/60 text-center max-w-xl">
              Five ways to find the student innovation that speaks to your values.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <button className="swiper-disc-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-white"
              style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>←</button>
            <button className="swiper-disc-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-white"
              style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>→</button>

            <Swiper
              modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
              spaceBetween={16} slidesPerView={1} speed={800}
              navigation={{ prevEl: '.swiper-disc-prev', nextEl: '.swiper-disc-next' }}
              pagination={{ clickable: true }} keyboard={{ enabled: true }} grabCursor
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }}
              className="!pb-10 !px-10"
            >
              {discoverMethods.map(({ icon, title, accent, vector, description }, i) => (
                <SwiperSlide key={i} className="h-auto">
                  <div className="h-full bg-white flex flex-col transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                    style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
                    {/* Top accent bar */}
                    <div className="h-1.5" style={{ background: accent }} />

                    {/* Illustration */}
                    <div className="flex justify-center pt-6 pb-2 px-6">
                      <img src={vector} alt="" className="w-20 h-20 opacity-40" />
                    </div>

                    {/* Header */}
                    <div className="px-5 pb-3 flex items-center gap-3" style={{ borderBottom: '2px solid #003366' }}>
                      <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: accent, border: '2px solid #003366' }}>{icon}</div>
                      <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-[#003366] leading-tight">{title}</h3>
                    </div>

                    {/* Description */}
                    <p className="px-5 py-4 text-sm sm:text-base font-bold text-[#003366]/70 leading-relaxed text-justify flex-1">
                      {description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §4 TRUST & TRANSPARENCY
            Golden ratio: alternating full-width cards
        ══════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#003366', borderTop: '4px solid #003366', borderBottom: '4px solid #003366' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0 mb-4">
                <div className="w-3 h-3" style={{ background: '#FF7F00' }} />
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#003366]"
                  style={{ background: '#FF7F00' }}>🔒 Trust & Transparency</div>
                <div className="w-3 h-3" style={{ background: '#0B9C2C' }} />
              </div>
              <h2 className="font-black text-white uppercase text-center leading-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)' }}>
                Why Donors{' '}
                <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>Trust DreamXec</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base font-bold text-orange-200 text-center max-w-xl">
                Five non-negotiable promises we make to every donor on the platform.
              </p>
            </div>

            {/* Trust cards — full-width stacked with alternating accent layout */}
            <div className="space-y-5">
              {trustPoints.map(({ icon, title, accent, description }, i) => (
                <div key={i}
                  className="bg-white flex flex-col sm:flex-row items-stretch transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                  style={{ border: '3px solid #fff', boxShadow: `7px 7px 0 ${accent}` }}>

                  {/* Icon column */}
                  <div className="flex-shrink-0 flex items-center justify-center sm:w-24 p-5 sm:p-0"
                    style={{ background: accent, borderRight: '3px solid #003366', borderBottom: 'none' }}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl sm:text-3xl">{icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white sm:text-[8px] hidden sm:block text-center leading-tight px-1"
                        style={{ opacity: 0.8 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Text column */}
                  <div className="flex-1 p-6 sm:p-8">
                    <h3 className="font-black text-base sm:text-lg md:text-xl uppercase tracking-tight text-[#003366] mb-3"
                      style={{ borderLeft: `4px solid ${accent}`, paddingLeft: '12px' }}>
                      {title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-justify">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            §5 FINAL CTA
        ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20" style={{ background: '#fffbf5', borderTop: '4px solid #003366' }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rotate-12 opacity-10 pointer-events-none" style={{ background: '#FF7F00', border: '4px solid #003366' }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 -rotate-12 opacity-10 pointer-events-none" style={{ background: '#0B9C2C' }} />

          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
            <SectionLabel>🚀 Start Funding</SectionLabel>

            <h2 className="font-black text-[#003366] uppercase leading-tight mb-4"
              style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>
              Be the Reason a{' '}
              <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>
                Dream Takes Off.
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed text-justify max-w-xl mx-auto mb-8">
              Every student project you back today becomes a proof point for what India's next generation can achieve. The most impactful projects don't wait for VCs — they need believers like you.
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
                🔍 Discover Projects →
              </a>
              <a href="/success-stories"
                className="px-10 py-4 font-black text-sm sm:text-base uppercase tracking-widest text-white transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{ background: '#003366', border: '4px solid #003366', boxShadow: '7px 7px 0 #FF7F00' }}>
                See Impact Created
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default FundInnovation;