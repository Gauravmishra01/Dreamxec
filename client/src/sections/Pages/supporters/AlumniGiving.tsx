import { Header } from '../../Header'
import { Footer } from '../../Footer'

const AlumniGivingPrograms = () => {

  const reasons = [
    {
      title: "You've Been There",
      description: "You were a student with a big idea. Maybe you got funding. Maybe you didn't. Either way, you remember the challenge: finding someone who believed in you. Now, as an alumnus/alumna, you can be that person for today's students."
    },
    {
      title: "Unique Position",
      description: "Alumni understand student innovators better than anyone. You know the pressure, the self-doubt, the moment when belief makes all the difference. Your gift isn't just money—it's mentorship, role modeling, and proof that student innovation leads somewhere."
    },
    {
      title: "Alumni Success Network",
      description: "DreamXec alumni are now entrepreneurs, engineers, doctors, social leaders. Some are serial founders. Some are in director-level roles at major companies. Together, this community can create a powerful ecosystem—funding today's students and mentoring them to become tomorrow's change-makers."
    }
  ]

  const programTypes = [
    {
      title: "1. Give Once",
      description: "₹1K–₹10L pledge to a specific project or cause. Immediate impact. Your name on project page (if desired). Monthly updates on how your gift was used."
    },
    {
      title: "2. Monthly Giving",
      description: "₹500–₹5,000/month automatically funds new projects closely matching your theme preference. Recurring impact. Quarterly impact summaries. Alumni community badge."
    },
    {
      title: "3. Named Fund",
      description: "₹5L+ creates a permanent fund: \"Your Name Innovation Fund.\" Funds 5–10 projects annually. Naming rights in perpetuity. Annual beneficiary stories. Legacy building."
    },
    {
      title: "4. Mentorship Fund",
      description: "Combine your monetary contribution with mentorship hours (10–50 hours/year). You directly mentor funded students. Track their progress over years. High-touch impact."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Alumni Giving Programs | DreamXec</title>
      <meta
        name="description"
        content="Give Back to Students Walking in Your Footsteps. Alumni of DreamXec-backed projects can now create funds to support the next generation."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Give Back to Students Walking in Your Footsteps
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Alumni of DreamXec-backed projects can now create funds to support the next generation.
          </p>
        </section>

        {/* Why Alumni Giving */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Why Alumni Giving
          </h2>

          <div className="space-y-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-pastel animate-fade-in p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card max-w-7xl mx-auto hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-dreamxec-navy text-base md:text-xl font-medium leading-relaxed max-w-7xl mx-auto">
                  <span className="text-dreamxec-berkeley-blue font-bold">{reason.title}:</span> {reason.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Program Types */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Program Types
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {programTypes.map((program, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                  {program.title}
                </h3>
                <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          <a href="/alumni-named-fund">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🎓 Create Your Alumni Fund
              </h2>
            </div>
          </a>

          <a href="/alumni-monthly">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Start Monthly Giving
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default AlumniGivingPrograms