import { HeroTitle } from "./components/HeroTitle";
import { Hero } from "./components/Hero";
import { CampaignCarousel } from "./components/CampaignCarousel";
import { RopeDivider } from "../../components/RopeDivider";

export const HeroSection = () => {
  const currentUser = null;

  return (
    <section className="relative w-full">
      <div
        className="
          max-w-7xl mx-auto px-4
          pt-16 pb-12
          sm:pt-20 sm:pb-16
          md:pt-24 md:pb-16
        "
      >
        {/* Illustration / Visual Block */}
        <div className="w-full flex justify-center mb-12 md:mb-16">
          <Hero />
        </div>

        {/* Main Title */}
        <div className="w-full flex justify-center">
          <HeroTitle user={currentUser} />
        </div>

        {/* Carousel */}
        <CampaignCarousel />
      </div>
      <RopeDivider />
    </section>
  );
};
