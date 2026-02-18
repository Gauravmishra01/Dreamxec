import { Header } from "../../Header/index";
import { Footer } from "../../Footer/index";
import { RopeDivider } from "../../../components/RopeDivider";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const StartAProject = () => {
  const columns = [
    {
      title: "Step 1: Create Your Project",
      text: "Write a compelling project description, set your funding goal (₹5K–₹50L), upload your video/ppt pitch, and explain project milestones and impact vision.",
    },
    {
      title: "Step 2: Campaign & Community",
      text: "Launch your campaign. Supporters pledge funds. Mentors guide your execution. Build momentum with updates and milestone celebrations.",
    },
    {
      title: "Step 3: Deliver Impact",
      text: "Once funded, execute with mentor support. Track outcomes (internships, jobs, patents, social impact) and celebrate success.",
    },
  ];

  const FAQ = [
    {
      q: "How long does the campaign run?",
      a: "30 to 60 days. You choose the duration and goal. If you reach your goal before deadline, great—celebrate early. If not, you can extend by 30 days.",
    },
    {
      q: "What happens if I don't reach my funding goal?",
      a: "With flexible funding enabled (which DreamXec supports), you keep whatever you raised. If all-or-nothing, funds are returned to backers. No penalties to you.",
    },
    {
      q: "Can I have multiple projects running?",
      a: "Yes! A club can have multiple research projects. You must report milestones on time. Strong milestone delivery builds donor trust and helps raise funds for future stages.",
    },
    {
      q: "How do clubs with challenges get supported?",
      a: "Clubs showing delivery receive higher visibility, while those facing challenges are actively supported by the DreamXec team to move forward.",
    },
    {
      q: "What does the project lifecycle look like?",
      a: "List your projects → Outline milestones → Raise funds → Start → Execute → Share outcomes → Raise funds for the next stage of research.",
    },
    {
      q: "How do I use platform features like the mentor marketplace?",
      a: "Post your project → select mentor matches → weekly mentorship calls begin immediately, even before your campaign launches.",
    },
  ];

  return (
    <>
      {/* SEO */}
      <title>Start a Project | DreamXec</title>
      <meta
        name="description"
        content="Turn your innovation into reality with DreamXec. Get funded, mentored, and supported to launch your student project."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-[url('/your-bg-image.png')] bg-cover bg-center" />

          <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in">
            Turn Your Innovation Into Reality
          </h1>

          <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
            Get funded. Get mentored. Make an impact. Launch your next big idea
            with
            <span className="font-semibold text-dreamxec-berkeley-blue">
              {" "}
              DreamXec
            </span>{" "}
            — India’s fastest-growing student innovation platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-5 py-2 rounded-full bg-dreamxec-berkeley-blue/10 text-dreamxec-berkeley-blue text-sm font-semibold">
              Student-first platform
            </span>
            <span className="px-5 py-2 rounded-full bg-dreamxec-berkeley-blue/10 text-dreamxec-berkeley-blue text-sm font-semibold">
              Funding + mentorship
            </span>
            <span className="px-5 py-2 rounded-full bg-dreamxec-berkeley-blue/10 text-dreamxec-berkeley-blue text-sm font-semibold">
              Built for real impact
            </span>
          </div>
        </section>

        {/* Divider */}
        <RopeDivider />
        {/* What is DreamXec */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <img
            src="/assets/doodles/sparkle.svg"
            alt=""
            className="absolute -top-8 left-6 w-10 h-10 opacity-70 pointer-events-none hidden sm:block"
          />
          <img
            src="/assets/doodles/lightbulb.svg"
            alt=""
            className="absolute top-10 right-4 w-12 h-12 opacity-70 pointer-events-none hidden md:block"
          />
          <h2 className="text-dreamxec-berkeley-blue text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            What is DreamXec for Innovators?
          </h2>

          <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto text-center">
            DreamXec is a crowdfunding platform built exclusively for student
            innovators. Whether you’re working on a research project, building a
            tech product, creating a social enterprise, or shaping a startup
            idea — DreamXec connects you with funding, mentors, and a community
            that believes in your vision.
          </p>

          {/* Feature Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            {[
              {
                title: "Get Funded",
                desc: "Access capital without needing VC backing",
                vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
              },
              {
                title: "Get Mentored",
                desc: "Learn directly from industry & academic experts",
                vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg"
              },
              {
                title: "Create Impact",
                desc: "Turn ideas into real-world solutions",
                vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card-glass p-4 md:p-6 text-center space-y-3 hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-bold text-dreamxec-berkeley-blue">
                  {item.title}
                </h3>
                <p className="text-dreamxec-navy text-base">{item.desc}</p>
                <div className="flex justify-center pt-2">
                  <img 
                    src={item.vector} 
                    alt="" 
                    className="w-24 h-24 opacity-50"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Closing Line */}
          <p className="text-dreamxec-navy text-lg md:text-xl font-semibold text-center max-w-3xl mx-auto mt-12">
            Your idea doesn’t need venture capital backing — it needs{" "}
            <span className="text-dreamxec-berkeley-blue">DreamXec</span>{" "}
            backing.
          </p>
        </section>

        {/* Why DreamXec – Whiteboard Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            How It Works
          </h2>

          <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
            spaceBetween={48}
            slidesPerView={1}
            speed={800}
            navigation
            pagination={{ clickable: false }}
            keyboard={{ enabled: true }}
            grabCursor={false}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 48,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 48,
              },
            }}
            className="start-project-carousel"
          >
            {columns.map((col, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card-whiteboard h-full"
                >
                  <div className="whiteboard-content pt-14">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 p-2">
                      {col.title}
                    </h3>
                    <p className="text-xs text-left md:text-sm lg:text-base text-slate-600 leading-relaxed p-2">
                      {col.text}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* CTA Section */}
        <section className="flex  items-center justify-center gap-4">
          {/* Pill-style CTA: Primary */}
          <a href="/dashboard" className="flex justify-center">
            <div className="relative self-start caret-transparent">
              <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
                <h2 className="text-dreamxec-navy text-base md:text-xl font-sans font-bold leading-tight text-center whitespace-nowrap">
                  <span className="">Start Your Project</span>
                </h2>
              </div>
            </div>
          </a>

          {/* Pill-style CTA: Secondary */}
          {/* <a href="/innovators/success-stories" className="flex justify-center">
            <div className="relative self-start caret-transparent">
              <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
                <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-sans font-bold leading-tight text-center whitespace-nowrap">
                  Explore Success Stories
                </h2>
              </div>
            </div>
          </a> */}
        </section>

        {/* What You Get */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            What You Get
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
            className="start-project-carousel"
          >
            <SwiperSlide>
              <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full">
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                  Funding (₹5K–₹50L)
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                  Access capital from passionate supporters. No interference in
                  the research process—you own the journey completely!.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full">
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                  Mentorship (Expert Guidance)
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                  Paired with 1,000+ mentors across engineering, business, social
                  impact, product with weekly guidance calls.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full">
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                  Exposure (Build Your Network)
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                  Featured on platform homepage, media coverage for standout
                  projects, and LinkedIn visibility for your team.
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Eligibility Snapshot */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Eligibility Snapshot
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Who Can Apply */}
            <div className="card-pastel rounded-xl border-2 border-dreamxec-navy shadow-pastel-card p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                Who Can Apply
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg">
                <li>• Currently enrolled in an Indian college/university</li>
                <li>• Team of 1–6 members (mix of backgrounds welcome)</li>
                <li>• Project in ideation, prototype, or execution stage</li>
                <li>
                  • Any field: tech, biotech, defence, education, environment,
                  art, social sciences etc.
                </li>
              </ul>
            </div>

            {/* What Doesn't Qualify */}
            <div className="card-pastel rounded-xl border-2 border-dreamxec-navy shadow-pastel-card p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                What Doesn&apos;t Qualify
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg">
                <li>• Personal expenses</li>
                <li>• Projects violating laws or ethical standards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Success Metrics – CriteriaGrid Theme */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 py-16">
          <img
            src="/assets/doodles/star.svg"
            alt=""
            className="absolute -top-6 left-4 w-10 h-10 opacity-70 pointer-events-none hidden sm:block"
          />
          <img
            src="/assets/doodles/handshake.svg"
            alt=""
            className="absolute top-6 right-6 w-12 h-12 opacity-70 pointer-events-none hidden md:block"
          />
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                What does "success" look like for us?
              </h2>
            </div>

            {/* Success Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  text: "Fund over 500 student-led projects by 2026",
                  vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
                },
                {
                  icon: "💰",
                  text: "Raise a minimum of ₹10 crore in total funding",
                  vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
                },
                {
                  icon: "🧠",
                  text: "Engage more than 1,000 industry and academic mentors",
                  vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg"
                },
                {
                  icon: "📈",
                  text: "Achieve at least a 70% success rate for projects reaching their funding goals",
                  vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg"
                },
                {
                  icon: "🤝",
                  text: "Build strong collaborations between academia, industry, and government to enhance employability and job creation",
                  vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/18.svg"
                },
                {
                  icon: "🎓",
                  text: "Enable 50,000+ students to access real-world opportunities through funded projects, mentorship, and industry collaborations",
                  vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/2.svg"
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="card-glass animate-fade-in p-3 hover:shadow-lg transition-shadow duration-300 min-h-[120px]"
                >
                  {/* Top content with icon and text */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Icon Badge */}
                    <div className="w-8 h-8 rounded-full bg-dreamxec-berkeley-blue/10 flex items-center justify-center shrink-0">
                      <span className="text-sm">{item.icon}</span>
                    </div>

                    {/* Text */}
                    <p className="text-sm md:text-base font-semibold text-dreamxec-gray-250 leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  {/* Bottom image */}
                  <div className="flex justify-center">
                    <img 
                      src={item.vector} 
                      alt="" 
                      className="w-48 h-48 opacity-40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
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
                Everything you need to know before launching your project on
                DreamXec
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {FAQ.map((item, index) => (
                <div
                  key={index}
                  className="card-pastel-offwhite rounded-xl border-2 border-dreamxec-navy shadow-pastel-card p-6 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-tricolor-tag"></div>

                  <h3 className="text-xl font-bold text-dreamxec-navy font-display mb-3">
                    Q: {item.q}
                  </h3>

                  <p className="text-dreamxec-gray-250 font-sans text-sm md:text-base leading-relaxed bg-dreamxec-cream px-4 py-3 rounded-lg">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default StartAProject;
