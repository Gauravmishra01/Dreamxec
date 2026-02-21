import { Header } from '../../Header'
import { Footer } from '../../Footer'

const Careers = () => {

  const cultureValues = [
    { title: "Bias for Impact", desc: "Decisions are made through the lens of \"which choice helps more students succeed?\"" },
    { title: "Transparency", desc: "Salaries are open. Decisions are debated publicly. Failures are learning opportunities." },
    { title: "Student-First", desc: "You'll regularly talk to students using the platform. They'll shape your decisions." },
    { title: "Diverse Backgrounds", desc: "Engineers, teachers, designers, policy experts, marketers. We hire for mission fit, not pedigree." },
    { title: "Flexibility", desc: "Remote work. Flexible hours. Time for side projects (we encourage mentoring DreamXec students)." },
    { title: "Learning Budget", desc: "₹50K/year per employee for courses, conferences, books." }
  ]

  const whyWork = [
    {
      title: "Impact",
      desc: "You're not optimizing click-through rates for ads. You're helping students change their lives. That matters."
    },
    {
      title: "Growth",
      desc: "Fast-scaling startup (500+ projects in 2026 → 10,000+ by 2027). You'll take on 5x your current responsibilities. Rapidly level up."
    },
    {
      title: "Learn",
      desc: "Your knowledge will not be limited to just one field but you will be privy to developments happening across industries and verticals."
    },
    {
      title: "Network",
      desc: "Work with 1,000+ mentors, 5,000+ backers, 10,000+ students. Incredible network effects."
    }
  ]

  const openRoles = [
    "Campus Partnership Executive (pan-India, Full-time)",
    "Corporate Partnership Executive (pan-India, Full-time)",
  ]

  const internshipBenefits = [
    "Mentorship",
    "Real project ownership",
    "Job offer potential if you perform well",
    "Networking with 1,000+ mentors"
  ]

  return (
    <>
      {/* SEO */}
      <title>Careers at DreamXec | Join Our Team</title>
      <meta
        name="description"
        content="Build the Future of Student Innovation. Join DreamXec. Help us unlock potential for 1 million Indian students."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            Build the Future of Student Innovation
          </h1>
          <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Join DreamXec. Help us unlock potential for 1 million Indian students.
          </p>
        </section>

        {/* Culture & Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Culture & Values
          </h2>

          <div className="max-w-7xl mx-auto mb-8">
            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto">
              DreamXec Culture: We're mission-driven, not just profit-driven. Everyone here believes student innovation will reshape India. That belief shows up in how we work:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {cultureValues.map((value, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg md:text-xl font-bold text-dreamxec-berkeley-blue mb-3">
                  {value.title}
                </h3>
                 <p className="text-dreamxec-navy text-sm sm:text-base md:text-lg leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Work at DreamXec */}
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Why Work at DreamXec
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {whyWork.map((item, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                  {item.title}
                </h3>
                <p className="text-dreamxec-navy text-sm sm:text-base md:text-lg leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Roles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Open Roles
          </h2>

          <div className="max-w-7xl mx-auto">
            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto mb-8">
              We're currently hiring for:
            </p>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300 mb-8">
              <ul className="space-y-3">
                {openRoles.map((role, index) => (
                  <li key={index} className="flex gap-3 text-dreamxec-navy text-base sm:text-lg md:text-xl">
                    <span className="text-lg font-bold flex-shrink-0">–</span>
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
              <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                All roles are open to remote candidates (India-based). We hire for potential + mission alignment over just experience.
              </p>
            </div>
          </div>
        </section>

        {/* Internship Info */}
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Internship Program
          </h2>

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
              <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed mb-6">
                DreamXec Internships: 3–6 month programs for students/recent grads. Roles in Engineering, Product, Community, Partnerships, Content, Design.
              </p>

              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                What You Get:
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                {internshipBenefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="font-bold flex-shrink-0">–</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                Application
              </h3>
              <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed">
                <span className="font-mono bg-dreamxec-cream px-2 py-1 rounded">careers@dreamxec.com</span> (CV + cover letter)
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          {/* <a href="/careers/open-roles">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                💼 View All Open Roles
              </h2>
            </div>
          </a> */}

          <a href="https://forms.gle/E8EXaPfyvr9ZgNqXA" target="_blank" rel="noopener noreferrer">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Join Our Internship Program
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default Careers