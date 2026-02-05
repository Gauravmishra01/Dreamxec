import { Header } from '../../Header'
import { Footer } from '../../Footer'
import Carousel from '../../../components/ui/Carousel'
import TestimonialCard from '../../../components/ui/TestimonialCard'
import AnimatedSection from '../../../components/ui/AnimatedSection'

const FundInnovation = () => {

  const testimonials = [
    {
      quote: "Supporting student innovation through DreamXec has been incredibly rewarding. I've seen brilliant ideas come to life!",
      name: "Dr. Priya Sharma",
      role: "Tech Entrepreneur & Mentor"
    },
    {
      quote: "Every rupee I invest here goes directly to empowering the next generation of innovators. It's transparent and impactful.",
      name: "Rajesh Kumar",
      role: "Angel Investor"
    },
    {
      quote: "I funded three projects last year. Seeing their progress updates and final outcomes was worth every contribution.",
      name: "Anita Desai",
      role: "Corporate Donor"
    },
    {
      quote: "DreamXec makes it easy to find projects aligned with my interests. The student updates keep me engaged throughout.",
      name: "Vikram Patel",
      role: "Alumni Supporter"
    },
    {
      quote: "Supporting student research is an investment in India's future. DreamXec makes it simple and trustworthy.",
      name: "Meera Reddy",
      role: "Social Impact Investor"
    }
  ]

  const discoverMethods = [
    {
      title: "Browse by Category",
      description: "AI/ML, Robotics, Biotech, Social Impact, Education Tech, Healthcare, Environment, Arts & Design, and more."
    },
    {
      title: "Search by Keywords",
      description: "Looking for \"water conservation projects\" or \"mental health innovations\"? Use our search to find projects aligned with your interests."
    },
    {
      title: "Filter by Stage",
      description: "Ideation (earliest stage), Prototype (proof of concept), Execution (ready to go). Choose the risk level you're comfortable with."
    },
    {
      title: "Follow Favorite Creators",
      description: "Love a team's previous project? Follow them. You'll be notified the moment they launch their next idea."
    },
    {
      title: "Browse Collections",
      description: "\"Women-Led Innovations,\" \"Social Impact,\" \"Climate Tech\"—curated collections based on impact theme or creator background."
    }
  ]

  const trustPoints = [
    {
      title: "Your money is safe",
      description: "Funds are held in escrow until the project achieves 100% of goal or at project's end date. The disbursements are made as per the milestones specified at the time of the project listing."
    },
    {
      title: "You know where your money goes",
      description: "Every project specifies exactly how funds will be used: materials %, team stipends %, lab rentals %, etc. No hidden fees."
    },
    {
      title: "You see progress",
      description: "Creators post mandatory bi-weekly updates. You see the project evolving, challenges being solved, outcomes being delivered. No radio silence."
    },
    {
      title: "No equity. No complications",
      description: "Your contribution is a gift/donation. You don't own the project, and they don't owe you anything beyond delivery of promised outcomes (documented updates, final report)."
    },
    {
      title: "Open feedback loop",
      description: "If a project misuses funds or stops updating, report it. Our team investigates. Repeat offenders are removed from the platform."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Fund Innovation | DreamXec</title>
      <meta
        name="description"
        content="Your Support Powers India's Next Generation of Innovators. Discover projects transforming ideas into impact. Fund the innovations you believe in."
      />

      <Header />

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

        {/* Hero */}
        <AnimatedSection animation="fade-in">
          <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
              Your Support Powers India's Next Generation of Innovators
            </h1>
            <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover projects transforming ideas into impact. Fund the innovations you believe in.
            </p>
          </section>
        </AnimatedSection>

        {/* Testimonials Carousel */}
        <AnimatedSection animation="slide-up" delay={200}>
          <section className="max-w-7xl mx-auto px-4 space-y-12">
            <h2 className="text-dreamxec-berkeley-blue text-3xl md:text-5xl font-extrabold text-center">
              What Supporters Say
            </h2>
            <div className="pb-12">
              <Carousel
                slidesToShow={3}
                autoplaySpeed={4000}
                className="px-8"
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="px-2">
                    <TestimonialCard
                      quote={testimonial.quote}
                      name={testimonial.name}
                      role={testimonial.role}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </section>
        </AnimatedSection>

        {/* Intro */}
        <section className="max-w-6xl mx-auto  space-y-6">
          <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto">
            Every great innovation starts as a student's dream in a dorm room, hostel, or family home. DreamXec connects those dreamers with supporters like you—people who believe in potential before the world knows about it. When you fund a project on DreamXec, you're not just giving money. You're giving belief, validation, and a platform for that student to change their trajectory. Join 1.4 Billion Indians in supporting India's leap into the future.
          </p>
        </section>

        {/* How to Discover Projects */}
        <AnimatedSection animation="fade-in" delay={300}>
          <section className="max-w-7xl mx-auto px-4 space-y-12">
            <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
              How to Discover Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {discoverMethods.map((method, index) => (
                <AnimatedSection
                  key={index}
                  animation="slide-up"
                  delay={400 + index * 100}
                >
                  <div className="card-premium p-8">
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-dreamxec-berkeley-blue to-dreamxec-orange bg-clip-text text-transparent mb-3">
                      {method.title}
                    </h3>
                    <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Trust & Transparency */}
        <AnimatedSection animation="fade-in" delay={600}>
          <section className="max-w-7xl mx-auto px-4 space-y-12">
            <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
              Trust & Transparency
            </h2>

            <div className="space-y-6">
              {trustPoints.map((point, index) => (
                <AnimatedSection
                  key={index}
                  animation="slide-up"
                  delay={700 + index * 100}
                >
                  <div className="card-soft-shadow p-8">
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
                      {point.title}
                    </h3>
                    <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* CTA Section */}
        <section className="flex items-center justify-center gap-6 py-16">
          <a href="/discover-projects">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                🔍 Discover Projects Now
              </h2>
            </div>
          </a>

          <a href="/impact-stories">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                See Impact You've Created
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default FundInnovation