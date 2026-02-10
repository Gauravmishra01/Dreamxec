import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { Mail, Linkedin, Twitter, Instagram } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ContactUs = () => {

  const contactCategories = [
    {
      icon: "🎓",
      title: "For Student & Project Support",
      email: "support@dreamxec.com",
      details: "Response time: 24–48 hours",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg"
    },
    {
      icon: "🤝",
      title: "For Partnerships & Sponsorships",
      email: "partnerships@dreamxec.com",
      details: "Call [Phone]: Mon–Fri 10am–6pm",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/18.svg"
    },
    {
      icon: "📰",
      title: "For Press & Media",
      email: "pr@dreamxec.com",
      details: "Media kit available upon request",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg"
    },
    {
      icon: "💬",
      title: "For General Inquiries",
      email: "hello@dreamxec.com",
      details: "Chat with our team on Discord: [Discord link]",
      vector: "/assets/icon-pack/DX-ILLUSTRATION-PACK/2.svg"
    }
  ]

  const socials = [
    { icon: "📸", platform: "Instagram", handle: "@dreamxec", url: "#" },
    { icon: "💼", platform: "LinkedIn", handle: "linkedin.com/company/dreamxec", url: "#" },
    { icon: "🐦", platform: "Twitter", handle: "@DreamXecIndia", url: "#" }
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

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg" 
              alt="" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </div>
          <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            📬 Get in Touch
          </h1>
          <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Have questions? Want to partner with DreamXec? Need support with your project? We're here to help. Below are all the ways you can reach us—email, phone, social media, or in person.
          </p>
        </section>

        {/* Contact Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            📞 How to Reach Us
          </h2>

          <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            speed={800}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            grabCursor={true}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
            }}
            className="contact-carousel"
          >
            {contactCategories.map((category, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full flex items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl md:text-3xl">{category.icon}</span>
                      <h3 className="text-lg md:text-xl font-bold text-dreamxec-berkeley-blue">
                        {category.title}
                      </h3>
                    </div>
                    <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl font-mono bg-dreamxec-cream px-3 py-2 rounded mb-3">
                      {category.email}
                    </p>
                    {category.details && (
                      <p className="text-dreamxec-navy text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                        {category.details}
                      </p>
                    )}
                  </div>
                  <img 
                    src={category.vector} 
                    alt="" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 hidden sm:block"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Email & Socials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            🌐 Connect With Us
          </h2>

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">✉️</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Email
                  </h3>
                </div>
                <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl">
                  <span className="font-mono bg-dreamxec-cream px-3 py-2 rounded">hello@dreamxec.com</span>
                </p>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg" 
                alt="" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl md:text-4xl">📱</span>
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                  Follow Us On Social
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                      className="p-4 bg-dreamxec-cream rounded-lg hover:bg-dreamxec-navy group transition-colors flex items-center gap-3 border-2 border-dreamxec-navy/20 hover:border-dreamxec-navy"
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <span className="text-dreamxec-berkeley-blue group-hover:text-white transition-colors">
                        {getIcon()}
                      </span>
                      <div>
                        <p className="font-bold text-dreamxec-berkeley-blue group-hover:text-white text-sm transition-colors">
                          {social.platform}
                        </p>
                        <p className="text-xs text-dreamxec-navy group-hover:text-white/80 break-all transition-colors">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            📋 Legal Information
          </h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">📍</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Registered Office
                  </h3>
                </div>
                <div className="bg-dreamxec-cream px-4 py-3 rounded-lg">
                  <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl leading-relaxed font-medium">
                    FinXec Investments Consultancy Private Limited<br />
                    Gurugram, Haryana 122001, India
                  </p>
                </div>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg" 
                alt="" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>

            <div className="card-pastel p-6 md:p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl">⚖️</span>
                  <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue">
                    Legal Inquiries
                  </h3>
                </div>
                <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl">
                  Email: <span className="font-mono bg-dreamxec-cream px-3 py-2 rounded">legal@dreamxec.com</span>
                </p>
              </div>
              <img 
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg" 
                alt="" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0 hidden sm:block"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-12 px-4">
          <a href="mailto:hello@dreamxec.com">
            <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform border-4 border-dreamxec-navy shadow-pastel-card">
              <h2 className="text-dreamxec-navy text-base md:text-xl font-bold">
                ✉️ Send Us an Email
              </h2>
            </div>
          </a>

          <a href="/">
            <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform border-4 border-dreamxec-navy/30">
              <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-bold">
                🏠 Back to Home
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