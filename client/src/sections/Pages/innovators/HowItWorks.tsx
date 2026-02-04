import { Header } from '../../Header'
import { Footer } from '../../Footer'

const HowItWorksStudents = () => {

    const steps = [
        {
            title: "STEP 1: SIGN UP & COMPLETE YOUR PROFILE",
            text: "Create your DreamXec account (College email and mobile verification). Fill in your profile: bio, photo, college, field of study, what drives you. This builds trust with potential mentors and backers. A strong profile increases your chances of mentor matches by 3x. Answer all questions honestly—authenticity matters most."
        },
        {
            title: "STEP 2: CREATE YOUR PROJECT",
            text: "Write your project title, description (300–500 words), set your funding goal, timeline, and key milestones. Upload 1–3 images and a 2–5 minute video explaining your idea (phone video is fine). Mention your problem statement, solution, and how you'll measure success. Clarity here increases backer engagement by 4x."
        },
        {
            title: "STEP 3: REQUEST MENTOR MATCHES",
            text: "DreamXec's AI system analyzes your project and suggests 5–10 relevant mentors (engineers, entrepreneurs, domain experts). You can also search mentors by name/expertise. Send requests to 3–5 mentors with a personalized note (50–100 words). Most respond within 48 hours. Start with your top matches while your campaign is building momentum."
        },
        {
            title: "STEP 4: LAUNCH YOUR CAMPAIGN",
            text: "Your campaign goes live. Mentors and backers see it. You send launch updates to your network (friends, teachers, alumni groups, social media). Share daily or weekly to maintain momentum. Respond quickly to backer comments and mentor inquiries. Active creators see 80% higher success rates."
        },
        {
            title: "STEP 5: DELIVER AFTER FUNDING",
            text: "Campaign ended and you hit your goal? Congratulations! Now comes execution: weekly updates to backers, regular mentor check-ins, milestone celebrations, and final outcome reporting. Most projects deliver within the promised timeline. Successful delivery builds your reputation for future projects."
        }
    ]

    return (
        <>
            {/* SEO */}
            <title>How It Works for Students | DreamXec</title>
            <meta
                name="description"
                content="The complete guide to launching your project on DreamXec. Learn how students sign up, create projects, get mentors, raise funds, and deliver impact."
            />

            <Header />

            <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center space-y-6">
                    <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold animate-fade-in">
                        The Complete Guide to Launching Your Project on DreamXec
                    </h1>
                    <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        From idea to impact in 5 steps. Here's exactly how to navigate the DreamXec
                        platform and turn your vision into reality.
                    </p>
                </section>

                {/* Overview */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
                    <h1 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
                        Overview
                    </h1>
                    <p className="text-dreamxec-navy text-base md:text-xl leading-relaxed">
                        Launching a project on DreamXec is a structured journey designed to maximize
                        your success. You're not just raising money—you're building a support system
                        of mentors, backers, and community members who believe in your impact. This
                        guide walks you through every stage: from project creation to mentor matching
                        to campaign execution to post-funding delivery. Follow these steps, and
                        you'll join the coveted 500+ innovators we will help succeed in their
                        research journey!.
                    </p>
                </section>

                {/* Step-by-Step – Transparent / Glass Cards */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
                    <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
                        Step-by-Step Guide
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-5xl mx-auto">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                style={{ animationDelay: `${index * 120}ms` }}
                                className="card-glass animate-fade-in p-6 md:p-8 text-left hover:shadow-lg transition-shadow duration-300"
                            >
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-gray-250 mb-4">
                                    {step.title}
                                </h3>

                                <p className="text-base md:text-lg lg:text-xl text-dreamxec-gray-600 font-semibold leading-relaxed">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Do's & Don'ts */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
                        Do&apos;s & Don&apos;ts
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-2xl font-bold mb-4">DO</h3>
                            <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                <li>✅ Be honest about your timeline and challenges</li>
                                <li>✅ Post regular updates (bi-weekly minimum)</li>
                                <li>✅ Respond to every backer comment within 24 hours</li>
                                <li>✅ Use video updates (they increase backer engagement 5x)</li>
                                <li>✅ Celebrate small wins publicly</li>
                                <li>✅ Ask mentors for introductions or advice</li>
                            </ul>
                        </div>

                        <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-2xl font-bold mb-4">DON&apos;T</h3>
                            <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                <li>❌ Exaggerate your past experience or credentials</li>
                                <li>❌ Go silent for weeks (backers lose trust)</li>
                                <li>❌ Use funds for anything outside your stated scope</li>
                                <li>❌ Ignore backer or mentor feedback</li>
                                <li>❌ Promise unrealistic outcomes</li>
                                <li>❌ Launch without a clear problem statement</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Common Mistakes */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                    <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
                        Common Mistakes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                                Vague Project Description
                            </h3>
                            <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                Vague project description. "We're building an app" doesn't cut it. Explain
                                why (problem), what (solution), how (approach), impact (measurable outcome).
                                Specific projects raise 3x more.
                            </p>
                        </div>

                        <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
                            <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                                Incorrect Funding Goal
                            </h3>
                            <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                Setting the wrong funding goal. Too low = underestimate costs. Too high =
                                looks unrealistic. Research similar projects; aim for ₹1–5L for most student
                                projects.
                            </p>
                        </div>

                        <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
                            <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                                Poor Video Quality
                            </h3>
                            <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                Poor video quality. Doesn't need to be Hollywood. Just clear lighting, good
                                audio, genuine enthusiasm. Phone videos often outperform produced videos
                                because they feel authentic.
                            </p>
                        </div>

                        <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
                            <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                                Missing Updates
                            </h3>
                            <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                Missing milestone updates. Not updating donors/backers can reduce trust and
                                hurt future fundraising. Credibility and consistency accelerate success.
                            </p>
                        </div>

                    </div>

                </section>

                {/* CTA – Pill Style */}
                <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
                    <a href="/create-project">
                        <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
                            <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                                🚀 Create Your Project Now
                            </h2>
                        </div>
                    </a>

                    <a href="/mentors">
                        <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
                            <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                                Browse Mentor Directory
                            </h2>
                        </div>
                    </a>

                    <a href="/innovators/success-stories">
                        <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
                            <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                                Read a Success Story
                            </h2>
                        </div>
                    </a>
                </section>

            </main>

            <Footer />
        </>
    )
}

export default HowItWorksStudents
