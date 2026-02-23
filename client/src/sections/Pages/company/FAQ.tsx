import { Header } from '../../Header'
import { Footer } from '../../Footer'
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const FAQ = () => {

  const studentFAQs = [
    {
      q: "How much can I raise?",
      a: "Projects typically range ₹5K–₹50L. We've funded projects as small as ₹5K (small research), as large as ₹1Cr (major prototypes). Your goal should be realistic—cover actual costs + 20% buffer for unexpected expenses."
    },
    {
      q: "What if I miss my deadline?",
      a: "With flexible funding (which we recommend), you keep whatever you've raised by the deadline, even if you didn't hit your goal. With all-or-nothing, funds are returned if you don't reach goal. You can extend your campaign by 30 days if needed (once per project)."
    },
    {
      q: "Can I access funds immediately?",
      a: "No. Funds are held in escrow until your campaign ends (or you hit goal, in flexible funding). Then we verify your identity/bank details (2–3 days), and transfer funds. You'll typically have money within a week of campaign conclusion."
    },
    {
      q: "What if I want to change my project after launching?",
      a: "Minor tweaks (scope, timeline, budget allocation) can be updated with a transparent post to backers explaining the changes. Major pivots (completely different project) are discouraged—backers funded a specific vision. Communicate changes quickly."
    },
    {
      q: "Can I run multiple projects simultaneously?",
      a: "Yes, but we recommend launching your second project only after completing your first. Backers lose trust when creators juggle too many projects at once. Plus, you'll have more credibility and mentorship success to showcase in your next campaign."
    }
  ]

  const donorFAQs = [
    {
      q: "Is my money secure?",
      a: "Yes. Funds are held in an escrow account at our banking partner until the project reaches its goal (or campaign ends, with flexible funding). We conduct compliance checks on every project before it goes live. If a project misuses funds, backers can request refunds within 30 days of campaign end."
    },
    {
      q: "What happens if a project fails to deliver?",
      a: "Projects deliver via milestone updates and a final report. If a creator goes silent or clearly doesn't deliver, backers can raise their concerns with the DX team. Our team investigates and manages the communication with the concerned project lead. If the concerns are real the club may face lower ratings on the platform as well as project removal from platform."
    },
    {
      q: "Can I change my pledge or get a refund?",
      a: "Projects deliver via milestone updates and a final report. If a creator goes silent or clearly doesn't deliver, backers can raise their concerns with the DX teeam. Our team investigates and manages the communication with the concerned project lead. If, the concerns are real the club may face lower ratings on the platform as well as project removal from platform. "
    },
    {
      q: "How do I know my impact is real?",
      a: "We track outcomes: 6-month, 1-year, and 3-year follow-ups. You'll receive impact reports showing what the student actually delivered, whether they got a job/internship, if they filed a patent, how many people their project helped. Not perfect data, but as transparent as we can be."
    }
  ]

  const corporateFAQs = [
    {
      q: "How does CSR on DreamXec work?",
      a: "You allocate CSR budget to support student innovation. Models range from sponsoring 1 specific projects to annual innovation grants to long-term partnerships (₹1Cr+). Each comes with different branding, reporting, and talent acquisition benefits. Email partnerships@dreamxec.com to discuss your budget and priorities."
    },
    {
      q: "What's the ROI of DreamXec partnerships?",
      a: "The real ROI lies in the technological advancement of India at the global level by boosting the culture of innovation and research to newer heights. Other benefits can be: talent acquisition (interns, hires), strategic insights (market trends from student projects), community goodwill. Also, ₹1Cr CSR spend = meaningful impact on 100–200+ student lives—that's real ROI beyond financial metrics."
    },
    {
      q: "Can DreamXec help us with employee volunteering?",
      a: "Yes. We facilitate employee volunteer mentorship (1–3 hours/month per employee). Your team mentors student projects, reviews pitches, hosts workshops. We coordinate scheduling and match employees with projects. This deepens employee engagement while directly helping students."
    }
  ]

  const FAQGrid = ({ faqs }) => {
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    return (
      <div className="relative">
        {/* <button
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button> */}
        <Swiper
          modules={[Pagination, Keyboard, A11y, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          speed={800}
          onSwiper={(s) => setSwiperInstance(s)}
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          grabCursor={true}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="faq-page-carousel"
        >
          {faqs.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 md:p-8 hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] h-full"
              >
                <div className="card-tricolor-tag"></div>

                <h3 className="text-lg font-bold text-dreamxec-navy font-display mb-3">
                  Q: {item.q}
                </h3>

                <p className="text-dreamxec-gray font-sans text-sm sm:text-base md:text-lg leading-relaxed bg-dreamxec-cream px-4 py-3 rounded-lg">
                  A: {item.a}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <button
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button> */}
      </div>
    );
  };

  return (
    <>
      {/* SEO */}
      <title>FAQ | DreamXec</title>
      <meta
        name="description"
        content="Frequently asked questions from students, supporters, and corporate partners. Get answers to your questions about DreamXec."
      />

      <Header />

      <main className="space-y-20 relative self-start box-border caret-transparent w-full py-12">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            Frequently Asked Questions
          </h1>
          <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto">
            Frequently asked questions from students, supporters, and corporate partners. Can't find your answer? Email support@dreamxec.com and we'll respond within 24 hours.
          </p>
        </section>

        {/* Student FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            For Students
          </h2>

          <FAQGrid faqs={studentFAQs} />
        </section>

        {/* Donor FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            For Supporters & Donors
          </h2>

          <FAQGrid faqs={donorFAQs} />
        </section>

        {/* Corporate FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center">
            For Corporate Partners
          </h2>

          <FAQGrid faqs={corporateFAQs} />
        </section>


      </main>

      <Footer />
    </>
  )
}

export default FAQ