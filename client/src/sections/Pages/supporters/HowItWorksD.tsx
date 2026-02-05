import { Header } from '../../Header'
import { FooterContent } from '../../Footer/components/FooterContent'
import useScrollReveal from '../../../hooks/useScrollReveal'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const HowItWorksDonors = () => {

    /* -------------------- Scroll Reveal Hooks -------------------- */
    const fundingFlow = useScrollReveal()
    const transparency = useScrollReveal()
    const impact = useScrollReveal()
    const faq = useScrollReveal()

    /* -------------------- Data -------------------- */
    const steps = [
        {
            title: "STEP 1: DISCOVER & RESEARCH",
            text: "Browse projects by category, theme, or creator. Read the project description, watch the team's video, check creator credentials. Read backer comments and mentor feedback (often brutal honesty helps). Spend time. Make sure you genuinely believe in the project and team. Use the \"Follow\" button if you want to track progress without committing yet."
        },
        {
            title: "STEP 2: PLEDGE YOUR SUPPORT",
            text: "Choose your pledge amount (₹100 to ₹1L+). Review what you're supporting: the specific milestone or outcome you're backing. Confirm your contact info. Add an optional note to the creator (many backers share personal stories or encouragement—these mean a lot to young teams)."
        },
        {
            title: "STEP 3: SECURE PAYMENT & CONFIRMATION",
            text: "Pay via UPI, card, or wallet (Razorpay integration). Your pledge is confirmed. You receive a receipt. The project team is notified. You join a community of supporters on that project's backer page. Now watch as the team executes with mentors' guidance."
        },
        {
            title: "STEP 4: TRACK PROGRESS & IMPACT",
            text: "Receive bi-weekly updates from the team via email. See project progress, challenges overcome, milestones hit. Some projects invite backers to virtual progress calls (optional). Once complete, receive final report: what they built, what they learned, what impact they created, and what's next (job placement, patent filing, startup launch, etc.)."
        }
    ]

    const budgetBreakdown = [
        { category: "Materials & Supplies", amount: "30–40%", description: "(components, lab materials, equipment rentals)" },
        { category: "Team Stipends", amount: "20–30%", description: "(if students need to take time off internships/part-time jobs)" },
        { category: "Mentorship Support", amount: "5–10%", description: "(specialized mentors or consultants)" },
        { category: "Manufacturing / Production", amount: "15–25%", description: "(prototype → small-scale production)" },
        { category: "Platform & Legal", amount: "5%", description: "(DreamXec fees, compliance, insurance)" }
    ]

    const impactMetrics = [
        { title: "Career Outcomes", description: "Jobs, internships, or higher education admissions." },
        { title: "Innovation Impact", description: "Patents filed, research published, startups launched." },
        { title: "Social Impact", description: "Communities helped and problems solved." },
        { title: "Learning Gains", description: "Skills gained, confidence built, growth achieved." }
    ]

    const FAQ = [
        { q: "What's the minimum pledge amount?", a: "₹100. Small amounts collectively create big impact." },
        { q: "Can I change my pledge or get a refund?", a: "No. Since this is a donation, refunds are not possible." },
        { q: "What if a project fails?", a: "Research can fail. If misuse is suspected, DreamXec investigates and takes strict action." },
        { q: "Can I contribute anonymously?", a: "Yes. Enable Anonymous Backer during checkout." },
        { q: "How often do projects succeed?", a: "Success includes learning, iteration, and outcomes — not just final products." }
    ]

    return (
        <>
            {/* SEO */}
            <title>How It Works for Donors | DreamXec</title>
            <meta
                name="description"
                content="Support innovation in 4 simple steps. See how DreamXec turns donations into real-world impact."
            />

            <Header />

            <main className="space-y-24 py-20 w-full">

                {/* -------------------- Hero -------------------- */}
                <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
                    <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
                        Support Innovation in 4 Simple Steps
                    </h1>
                    <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        From discovering a project to seeing real-world impact — here’s exactly how DreamXec works.
                    </p>
                </section>

                {/* -------------------- Funding Flow -------------------- */}
                <section
                    ref={fundingFlow.ref}
                    className={`max-w-7xl mx-auto px-4 space-y-12 reveal ${fundingFlow.isVisible ? 'reveal-visible' : ''
                        }`}
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center text-dreamxec-berkeley-blue">
                        Funding Flow
                    </h2>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ 
                            delay: 4000, 
                            pauseOnMouseEnter: true,
                            disableOnInteraction: false
                        }}
                        breakpoints={{
                            768: { 
                                slidesPerView: 2,
                                spaceBetween: 24
                            },
                            1024: { 
                                slidesPerView: 3,
                                spaceBetween: 32
                            },
                        }}
                        className="pb-12"
                    >
                        {steps.map((step, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    style={{ transitionDelay: `${index * 120}ms` }}
                                    className={`card-pastel p-8 rounded-2xl border-4 border-dreamxec-navy shadow-pastel-card h-full
                                    hover:transform hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300
                                    reveal ${fundingFlow.isVisible ? 'reveal-visible' : ''}`}
                                >
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-dreamxec-navy text-lg md:text-xl leading-[1.75]">
                                        {step.text}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                {/* -------------------- Transparency -------------------- */}
                <section
                    ref={transparency.ref}
                    className={`max-w-7xl mx-auto px-4 space-y-12 reveal ${transparency.isVisible ? 'reveal-visible' : ''
                        }`}
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center text-dreamxec-berkeley-blue">
                        Money Usage Transparency
                    </h2>

                    <div className="space-y-4 max-w-5xl mx-auto">
                        {budgetBreakdown.map((item, index) => (
                            <div
                                key={index}
                                style={{ transitionDelay: `${index * 120}ms` }}
                                className={`card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card
              reveal ${transparency.isVisible ? 'reveal-visible' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                                            {item.category}
                                        </h4>
                                        <p className="text-base md:text-lg text-dreamxec-navy">
                                            {item.description}
                                        </p>
                                    </div>
                                    <span className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue">
                                        {item.amount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* -------------------- Impact -------------------- */}
                <section
                    ref={impact.ref}
                    className={`max-w-7xl mx-auto px-4 space-y-12 reveal ${impact.isVisible ? 'reveal-visible' : ''
                        }`}
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center text-dreamxec-berkeley-blue">
                        Impact Tracking
                    </h2>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ 
                            delay: 4000, 
                            pauseOnMouseEnter: true,
                            disableOnInteraction: false
                        }}
                        breakpoints={{
                            768: { 
                                slidesPerView: 2,
                                spaceBetween: 24
                            },
                            1024: { 
                                slidesPerView: 3,
                                spaceBetween: 32
                            },
                        }}
                        className="pb-12"
                    >
                        {impactMetrics.map((metric, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    style={{ transitionDelay: `${index * 120}ms` }}
                                    className={`card-pastel p-6 rounded-2xl border-4 border-dreamxec-navy shadow-pastel-card h-full
                                    hover:transform hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300
                                    reveal ${impact.isVisible ? 'reveal-visible' : ''}`}
                                >
                                    <h4 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                                        {metric.title}
                                    </h4>
                                    <p className="text-dreamxec-navy text-lg md:text-xl leading-relaxed">
                                        {metric.description}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                {/* -------------------- FAQ -------------------- */}
                <section
                    ref={faq.ref}
                    className={`px-4 reveal ${faq.isVisible ? 'reveal-visible' : ''}`}
                >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FAQ.map((item, index) => (
                            <div
                                key={index}
                                style={{ transitionDelay: `${index * 120}ms` }}
                                className="card-pastel-offwhite p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card"
                            >
                                <h3 className="text-lg md:text-xl font-bold mb-2 text-dreamxec-navy">
                                    Q: {item.q}
                                </h3>
                                <p className="text-base md:text-lg text-dreamxec-gray leading-relaxed">
                                    A: {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <FooterContent />
        </>
    )

}

export default HowItWorksDonors
