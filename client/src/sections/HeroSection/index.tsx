import { HeroTitle } from "./components/HeroTitle";
import { Hero } from "./components/Hero";
import { CampaignCarousel } from "./components/CampaignCarousel";
import { useEffect, useState } from "react";
import { NewsletterModal } from "../../components/NewsletterModal";


export const HeroSection = () => {
  const currentUser = null;
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("dx_newsletter_seen");

    if (hasSeenModal) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollPercentage = scrollPosition / pageHeight;

      if (scrollPercentage > 0.4) {
        setIsNewsletterOpen(true);
        localStorage.setItem("dx_newsletter_seen", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (

    <section className="relative w-full overflow-x-hidden">
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
      {/* Constrained Content */}
      <div
        className="
          max-w-7xl mx-auto px-4
          pt-16 pb-8
          sm:pt-20 sm:pb-10
          md:pt-24 md:pb-12
        "
      >
        {/* Illustration */}
        <div className="w-full flex justify-center mb-12 md:mb-16">
          <Hero />
        </div>

        {/* Title */}
        <div className="w-full flex justify-center">
          <HeroTitle user={currentUser} />
        </div>
      </div>

      {/*  FULL-WIDTH CAROUSEL */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mt-12">
        <CampaignCarousel />
      </div>
      {/* <div className="mt-12" />
      <RopeDivider /> */}
    </section>
  );
};
