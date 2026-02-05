import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { Mail, Phone, MessageSquare, Linkedin, Twitter, Instagram, MapPin, FileText } from 'lucide-react'
import AnimatedSection from '../../../components/ui/AnimatedSection'

const ContactUs = () => {

  const contactCategories = [
    {
      title: "For Student & Project Support",
      email: "support@dreamxec.com",
      details: "Response time: 24–48 hours"
    },
    {
      title: "For Partnerships & Sponsorships",
      email: "partnerships@dreamxec.com",
      details: "Call [Phone]: Mon–Fri 10am–6pm"
    },
    {
      title: "For Press & Media",
      email: "pr@dreamxec.com",
      details: ""
    },
    {
      title: "For General Inquiries",
      email: "hello@dreamxec.com",
      details: "Chat with our team on Discord: [Discord link]"
    }
  ]

  const socials = [
    { platform: "Instagram", handle: "@dreamxec", url: "#" },
    { platform: "LinkedIn", handle: "linkedin.com/company/dreamxec", url: "#" },
    { platform: "Twitter", handle: "@DreamXecIndia", url: "#" }
  ]

  return (
    <>
      {/* SEO */}
      <title>Contact Us | DreamXec</title>
      <meta
        name="description"
        content="Have questions? Want to partner with DreamXec? Need support with your project? We're here to help."
      />

      <Header />

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

        {/* Hero */}
        <AnimatedSection animation="fade-in">
          <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
              Get in Touch
            </h1>
            <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Have questions? Want to partner with DreamXec? Need support with your project? We're here to help. Below are all the ways you can reach us—email, phone, social media, or in person.
            </p>
          </section>
        </AnimatedSection>

        {/* Contact Categories */}
        <AnimatedSection animation="fade-in" delay={200}>
          <section className="max-w-7xl mx-auto px-4 space-y-12">
            <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
              How to Reach Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactCategories.map((category, index) => (
                <AnimatedSection
                  key={index}
                  animation="slide-up"
                  delay={300 + index * 100}
                >
                  <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-pastel-glow-saffron transition-all duration-300 hover:scale-105">
                    <div className="flex items-start gap-4 mb-3">
                      <Mail className="w-6 h-6 text-dreamxec-berkeley-blue flex-shrink-0 mt-1" />
                      <h3 className="text-lg md:text-xl font-bold text-dreamxec-berkeley-blue">
                        {category.title}
                      </h3>
                    </div>
                    <p className="text-dreamxec-navy text-base md:text-lg font-mono bg-dreamxec-cream px-3 py-2 rounded mb-3">
                      {category.email}
                    </p>
                    {category.details && (
                      <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                        {category.details}
                      </p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Email & Socials */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Connect With Us
          </h2>

          <div className="max-w-6xl mx-auto space-y-8">
            <div className="card-pastel p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-7 h-7 text-dreamxec-berkeley-blue" />
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                  Email
                </h3>
              </div>
              <p className="text-dreamxec-navy text-base md:text-lg">
                <span className="font-mono bg-dreamxec-cream px-3 py-2 rounded">hello@dreamxec.com</span>
              </p>
            </div>

            <div className="card-pastel p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-7 h-7 text-dreamxec-berkeley-blue" />
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                  Follow Us On Social
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {socials.map((social, index) => {
                  const getIcon = () => {
                    switch(social.platform) {
                      case "Instagram":
                        return <Instagram className="w-5 h-5" />;
                      case "LinkedIn":
                        return <Linkedin className="w-5 h-5" />;
                      case "Twitter":
                        return <Twitter className="w-5 h-5" />;
                      default:
                        return <Mail className="w-5 h-5" />;
                    }
                  };
                  
                  return (
                    <a
                      key={index}
                      href={social.url}
                      className="p-4 bg-dreamxec-cream rounded-lg hover:bg-dreamxec-navy hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="text-dreamxec-berkeley-blue hover:text-white">
                        {getIcon()}
                      </span>
                      <div>
                        <p className="font-bold text-dreamxec-berkeley-blue hover:text-white text-sm">
                          {social.platform}
                        </p>
                        <p className="text-xs text-dreamxec-navy hover:text-white break-all">
                          {social.handle}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Address & Legal */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Legal Information
          </h2>

          <div className="max-w-6xl mx-auto space-y-8">
            <div className="card-pastel p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-7 h-7 text-dreamxec-berkeley-blue" />
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                  Registered Office
                </h3>
              </div>
              <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                FinXec Investments Consultancy Private Limited<br />
                Gurugram, Haryana 122001, India
              </p>
            </div>

            <div className="card-pastel p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-7 h-7 text-dreamxec-berkeley-blue" />
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                  Legal Inquiries
                </h3>
              </div>
              <p className="text-dreamxec-navy text-base md:text-lg">
                Email: <span className="font-mono bg-dreamxec-cream px-3 py-2 rounded">legal@dreamxec.com</span>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex items-center justify-center gap-6 py-16">
          <a href="mailto:hello@dreamxec.com">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                ✉️ Send Us an Email
              </h2>
            </div>
          </a>

          <a href="/">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                Back to Home
              </h2>
            </div>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default ContactUs