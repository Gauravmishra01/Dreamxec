import { Header } from '../../Header'
import { Footer } from '../../Footer'
import Carousel from '../../../components/ui/Carousel'
import AnimatedSection from '../../../components/ui/AnimatedSection'
import { BookOpen, Video, FileText, Download, Users, Lightbulb } from 'lucide-react'

const ResourceCenter = () => {

  const partnerLogos = [
    { name: "IIT Delhi", logo: "🎓" },
    { name: "IISc Bangalore", logo: "🔬" },
    { name: "BITS Pilani", logo: "📚" },
    { name: "NIT Trichy", logo: "⚙️" },
    { name: "Anna University", logo: "🏛️" },
    { name: "Delhi University", logo: "📖" },
    { name: "Mumbai University", logo: "🌟" },
    { name: "Jadavpur University", logo: "💡" },
  ]

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

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

        {/* Hero */}
        <AnimatedSection animation="fade-in">
          <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
              Think, Learn, Apply & Build: Your Resource Library
            </h1>
            <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Everything you need to go from idea to funded project.
            </p>
          </section>
        </AnimatedSection>

        {/* Partner Logos Carousel */}
        <AnimatedSection animation="slide-up" delay={200}>
          <section className="max-w-7xl mx-auto px-4 space-y-8">
            <h2 className="text-dreamxec-berkeley-blue text-2xl md:text-3xl font-bold text-center">
              Trusted by Students from Leading Institutions
            </h2>
            <div className="pb-12">
              <Carousel
                slidesToShow={4}
                autoplaySpeed={2500}
                arrows={false}
                className="px-8"
              >
                {partnerLogos.map((partner, index) => (
                  <div key={index} className="px-2">
                    <div className="card-glass-modern p-6 h-32 flex flex-col items-center justify-center">
                      <span className="text-4xl mb-2">{partner.logo}</span>
                      <p className="text-dreamxec-navy font-semibold text-sm text-center">{partner.name}</p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </section>
        </AnimatedSection>

        {/* Intro */}
        <section className="max-w-6xl mx-auto space-y-6">
          <p className="text-dreamxec-navy text-base md:text-xl font-semibold leading-relaxed max-w-7xl mx-auto">
            Launching a project can feel overwhelming. That's why DreamXec built a resource library—guides, templates, videos, webinars, mentor insights, and community stories. Whether you're writing your first pitch, navigating investor questions, or managing post-funding execution, you'll find practical resources here. Browse by category, watch videos, download templates, and learn from 460+ projects that came before you.
          </p>
        </section>

        {/* Categories */}
        <AnimatedSection animation="fade-in" delay={300}>
          <section className="max-w-7xl mx-auto px-4 space-y-12">
            <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
              Browse by Category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <AnimatedSection
                  key={index}
                  animation="slide-up"
                  delay={400 + index * 100}
                >
                  <div className="card-premium p-6">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-dreamxec-berkeley-blue to-dreamxec-navy bg-clip-text text-transparent mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm md:text-base text-dreamxec-navy font-semibold mb-4">
                      {category.subtitle}
                    </p>
                    <ul className="space-y-2">
                      {category.resources.map((resource, idx) => (
                        <li key={idx} className="text-dreamxec-navy text-sm md:text-base leading-relaxed flex items-start gap-2">
                          <span className="text-dreamxec-orange mt-1">•</span>
                          <span>{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Resource Cards */}
        <AnimatedSection animation="fade-in" delay={600}>
          <section className="max-w-7xl mx-auto px-4 space-y-12">
            <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
              Featured Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resourceCards.map((resource, index) => (
                <AnimatedSection
                  key={index}
                  animation="scale"
                  delay={700 + index * 80}
                >
                  <div className="card-soft-shadow p-6">
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-dreamxec-orange to-orange-600 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
                        {resource.type}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-dreamxec-berkeley-blue to-dreamxec-navy bg-clip-text text-transparent mb-3">
                      {resource.title}
                    </h3>

                    <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed mb-4">
                      {resource.description}
                    </p>

                    <button className="mt-auto inline-flex items-center gap-2 text-dreamxec-orange font-bold text-sm md:text-base hover:gap-3 transition-all group">
                      <span>Access Resource</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

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