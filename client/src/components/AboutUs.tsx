import { useNavigate } from 'react-router-dom';
import { FooterContent } from '../sections/Footer/components/FooterContent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CORE_VALUES = [
  {
    emoji: '🌱',
    title: 'Belief in Potential',
    body: 'We see possibility in every student idea—regardless of background, college, or connections.',
    accent: '#FF7F00',
  },
  {
    emoji: '🤝',
    title: 'Community Over Competition',
    body: 'Students, mentors, and backers grow together—collaboration beats rivalry.',
    accent: '#0B9C2C',
  },
  {
    emoji: '🚀',
    title: 'Impact First',
    body: 'Success is measured by real outcomes—careers built, startups launched, and problems solved.',
    accent: '#003366',
  },
];

const STATS = [
  { value: '40M+', label: 'College Students in India' },
  { value: '5M+', label: 'Actively Innovating' },
  { value: '0.1%', label: 'Receive Meaningful Funding' },
  { value: '2030', label: 'Target: 1M Students Funded' },
];

const AboutUs = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  return (
    <div className="min-h-screen pt-20" style={{ background: '#fffbf5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* ══════════════════════════════════
            HERO
        ══════════════════════════════════ */}
        <div className="text-center relative">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-4 w-10 h-10 rotate-12 opacity-20 pointer-events-none"
            style={{ border: '4px solid #FF7F00' }} />
          <div className="absolute top-8 right-6 w-7 h-7 rotate-45 opacity-20 pointer-events-none"
            style={{ background: '#0B9C2C' }} />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.25em] text-white"
            style={{ background: '#003366', border: '2px solid #003366' }}>
            🇮🇳 DreamXec — Student Innovation Platform
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-[#003366] uppercase leading-none tracking-tight mb-6 mx-auto max-w-4xl"
          >
            Research Karega India{' '}
            <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>
              Toh Badhega India
            </span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed">
              DreamXec is India's student innovation crowdfunding platform.
            </p>
            <p className="text-base md:text-lg font-bold text-[#003366]/70 leading-relaxed">
              We fund ideas, connect mentors, and help students turn research and curiosity into real-world impact.
            </p>
          </div>

          {/* Tricolor strip */}
          <div className="flex h-1.5 max-w-xs mx-auto mt-8">
            <div className="flex-1" style={{ background: '#FF7F00' }} />
            <div className="flex-1" style={{ background: '#003366' }} />
            <div className="flex-1" style={{ background: '#0B9C2C' }} />
          </div>
        </div>

        {/* ══════════════════════════════════
            MISSION & VISION
        ══════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            {/* Section label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[10px] font-black uppercase tracking-widest text-white"
              style={{ background: '#FF7F00', border: '2px solid #003366' }}>
              Our Mission & Vision
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#003366] uppercase tracking-tight leading-tight mb-6">
              Democratizing Access to{' '}
              <span className="inline-block px-1" style={{ background: '#0B9C2C', color: '#fff' }}>
                Opportunity
              </span>
            </h2>

            <div
              className="space-y-4 p-5"
              style={{ background: '#fff', border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
            >
              <p className="text-sm font-bold text-[#003366]/80 leading-relaxed text-justify">
                Our mission is to democratize access to funding and mentorship for student innovators across India.
                We believe that great ideas are not limited by college rankings, cities, or personal networks.
                Talent exists everywhere—opportunity does not.
              </p>
              <div className="h-px" style={{ background: '#FF7F00', opacity: 0.4 }} />
              <p className="text-sm font-bold text-[#003366]/80 leading-relaxed text-justify">
                By 2030, DreamXec aims to enable over one million Indian students to launch, fund,
                and execute innovation projects—building startups, creating jobs, filing patents,
                and solving real problems.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div
              className="absolute -inset-3 pointer-events-none"
              style={{ background: 'rgba(255,127,0,0.12)', border: '3px dashed #FF7F00' }}
            />
            <img
              src="https://res.cloudinary.com/dvqeeun29/image/upload/v1768358391/ChatGPT_Image_Jan_14_2026_08_08_19_AM_vw2ip1.png"
              alt="Students collaborating"
              className="relative w-full h-auto object-cover"
              style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #0B9C2C' }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════
            STATS — PROBLEM STATEMENT
        ══════════════════════════════════ */}
        <div>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-white"
              style={{ background: '#003366', border: '2px solid #003366' }}>
              The Gap We're Closing
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#003366] uppercase tracking-tight mb-4">
              India's Student{' '}
              <span className="inline-block px-1" style={{ background: '#FF7F00', color: '#003366' }}>
                Innovation Gap
              </span>
            </h2>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STATS.map(({ value, label }, i) => {
              const accents = ['#FF7F00', '#0B9C2C', '#003366', '#FF7F00'];
              return (
                <div
                  key={label}
                  className="bg-white flex flex-col items-center justify-center text-center p-5 transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accents[i]}` }}
                >
                  <p className="text-3xl md:text-4xl font-black text-[#003366] leading-none mb-1">{value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50">{label}</p>
                </div>
              );
            })}
          </div>

          {/* Text block */}
          <div
            className="p-6 bg-white max-w-4xl mx-auto"
            style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
          >
            <p className="text-sm font-bold text-[#003366]/80 leading-relaxed mb-3 text-center">
              Traditional banks consider student projects too risky. Venture capital focuses only on large-ticket
              opportunities. Mentorship remains gatekept by networks rather than merit.
            </p>
            <div className="flex h-1 mb-3 max-w-xs mx-auto">
              <div className="flex-1" style={{ background: '#FF7F00' }} />
              <div className="flex-1" style={{ background: '#003366' }} />
              <div className="flex-1" style={{ background: '#0B9C2C' }} />
            </div>
            <p className="text-sm font-bold text-[#003366]/80 leading-relaxed text-center">
              Global platforms are expensive and not built for Indian students. The ideas exist.
              The students exist. What's missing is the right platform. <strong className="text-[#003366]">DreamXec exists to close this gap.</strong>
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════
            CORE VALUES CAROUSEL
        ══════════════════════════════════ */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-white"
              style={{ background: '#0B9C2C', border: '2px solid #003366' }}>
              What We Stand For
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#003366] uppercase tracking-tight">
              Our Core{' '}
              <span className="inline-block px-1" style={{ background: '#0B9C2C', color: '#fff' }}>
                Values
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Custom nav */}
            <button
              className="swiper-values-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-white transition-all hover:translate-x-[-2px]"
              style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
            >←</button>
            <button
              className="swiper-values-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-white transition-all hover:translate-x-[2px]"
              style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
            >→</button>

            <Swiper
              modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              speed={800}
              navigation={{ prevEl: '.swiper-values-prev', nextEl: '.swiper-values-next' }}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              grabCursor={true}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
              className="about-values-carousel !pb-10 !px-10"
            >
              {CORE_VALUES.map(({ emoji, title, body, accent }) => (
                <SwiperSlide key={title} className="h-auto">
                  <div
                    className="bg-white flex flex-col h-full p-5 transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                    style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}
                  >
                    {/* Top accent bar */}
                    <div className="h-1.5 -mx-5 -mt-5 mb-5 flex">
                      <div className="flex-1" style={{ background: accent }} />
                    </div>

                    <div
                      className="w-10 h-10 flex items-center justify-center text-xl mb-4 flex-shrink-0"
                      style={{ background: `${accent}22`, border: `2px solid ${accent}` }}
                    >
                      {emoji}
                    </div>

                    <h3 className="font-black text-sm text-[#003366] uppercase tracking-tight mb-3"
                      style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '8px' }}>
                      {title}
                    </h3>

                    <p className="text-xs font-bold text-[#003366]/70 leading-relaxed mt-auto px-3 py-2"
                      style={{ background: '#fffbf5', border: '2px solid #003366' }}>
                      {body}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ══════════════════════════════════
            HOW WE'RE DIFFERENT
        ══════════════════════════════════ */}
        <div
          className="p-6 md:p-10"
          style={{ background: '#fff', border: '3px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-white"
                style={{ background: '#FF7F00', border: '2px solid #003366' }}>
                Why DreamXec
              </div>
              <h2 className="text-3xl font-black text-[#003366] uppercase tracking-tight leading-tight">
                How We're{' '}
                <span className="inline-block px-1" style={{ background: '#003366', color: '#FF7F00' }}>
                  Different
                </span>
              </h2>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '₹', label: 'Low pledges from ₹100' },
                { icon: '🎓', label: 'Built-in mentorship during campaigns' },
                { icon: '🇮🇳', label: 'India-specific payments & language support' },
                { icon: '🔍', label: 'Transparent governance with fair fees' },
                { icon: '📈', label: 'Long-term outcome tracking, not vanity metrics' },
                { icon: '🌐', label: 'Student-first, not investor-first' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-3 py-2"
                  style={{ border: '2px solid #003366', background: '#fffbf5' }}>
                  <div className="w-8 h-8 flex items-center justify-center text-base flex-shrink-0 font-black"
                    style={{ background: '#FF7F00', border: '2px solid #003366', color: '#003366' }}>
                    {icon}
                  </div>
                  <p className="text-xs font-black text-[#003366] uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            CTA
        ══════════════════════════════════ */}
        <div
          className="text-center relative overflow-hidden p-10 md:p-14"
          style={{ background: '#003366', border: '4px solid #FF7F00', boxShadow: '8px 8px 0 #FF7F00' }}
        >
          {/* Decorative shapes */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rotate-12 opacity-10 pointer-events-none"
            style={{ background: '#FF7F00', border: '4px solid #fff' }} />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rotate-45 opacity-10 pointer-events-none"
            style={{ background: '#0B9C2C' }} />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#003366]"
            style={{ background: '#FF7F00', border: '2px solid #fff' }}>
            Join the Revolution
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-none">
            Ready to{' '}
            <span className="inline-block px-2" style={{ background: '#FF7F00', color: '#003366' }}>
              Change India?
            </span>
          </h2>

          <p className="text-sm font-bold text-orange-200 mb-8 max-w-xl mx-auto leading-relaxed">
            Whether you're a student with a dream or a supporter who believes in the power of youth,
            there's a place for you here.
          </p>

          {/* Tricolor strip */}
          <div className="flex h-1 max-w-xs mx-auto mb-8">
            <div className="flex-1" style={{ background: '#FF7F00' }} />
            <div className="flex-1" style={{ background: '#fff' }} />
            <div className="flex-1" style={{ background: '#0B9C2C' }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button
              onClick={() => navigate(role === 'DONOR' ? '/donor/dashboard' : '/dashboard')}
              className="px-8 py-3 font-black text-sm uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ background: '#FF7F00', border: '3px solid #fff', boxShadow: '5px 5px 0 #fff' }}
            >
              Get Started →
            </button>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-8 py-3 font-black text-sm uppercase tracking-widest text-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ background: 'transparent', border: '3px solid #fff', boxShadow: '5px 5px 0 rgba(255,255,255,0.3)' }}
            >
              Explore Campaigns
            </button>
          </div>
        </div>

      </div>

      <FooterContent />
    </div>
  );
};

export default AboutUs;