import { href, useNavigate } from 'react-router-dom';
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
      name: "Q:What if the project fails?",
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
      category: "A: We track outcomes through 6-month, 1-year, and 3-year follow-ups. You receive clear impact reports on what the student delivered, career outcomes, patents filed, and real-world impact — as transparent as possible."
    }
  ];

  return (
    <section className="relative py-16 px-4 ">


      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-berkeley-blue mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-dreamxec-berkeley-blue font-sans max-w-3xl mx-auto leading-relaxed">
            Collaborating with industry leaders to bridge the gap between academic innovation and real-world impact
          </p>
        </div>

        {/* FAQ Carousel */}
        <div className="mb-12">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            speed={800}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            grabCursor={true}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="faq-carousel"
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={partner.name}>
                <div
                  className="card-pastel-offwhite rounded-lg border-3 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 text-center h-full flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:border-dreamxec-orange group cursor-pointer"
                >
                  <div className="card-tricolor-tag"></div>

                  {/* Partner Logo */}
                  <div className="bg-white rounded-md border-2 border-dreamxec-navy p-2 sm:p-3 mb-3 flex-shrink-0 group-hover:border-dreamxec-orange transition-colors">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="w-full h-24 sm:h-28 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Partner Info */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-dreamxec-navy font-display mb-2 leading-tight">
                    {partner.name}
                  </h3>
                  <p className="text-dreamxec-orange font-semibold font-sans text-xs sm:text-sm bg-dreamxec-cream px-2 sm:px-3 py-1 rounded-full inline-block">
                    {partner.category}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 sm:p-8 max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue font-display mb-3 sm:mb-4 mt-4">
              Partner With Us
            </h3>
            <p className="text-dreamxec-navy font-sans text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
              Join our mission to empower student innovation and drive technological advancement across India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <button
                onClick={() => {
                  const storedUser = localStorage.getItem("user");
                  const user = storedUser ? JSON.parse(storedUser) : null;

                  if (!user) {
                    href("/auth");
                  } else if (user.role === "DONOR") {
                    href("/donor/dashboard");
                  } else {
                    href("/dashboard");
                  }
                }}
                className="px-8 py-3 bg-dreamxec-orange text-white font-bold rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/campaigns')}
                className="px-8 py-3 bg-transparent border-2 border-dreamxec-navy text-dreamxec-navy font-bold rounded-xl hover:bg-dreamxec-navy/10 transition-colors"
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
