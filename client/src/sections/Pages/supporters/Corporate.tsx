import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const CorporateCSRPartnerships = () => {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const sdgAlignments = [
    {
      icon: "🏫",
      sdg: "SDG 4 (Quality Education)",
      description: "We fund student innovation, capacity building, and skill development—core to NEP 2020"
    },
    {
      icon: "💼",
      sdg: "SDG 8 (Decent Work & Economic Growth)",
      description: "Funded students get jobs, start companies, create employment"
    },
    {
      icon: "♀️",
      sdg: "SDG 5 (Gender Equality)",
      description: "40% of our projects are women-led; we actively encourage female innovators"
    },
    {
      icon: "⚖️",
      sdg: "SDG 10 (Reduced Inequality)",
      description: "Focus on underrepresented geographies (Tier 2/3 cities)"
    },
    {
      icon: "🤝",
      sdg: "SDG 17 (Partnerships)",
      description: "Multi-stakeholder model (corporates, mentors, government, students)"
    }
  ]

  const partnerships = [
    {
      icon: "💰",
      title: "MODEL 1: ANNUAL INNOVATION GRANT (₹50–200L)",
      description: "You allocate CSR budget to \"Fund Indian Student Innovation\" because ;Research karega India to Badhega India' initiative. DreamXec vets projects, you decide thematic focus (e.g., \"AI for Social Good\" or \"Women-Led Startups\"). We curate 10–20 projects per year. Sponsorship: all funded projects acknowledge your support, quarterly impact reports, co-hosted webinars, intern pathways to your company.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
    },
    {
      icon: "🏆",
      title: "MODEL 2: LONG-TERM PARTNERSHIP (₹1-5Cr, Multi-Year)",
      description: "Deep collaboration. You become a founding partner. Dedicated program: \"Acme Corporation Innovation Fund\" with 500+ funded projects over 3 years. Includes: executive mentor network, internship pipeline, recruitment from DreamXec alumni, co-branded learning hub. Maximum credibility, leadership positioning, talent acquisition.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
    },
    {
      icon: "🎯",
      title: "MODEL 3: PROJECT/CLUB or COLLEGE EVENT SPONSORSHIP (₹10–50L)",
      description: "You choose projects/club/college events aligning with your brand requirement (e.g., green tech, women entrepreneurs,healthcare innovation, intercollege events or fests). You fund them fully or co-fund with other supporters. Heavy branding: your logo on promotional material, creator mentions you in updates, case study in your CSR report. ROI: emotional connection with young innovators, authentic impact story, media coverage.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg"
    }
  ]

  const corporateBenefits = [
    {
      icon: "⭐",
      category: "Brand & Reputation",
      points: [
        "Position as \"supporting India's next generation\" and \"India's leap into the future\"",
        "Media coverage (startup stories, CSR features, thought leadership)",
        "Employee volunteer opportunities (mentoring students)",
        "Authentic brand love from young demographics (future customers)"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg"
    },
    {
      icon: "👥",
      category: "Talent Acquisition",
      points: [
        "Direct pipeline to pre-vetted student innovators",
        "Internship pathways (find talent early)",
        "Recruitment advantage (associate with innovation)",
        "Alumni network (track funded students throughout careers)"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg"
    },
    {
      icon: "💡",
      category: "Strategic Insight",
      points: [
        "Early signals of tech trends (funded projects indicate market direction)",
        "Customer feedback (interact with young minds)",
        "Innovation ideas (students often think creatively about your industry challenges)"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
    },
    {
      icon: "🧾",
      category: "Tax Benefits",
      points: [
        "80G certification (donations are tax-deductible)",
        "CSR spend recognition (up to 2% of profit)",
        "Measurable impact reporting (audited outcomes)"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Corporate & CSR Partnerships | DreamXec</title>
      <meta
        name="description"
        content="Turn Your CSR Into Real Student Impact. Partner with DreamXec to fund innovation, build brand love, and align with NEP 2020 goals."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Turn Your CSR Into Real Student Impact
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Partner with DreamXec to fund innovation, build brand love, and align with NEP 2020 goals.
          </p>
        </section>

        {/* CSR Alignment */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            CSR Alignment
          </h2>

          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-8 text-center">
              Why DreamXec Fits Your CSR Strategy:
            </h3>

            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto mb-8">
              DreamXec has the potential to create impact for all '17' UN declared Sustainable Development Growth with direct alignment with multiple SDGs and government priorities:
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {sdgAlignments.map((item, index) => (
                <div
                  key={index}
                  className="card-pastel p-5 md:p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.02] transition-all duration-300 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl md:text-3xl">{item.icon}</span>
                    <h4 className="text-base md:text-lg font-bold text-dreamxec-berkeley-blue">
                      {item.sdg}
                    </h4>
                  </div>
                  <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Partnership Models
          </h2>

          <div className="space-y-6">
            {partnerships.map((model, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-pastel animate-fade-in p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl md:text-4xl">{model.icon}</span>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-dreamxec-berkeley-blue">
                      {model.title}
                    </h3>
                  </div>
                  <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed font-medium">
                    {model.description}
                  </p>
                </div>
                <img 
                  src={model.vector} 
                  alt="" 
                  className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Corporate Benefits */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Corporate Benefits
          </h2>

          <div className="relative">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Swiper
              modules={[Pagination, Keyboard, A11y, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              speed={800}
              onSwiper={(s) => setSwiperInstance(s)}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              grabCursor={true}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 32,
                },
              }}
              className="corporate-benefits-carousel"
            >
            {corporateBenefits.map((benefit, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl">{benefit.icon}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                        {benefit.category}
                      </h3>
                    </div>
                    <img 
                      src={benefit.vector} 
                      alt="" 
                      className="w-14 h-14 md:w-16 md:h-16 object-contain"
                    />
                  </div>
                  <ul className="space-y-2 flex-1">
                    {benefit.points.map((point, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dreamxec-orange text-white text-xs font-bold flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-dreamxec-navy text-sm md:text-base leading-relaxed font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          <a href="/contact">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                💼 Discuss Partnership Options
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default CorporateCSRPartnerships