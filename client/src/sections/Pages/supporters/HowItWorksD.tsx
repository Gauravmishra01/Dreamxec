import { Header } from '../../Header'
import { FooterContent } from '../../Footer/components/FooterContent'
import useScrollReveal from '../../../hooks/useScrollReveal'
import { HorizontalCardCarousel } from '../../../components/HorizontalCardCarousel'

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

                    <HorizontalCardCarousel
                        cards={steps.map((step) => ({
                            title: step.title,
                            description: step.text,
                        }))}
                        autoScrollInterval={5000}
                        showPagination={true}
                    />
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

                    <HorizontalCardCarousel
                        cards={budgetBreakdown.map((item) => ({
                            title: item.category,
                            content: (
                                <div className="flex flex-col h-full justify-between">
                                    <p className="text-base md:text-lg text-dreamxec-navy mb-4">
                                        {item.description}
                                    </p>
                                    <span className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue text-center">
                                        {item.amount}
                                    </span>
                                </div>
                            ),
                        }))}
                        autoScrollInterval={4500}
                        showPagination={true}
                    />
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

                    <HorizontalCardCarousel
                        cards={impactMetrics.map((metric) => ({
                            title: metric.title,
                            description: metric.description,
                        }))}
                        autoScrollInterval={4500}
                        showPagination={true}
                    />
                </section>

                {/* -------------------- FAQ -------------------- */}
                <section
                    ref={faq.ref}
                    className={`px-4 reveal ${faq.isVisible ? 'reveal-visible' : ''}`}
                >
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center text-dreamxec-berkeley-blue mb-12">
                            Frequently Asked Questions
                        </h2>
                        <HorizontalCardCarousel
                            cards={FAQ.map((item) => ({
                                title: `Q: ${item.q}`,
                                description: `A: ${item.a}`,
                            }))}
                            autoScrollInterval={5000}
                            showPagination={true}
                        />
                    </div>
                </section>

            </main>

            <FooterContent />
        </>
    )

}

export default HowItWorksDonors
