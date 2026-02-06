import { Header } from '../../Header/index'
import { Footer } from '../../Footer/index'
import { RopeDivider } from '../../../components/RopeDivider'
import { CardCarousel } from '../../../components/CardCarousel'

const StartAProject = () => {

  const columns = [
    {
      title: "Step 1: Create Your Project",
      text: "Write a compelling project description, set your funding goal (₹5K–₹50L), upload your video/ppt pitch, and explain project milestones and impact vision."
    },
    {
      title: "Step 2: Campaign & Community",
      text: "Launch your campaign. Supporters pledge funds. Mentors guide your execution. Build momentum with updates and milestone celebrations."
    },
    {
      title: "Step 3: Deliver Impact",
      text: "Once funded, execute with mentor support. Track outcomes (internships, jobs, patents, social impact) and celebrate success."
    }
  ]


  const FAQ = [
    {
      q: "How long does the campaign run?",
      a: "30 to 60 days. You choose the duration and goal. If you reach your goal before deadline, great—celebrate early. If not, you can extend by 30 days."
    },
    {
      q: "What happens if I don't reach my funding goal?",
      a: "With flexible funding enabled (which DreamXec supports), you keep whatever you raised. If all-or-nothing, funds are returned to backers. No penalties to you."
    },
    {
      q: "Can I have multiple projects running?",
      a: "Yes! A club can have multiple research projects. You must report milestones on time. Strong milestone delivery builds donor trust and helps raise funds for future stages."
    },
    {
      q: "How do clubs with challenges get supported?",
      a: "Clubs showing delivery receive higher visibility, while those facing challenges are actively supported by the DreamXec team to move forward."
    },
    {
      q: "What does the project lifecycle look like?",
      a: "List your projects → Outline milestones → Raise funds → Start → Execute → Share outcomes → Raise funds for the next stage of research."
    },
    {
      q: "How do I use platform features like the mentor marketplace?",
      a: "Post your project → select mentor matches → weekly mentorship calls begin immediately, even before your campaign launches."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Start a Project | DreamXec</title>
      <meta
        name="description"
        content="Turn your innovation into reality with DreamXec. Get funded, mentored, and supported to launch your student project."
      />

      <Header />

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-8">

        {/* Hero Section */}
        <section className="relative max-w-6xl mx-auto px-4 pt-24 pb-16 text-center overflow-hidden">

          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-[url('/your-bg-image.png')] bg-cover bg-center" />

          <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
            Turn Your Innovation Into Reality
          </h1>

          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Get funded. Get mentored. Make an impact. Launch your next big idea with
            <span className="font-semibold text-dreamxec-berkeley-blue"> DreamXec</span> —
            India’s fastest-growing student innovation platform.
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
        <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          <h2 className="text-dreamxec-berkeley-blue text-center text-4xl md:text-6xl font-extrabold tracking-tight">
            What is DreamXec for Innovators?
          </h2>

          <p className="text-dreamxec-navy text-base md:text-xl leading-relaxed max-w-4xl mx-auto text-center">
            DreamXec is a crowdfunding platform built exclusively for student innovators.
            Whether you’re working on a research project, building a tech product,
            creating a social enterprise, or shaping a startup idea — DreamXec connects
            you with funding, mentors, and a community that believes in your vision.
          </p>

          {/* Feature Row */}
          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
            ariaLabel="Feature cards"
            className="mt-12"
          >
            {[
              {
                title: "Get Funded",
                desc: "Access capital without needing VC backing"
              },
              {
                title: "Get Mentored",
                desc: "Learn directly from industry & academic experts"
              },
              {
                title: "Create Impact",
                desc: "Turn ideas into real-world solutions"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="card-glass p-8 text-center space-y-3"
              >
                <h3 className="text-xl font-bold text-dreamxec-berkeley-blue">
                  {item.title}
                </h3>
                <p className="text-dreamxec-navy text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </CardCarousel>

          {/* Closing Line */}
          <p className="text-dreamxec-navy text-lg md:text-xl font-semibold text-center max-w-3xl mx-auto mt-12">
            Your idea doesn’t need venture capital backing —
            it needs <span className="text-dreamxec-berkeley-blue">DreamXec</span> backing.
          </p>
        </section>

        {/* Why DreamXec – Whiteboard Cards */}
        <section className="max-w-7xl mx-auto px-4 -pb-2 text-center space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col, index) => (
              <div
                key={index}
                style={{ animationDelay: `${200 + index * 150}ms` }}
                className="card-whiteboard animate-fade-in"
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
            ))}
          </div>
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
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            What You Get
          </h2>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
            ariaLabel="What you get cards"
          >
            {[
              {
                title: "Funding (₹5K–₹50L)",
                desc: "Access capital from passionate supporters. No interference in the research process—you own the journey completely!."
              },
              {
                title: "Mentorship (Expert Guidance)",
                desc: "Paired with 1,000+ mentors across engineering, business, social impact, product with weekly guidance calls."
              },
              {
                title: "Exposure (Build Your Network)",
                desc: "Featured on platform homepage, media coverage for standout projects, and LinkedIn visibility for your team."
              }
            ].map((item, index) => (
              <div key={index} className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
                <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </CardCarousel>
        </section>


        {/* Eligibility Snapshot */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Eligibility Snapshot
          </h2>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
            ariaLabel="Eligibility snapshot cards"
          >
            {[
              {
                title: "Who Can Apply",
                items: [
                  "Currently enrolled in an Indian college/university",
                  "Team of 1–6 members (mix of backgrounds welcome)",
                  "Project in ideation, prototype, or execution stage",
                  "Any field: tech, biotech, defence, education, environment, art, social sciences etc."
                ]
              },
              {
                title: "What Doesn't Qualify",
                items: [
                  "Personal expenses",
                  "Projects violating laws or ethical standards"
                ]
              }
            ].map((item, index) => (
              <div key={index} className="card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg">
                  {item.items.map((text, idx) => (
                    <li key={idx}>• {text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardCarousel>
        </section>


        {/* Success Metrics – CriteriaGrid Theme */}
        <section className="w-full px-4 py-24">
          <div className="max-w-6xl mx-auto">

            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold tracking-tight">
                What does "success" look like for us?
              </h2>
            </div>

            <CardCarousel
              slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
              ariaLabel="Success metrics cards"
            >
              {[
                "Fund over 500 student-led projects by 2026",
                "Raise a minimum of ₹10 crore in total funding",
                "Engage more than 1,000 industry and academic mentors",
                "Achieve at least a 70% success rate for projects reaching their funding goals",
                "Build strong collaborations between academia, industry, and government to enhance employability and job creation",
                "Enable 50,000+ students to access real-world opportunities through funded projects, mentorship, and industry collaborations"
              ].map((item, index) => (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="card-glass animate-fade-in flex items-start gap-4 p-6"
                >
                  {/* Trophy Bullet */}
                  <span className="text-2xl mt-1">🏆</span>

                  {/* Text */}
                  <p className="text-xl font-semibold text-dreamxec-gray-250 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </CardCarousel>

          </div>
        </section>




        {/* FAQ Section */}
        <section className="relative py-16 px-4">
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
                Everything you need to know before launching your project on DreamXec
              </p>
            </div>

            {/* FAQ Grid */}
            <CardCarousel
              slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              ariaLabel="FAQ cards"
              className="mb-12"
            >
              {FAQ.map((item, index) => (
                <div
                  key={index}
                  className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 hover:scale-105 transition-all duration-300"
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
            </CardCarousel>

          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default StartAProject
