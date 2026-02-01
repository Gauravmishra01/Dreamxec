export const Hero = () => {
  return (
    <div className="relative self-center caret-transparent w-full" style={{ overflow: 'visible' }}>
      <div className="relative inline-block w-full" style={{ overflow: 'visible' }}>
        
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
                     -top-8 -left-8 w-16 h-16
                     sm:-top-12 sm:-left-12 sm:w-24 sm:h-24
                     md:-top-16 md:-left-16 md:w-32 md:h-32
                     lg:-top-20 lg:-left-20 lg:w-40 lg:h-40
                     xl:-top-24 xl:-left-24 xl:w-48 xl:h-48
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300"
          style={{
            minWidth: '64px',
            minHeight: '64px',
            maxWidth: '192px',
            maxHeight: '192px'
          }}
        />

        {/* SVG Corner Accent - Bottom Right */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/13.svg"
          alt="Bottom Right Corner Decoration"
          className="absolute 
                     -bottom-8 -right-8 w-16 h-16
                     sm:-bottom-12 sm:-right-12 sm:w-24 sm:h-24
                     md:-bottom-16 md:-right-16 md:w-32 md:h-32
                     lg:-bottom-20 lg:-right-20 lg:w-40 lg:h-40
                     xl:-bottom-24 xl:-right-24 xl:w-48 xl:h-48
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300"
          style={{
            minWidth: '64px',
            minHeight: '64px',
            maxWidth: '192px',
            maxHeight: '192px'
          }}
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
                     -bottom-8 -left-8 w-16 h-16
                     sm:-bottom-12 sm:-left-12 sm:w-24 sm:h-24
                     md:-bottom-16 md:-left-16 md:w-32 md:h-32
                     lg:-bottom-20 lg:-left-20 lg:w-40 lg:h-40
                     xl:-bottom-24 xl:-left-24 xl:w-48 xl:h-48
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300"
          style={{
            minWidth: '64px',
            minHeight: '64px',
            maxWidth: '192px',
            maxHeight: '192px'
          }}
        />

        {/* SVG Corner Accent - Top Right */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/11.svg"
          alt="Top Right Corner Decoration"
          className="absolute 
                     -top-8 -right-8 w-16 h-16
                     sm:-top-12 sm:-right-12 sm:w-24 sm:h-24
                     md:-top-16 md:-right-16 md:w-32 md:h-32
                     lg:-top-20 lg:-right-20 lg:w-40 lg:h-40
                     xl:-top-24 xl:-right-24 xl:w-48 xl:h-48
                     pointer-events-none 
                     opacity-90 hover:opacity-100 
                     transition-opacity duration-300"
          style={{
            minWidth: '64px',
            minHeight: '64px',
            maxWidth: '192px',
            maxHeight: '192px'
          }}
        />

      </div>
    </div>
  );
};
