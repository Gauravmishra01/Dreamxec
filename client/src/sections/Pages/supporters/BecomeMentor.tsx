import { Header } from '../../Header'
import { Footer } from '../../Footer'

const BecomeMentor = () => {

  const mentorTypes = [
    "Engineers & technical leaders",
    "Entrepreneurs & startup founders",
    "Doctors & healthcare professionals",
    "Designers & product managers",
    "Writers & communication experts",
    "Business & finance professionals",
    "Social impact leaders & nonprofit founders",
    "Teachers & academic researchers",
    "Artists & creative professionals",
    "Domain specialists of any kind"
  ]

  const mentorBenefits = [
    {
      category: "Personal",
      points: [
        "Help a student change their life trajectory",
        "Stay connected to young minds and fresh ideas",
        "Give back without major time commitment (1 hour/week)",
        "Build your mentorship reputation",
        "Access to network of 1,000+ mentors on platform"
      ]
    },
    {
      category: "Professional",
      points: [
        "Find talent for your team (intern/hire pathways)",
        "Get market insights from student innovators",
        "Develop leadership & coaching skills",
        "LinkedIn visibility (mentor badge, public profile)",
        "Media features (great mentor stories get coverage)",
        "Tax benefits (if through registered organization)"
      ]
    },
    {
      category: "Intellectual",
      points: [
        "Stay sharp by solving student problems",
        "Co-publish research with student projects",
        "Explore ideas outside your day job",
        "Creative stimulation"
      ]
    }
  ]

  const mentorStories = [
    {
      name: "Arvind",
      title: "Senior Engineer at Google",
      story: "I mentor 2–3 DreamXec projects every year. It takes ~2 hours/week, and honestly? I learn as much as I teach. These 22-year-olds think about problems differently. One mentee's startup idea made me rethink our team's approach to a product. I now have 3 interns from DreamXec projects in my team. Best talent pipeline I've found."
    },
    {
      name: "Dr. Priya",
      title: "Doctor & Social Entrepreneur",
      story: "I mentor healthcare innovation projects. It's deeply meaningful—these students are solving real problems in rural health. I've helped 5 projects get funding. Watching them impact thousands of lives? That's why I became a doctor. Now DreamXec lets me multiply that impact by mentoring others."
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
              <ul className="space-y-3">
                {mentorTypes.map((type, index) => (
                  <li key={index} className="flex gap-3 text-dreamxec-navy text-base md:text-lg">
                    <span className="text-lg font-bold flex-shrink-0">–</span>
                    <span>{type}</span>
                  </li>
                ))}
              </ul>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mentorBenefits.map((benefit, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                  {benefit.category}:
                </h3>
                <ul className="space-y-3">
                  {benefit.points.map((point, idx) => (
                    <li key={idx} className="flex gap-2 text-dreamxec-navy text-sm md:text-base leading-relaxed">
                      <span className="text-lg font-bold flex-shrink-0">–</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Time Commitment */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Time Commitment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                Per Mentee: 1 Hour/Week
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-sm md:text-base leading-relaxed">
                <li>– Weekly 30–60 min calls (choose your schedule)</li>
                <li>– Async communication via platform (Slack-like chat)</li>
                <li>– Optional: project reviews, introduction facilitation</li>
                <li>– Duration: 8–12 weeks per project</li>
              </ul>
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                For Multiple Mentees
              </h3>
              <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed mb-4">
                You choose your capacity. Mentors work with 1–5 students simultaneously. Average: 2–3 mentees, which is 2–3 hours/week.
              </p>
              <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                Seasonal Option: Some mentors prefer intensive mentorship (10 hours/week for 4 weeks) rather than ongoing. Flexible models available.
              </p>
            </div>
          </div>
        </section>

        {/* Mentor Stories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Mentor Stories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {mentorStories.map((story, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue">
                    {story.name}
                  </h3>
                  <p className="text-dreamxec-navy text-sm md:text-base font-medium mt-1">
                    {story.title}
                  </p>
                </div>

                <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                  {story.story}
                </p>
              </div>
            ))}
          </div>
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