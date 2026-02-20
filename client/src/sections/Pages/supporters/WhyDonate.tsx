import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const WhyDonate = () => {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const reasons = [
    {
      icon: "🎓",
      title: "For Students",
      description: "A DreamXec pledge is more than money—it's validation. When a 20-year-old sees 100 people believe in their idea enough to fund it, something shifts. Confidence soars. The impossible suddenly seems doable. Many of our backed students tell us: \"Getting DreamXec funding was my turning point. I stopped doubting myself and started building.\"",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
    },
    {
      icon: "🇮🇳",
      title: "For India",
      description: "Student innovation is India's secret superpower. We have 40M college students, yet only 0.1% get funded. Imagine if that number was 1%. Or 5%. The inventions, startups, jobs, and social impact would be transformative. Your support accelerates that shift.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
    },
    {
      icon: "⚙️",
      title: "For Systemic Change",
      description: "Every successful student project proves the model works. Investors see it. The government sees it. colleges see it. More funding flows to innovation. More teachers encourage students. More colleges build maker spaces. One donation creates a ripple effect.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg"
    }
  ]

  const stories = [
    {
      icon: "💼",
      name: "Sandeep",
      title: "45, Corporate Executive",
      story: "I backed 12 projects over 2 years. One was an AI app for farmers. Another was a water sensor for rural areas. Seeing those 20-year-old founders execute with confidence—it reminded me why I love India's potential. Three of them reached out later for job interviews. Two are now in my team. Best ROI I've ever made.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg"
    },
    {
      icon: "👨‍🏫",
      name: "Priya & Raj",
      title: "Retired Teachers",
      story: "We give ₹5,000 each month to random projects. We love reading the updates, seeing young minds solve real problems. Our grandchildren know about 'Grandpa's fund' and want to launch projects themselves. We've created a family legacy of supporting innovation.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg"
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Why Donate? | DreamXec</title>
      <meta
        name="description"
        content="You Have the Power to Change India's Future with One Research at a Time. One pledge. One idea. Decades of impact. Here's why supporting student innovation matters."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            You Have the Power to Change India's Future with One Research at a Time
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            One pledge. One idea. Decades of impact. Here's why supporting student innovation matters.
          </p>
        </section>

        {/* Why Your Support Matters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Why Your Support Matters
          </h2>

          <div className="space-y-6">
            {reasons.map((reason, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-pastel animate-fade-in p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl md:text-4xl">{reason.icon}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                      {reason.title}
                    </h3>
                  </div>
                  <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed font-medium">
                    {reason.description}
                  </p>
                </div>
                <img 
                  src={reason.vector} 
                  alt="" 
                  className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Donor Stories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Donor Stories
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
                640: {
                  slidesPerView: 2,
                  spaceBetween: 32,
                },
              }}
              className="donor-stories-carousel"
            >
            {stories.map((story, index) => (
              <SwiperSlide key={index}>
                <div
                   className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl">{story.icon}</span>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                          {story.name}
                        </h3>
                        <p className="text-dreamxec-navy text-sm md:text-base font-semibold">
                          {story.title}
                        </p>
                      </div>
                    </div>
                    <img 
                      src={story.vector} 
                      alt="" 
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>

                  <div className="bg-dreamxec-cream px-4 py-4 rounded-lg flex-1">
                    <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed font-medium italic">
                      "{story.story}"
                    </p>
                  </div>
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
          <a href="/discover-projects">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🚀 Start Supporting Campaign
              </h2>
            </div>
          </a>

          {/* <a href="/monthly-giving">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Schedule Monthly Giving
              </h2>
            </div>
          </a> */}
        </section>

      </main>

      <Footer />
    </>
  )
}

export default WhyDonate