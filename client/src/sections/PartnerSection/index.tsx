import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const PartnersSection = () => {
  const navigate = useNavigate();

  const partners = [
    {
      name: "Q: Is my donation tax-deductible? (Corporate/Foundation)",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734236/23_sqrtii.png",
      category: "A: Yes! 80G certificate auto-generated. 50% deduction."
    },
    {
      name: "Q: Can I donate anonymously?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734218/22_uadpdn.png",
      category: "A: Yes, you can choose to remain anonymous when making a donation."
    },
    {
      name: "Q: What's the minimum pledge amount?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734249/24_ikcg3l.png",
      category: "A: ₹100. Even small amounts add up and show the team they have community support."
    },
    {
      name: "Q: What if the project fails?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734189/21_apvr2t.png",
      category: "A: Rare (95% completion rate). If it happens, we transparently share reasons. Funds already used can't be refunded, but unused funds can be redirected."
    },
    {
      name: "Q. What is a Donor Opportunity?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734256/25_x3uyod.png",
      category: "A. A Donor Opportunity is a post created by a donor that students can apply to, such as internships, scholarships, projects, or mentorships."
    },
    {
      name: "Q: How do I know my impact is real?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734263/26_wedmyg.png",
      category: "A: We track outcomes through 6-month, 1-year, and 3-year follow-ups. You receive clear impact reports on career outcomes, patents filed, and real-world impact."
    }
  ];

  const handleGetStarted = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      navigate("/auth");
    } else if (user.role === "DONOR") {
      navigate("/donor/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="relative py-14 sm:py-20 px-4  overflow-hidden">

      {/* Neobrutalism background texture dots */}
      <div className="absolute inset-0 pointer-events-none opacity-10"

      />

      <div className="relative max-w-7xl mx-auto">

        {/* ── Header ── */}


        <div className="text-center mb-10 sm:mb-12 md:mb-14">

          {/* Eyebrow stamp */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white"
              style={{ background: '#003366', border: '2px solid #003366' }}
            >
              ★ DreamXec At Your Service
            </span>
          </div>

          {/* Main heading with stamp highlight */}
          <h2 className="font-black leading-tight mb-3">
            <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-dreamxec-navy uppercase tracking-tight">
              Frequently Asked
            </span>
            <span className="block mt-1 sm:mt-2">
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 translate-x-[4px] translate-y-[4px] sm:translate-x-[6px] sm:translate-y-[6px]"
                  style={{ background: '#0B9C2C' }}
                  aria-hidden
                />
                <span
                  className="relative z-10 inline-block px-3 sm:px-5 py-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white font-black uppercase tracking-tight"
                  style={{ background: '#003366', border: '3px solid #003366' }}
                >
                  Questions
                </span>
              </span>
            </span>
          </h2>

          <p
            className="inline-block mt-5 sm:mt-6 px-4 sm:px-5 py-2 text-xs sm:text-sm md:text-base font-black text-dreamxec-navy uppercase tracking-wide"
            style={{ border: '2px dashed #003366', background: '#fff7ed' }}
          >
            Everything you need to know — honest, transparent, no fluff.
          </p>
        </div>

        {/* ── FAQ Carousel ── */}
        <div className="mb-14 relative">
          {/* Custom nav buttons at screen ends */}
          <button
            className="swiper-faq-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-white transition-all hover:translate-x-[-2px]"
            style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
          >
            ←
          </button>
          <button
            className="swiper-faq-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center font-black text-sm text-white transition-all hover:translate-x-[2px]"
            style={{ background: '#003366', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
          >
            →
          </button>

          <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            speed={700}
            navigation={{
              prevEl: '.swiper-faq-prev',
              nextEl: '.swiper-faq-next',
            }}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            grabCursor={true}
            autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              520: { slidesPerView: 2, spaceBetween: 14 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
            }}
            className="faq-carousel !pb-10 !px-10"
          >
            {partners.map((partner, index) => {
              const shadowAccents = ['#FF7F00', '#0B9C2C', '#003366'];
              const accent = shadowAccents[index % 3];
              return (
                <SwiperSlide key={partner.name} className="h-auto">
                  <div
                    className="group bg-white flex flex-col h-full cursor-pointer relative overflow-hidden transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    style={{
                      border: '3px solid #003366',
                      boxShadow: `5px 5px 0 ${accent}`,
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `7px 7px 0 ${accent}`)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${accent}`)}
                  >
                    {/* Corner accent */}
                    <div
                      className="absolute top-0 right-0 w-6 h-6"
                      style={{ background: accent, borderLeft: '3px solid #003366', borderBottom: '3px solid #003366' }}
                    />

                    {/* Index badge */}
                    <div
                      className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-[9px] font-black text-white"
                      style={{ background: '#003366', border: '2px solid #003366' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Logo */}
                    <div
                      className="mt-5 mx-3 mb-3 flex items-center justify-center p-2 flex-shrink-0 transition-colors duration-200"
                      style={{ background: '#fffbf5', border: '2px solid #003366' }}
                    >
                      <img
                        src={partner.logo}
                        alt={`FAQ ${index + 1} illustration`}
                        className="w-full h-16 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Question */}
                    <h3
                      className="text-xs font-black text-[#003366] uppercase tracking-tight mx-3 mb-2 leading-snug"
                      style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '6px' }}
                    >
                      {partner.name}
                    </h3>

                    {/* Answer */}
                    <p
                      className="mt-auto mx-3 mb-3 text-[11px] font-medium text-[#003366]/70 leading-relaxed px-2 py-1.5 transition-colors duration-200"
                      style={{ background: '#fffbf5', border: '2px solid #003366' }}
                    >
                      {partner.category}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ── Call to Action ── */}
        <div className="flex justify-center">
          <div className="
            bg-white
            border-[3px] border-dreamxec-navy
            shadow-[8px_8px_0px_#003366]
            rounded-none
            p-6 sm:p-10
            w-full max-w-2xl
            relative
            overflow-hidden
          ">
            {/* Decorative stripe top */}
            <div className="absolute top-0 left-0 w-full h-2 bg-tricolor-horizontal" />

            {/* Decorative corner block */}
            <div className="absolute bottom-0 right-0 w-14 h-14 bg-dreamxec-orange border-t-[3px] border-l-[3px] border-dreamxec-navy" />

            <h3 className="
              text-xl sm:text-2xl md:text-3xl font-extrabold text-dreamxec-berkeley-blue font-display
              mb-1 mt-3
              inline-block
              border-b-4 border-dreamxec-orange
              pb-1
            ">
              Partner With Us
            </h3>

            <p className="text-dreamxec-navy font-sans text-sm sm:text-base md:text-lg mt-4 mb-6 leading-relaxed max-w-lg">
              Join our mission to empower student innovation and drive technological advancement across India.
            </p>

            <div className="flex flex-col sm:flex-row justify-start gap-4 relative z-10">
              <button
                onClick={handleGetStarted}
                className="
                  px-6 sm:px-8 py-3
                  bg-dreamxec-orange text-white
                  font-extrabold text-sm sm:text-base
                  border-[3px] border-dreamxec-navy
                  rounded-none
                  shadow-[4px_4px_0px_#003366]
                  hover:shadow-[6px_6px_0px_#003366]
                  hover:-translate-y-0.5 hover:-translate-x-0.5
                  active:shadow-none active:translate-x-0 active:translate-y-0
                  transition-all duration-150
                "
              >
                Get Started →
              </button>
              <button
                onClick={() => navigate('/campaigns')}
                className="
                  px-6 sm:px-8 py-3
                  bg-white text-dreamxec-navy
                  font-extrabold text-sm sm:text-base
                  border-[3px] border-dreamxec-navy
                  rounded-none
                  shadow-[4px_4px_0px_#003366]
                  hover:shadow-[6px_6px_0px_#FF6600]
                  hover:border-dreamxec-orange hover:text-dreamxec-orange
                  hover:-translate-y-0.5 hover:-translate-x-0.5
                  active:shadow-none active:translate-x-0 active:translate-y-0
                  transition-all duration-150
                "
              >
                Explore Campaigns
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
