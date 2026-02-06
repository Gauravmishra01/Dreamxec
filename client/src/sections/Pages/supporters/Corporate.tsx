import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { CardCarousel } from '../../../components/CardCarousel'

const CorporateCSRPartnerships = () => {

  const sdgAlignments = [
    {
      sdg: "SDG 4 (Quality Education)",
      description: "We fund student innovation, capacity building, and skill development—core to NEP 2020"
    },
    {
      sdg: "SDG 8 (Decent Work & Economic Growth)",
      description: "Funded students get jobs, start companies, create employment"
    },
    {
      sdg: "SDG 5 (Gender Equality)",
      description: "40% of our projects are women-led; we actively encourage female innovators"
    },
    {
      sdg: "SDG 10 (Reduced Inequality)",
      description: "Focus on underrepresented geographies (Tier 2/3 cities)"
    },
    {
      sdg: "SDG 17 (Partnerships)",
      description: "Multi-stakeholder model (corporates, mentors, government, students)"
    }
  ]

  const partnerships = [
    {
      title: "MODEL 1: ANNUAL INNOVATION GRANT (₹50–200L)",
      description: "You allocate CSR budget to \"Fund Indian Student Innovation\" because ;Research karega India to Badhega India' initiative. DreamXec vets projects, you decide thematic focus (e.g., \"AI for Social Good\" or \"Women-Led Startups\"). We curate 10–20 projects per year. Sponsorship: all funded projects acknowledge your support, quarterly impact reports, co-hosted webinars, intern pathways to your company."
    },
    {
      title: "MODEL 2: LONG-TERM PARTNERSHIP (₹1-5Cr, Multi-Year)",
      description: "Deep collaboration. You become a founding partner. Dedicated program: \"Acme Corporation Innovation Fund\" with 500+ funded projects over 3 years. Includes: executive mentor network, internship pipeline, recruitment from DreamXec alumni, co-branded learning hub. Maximum credibility, leadership positioning, talent acquisition."
    },
    {
      title: "MODEL 3: PROJECT/CLUB or COLLEGE EVENT SPONSORSHIP (₹10–50L)",
      description: "You choose projects/club/college events aligning with your brand requirement (e.g., green tech, women entrepreneurs,healthcare innovation, intercollege events or fests). You fund them fully or co-fund with other supporters. Heavy branding: your logo on promotional material, creator mentions you in updates, case study in your CSR report. ROI: emotional connection with young innovators, authentic impact story, media coverage."
    }
  ]

  const corporateBenefits = [
    {
      category: "Brand & Reputation",
      points: [
        "Position as \"supporting India's next generation\" and \"India's leap into the future\"",
        "Media coverage (startup stories, CSR features, thought leadership)",
        "Employee volunteer opportunities (mentoring students)",
        "Authentic brand love from young demographics (future customers)"
      ]
    },
    {
      category: "Talent Acquisition",
      points: [
        "Direct pipeline to pre-vetted student innovators",
        "Internship pathways (find talent early)",
        "Recruitment advantage (associate with innovation)",
        "Alumni network (track funded students throughout careers)"
      ]
    },
    {
      category: "Strategic Insight",
      points: [
        "Early signals of tech trends (funded projects indicate market direction)",
        "Customer feedback (interact with young minds)",
        "Innovation ideas (students often think creatively about your industry challenges)"
      ]
    },
    {
      category: "Tax Benefits",
      points: [
        "80G certification (donations are tax-deductible)",
        "CSR spend recognition (up to 2% of profit)",
        "Measurable impact reporting (audited outcomes)"
      ]
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Corporate & CSR Partnerships | DreamXec</title>
      <meta
        name="description"
        content="Turn Your CSR Into Real Student Impact. Partner with DreamXec to fund innovation, build brand love, and align with NEP 2020 goals."
      />

      <Header />

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
            Turn Your CSR Into Real Student Impact
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Partner with DreamXec to fund innovation, build brand love, and align with NEP 2020 goals.
          </p>
        </section>

        {/* CSR Alignment */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            CSR Alignment
          </h2>

          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-8 text-center">
              Why DreamXec Fits Your CSR Strategy:
            </h3>

            <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto mb-8">
              DreamXec has the potential to create impact for all '17' UN declared Sustainable Development Growth with direct alignment with multiple SDGs and government priorities:
            </p>

            <div className="space-y-4">
              {sdgAlignments.map((item, index) => (
                <div
                  key={index}
                  className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card"
                >
                  <h4 className="text-lg md:text-xl font-bold text-dreamxec-berkeley-blue mb-2">
                    * {item.sdg}
                  </h4>
                  <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Partnership Models
          </h2>

          <div className="space-y-8">
            {partnerships.map((model, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 120}ms` }}
                className="card-glass animate-fade-in p-8 max-w-6xl mx-auto"
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-gray-250 mb-4">
                  {model.title}
                </h3>
                <p className="text-base md:text-lg text-dreamxec-gray-600 font-semibold leading-relaxed">
                  {model.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Corporate Benefits */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Corporate Benefits
          </h2>

          <CardCarousel
            ariaLabel="Corporate benefits and advantages"
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            {corporateBenefits.map((benefit, index) => (
              <div
                key={index}
                className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card"
              >
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4">
                  {benefit.category}:
                </h3>
                <ul className="space-y-3">
                  {benefit.points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-dreamxec-navy text-sm md:text-base leading-relaxed">
                      <span className="text-lg font-bold flex-shrink-0">*</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardCarousel>
        </section>

        {/* CTA Section */}
        <section className="flex items-center justify-center gap-6 py-16">
          <a href="/contact">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                💼 Discuss Partnership Options
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default CorporateCSRPartnerships