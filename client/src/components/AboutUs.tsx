import { useNavigate } from 'react-router-dom';
// Actually, I'll build a custom one to be safe and simple, similar to other pages.

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dreamxec-cream pt-20"> {/* pt-20 to account for fixed header if any, or just spacing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-dreamxec-navy font-display mb-6">
                        About <span className="text-dreamxec-orange">DreamXec</span>
                    </h1>
                    <p className="text-xl text-dreamxec-navy/80 max-w-3xl mx-auto font-sans leading-relaxed">
                        Research Karega India Toh Badhega India
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-dreamxec-navy font-display">Our Mission</h2>
                        <p className="text-lg text-dreamxec-navy/70 font-sans leading-relaxed">
                            DreamXec is India's national crowdfunding platform dedicated to turning student projects into real-world innovations. We connect the brightest young minds with the capital and mentorship they need to build a self-reliant future.
                        </p>
                        <p className="text-lg text-dreamxec-navy/70 font-sans leading-relaxed">
                            We believe that every student in India has the potential to innovate, but often lacks the resources to bring their ideas to life. DreamXecbridges that gap.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-dreamxec-orange/20 rounded-xl transform rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                            alt="Students collaborating"
                            className="relative rounded-xl shadow-xl w-full h-auto object-cover"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-xl shadow-pastel-card border-2 border-dreamxec-navy/10 hover:border-dreamxec-orange transition-colors">
                        <div className="w-12 h-12 bg-dreamxec-orange/10 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-dreamxec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-3 font-display">Empowerment</h3>
                        <p className="text-dreamxec-navy/70">
                            Giving students the power to create, innovate, and lead the future of technology and social change.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-pastel-card border-2 border-dreamxec-navy/10 hover:border-dreamxec-orange transition-colors">
                        <div className="w-12 h-12 bg-dreamxec-berkeley-blue/10 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-dreamxec-berkeley-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-3 font-display">Community</h3>
                        <p className="text-dreamxec-navy/70">
                            Building a strong network of mentors, donors, and peers to support every step of the journey.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-pastel-card border-2 border-dreamxec-navy/10 hover:border-dreamxec-orange transition-colors">
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-3 font-display">Transparency</h3>
                        <p className="text-dreamxec-navy/70">
                            Ensuring every rupee donated goes directly to the project and its development with full accountability.
                        </p>
                    </div>
                </div>

                <div className="text-center bg-dreamxec-berkeley-blue rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-dreamxec-orange/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-dreamxec-orange/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-6 relative z-10">
                        Ready to Join the Revolution?
                    </h2>
                    <p className="text-dreamxec-cream/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Whether you're a student with a dream or a supporter who believes in the power of youth, there's a place for you here.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <button
                            onClick={() => navigate('/auth')}
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
        </div>
    );
};

export default AboutUs;
