import { Header } from '../Header'
import { Footer } from '../Footer'
interface ComingSoonProps {
  title: string
  subtitle?: string
}
const ComingSoon = ({ title, subtitle }: ComingSoonProps) => {
  return (
    <>
      {/* SEO */}
      <title>{title} | DreamXec</title>
      <meta
        name="description"
        content={`${title} page is coming soon. Stay tuned for exciting updates from DreamXec.`}
      />
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8">
          {/* Icon or Illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <img
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg"
                alt="Coming Soon"
                className="w-full h-full object-contain animate-float-slow"
              />
            </div>
          </div>
          {/* Main Heading */}
          <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            {title}
          </h1>
          {/* Subtitle */}
          {subtitle && (
            <h2 className="text-dreamxec-navy text-xl md:text-2xl lg:text-3xl font-semibold">
              {subtitle}
            </h2>
          )}
          {/* Coming Soon Message */}
          <div className="card-glass p-8 md:p-12 rounded-2xl max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="inline-block px-6 py-3 bg-dreamxec-orange/10 rounded-full">
                <p className="text-dreamxec-orange text-lg md:text-xl font-bold uppercase tracking-wide">
                  Coming Soon
                </p>
              </div>
              
              <p className="text-dreamxec-navy text-lg md:text-xl leading-relaxed">
                We're working on something exciting. Stay tuned!
              </p>
              
              <p className="text-dreamxec-gray-500 text-base md:text-lg">
                This page will be available soon with amazing content to help you on your innovation journey.
              </p>
            </div>
          </div>
          {/* CTA Section */}
          <div className="pt-8 space-y-4">
            <p className="text-dreamxec-navy text-base md:text-lg font-semibold">
              In the meantime, explore other sections:
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/"
                className="px-6 py-3 bg-dreamxec-berkeley-blue text-white font-semibold rounded-lg hover:bg-dreamxec-orange transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Home
              </a>
              <a
                href="/campaigns"
                className="px-6 py-3 bg-dreamxec-orange text-white font-semibold rounded-lg hover:bg-dreamxec-green transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Campaigns
              </a>
              <a
                href="/contact"
                className="px-6 py-3 bg-dreamxec-green text-white font-semibold rounded-lg hover:bg-dreamxec-berkeley-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
export default ComingSoon