import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { CardCarousel } from '../../../components/CardCarousel'

const ProjectEligibility = () => {

  const eligibleCategories = [
    {
      category: "STEM & Technology",
      items: "AI/ML applications, robotics, hardware prototypes, biotech, material science, renewable energy, IoT devices, apps, software platforms"
    },
    {
      category: "Social Impact",
      items: "Education tech, sanitation solutions, financial inclusion tools, healthcare access innovations, community development projects, environmental conservation efforts, language conservation"
    },
    {
      category: "Business & Entrepreneurship",
      items: "B2C startups, B2B platforms, D2C brands, service businesses, franchises, marketplaces (if student-led at launch)"
    },
    {
      category: "Research & Academic",
      items: "Undergraduate research projects, independent studies, lab innovations, published research requiring funding, open-source tools for community, deep tech"
    },
    {
      category: "Creative & Design",
      items: "Documentaries, art installations, design products, educational content creation, Generative AI music/media projects with social/commercial potential"
    }
  ]

  const eligibilityRequirements = [
    "Team members should be part of the club and be currently enrolled in an Indian college/university",
    "Project should have real impact in ideation, prototype, or early execution stage",
    "Clear problem statement and measurable solution",
    "Realistic timeline and budget",
    "Commitment to monthly updates and outcome reporting"
  ]

  const ineligibleCategories = [
    {
      title: "Personal Expenses",
      items: "Tuition fees, travel, accommodation, personal loans, wedding, car, fashion/luxury items, individual certifications"
    },
    {
      title: "Mature Businesses",
      items: "Companies with ₹10L+ annual revenue, established brands seeking expansion capital, debt repayment"
    },
    {
      title: "High-Risk/Unsafe Projects",
      items: "Weapons, explosives, dangerous drugs, illegal activities, Projects violating laws in any jurisdiction, Anything that could cause physical or environmental harm"
    },
    {
      title: "Speculative Ventures",
      items: "Crypto trading, forex, stock market gambling, multi-level marketing (MLM)"
    },
    {
      title: "Political/Religious Projects",
      items: "Partisan political campaigns, sectarian religious activities (interfaith collaboration is welcome)"
    },
    {
      title: "Duplicate Projects",
      items: "If exact concept already fully funded on DreamXec, we may decline to avoid backer confusion"
    },
    {
      title: "Insufficient Detail",
      items: "Projects with vague descriptions, unrealistic goals, or no clear team"
    }
  ]

  const reviewProcess = [
    {
      step: "Submission → Review (24–48 hours)",
      description: "You submit your project. Our team conducts initial screening: eligibility check, content quality review, potential concerns flag."
    },
    {
      step: "Feedback & Revision (48–72 hours)",
      description: "If approved: project goes live immediately. If needs revision: we provide specific feedback. You revise and resubmit (usually approved in 2nd attempt)."
    }
  ]

  const reviewChecklist = [
    "Does the project meet our eligibility criteria?",
    "Is the description clear, honest, and compelling?",
    "Is the video high-quality and authentic?",
    "Are the goals realistic and measurable?",
    "Is the team credible and diverse?",
    "Does it avoid red flags (safety, legality, ethics)?"
  ]

  const appealProcess = "If declined, you can appeal within 7 days with additional information or project revisions. Rare declines are discussed directly with founders."

  const videoRules = [
    "2–5 minutes recommended (can be shorter)",
    "Phone video is fine; clear audio and lighting matter more than equipment",
    "Show your face and team; authenticity beats production value",
    "Explain your problem, solution, and why you're the right team"
  ]

  const descriptionRules = [
    "300–500 words ideal",
    "Lead with problem statement (hook readers immediately)",
    "Use bullet points for clarity",
    "Include 2–3 images of prototype/progress",
    "Be honest about challenges and unknowns",
    "End with clear call-to-action for mentors/backers"
  ]

  const updatesRules = [
    "Post at least bi-weekly during campaign",
    "Share milestones, learnings, challenges, team stories",
    "Respond to comments within 24 hours",
    "Video updates increase engagement 5x"
  ]

  const legalItems = [
    {
      title: "Intellectual Property",
      text: "You retain full IP ownership. DreamXec has no claim on your patents, trademarks, or copyrights."
    },
    {
      title: "Funding Legality",
      text: "DreamXec operates as a crowdfunding platform. Funds received are gifts/donations (not loans or equity sales). No securities laws apply to student projects at this scale."
    },
    {
      title: "Taxes & Reporting",
      text: "For projects raising >₹5L, consult a CA regarding income tax implications. DreamXec will provide a funding summary for your records. Individual backers should maintain donation receipts."
    },
    {
      title: "Responsibility",
      text: "You are responsible for using funds legally and ethically. DreamXec reserves the right to pause payouts if illegal activity is suspected."
    }
  ]

  const FAQ = [
    {
      q: "Can I launch a for-profit startup?",
      a: "Yes! Many of our projects become profitable ventures. We welcome commercial projects as long as the student team is leading and initial focus is on learning/impact."
    },
    {
      q: "What if my project scope changes mid-campaign?",
      a: "Update your backers immediately (transparent communication). Minor scope shifts are fine if you explain the rationale. Major pivots may confuse backers—consult our support team."
    },
    {
      q: "Can I use DreamXec funds to hire people?",
      a: "Yes. You can hire other students, freelancers, or contractors. Just be transparent about team composition and use funds efficiently."
    },
    {
      q: "What happens if my project fails?",
      a: "There is no such thing as failure in research; it's just another learning on what not to do. Share a transparent post-mortem. Most backers value honesty over success. Many failed projects become learning case studies that help others. There's no shame in honest failure. Also remember to highlight key learnings and findings even if the hypothesis on which research is based has failed."
    },
    {
      q: "Can international students apply?",
      a: "If you're studying in India, yes. If you're studying abroad but want to fund a project in India, consult our team (case-by-case)."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Project Eligibility & Guidelines | DreamXec</title>
      <meta
        name="description"
        content="What Projects Can We Fund? Full Eligibility Guide. We support innovation in every field—from biotech to social impact. Here's what qualifies (and what doesn't)."
      />

      <Header />

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
            What Projects Can We Fund? Full Eligibility Guide
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We support innovation in every field—from biotech to social impact. Here's what qualifies (and what doesn't).
          </p>
        </section>

        {/* Eligible Projects */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Eligible Projects
          </h2>

          <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed text-center">
            DreamXec funds student-led innovations across:
          </p>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
            ariaLabel="Eligible project categories"
          >
            {eligibleCategories.map((cat, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-glass animate-fade-in p-8 text-left"
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-gray-250 mb-4">
                  {cat.category}
                </h3>
                <p className="text-base md:text-lg text-dreamxec-gray-600 font-semibold leading-relaxed">
                  {cat.items}
                </p>
              </div>
            ))}
          </CardCarousel>

          {/* Eligibility Requirements */}
          <div className="max-w-6xl mx-auto mt-12">
            <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-6 text-center">
              Eligibility Requirements:
            </h3>
            <div className="card-pastel p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <ul className="space-y-3">
                {eligibilityRequirements.map((req, index) => (
                  <li key={index} className="flex gap-3 text-dreamxec-navy text-base md:text-lg">
                    <span className="text-xl font-bold flex-shrink-0">✅</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Ineligible Projects */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Ineligible Projects
          </h2>

          <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed text-center">
            We cannot fund:
          </p>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
            ariaLabel="Ineligible project categories"
          >
            {ineligibleCategories.map((cat, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-glass animate-fade-in p-8 text-left"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-gray-250 mb-4">
                  ❌ {cat.title}
                </h3>
                <p className="text-base md:text-lg text-dreamxec-gray-600 font-semibold leading-relaxed">
                  {cat.items}
                </p>
              </div>
            ))}
          </CardCarousel>
        </section>

        {/* Review & Approval Process */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Review & Approval Process
          </h2>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
            ariaLabel="Review and approval process steps"
          >
            {reviewProcess.map((item, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-glass animate-fade-in p-8 text-left"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-gray-250 mb-4">
                  {item.step}
                </h3>
                <p className="text-base md:text-lg text-dreamxec-gray-600 font-semibold leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </CardCarousel>

          <div className="max-w-6xl mx-auto">
            <div className="card-glass p-8 text-left">
              <h3 className="text-xl md:text-2xl font-bold text-dreamxec-gray-250 mb-4">
                Appeal Process
              </h3>
              <p className="text-base md:text-lg text-dreamxec-gray-600 font-semibold leading-relaxed">
                {appealProcess}
              </p>
            </div>
          </div>

          {/* Review Checklist */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-6 text-center">
              What We Check:
            </h3>
            <div className="card-pastel p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <ul className="space-y-3">
                {reviewChecklist.map((item, index) => (
                  <li key={index} className="flex gap-3 text-dreamxec-navy text-base md:text-lg">
                    <span className="text-xl font-bold flex-shrink-0">✅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Content Rules */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Content Rules
          </h2>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
            ariaLabel="Content rules for project submissions"
          >
            <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                Videos:
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-sm md:text-lg leading-relaxed">
                {videoRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                Description:
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-sm md:text-lg leading-relaxed">
                {descriptionRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                Updates:
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-sm md:text-lg leading-relaxed">
                {updatesRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </CardCarousel>
        </section>

        {/* Legal & Compliance */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Legal & Compliance Note
          </h2>

          <CardCarousel
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
            ariaLabel="Legal and compliance information"
          >
            {legalItems.map((item, index) => (
              <div
                key={index}
                className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                  {item.title}:
                </h3>
                <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </CardCarousel>
        </section>

        {/* FAQ Section */}
        <section className="relative  px-4">
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
                Everything you need to know about project eligibility and guidelines
              </p>
            </div>

            {/* FAQ Grid */}
            <CardCarousel
              slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              ariaLabel="Frequently asked questions about project eligibility"
            >
              {FAQ.map((item, index) => (
                <div
                  key={index}
                  className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-tricolor-tag"></div>

                  <h3 className="text-lg font-bold text-dreamxec-navy font-display mb-3">
                    Q: {item.q}
                  </h3>

                  <p className="text-dreamxec-orange font-sans text-sm md:text-base leading-relaxed bg-dreamxec-cream px-4 py-3 rounded-lg">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </CardCarousel>

          </div>
        </section>

        {/* CTA Section */}
        <section className="flex items-center justify-center gap-6 ">
          <a href="/create-project">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🚀 Submit Your Project
              </h2>
            </div>
          </a>

          <a href="/how-it-works">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Learn How It Works
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default ProjectEligibility