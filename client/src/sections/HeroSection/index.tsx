import { HeroTitle } from "./components/HeroTitle";
import { Hero } from "./components/Hero";
import { CampaignCarousel } from "./components/CampaignCarousel";


export const HeroSection = () => {
  const currentUser = null;

  return (
    <section className="relative w-full overflow-x-hidden">
      {/* Constrained Content */}
      <div
        className="
          max-w-7xl mx-auto px-4
          pt-12 pb-6
          xs:pt-14 xs:pb-7
          sm:pt-16 sm:pb-8
          md:pt-20 md:pb-10
          lg:pt-24 lg:pb-12
        "
      >
        {/* Illustration */}
        <div className="w-full flex justify-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          <Hero />
        </div>

        {/* Title */}
        <div className="w-full flex justify-center">
          <HeroTitle user={currentUser} />
        </div>
      </div>

      {/*  FULL-WIDTH CAROUSEL */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mt-8 xs:mt-10 sm:mt-12">
        <CampaignCarousel />
      </div>
    </section>
  );
};
