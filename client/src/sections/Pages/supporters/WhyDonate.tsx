import { Header } from '../../Header'
import { Footer } from '../../Footer'

const WhyDonate = () => {

  const reasons = [
    {
      title: "For Students",
      description: "A DreamXec pledge is more than money—it's validation. When a 20-year-old sees 100 people believe in their idea enough to fund it, something shifts. Confidence soars. The impossible suddenly seems doable. Many of our backed students tell us: \"Getting DreamXec funding was my turning point. I stopped doubting myself and started building.\""
    },
    {
      title: "For India",
      description: "Student innovation is India's secret superpower. We have 40M college students, yet only 0.1% get funded. Imagine if that number was 1%. Or 5%. The inventions, startups, jobs, and social impact would be transformative. Your support accelerates that shift."
    },
    {
      title: "For Systemic Change",
      description: "Every successful student project proves the model works. Investors see it. The government sees it. colleges see it. More funding flows to innovation. More teachers encourage students. More colleges build maker spaces. One donation creates a ripple effect."
    }
  ]

  const stories = [
    {
      name: "Sandeep",
      title: "45, Corporate Executive",
      story: "I backed 12 projects over 2 years. One was an AI app for farmers. Another was a water sensor for rural areas. Seeing those 20-year-old founders execute with confidence—it reminded me why I love India's potential. Three of them reached out later for job interviews. Two are now in my team. Best ROI I've ever made."
    },
    {
      name: "Priya & Raj",
      title: "Retired Teachers",
      story: "We give ₹5,000 each month to random projects. We love reading the updates, seeing young minds solve real problems. Our grandchildren know about 'Grandpa's fund' and want to launch projects themselves. We've created a family legacy of supporting innovation."
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

          <div className="space-y-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-glass animate-fade-in p-6 md:p-8 max-w-7xl mx-auto hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-dreamxec-navy text-base md:text-2xl  leading-relaxed max-w-7xl mx-auto">
                  <span className="text-dreamxec-berkeley-blue font-semibold">{reason.title}:</span> {reason.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Donor Stories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Donor Stories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {stories.map((story, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue">
                    {story.name}
                  </h3>
                  <p className="text-dreamxec-navy text-sm md:text-base font-semibold mt-1">
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
          <a href="/discover-projects">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🚀 Start Supporting Projects
              </h2>
            </div>
          </a>

          <a href="/monthly-giving">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Schedule Monthly Giving
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default WhyDonate