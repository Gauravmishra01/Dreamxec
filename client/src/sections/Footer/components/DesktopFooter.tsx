import { useState } from 'react';
import { subscribeToNewsletter } from '../../../services/newsletterService';
import { FooterCarousel } from './FooterCarousel';
import '../FooterCarousel.css';

export const DesktopFooter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus('loading');
    setMessage('');

    try {
      await subscribeToNewsletter(email, 'footer');
      setStatus('success');
      setMessage('Subscribed successfully!');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to subscribe');
    }
  };

  return (
    <footer className="w-full bg-dreamxec-berkeley-blue border-t-4 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* 4-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-dreamxec-orange/20">

          {/* Column 1: DreamXec Brand & Mission */}
          <div className="space-y-6">
            <img
              src='assets/dx-logo-2.png'
              alt="DreamXec Logo"
              className="h-12 w-auto object-contain"
            />
            <h3 className="text-dreamxec-orange text-xl font-bold">
              Research Karega India Toh Badhega India
            </h3>
            <p className="text-dreamxec-cream text-sm leading-relaxed">
              DreamXec is India's crowdfunding platform dedicated to turning student projects into real-world innovations. We connect the brightest young minds with the capital and mentorship they need to build a self-reliant future.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3 pt-4">
              <h4 className="text-dreamxec-orange font-semibold text-base">
                Stay Ahead of Innovation
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 px-4 py-2 bg-dreamxec-cream/10 border border-dreamxec-orange/30 text-dreamxec-cream placeholder-dreamxec-cream/50 focus:outline-none focus:border-dreamxec-orange transition-colors disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status === 'loading' || status === 'success'}
                  className="px-6 py-2 bg-dreamxec-orange hover:bg-dreamxec-green text-white font-semibold transition-all duration-300 whitespace-nowrap disabled:bg-gray-500"
                >
                  {status === 'loading' ? '...' : status === 'success' ? '✔' : 'Subscribe'}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-xs mt-1">{message}</p>
              )}
              {status === 'success' && (
                <p className="text-green-400 text-xs mt-1">{message}</p>
              )}

              <p className="text-dreamxec-cream/70 text-xs">
                Get weekly briefs on India's most promising student projects, success stories, and funding opportunities.
              </p>
            </div>
          </div>

          {/* Column 2: For Innovators */}
          <div className="space-y-4">
            <h3 className="text-dreamxec-orange text-lg font-bold uppercase tracking-wide mb-6">
              For Innovators
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/start-project" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 font-semibold text-base">
                  Start a Project →
                </a>
              </li>
              {/* <li>
                <a href="/how-it-works/students" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  How It Works: For Students
                </a>
              </li> */}
              <li>
                <a href="/success-stories" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="/eligibility" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Project Eligibility & Guidelines
                </a>
              </li>
              {/* <li>
                <a href="/resources" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Resource Center
                </a>
              </li> */}
            </ul>
          </div>


          {/* Column 3: For Supporters */}
          <div className="space-y-4">
            <h3 className="text-dreamxec-orange text-lg font-bold uppercase tracking-wide mb-6">
              For Supporters
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/fund-innovation" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 font-semibold text-base">
                  Fund Innovation →
                </a>
              </li>
              <li>
                <a href="/how-it-works/donors" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  How It Works: For Donors
                </a>
              </li>
              <li>
                <a href="/why-donate" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Why Donate?
                </a>
              </li>
              <li>
                <a href="/corporate-partnerships" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Corporate & CSR Partnerships
                </a>
              </li>
              {/* <li>
                <a href="/alumni-giving" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Alumni Giving Programs
                </a>
              </li> */}
              <li>
                <a href="/become-mentor" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Become a Mentor
                </a>
              </li>
            </ul>
          </div>


          {/* Column 4: Company */}
          <div className="space-y-4">
            <h3 className="text-dreamxec-orange text-lg font-bold uppercase tracking-wide mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/perfect-storm" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  The Perfect Storm for Innovation
                </a>
              </li>
              <li>
                <a href="/press" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Press & Media
                </a>
              </li>
              {/* <li>
                <a href="/careers" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Careers
                </a>
              </li> */}
              <li>
                <a href="/contact" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Carousel - Illustration Cards */}
        <FooterCarousel />

        {/* Sub-Footer: Final Trust Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 items-center">
          {/* Left: Copyright */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="text-dreamxec-cream/70 text-sm">
              © 2025 DreamXec Investment Consultancy Pvt. LTD. All Rights Reserved.
            </p>
          </div>

          {/* Center: Social Media */}
          <div className="flex items-center justify-center gap-6 order-1 lg:order-2">
            <a
              href="https://www.linkedin.com/company/dreamxec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://twitter.com/dreamxec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300"
              aria-label="Twitter"
              title="Twitter/X"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/dreamxec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dreamxec-cream hover:text-dreamxec-orange transition-colors duration-300"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>


          {/* Right: Legal & Patriotic */}
          <div className="text-center lg:text-right order-3">
            <p className="text-dreamxec-cream/70 text-sm">
              <a href="/terms-And-Conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dreamxec-orange transition-colors">
                Terms of Service
              </a>
              {" | "}
              <a href="/privacy-policy" className="hover:text-dreamxec-orange transition-colors">
                Privacy Policy
              </a>
              <span className="inline-block ml-2">
                Made with ❤️ in India 🇮🇳
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};