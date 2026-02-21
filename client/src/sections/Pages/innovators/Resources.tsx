import { Header } from '../../Header'
import { Footer } from '../../Footer'

const ResourceCenter = () => {

  const categories = [
    {
      title: "GET STARTED",
      subtitle: "Guides for First-Time Creators",
      resources: [
        "\"How to Write a Compelling Project Description\" (15 min read)",
        "\"Your First DreamXec Video: Template & Tips\" (video tutorial)",
        "\"Setting Your Funding Goal: The Right Way\" (calculator tool)",
        "\"Mentor Matching 101: Get the Most from Expert Mentors\" (guide)"
      ]
    },
    {
      title: "EXECUTE WITH CONFIDENCE",
      subtitle: "Guides for Ongoing Projects",
      resources: [
        "\"Campaign Momentum: Weekly Update Templates\" (templates)",
        "\"Handling Backer Feedback & Criticism\" (guide)",
        "\"Milestone Celebrations: Keeping Momentum High\" (playbook)",
        "\"Post-Funding Execution: From Promise to Delivery\" (checklist)"
      ]
    },
    {
      title: "GROW YOUR IMPACT",
      subtitle: "Guides for Scaling & Next Steps",
      resources: [
        "\"From Project to Startup: Next Steps After Funding\" (guide)",
        "\"Patent Filing 101: Protecting Your Innovation\" (step-by-step)",
        "\"Pitching to Investors: After DreamXec Success\" (workshop)",
        "\"Building a Founder Network: Alumni Community\" (networking guide)"
      ]
    }
  ]

  const resourceCards = [
    {
      title: "Writing Your Project Description",
      type: "Guide",
      description: "Master the 500-word art of capturing attention. Hook with your problem. Explain your solution. Prove your team. Watch backers convert."
    },
    {
      title: "Video Production on a Student Budget",
      type: "Video",
      description: "Phone, sunlight, clear audio, genuine energy. Here's how to make a compelling video without fancy equipment or Hollywood skills."
    },
    {
      title: "Mentor Matching Strategy",
      type: "Template",
      description: "Identify 5 ideal mentors. Craft personalized requests. Schedule weekly calls. Extract maximum value from expert guidance. Formula inside."
    },
    {
      title: "Campaign Momentum Tracker",
      type: "Spreadsheet",
      description: "Track daily views, pledges, comments, mentor requests. Identify what's working. Adjust strategy real-time. Includes weekly update templates."
    },
    {
      title: "Post-Funding Execution Checklist",
      type: "Downloadable",
      description: "30-item checklist covering legal setup, fund utilization, backer communication, milestone tracking, final delivery, and outcome reporting."
    },
    {
      title: "Investor Pitch Deck Template",
      type: "Editable",
      description: "Transform your DreamXec success into Series A pitch. Includes investor-speak translations, metrics formatting, and sample investor questions."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Resource Center | DreamXec</title>
      <meta
        name="description"
        content="Think, Learn, Apply & Build: Your Resource Library. Everything you need to go from idea to funded project."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Think, Learn, Apply & Build: Your Resource Library
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to go from idea to funded project.
          </p>
        </section>

        {/* Intro */}
        <section className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
          <p className="text-dreamxec-navy text-base md:text-xl font-semibold leading-relaxed max-w-7xl mx-auto">
            Launching a project can feel overwhelming. That's why DreamXec built a resource library—guides, templates, videos, webinars, mentor insights, and community stories. Whether you're writing your first pitch, navigating investor questions, or managing post-funding execution, you'll find practical resources here. Browse by category, watch videos, download templates, and learn from 460+ projects that came before you.
          </p>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Browse by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-pastel rounded-xl border-2 border-dreamxec-navy shadow-pastel-card p-6 md:p-8 animate-fade-in hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-berkeley-blue mb-2">
                  {category.title}
                </h3>
                <p className="text-sm md:text-base text-dreamxec-navy font-semibold mb-4">
                  {category.subtitle}
                </p>
                <ul className="space-y-2">
                  {category.resources.map((resource, idx) => (
                    <li key={idx} className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                      • {resource}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            Featured Resources
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {resourceCards.map((resource, index) => (
              <div
                key={index}
                className="card-pastel p-6 md:p-8 rounded-xl border-2 border-dreamxec-navy shadow-pastel-card hover:scale-105 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">
                  <span className="inline-block bg-dreamxec-berkeley-blue text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                    {resource.type}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                  {resource.title}
                </h3>

                <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                  {resource.description}
                </p>

                <button className="mt-4 text-dreamxec-navy font-bold text-sm md:text-base hover:text-dreamxec-berkeley-blue transition-colors">
                  Access Resource →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex items-center justify-center gap-6 py-16">
          <a href="/resources/download">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                📥 Download All Resources (PDF Bundle)
              </h2>
            </div>
          </a>

          <a href="/webinars">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Join Creator Webinar Series
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default ResourceCenter