import { useNavigate } from 'react-router-dom';
import { FooterContent } from '../sections/Footer/components/FooterContent';

const AboutUs = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role'); // "STUDENT" | "DONOR" | null

    return (
        <div className="min-h-screen  pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* HERO */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-dreamxec-navy font-display mb-6">
                        Research Karega India Toh Badhega India
                    </h1>

                    <div className="space-y-3 max-w-3xl mx-auto">
                        <p className="text-lg md:text-xl text-dreamxec-navy font-sans leading-relaxed">
                            DreamXec is India’s student innovation crowdfunding platform.
                        </p>
                        <p className="text-lg md:text-xl text-dreamxec-navy font-sans leading-relaxed">
                            We fund ideas, connect mentors, and help students turn research and curiosity into real-world impact.
                        </p>
                    </div>
                </div>

                {/* MISSION & VISION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center mb-24">
                    <div className="space-y-6 max-w-prose">
                        <h2 className="text-3xl font-bold text-dreamxec-navy font-display">
                            Our Mission & Vision
                        </h2>

                        <p className="text-lg text-dreamxec-navy font-sans leading-[1.75] text-justify">
                            Our mission is to democratize access to funding and mentorship for student innovators across India.
                            We believe that great ideas are not limited by college rankings, cities, or personal networks.
                            Talent exists everywhere—opportunity does not.
                        </p>

                        <p className="text-lg text-dreamxec-navy font-sans leading-[1.75] text-justify">
                            By 2030, DreamXec aims to enable over one million Indian students to launch, fund,
                            and execute innovation projects. These students will go on to build startups,
                            create jobs, file patents, and solve real social and technological problems—shaping
                            a more innovative, inclusive, and entrepreneurial India.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-dreamxec-orange/20 rounded-xl transform rotate-3 transition-transform group-hover:rotate-2"></div>
                        <img
                            src="https://res.cloudinary.com/dvqeeun29/image/upload/v1768358391/ChatGPT_Image_Jan_14_2026_08_08_19_AM_vw2ip1.png"
                            alt="Students collaborating"
                            className="relative rounded-xl shadow-xl w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* PROBLEM STATEMENT */}
                <div className="max-w-4xl mx-auto mb-24 text-center">
                    <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-6">
                        India’s Student Innovation Gap
                    </h2>

                    <p className="text-lg text-dreamxec-navy font-sans leading-relaxed">
                        India has over 40 million college students, with nearly 5 million actively trying to innovate.
                        Yet fewer than 50,000 receive meaningful funding—just 0.1%. Traditional banks consider student
                        projects too risky, venture capital focuses only on large-ticket opportunities, and mentorship
                        remains gatekept by networks rather than merit.
                    </p>

                    <p className="text-lg text-dreamxec-navy font-sans leading-relaxed mt-4">
                        Global platforms are expensive and not built for Indian students. The ideas exist.
                        The students exist. The demand for mentorship is massive. What’s missing is the right platform.
                        DreamXec exists to close this gap.
                    </p>
                </div>


                {/* CORE VALUES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-xl shadow-pastel-card border-2 border-dreamxec-navy">
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-3 font-display">
                            Belief in Potential
                        </h3>
                        <p className="text-dreamxec-navy">
                            We see possibility in every student idea—regardless of background,
                            college, or connections.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-pastel-card border-2 border-dreamxec-navy">
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-3 font-display">
                            Community Over Competition
                        </h3>
                        <p className="text-dreamxec-navy">
                            Students, mentors, and backers grow together—collaboration beats rivalry.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-pastel-card border-2 border-dreamxec-navy">
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-3 font-display">
                            Impact First
                        </h3>
                        <p className="text-dreamxec-navy">
                            Success is measured by real outcomes—careers built,
                            startups launched, and problems solved.
                        </p>
                    </div>
                </div>

                {/* HOW DREAMXEC IS DIFFERENT */}
                <div className="max-w-5xl mx-auto mb-20 text-center">
                    <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-6">
                        How DreamXec Is Different
                    </h2>

                    <p className="text-lg text-dreamxec-navy font-sans leading-relaxed">
                        DreamXec is built student-first: low minimum pledges starting at ₹100,
                        built-in mentorship during campaigns, India-specific payments and language
                        support, transparent governance with fair fees, and long-term tracking
                        of student outcomes—not vanity metrics.
                    </p>

                    <p className="text-lg text-dreamxec-navy font-sans leading-relaxed mt-4">
                        Every quarter, more students get funded. Every project supported
                        changes a trajectory forever.
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center bg-dreamxec-berkeley-blue rounded-3xl p-12 relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-64 h-64 bg-dreamxec-orange/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-dreamxec-orange/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-6 relative z-10">
                        Ready to Join the Revolution?
                    </h2>

                    <p className="text-dreamxec-cream/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Whether you're a student with a dream or a supporter who believes
                        in the power of youth, there’s a place for you here.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <button
                            onClick={() =>
                                navigate(
                                    role === 'DONOR'
                                        ? '/donor/dashboard'
                                        : '/dashboard'
                                )
                            }
                            className="px-8 py-3 bg-dreamxec-orange text-white font-bold rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-lg"
                        >
                            Get Started
                        </button>

                        <button
                            onClick={() => navigate('/campaigns')}
                            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Explore Campaigns
                        </button>
                    </div>
                </div>

            </div>

            <FooterContent />
        </div>
    );
};

export default AboutUs;
