import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const CriteriaGrid = () => {
  const criteria = [
    {
      title: "Merit First",
      text: "Ideas are judged by potential, not pedigree. Whether you're from IIT or a tier-3 college, if your project has merit, you get funded.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg",
    },
    {
      title: "Transparency",
      text: "Every rupee is tracked. Every milestone is public. No hidden fees, no opacity—just honest impact.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/4.svg",
    },
    {
      title: "Gurukul Spirit",
      text: "Like ancient Gurukuls where teachers and students co-created knowledge, DreamXec connects generations alumni mentoring students, corporates enabling research.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg",
    },
    {
      title: "Atmanirbhar Bharat",
      text: "We're building India's self-reliance in innovation. Not waiting for foreign funding, not copying Silicon Valley—creating our own model rooted in Indian context.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/6.svg",
    },
    {
      title: "UN SDG Alignment",
      text: "Every project must contribute to at least one Sustainable Development Goal. Innovation for profit AND purpose.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/7.svg",
    },
    {
      title: "Community First",
      text: "Students aren't 'users,' donors aren't 'customers'—we're all stakeholders in India's future.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/20.svg",
    },
  ];

  return (
    <div className="w-full px-4">
      <div className="mt-[10%] max-w-6xl mx-auto">
        <div className="text-center text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold mb-8">
          <h2>Our Values and Principles</h2>
          <h4 className="text-dreamxec-gray-700 text-base md:text-lg font-sans font-semibold mt-2">
            We seek students and young professionals whose projects embody these principles:        
          </h4>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          speed={800}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          grabCursor={true}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
          }}
          className="criteria-carousel"
        >
          {criteria.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="card-glass flex items-center p-6 h-full transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Left Side: Text Content */}
                <div className="w-2/3 pr-4">
                  <h2 className="text-2xl font-bold text-dreamxec-gray-250 mb-2">{item.title}</h2>
                  <p className="text-dreamxec-gray-600 text-sm font-semibold leading-relaxed">{item.text}</p>
                </div>

                {/* Right Side: SVG Icon */}
                <div className="w-1/3 flex justify-center items-center">
                  <img
                    src={item.icon}
                    alt={`${item.title} Icon`}
                    className="h-30 w-30 opacity-100"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
