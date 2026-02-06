import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FundInnovation = () => {

  const discoverMethods = [
    {
      title: "Browse by Category",
      description: "AI/ML, Robotics, Biotech, Social Impact, Education Tech, Healthcare, Environment, Arts & Design, and more."
    },
    {
      title: "Search by Keywords",
      description: "Looking for \"water conservation projects\" or \"mental health innovations\"? Use our search to find projects aligned with your interests."
    },
    {
      title: "Filter by Stage",
      description: "Ideation (earliest stage), Prototype (proof of concept), Execution (ready to go). Choose the risk level you're comfortable with."
    },
    {
      title: "Follow Favorite Creators",
      description: "Love a team's previous project? Follow them. You'll be notified the moment they launch their next idea."
    },
    {
      title: "Browse Collections",
      description: "\"Women-Led Innovations,\" \"Social Impact,\" \"Climate Tech\"—curated collections based on impact theme or creator background."
    }
  ]

  const trustPoints = [
    {
      title: "Your money is safe",
      description: "Funds are held in escrow until the project achieves 100% of goal or at project's end date. The disbursements are made as per the milestones specified at the time of the project listing."
    },
    {
      title: "You know where your money goes",
      description: "Every project specifies exactly how funds will be used: materials %, team stipends %, lab rentals %, etc. No hidden fees."
    },
    {
      title: "You see progress",
      description: "Creators post mandatory bi-weekly updates. You see the project evolving, challenges being solved, outcomes being delivered. No radio silence."
    },
    {
      title: "No equity. No complications",
      description: "Your contribution is a gift/donation. You don't own the project, and they don't owe you anything beyond delivery of promised outcomes (documented updates, final report)."
    },
    {
      title: "Open feedback loop",
      description: "If a project misuses funds or stops updating, report it. Our team investigates. Repeat offenders are removed from the platform."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Fund Innovation | DreamXec</title>
      <meta
        name="description"
        content="Your Support Powers India's Next Generation of Innovators. Discover projects transforming ideas into impact. Fund the innovations you believe in."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Your Support Powers India's Next Generation of Innovators
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover projects transforming ideas into impact. Fund the innovations you believe in.
          </p>
        </section>

        {/* Intro */}
        <section className="max-w-6xl mx-auto  space-y-6">
          <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto">
            Every great innovation starts as a student's dream in a dorm room, hostel, or family home. DreamXec connects those dreamers with supporters like you—people who believe in potential before the world knows about it. When you fund a project on DreamXec, you're not just giving money. You're giving belief, validation, and a platform for that student to change their trajectory. Join 1.4 Billion Indians in supporting India's leap into the future.
          </p>
        </section>

        {/* How to Discover Projects */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            How to Discover Projects
          </h2>

          <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
            spaceBetween={32}
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
                spaceBetween: 32,
              },
            }}
            className="fund-innovation-carousel"
          >
            {discoverMethods.map((method, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                    {method.title}
                  </h3>
                  <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Trust & Transparency */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Trust & Transparency
          </h2>

          <div className="space-y-6">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                  {point.title}
                </h3>
                <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          <a href="/discover-projects">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🔍 Discover Projects Now
              </h2>
            </div>
          </a>

          <a href="/impact-stories">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                See Impact You've Created
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default FundInnovation