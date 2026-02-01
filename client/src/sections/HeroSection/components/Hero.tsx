export const Hero = () => {
  return (
    <div className="relative self-center caret-transparent w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="relative inline-block w-full">
        
        {/* Premium glow border - Responsive inset */}
        <div className="absolute 
                        -inset-3 sm:-inset-4 md:-inset-6 lg:-inset-8 
                        bg-gradient-to-r from-dreamxec-saffron/10 via-white/50 to-dreamxec-green/10 
                        rounded-2xl sm:rounded-3xl 
                        border sm:border-2 border-dreamxec-saffron 
                        shadow-lg sm:shadow-xl md:shadow-2xl shadow-dreamxec-navy/20">
        </div>

        {/* SVG Corner Accent - Top Left */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
          alt="Top Left Corner Decoration"
          className="absolute 
                     -top-6 -left-6 w-12 h-12
                     sm:-top-8 sm:-left-8 sm:w-16 sm:h-16
                     md:-top-10 md:-left-10 md:w-20 md:h-20
                     lg:-top-12 lg:-left-12 lg:w-24 lg:h-24
                     xl:-top-14 xl:-left-14 xl:w-28 xl:h-28
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300
                     object-contain"
        />

        {/* SVG Corner Accent - Bottom Right */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/13.svg"
          alt="Bottom Right Corner Decoration"
          className="absolute 
                     -bottom-6 -right-6 w-12 h-12
                     sm:-bottom-8 sm:-right-8 sm:w-16 sm:h-16
                     md:-bottom-10 md:-right-10 md:w-20 md:h-20
                     lg:-bottom-12 lg:-right-12 lg:w-24 lg:h-24
                     xl:-bottom-14 xl:-right-14 xl:w-28 xl:h-28
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300
                     object-contain"
        />

        {/* Main Heading - Fluid Typography */}
        <h1 className="relative 
                       text-dreamxec-navy 
                       text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl
                       font-display font-black caret-transparent 
                       leading-tight break-words text-center 
                       p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12
                       transition-all duration-300">
          
          {/* Line 1: Research Karega India */}
          <span className="block mb-1 sm:mb-2 relative">
            <span className="relative z-10 
                           text-dreamxec-berkeley-blue 
                           drop-shadow-[1px_1px_0_rgba(11,156,44,0.25)] 
                           sm:drop-shadow-[2px_2px_0_rgba(11,156,44,0.3)] 
                           md:drop-shadow-[3px_3px_0_rgba(11,156,44,0.3)]
                           hover:scale-[1.02] 
                           transition-transform duration-300 
                           inline-block">
              Research Karega India
            </span>
          </span>

          {/* Line 2: Toh - Emphasis with smaller size */}
          <span className="block my-1 sm:my-1.5 md:my-2 relative">
            <span className="relative z-10 
                           text-dreamxec-babyPowder-50 
                           text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl
                           font-bold 
                           drop-shadow-[2px_2px_0_rgba(0,0,128,0.25)] 
                           sm:drop-shadow-[3px_3px_0_rgba(0,0,128,0.3)] 
                           md:drop-shadow-[4px_4px_0_rgba(0,0,128,0.3)]
                           hover:scale-105 
                           transition-transform duration-300 
                           inline-block">
              Toh
            </span>
          </span>

          {/* Line 3: Badhega India */}
          <span className="block mt-1 sm:mt-2 relative">
            <span className="relative z-10 
                           text-dreamxec-berkeley-blue 
                           drop-shadow-[1px_1px_0_rgba(11,156,44,0.25)] 
                           sm:drop-shadow-[2px_2px_0_rgba(11,156,44,0.3)] 
                           md:drop-shadow-[3px_3px_0_rgba(11,156,44,0.3)]
                           hover:scale-[1.02] 
                           transition-transform duration-300 
                           inline-block">
              Badhega India
            </span>
          </span>
        </h1>
        
        {/* SVG Corner Accent - Bottom Left */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/19.svg"
          alt="Bottom Left Corner Decoration"
          className="absolute 
                     -bottom-6 -left-6 w-12 h-12
                     sm:-bottom-8 sm:-left-8 sm:w-16 sm:h-16
                     md:-bottom-10 md:-left-10 md:w-20 md:h-20
                     lg:-bottom-12 lg:-left-12 lg:w-24 lg:h-24
                     xl:-bottom-14 xl:-left-14 xl:w-28 xl:h-28
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300
                     object-contain"
        />

        {/* SVG Corner Accent - Top Right */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/11.svg"
          alt="Top Right Corner Decoration"
          className="absolute 
                     -top-6 -right-6 w-12 h-12
                     sm:-top-8 sm:-right-8 sm:w-16 sm:h-16
                     md:-top-10 md:-right-10 md:w-20 md:h-20
                     lg:-top-12 lg:-right-12 lg:w-24 lg:h-24
                     xl:-top-14 xl:-right-14 xl:w-28 xl:h-28
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300
                     object-contain"
        />

      </div>
    </div>
  );
};
