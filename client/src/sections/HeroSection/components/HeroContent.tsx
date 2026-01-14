import { HeroTitle } from "./HeroTitle";
import { Hero } from "./Hero";

export const HeroContent = () => {
  return (
    <div
      role=""
      className="relative self-start box-border caret-transparent flex flex-col col-end-2 col-start-1 row-end-2 row-start-1 justify-self-center w-11/12 md:w-5/6 lg:w-3/4 xl:w-2/3 mx-auto mt-[35%] md:mt-[20%] lg:mt-[15%]"
    >
      
      <Hero />
      <HeroTitle user={null} />
    </div>
  );
};
