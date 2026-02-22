import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const criteria = [
  {
    title: "Merit First",
    text: "Ideas are judged by potential, not pedigree. Whether you're from IIT or a tier-3 college, if your project has merit, you get funded.",
    icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg",
    shadow: "#FF7F00",
    stripe: "#FF7F00",
    num: "01",
  },
  {
    title: "Transparency",
    text: "Every rupee is tracked. Every milestone is public. No hidden fees, no opacity—just honest impact.",
    icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/4.svg",
    shadow: "#0B9C2C",
    stripe: "#0B9C2C",
    num: "02",
  },
  {
    title: "Gurukul Spirit",
    text: "Like ancient Gurukuls where teachers and students co-created knowledge, DreamXec connects generations — alumni mentoring students, corporates enabling research.",
    icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg",
    shadow: "#003366",
    stripe: "#003366",
    num: "03",
  },
  {
    title: "Atmanirbhar Bharat",
    text: "We're building India's self-reliance in innovation. Not waiting for foreign funding, not copying Silicon Valley — creating our own model rooted in Indian context.",
    icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/6.svg",
    shadow: "#FF7F00",
    stripe: "#FF7F00",
    num: "04",
  },
  {
    title: "UN SDG Alignment",
    text: "Every project must contribute to at least one Sustainable Development Goal. Innovation for profit AND purpose.",
    icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/7.svg",
    shadow: "#0B9C2C",
    stripe: "#0B9C2C",
    num: "05",
  },
  {
    title: "Community First",
    text: "Students aren't 'users,' donors aren't 'customers'—we're all stakeholders in India's future.",
    icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/20.svg",
    shadow: "#003366",
    stripe: "#003366",
    num: "06",
  },
];

export const CriteriaGrid = () => {
  return (
    <div className="w-full px-4">
      <div className="mt-[10%] max-w-6xl mx-auto">

        {/* ── SECTION HEADING ── */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">

          {/* Eyebrow stamp */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white"
              style={{ background: '#003366', border: '2px solid #003366' }}
            >
              ★ DreamXec Principles
            </span>
          </div>

          {/* Main heading with stamp highlight */}
          <h2 className="font-black leading-tight mb-3">
            <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-dreamxec-navy uppercase tracking-tight">
              Our Values
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
                  & Principles
                </span>
              </span>
            </span>
          </h2>

          <p
            className="inline-block mt-5 sm:mt-6 px-4 sm:px-5 py-2 text-xs sm:text-sm md:text-base font-black text-dreamxec-navy uppercase tracking-wide"
            style={{ border: '2px dashed #003366', background: '#fff7ed' }}
          >
            We seek students and young professionals whose projects embody these principles
          </p>
        </div>

        {/* ── SWIPER CAROUSEL ── */}
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          speed={700}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          grabCursor={true}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            768:  { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 2, spaceBetween: 28 },
          }}
          className="criteria-carousel pb-12"
        >
          {criteria.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div
                className="bg-white flex flex-col h-full transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                style={{
                  border: '3px solid #003366',
                  boxShadow: `6px 6px 0 ${item.shadow}`,
                }}
              >
                {/* Top color stripe */}
                <div className="h-2" style={{ background: item.stripe }} />

                <div className="flex items-stretch flex-1 p-4 sm:p-5 md:p-6 gap-4">

                  {/* Left: number + text */}
                  <div className="flex-1 flex flex-col min-w-0">

                    {/* Number badge */}
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-white text-xs sm:text-sm mb-3 flex-shrink-0"
                      style={{ background: item.stripe, border: '2px solid #003366' }}
                    >
                      {item.num}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-dreamxec-navy uppercase tracking-tight leading-snug mb-2 sm:mb-3">
                      {item.title}
                    </h3>

                    {/* Hard rule */}
                    <div
                      className="mb-2 sm:mb-3 h-0.5 w-8"
                      style={{ background: item.stripe }}
                    />

                    {/* Text */}
                    <p className="text-xs sm:text-sm text-dreamxec-navy/70 font-medium leading-relaxed flex-1">
                      {item.text}
                    </p>
                  </div>

                  {/* Right: SVG icon in bordered box */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center"
                      style={{ border: `2px solid ${item.stripe}`, background: `${item.stripe}10` }}
                    >
                      <img
                        src={item.icon}
                        alt={`${item.title} icon`}
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom swiper nav/pagination styles */}
        <style>{`
          .criteria-carousel .swiper-button-next,
          .criteria-carousel .swiper-button-prev {
            width: 36px;
            height: 36px;
            background: #fff;
            border: 3px solid #003366;
            box-shadow: 3px 3px 0 #FF7F00;
            color: #003366;
            border-radius: 0;
            top: 45%;
          }
          .criteria-carousel .swiper-button-next::after,
          .criteria-carousel .swiper-button-prev::after {
            font-size: 14px;
            font-weight: 900;
          }
          .criteria-carousel .swiper-button-next:hover,
          .criteria-carousel .swiper-button-prev:hover {
            background: #003366;
            color: #fff;
            transform: translate(-1px, -1px);
          }
          .criteria-carousel .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #fff;
            border: 2px solid #003366;
            border-radius: 0;
            opacity: 1;
          }
          .criteria-carousel .swiper-pagination-bullet-active {
            background: #FF7F00;
            border-color: #003366;
            transform: scale(1.2);
          }
          .criteria-carousel .swiper-pagination {
            bottom: 0;
          }
        `}</style>
      </div>
    </div>
  );
};