export const Hero = () => {
  return (
    <div className="relative self-center caret-transparent w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-2 xs:px-3 sm:px-4">
      <div className="relative inline-block w-full">

        {/* ── Neo border frame — replaces gradient glow ── */}
        <div
          className="absolute -inset-2 xs:-inset-2.5 sm:-inset-3 md:-inset-5 lg:-inset-6 xl:-inset-8"
          style={{
            border: '3px solid #003366',
            boxShadow: '8px 8px 0 #FF7F00, -4px -4px 0 #0B9C2C',
            background: 'transparent',
          }}
        />

       

        {/* SVG Corner Accent - Top Left */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute -top-4 -left-4 w-10 h-10 xs:-top-5 xs:-left-5 xs:w-12 xs:h-12 sm:-top-8 sm:-left-8 sm:w-16 sm:h-16 md:-top-12 md:-left-12 md:w-24 md:h-24 lg:-top-16 lg:-left-16 lg:w-32 lg:h-32 xl:-top-20 xl:-left-20 xl:w-40 xl:h-40 2xl:-top-24 2xl:-left-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
        />

        {/* SVG Corner Accent - Bottom Right */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/13.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute -bottom-4 -right-4 w-10 h-10 xs:-bottom-5 xs:-right-5 xs:w-12 xs:h-12 sm:-bottom-8 sm:-right-8 sm:w-16 sm:h-16 md:-bottom-12 md:-right-12 md:w-24 md:h-24 lg:-bottom-16 lg:-right-16 lg:w-32 lg:h-32 xl:-bottom-20 xl:-right-20 xl:w-40 xl:h-40 2xl:-bottom-24 2xl:-right-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
        />

        {/* ════════════════════════════════
            MAIN HEADING
        ════════════════════════════════ */}
        <h1 className="relative text-[clamp(1.25rem,4vw,1.5rem)] xs:text-[clamp(1.5rem,5vw,1.875rem)] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black caret-transparent leading-[1.2] xs:leading-[1.15] sm:leading-tight break-words text-center py-4 px-3 xs:py-5 xs:px-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 transition-all duration-300">

          {/* ── Line 1: Research Karega India ── */}
          <span className="block mb-1 xs:mb-1.5 sm:mb-2 md:mb-3">
            <span className="relative inline-block group">
              {/* Offset shadow layer */}
              <span
                className="absolute inset-0 translate-x-[3px] translate-y-[3px] sm:translate-x-[5px] sm:translate-y-[5px]"
                style={{ background: '#0B9C2C', zIndex: 0 }}
                aria-hidden
              />
              {/* Main text block */}
              <span
                className="relative z-10 inline-block px-2 xs:px-3 sm:px-4 md:px-5 py-0.5 sm:py-1 font-black text-white uppercase tracking-tight transition-transform duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{ background: '#003366', border: '2px solid #003366' }}
              >
                Research Karega India
              </span>
            </span>
          </span>

          {/* ── Line 2: Toh — emotional pivot ── */}
          <span className="block my-1 xs:my-1.5 sm:my-2 md:my-3 lg:my-4">
            <span className="relative inline-block group">
              {/* Big offset shadow — most prominent */}
              <span
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] sm:translate-x-[6px] sm:translate-y-[6px] md:translate-x-[8px] md:translate-y-[8px]"
                style={{ background: '#003366', zIndex: 0 }}
                aria-hidden
              />
              {/* Orange fill — hottest element on page */}
              <span
                className="relative z-10 inline-block px-4 xs:px-5 sm:px-7 md:px-8 lg:px-10 py-0.5 sm:py-1 md:py-2 font-black uppercase tracking-widest text-[clamp(1rem,3.5vw,1.25rem)] xs:text-[clamp(1.25rem,4vw,1.5rem)] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl transition-transform duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{
                  background: '#FF7F00',
                  border: '3px solid #003366',
                  color: '#003366',
                  letterSpacing: '0.15em',
                }}
              >
                Toh
              </span>
            </span>
          </span>

          {/* ── Line 3: Badhega India ── */}
          <span className="block mt-1 xs:mt-1.5 sm:mt-2 md:mt-3">
            <span className="relative inline-block group">
              {/* Offset shadow layer */}
              <span
                className="absolute inset-0 translate-x-[3px] translate-y-[3px] sm:translate-x-[5px] sm:translate-y-[5px]"
                style={{ background: '#FF7F00', zIndex: 0 }}
                aria-hidden
              />
              {/* Green fill — growth / forward motion */}
              <span
                className="relative z-10 inline-block px-2 xs:px-3 sm:px-4 md:px-5 py-0.5 sm:py-1 font-black text-white uppercase tracking-tight transition-transform duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{ background: '#0B9C2C', border: '2px solid #003366' }}
              >
                Badhega India
              </span>
            </span>
          </span>

        </h1>

        {/* SVG Corner Accent - Bottom Left */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/19.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute -bottom-4 -left-4 w-10 h-10 xs:-bottom-5 xs:-left-5 xs:w-12 xs:h-12 sm:-bottom-8 sm:-left-8 sm:w-16 sm:h-16 md:-bottom-12 md:-left-12 md:w-24 md:h-24 lg:-bottom-16 lg:-left-16 lg:w-32 lg:h-32 xl:-bottom-20 xl:-left-20 xl:w-40 xl:h-40 2xl:-bottom-24 2xl:-left-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
        />

        {/* SVG Corner Accent - Top Right */}
        <img
          src="/assets/icon-pack/DX-ILLUSTRATION-PACK/11.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute -top-4 -right-4 w-10 h-10 xs:-top-5 xs:-right-5 xs:w-12 xs:h-12 sm:-top-8 sm:-right-8 sm:w-16 sm:h-16 md:-top-12 md:-right-12 md:w-24 md:h-24 lg:-top-16 lg:-right-16 lg:w-32 lg:h-32 xl:-top-20 xl:-right-20 xl:w-40 xl:h-40 2xl:-top-24 2xl:-right-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
        />
      </div>
    </div>
  );
};