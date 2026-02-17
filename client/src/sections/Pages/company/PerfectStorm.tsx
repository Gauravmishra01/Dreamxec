import { Header } from '../../Header'
import { Footer } from '../../Footer'

const PerfectStorm = () => {

  const innovationGapData = [
    { stat: "40 million", desc: "college students actively pursuing degrees", vector: "/assets/icon-pack/002-student.svg" },
    { stat: "5 million (12.5%)", desc: "are trying to innovate: working on side projects, entering competitions, filing patents", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg" },
    { stat: "Only 50,000 (0.1%)", desc: "access meaningful funding", vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg" }
  ]

  const whyNowReasons = [
    {
      icon: "📜",
      title: "Regulatory Tailwinds",
      description: "National Cooperation Policy 2025 explicitly mandates \"tech-enabled platforms for youth innovation.\" NEP 2020 champions \"experiential learning\" and \"entrepreneurship.\" These aren't nice-to-haves; they're government priorities. DreamXec aligns with both.",
      vector: "/assets/icon-pack/005-student government.svg"
    },
    {
      icon: "📈",
      title: "Market Traction",
      description: "Kickstarter (global), Indiegogo (global), FuelADream (Indian but general)—none were optimized for students. DreamXec's proof of concept: ₹10.2 crore raised in 18 months with zero institutional funding. Demand is real.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg"
    },
    {
      icon: "🇮🇳",
      title: "Demographic Dividend",
      description: "India's population pyramid has peaked in youth. We have 20-40 years before demographics shift. This is the narrow window to harness young innovation. In 2045, we'll ask \"why didn't we fund more student projects?\" We still have time.",
      vector: "/assets/icon-pack/002-student.svg"
    },
    {
      icon: "📱",
      title: "Technology Enablement",
      description: "Mobile penetration (70% of India). Digital payment maturity (UPI, cards). Cloud infrastructure cost (sub-₹1,000/month). Mentorship platforms (Slack, Zoom, Discord). All the tools exist. Platforms just need to combine them for students.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/2.svg"
    },
    {
      icon: "🤝",
      title: "Social Capital",
      description: "Young Indians increasingly believe in crowdfunding, impact investing, and supporting peers. Unlike previous generations, they're comfortable \"funding strangers' ideas\" if they believe in the cause. This mindset shift happened in 2020–2025.",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/18.svg"
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>The Perfect Storm for Innovation | DreamXec</title>
      <meta
        name="description"
        content="India is at an inflection point. Explore why now is the moment for student-led innovation to reshape India's future."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            The Perfect Storm for Innovation
          </h1>
          <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            India is at an inflection point. How student-led innovation will reshape the nation's future.
          </p>
        </section>

        {/* Introduction */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto">
              India is at an inflection point. We have 40 million college students—the largest youth population of any country. We have technology. We have market problems crying for solutions. We have global demand for Indian innovation. And yet, fewer than 0.1% of our student innovators get funded to turn ideas into reality.
            </p>
            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto">
              This is the "Perfect Storm"—not a disaster, but a moment where multiple forces align to create unprecedented opportunity. DreamXec exists to harness that opportunity and unlock innovation at scale. This essay explores why now is the moment, and how student-led innovation will reshape India's future.
            </p>
          </div>
        </section>

        {/* Innovation Gap */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            India's Innovation Gap
          </h2>

          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-6 text-center">
                The Data:
              </h3>
              <div className="space-y-4">
                {innovationGapData.map((item, index) => (
                  <div
                    key={index}
                    className="card-pastel p-4 md:p-6 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300 flex items-center justify-between gap-4"
                  >
                    <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl flex-1">
                      <span className="font-bold text-dreamxec-berkeley-blue">{item.stat}</span> {item.desc}
                    </p>
                    <img 
                      src={item.vector} 
                      alt="" 
                      className="w-16 h-16 md:w-20 md:h-20 opacity-60 shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-pastel p-4 md:p-6 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/11.svg" 
                alt="" 
                className="absolute bottom-2 right-2 w-20 h-20 md:w-24 md:h-24 opacity-30 pointer-events-none"
              />
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                The Narrative:
              </h3>
              <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed relative z-10">
                We celebrate IIT graduates who become founders. We celebrate "Indian unicorns." But we ignore the 4.95 million students <br></br> 
                with ideas who never get their shot. That's not meritocracy. That's gatekeeping.
              </p>
            </div>

            <div className="card-pastel p-4 md:p-6 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/18.svg" 
                alt="" 
                className="absolute bottom-2 right-2 w-20 h-20 md:w-24 md:h-24 opacity-30 pointer-events-none"
              />
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                What Gets Lost:
              </h3>
              <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed mb-4 relative z-10">
                Imagine if 1% of those 5 million innovators succeeded (50,000 projects):
              </p>
              <ul className="space-y-2 text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed relative z-10">
                <li>– 50,000 new social enterprises (sanitation, health, education, environment)</li>
                <li>– 20,000+ tech startups (competing with global leaders)</li>
                <li>– 100,000+ jobs created (these founders would hire, mentor, inspire)</li>
                <li>– Billions in economic value</li>
                <li>– Solutions to local problems that global tech ignores</li>
              </ul>
            </div>

            <div className="card-pastel p-4 md:p-6 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg" 
                alt="" 
                className="absolute bottom-2 right-2 w-20 h-20 md:w-24 md:h-24 opacity-30 pointer-events-none"
              />
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                Why This Gap Exists:
              </h3>
              <div className="space-y-4 relative z-10">
                <div>
                  <p className="font-bold text-dreamxec-navy text-base sm:text-lg md:text-xl mb-2">Funding Gap:</p>
                  <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    Students average ₹80L project needs. VCs want ₹1Cr+. Banks want collateral. Family support is limited. Result: 99.9% of students don't attempt projects.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-dreamxec-navy text-base sm:text-lg md:text-xl mb-2">Mentorship Gap:</p>
                  <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    Good mentorship is network-dependent. "Know someone who knows someone." Rural students, first-generation students, women founders—systematically excluded from elite mentor networks.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-dreamxec-navy text-base sm:text-lg md:text-xl mb-2">Credibility Gap:</p>
                  <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    A 22-year-old's idea is dismissed as "inexperienced." A 45-year-old's is "seasoned." Same idea, different reception.<br /> Students need platforms that validate their potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Why Now
          </h2>

          <div className="space-y-6">
            {whyNowReasons.map((reason, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-pastel animate-fade-in p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl md:text-4xl">{reason.icon}</span>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-berkeley-blue">
                      {reason.title}
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-dreamxec-navy font-medium leading-relaxed">
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

        {/* Role of Students & Youth */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Role of Students & Youth
          </h2>

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">🎓</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Why Students?
                  </h3>
                </div>
                <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed mb-4">
                  Students are the ideal innovators for the next decade:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-orange text-white text-sm font-bold flex items-center justify-center mt-1">1</span>
                    <span><span className="font-bold">Urgency:</span> They see problems through the lens of their own lives (mental health, education quality, job market uncertainty)</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-orange text-white text-sm font-bold flex items-center justify-center mt-1">2</span>
                    <span><span className="font-bold">Creativity:</span> Unburdened by "how we've always done it," they invent new approaches</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-orange text-white text-sm font-bold flex items-center justify-center mt-1">3</span>
                    <span><span className="font-bold">Speed:</span> Fewer resource constraints, less process overhead; they move fast</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-orange text-white text-sm font-bold flex items-center justify-center mt-1">4</span>
                    <span><span className="font-bold">Global Mind:</span> Exposed to global trends while embedded in local context</span>
                  </li>
                </ul>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg" 
                alt="" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">🚀</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Why Youth?
                  </h3>
                </div>
                <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                  By 2030, millennials and Gen Z will drive 40%+ of India's GDP. The ideas they fund today become the businesses they build tomorrow. Their decisions on "which student innovations deserve support" shape what industries emerge. Student funding is investment in future India.
                </p>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg" 
                alt="" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">💸</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    What Happens When We Fund Students:
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="bg-dreamxec-cream px-4 py-3 rounded-lg">
                    <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                      <span className="font-bold text-dreamxec-berkeley-blue">⏱️ Immediate:</span> Ideas become projects. Projects become prototypes. Some prototypes become startups.
                    </p>
                  </li>
                  <li className="bg-dreamxec-cream px-4 py-3 rounded-lg">
                    <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                      <span className="font-bold text-dreamxec-berkeley-blue">📅 Medium-term (5 years):</span> Funded students become junior leaders at companies, or founders of high-growth startups. They mentor the next wave of student innovators. Virtuous cycle.
                    </p>
                  </li>
                  <li className="bg-dreamxec-cream px-4 py-3 rounded-lg">
                    <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                      <span className="font-bold text-dreamxec-berkeley-blue">🏆 Long-term (10–20 years):</span> Cohort of 50,000+ innovators becomes C-suite executives, serial founders, social leaders, policymakers. They reshape industries because they learned to innovate early.
                    </p>
                  </li>
                </ul>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg" 
                alt="" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">📊</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Statistical Reality:
                  </h3>
                </div>
                <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                  VC-backed founders average age: 35. Student-funded founders average age: 22. If we can shift the founding age down by a little over 7 years, we get faster iteration, more founders, more chances at breakthrough innovation.
                </p>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg" 
                alt="" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>
          </div>
        </section>

        {/* DreamXec's Role */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            DreamXec's Role
          </h2>

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed mb-6">
                  We're not inventing anything new. Crowdfunding exists. Mentorship networks exist. Student innovation happens. We're just connecting the dots.
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">⚙️</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    What We Do:
                  </h3>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-green text-white text-sm font-bold flex items-center justify-center mt-1">1</span>
                    <span className="font-medium">Add mentorship: Automated matching so students don't need connections</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-green text-white text-sm font-bold flex items-center justify-center mt-1">2</span>
                    <span className="font-medium">Organize at scale: 460+ projects today, 10,000+ by 2027</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-green text-white text-sm font-bold flex items-center justify-center mt-1">3</span>
                    <span className="font-medium">Track outcomes: Prove that student innovation creates jobs, wealth, social change</span>
                  </li>
                  <li className="flex gap-3 items-start text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dreamxec-green text-white text-sm font-bold flex items-center justify-center mt-1">4</span>
                    <span className="font-medium">Enable policy: Provide data for government to invest further</span>
                  </li>
                </ul>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">⚡</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Our Role in the Perfect Storm:
                  </h3>
                </div>
                <div className="bg-dreamxec-cream px-4 py-4 rounded-lg">
                  <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed font-medium">
                    We're the platform that makes the collision of (40M students) + (mentorship desire) + (funding availability) + (regulatory support) actually happen.
                  </p>
                </div>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg" 
                alt="" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Conclusion
          </h2>

          <div className="card-pastel p-8 md:p-12 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card relative overflow-hidden">
            <img 
              src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg" 
              alt="" 
              className="absolute top-4 right-4 w-24 h-24 md:w-32 md:h-32 opacity-20 pointer-events-none"
            />
            <img 
              src="/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg" 
              alt="" 
              className="absolute bottom-4 left-4 w-20 h-20 md:w-28 md:h-28 opacity-20 pointer-events-none"
            />
            <div className="space-y-6 relative z-10">
              <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed text-center">
                🌩️ The Perfect Storm for Indian student innovation is here. The elements are: talented youth, government support, market demand, technology enablement, and platforms like DreamXec to organize it all.
              </p>
              <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed text-center">
                🌟 We're at the dawn of a new era. In 5 years, "being DreamXec-funded" will be as prestigious as "getting into IIT." In 10 years, half of India's startup founders will have started as DreamXec-backed students.
              </p>
              <p className="text-dreamxec-berkeley-blue text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-center">
                ⚡ The storm is forming. Are you going to ride it?
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          <a href="/dashboard">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🚀 Launch Your Innovation
              </h2>
            </div>
          </a>

          <a href="/browse-projects">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Support Student Projects
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default PerfectStorm