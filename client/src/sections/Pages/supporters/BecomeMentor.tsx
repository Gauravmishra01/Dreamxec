import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BecomeMentor = () => {

  const mentorTypes = [
    { icon: "👨‍💻", text: "Engineers & technical leaders" },
    { icon: "🚀", text: "Entrepreneurs & startup founders" },
    { icon: "👨‍⚕️", text: "Doctors & healthcare professionals" },
    { icon: "🎨", text: "Designers & product managers" },
    { icon: "✍️", text: "Writers & communication experts" },
    { icon: "💼", text: "Business & finance professionals" },
    { icon: "🌍", text: "Social impact leaders & nonprofit founders" },
    { icon: "👩‍🏫", text: "Teachers & academic researchers" },
    { icon: "🎭", text: "Artists & creative professionals" },
    { icon: "🏆", text: "Domain specialists of any kind" }
  ]

  const mentorBenefits = [
    {
      icon: "❤️",
      category: "Personal",
      points: [
        "Help a student change their life trajectory",
        "Stay connected to young minds and fresh ideas",
        "Give back without major time commitment (1 hour/week)",
        "Build your mentorship reputation",
        "Access to network of 1,000+ mentors on platform"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
    },
    {
      icon: "💼",
      category: "Professional",
      points: [
        "Find talent for your team (intern/hire pathways)",
        "Get market insights from student innovators",
        "Develop leadership & coaching skills",
        "LinkedIn visibility (mentor badge, public profile)",
        "Media features (great mentor stories get coverage)",
        "Tax benefits (if through registered organization)"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg"
    },
    {
      icon: "🧠",
      category: "Intellectual",
      points: [
        "Stay sharp by solving student problems",
        "Co-publish research with student projects",
        "Explore ideas outside your day job",
        "Creative stimulation"
      ],
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg"
    }
  ]

  const mentorStories = [
    {
      icon: "👨‍💻",
      name: "Arvind",
      title: "Senior Engineer at Google",
      story: "I mentor 2–3 DreamXec projects every year. It takes ~2 hours/week, and honestly? I learn as much as I teach. These 22-year-olds think about problems differently. One mentee's startup idea made me rethink our team's approach to a product. I now have 3 interns from DreamXec projects in my team. Best talent pipeline I've found.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
    },
    {
      icon: "👩‍⚕️",
      name: "Dr. Priya",
      title: "Doctor & Social Entrepreneur",
      story: "I mentor healthcare innovation projects. It's deeply meaningful—these students are solving real problems in rural health. I've helped 5 projects get funding. Watching them impact thousands of lives? That's why I became a doctor. Now DreamXec lets me multiply that impact by mentoring others.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg"
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Become a Mentor | DreamXec</title>
      <meta
        name="description"
        content="Guide the Next Generation of Indian Innovators. Share your expertise. Unlock student potential. Become a DreamXec mentor."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Guide the Next Generation of Indian Innovators
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Share your expertise. Unlock student potential. Become a DreamXec mentor.
          </p>
        </section>

        {/* Who Can Mentor */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Who Can Mentor
          </h2>

          <div className="max-w-7xl mx-auto">
            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto mb-8">
              Any expert can mentor:
            </p>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card mb-8 hover:shadow-lg transition-shadow duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mentorTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3 text-dreamxec-navy text-base md:text-lg p-2 rounded-lg hover:bg-dreamxec-cream transition-colors duration-200">
                    <span className="text-xl md:text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
              <p className="text-dreamxec-navy text-base md:text-xl font-medium leading-relaxed">
                No specific experience required. Just genuine interest in helping students, ability to give 1 hour/week for 8–12 weeks, and willingness to share what you've learned (successes and failures both).
              </p>
            </div>
          </div>
        </section>

        {/* Mentor Benefits */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Mentor Benefits
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
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="mentor-benefits-carousel"
          >
            {mentorBenefits.map((benefit, index) => (
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
        </section>

        {/* Time Commitment */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Time Commitment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⏱️</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Per Mentee: 1 Hour/Week
                  </h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex gap-3 items-start text-dreamxec-navy text-sm md:text-base leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dreamxec-green text-white text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                    <span className="font-medium">Weekly 30–60 min calls (choose your schedule)</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-sm md:text-base leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dreamxec-green text-white text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                    <span className="font-medium">Async communication via platform (Slack-like chat)</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-sm md:text-base leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dreamxec-green text-white text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                    <span className="font-medium">Optional: project reviews, introduction facilitation</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-sm md:text-base leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dreamxec-green text-white text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                    <span className="font-medium">Duration: 8–12 weeks per project</span>
                  </li>
                </ul>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg" 
                alt="" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👥</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    For Multiple Mentees
                  </h3>
                </div>
                <div className="bg-dreamxec-cream px-4 py-3 rounded-lg mb-3">
                  <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed font-medium">
                    You choose your capacity. Mentors work with 1–5 students simultaneously. Average: 2–3 mentees, which is 2–3 hours/week.
                  </p>
                </div>
                <div className="bg-dreamxec-cream px-4 py-3 rounded-lg">
                  <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed font-medium">
                    <span className="font-bold text-dreamxec-berkeley-blue">Seasonal Option:</span> Some mentors prefer intensive mentorship (10 hours/week for 4 weeks) rather than ongoing. Flexible models available.
                  </p>
                </div>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg" 
                alt="" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>
          </div>
        </section>

        {/* Mentor Stories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Mentor Stories
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
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
            }}
            className="mentor-stories-carousel"
          >
            {mentorStories.map((story, index) => (
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
        </section>

        {/* CTA Section */}
         <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          <a href="/contact">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🎓 Become a Mentor
              </h2>
            </div>
          </a>

          {/* <a href="/mentor-community">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                View Mentor Community
              </h2>
            </div>
          </a> */}
        </section>

      </main>

      <Footer />
    </>
  )
}

export default BecomeMentor