// export const Hero = () => {
//   return (
//     <div className="relative self-center caret-transparent w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-2 xs:px-3 sm:px-4">
//       <div className="relative inline-block w-full">

//         {/* ── Neo border frame — replaces gradient glow ── */}
//         <div
//           className="absolute -inset-2 xs:-inset-2.5 sm:-inset-3 md:-inset-5 lg:-inset-6 xl:-inset-8"
//           style={{
//             border: '3px solid #003366',
//             boxShadow: '8px 8px 0 #FF7F00, -4px -4px 0 #0B9C2C',
//             background: 'transparent',
//           }}
//         />



//         {/* SVG Corner Accent - Top Left */}
//         <img
//           src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
//           alt=""
//           aria-hidden="true"
//           loading="lazy"
//           decoding="async"
//           className="absolute -top-4 -left-4 w-10 h-10 xs:-top-5 xs:-left-5 xs:w-12 xs:h-12 sm:-top-8 sm:-left-8 sm:w-16 sm:h-16 md:-top-12 md:-left-12 md:w-24 md:h-24 lg:-top-16 lg:-left-16 lg:w-32 lg:h-32 xl:-top-20 xl:-left-20 xl:w-40 xl:h-40 2xl:-top-24 2xl:-left-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
//         />

//         {/* SVG Corner Accent - Bottom Right */}
//         <img
//           src="/assets/icon-pack/DX-ILLUSTRATION-PACK/13.svg"
//           alt=""
//           aria-hidden="true"
//           loading="lazy"
//           decoding="async"
//           className="absolute -bottom-4 -right-4 w-10 h-10 xs:-bottom-5 xs:-right-5 xs:w-12 xs:h-12 sm:-bottom-8 sm:-right-8 sm:w-16 sm:h-16 md:-bottom-12 md:-right-12 md:w-24 md:h-24 lg:-bottom-16 lg:-right-16 lg:w-32 lg:h-32 xl:-bottom-20 xl:-right-20 xl:w-40 xl:h-40 2xl:-bottom-24 2xl:-right-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
//         />

//         {/* ════════════════════════════════
//             MAIN HEADING
//         ════════════════════════════════ */}
//         <h1 className="relative text-[clamp(1.25rem,4vw,1.5rem)] xs:text-[clamp(1.5rem,5vw,1.875rem)] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black caret-transparent leading-[1.2] xs:leading-[1.15] sm:leading-tight break-words text-center py-4 px-3 xs:py-5 xs:px-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 transition-all duration-300">

//           {/* ── Line 1: Research Karega India ── */}
//           <span className="block mb-1 xs:mb-1.5 sm:mb-2 md:mb-3">
//             <span className="relative inline-block group">
//               {/* Offset shadow layer */}
//               <span
//                 className="absolute inset-0 translate-x-[3px] translate-y-[3px] sm:translate-x-[5px] sm:translate-y-[5px]"
//                 style={{ background: '#0B9C2C', zIndex: 0 }}
//                 aria-hidden
//               />
//               {/* Main text block */}
//               <span
//                 className="relative z-10 inline-block px-2 xs:px-3 sm:px-4 md:px-5 py-0.5 sm:py-1 font-black text-white uppercase tracking-tight transition-transform duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
//                 style={{ background: '#FF7F00', border: '2px solid #003366' }}
//               >
//                 Research Karega India
//               </span>
//             </span>
//           </span>

//           {/* ── Line 2: Toh — emotional pivot ── */}
//           <span className="block my-1 xs:my-1.5 sm:my-2 md:my-3 lg:my-4">
//             <span className="relative inline-block group">
//               {/* Big offset shadow — most prominent */}
//               <span
//                 className="absolute inset-0 translate-x-[4px] translate-y-[4px] sm:translate-x-[6px] sm:translate-y-[6px] md:translate-x-[8px] md:translate-y-[8px]"
//                 style={{ background: '#003366', zIndex: 0 }}
//                 aria-hidden
//               />
//               {/* Orange fill — hottest element on page */}
//               <span
//                 className="relative z-10 inline-block px-4 xs:px-5 sm:px-7 md:px-8 lg:px-10 py-0.5 sm:py-1 md:py-2 font-black uppercase tracking-widest text-[clamp(1rem,3.5vw,1.25rem)] xs:text-[clamp(1.25rem,4vw,1.5rem)] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl transition-transform duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
//                 style={{
//                   background: '#FFFFFF',
//                   border: '3px solid #003366',
//                   color: '#003366',
//                   letterSpacing: '0.15em',
//                 }}
//               >
//                 Toh
//               </span>
//             </span>
//           </span>

//           {/* ── Line 3: Badhega India ── */}
//           <span className="block mt-1 xs:mt-1.5 sm:mt-2 md:mt-3">
//             <span className="relative inline-block group">
//               {/* Offset shadow layer */}
//               <span
//                 className="absolute inset-0 translate-x-[3px] translate-y-[3px] sm:translate-x-[5px] sm:translate-y-[5px]"
//                 style={{ background: '#FF7F00', zIndex: 0 }}
//                 aria-hidden
//               />
//               {/* Green fill — growth / forward motion */}
//               <span
//                 className="relative z-10 inline-block px-2 xs:px-3 sm:px-4 md:px-5 py-0.5 sm:py-1 font-black text-white uppercase tracking-tight transition-transform duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
//                 style={{ background: '#0B9C2C', border: '2px solid #003366' }}
//               >
//                 Badhega India
//               </span>
//             </span>
//           </span>

//         </h1>

//         {/* SVG Corner Accent - Bottom Left */}
//         <img
//           src="/assets/icon-pack/DX-ILLUSTRATION-PACK/19.svg"
//           alt=""
//           aria-hidden="true"
//           loading="lazy"
//           decoding="async"
//           className="absolute -bottom-4 -left-4 w-10 h-10 xs:-bottom-5 xs:-left-5 xs:w-12 xs:h-12 sm:-bottom-8 sm:-left-8 sm:w-16 sm:h-16 md:-bottom-12 md:-left-12 md:w-24 md:h-24 lg:-bottom-16 lg:-left-16 lg:w-32 lg:h-32 xl:-bottom-20 xl:-left-20 xl:w-40 xl:h-40 2xl:-bottom-24 2xl:-left-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
//         />

//         {/* SVG Corner Accent - Top Right */}
//         <img
//           src="/assets/icon-pack/DX-ILLUSTRATION-PACK/11.svg"
//           alt=""
//           aria-hidden="true"
//           loading="lazy"
//           decoding="async"
//           className="absolute -top-4 -right-4 w-10 h-10 xs:-top-5 xs:-right-5 xs:w-12 xs:h-12 sm:-top-8 sm:-right-8 sm:w-16 sm:h-16 md:-top-12 md:-right-12 md:w-24 md:h-24 lg:-top-16 lg:-right-16 lg:w-32 lg:h-32 xl:-top-20 xl:-right-20 xl:w-40 xl:h-40 2xl:-top-24 2xl:-right-24 2xl:w-48 2xl:h-48 pointer-events-none select-none opacity-80 sm:opacity-90 transition-opacity duration-300"
//         />
//       </div>
//     </div>
//   );
// };

import React from 'react';

export const Hero = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-2 md:py-8 flex flex-col items-center bg-transparent text-black overflow-hidden">

      {/* ════════════════════════════════
          MAIN HEADING — highlighted with shadow blocks
      ════════════════════════════════ */}
      <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center tracking-tight leading-[1.15] mb-6">

        {/* "Research Karega India" — orange slab with green shadow */}
        <span className="inline-block relative mb-3">
          <span
            className="absolute inset-0 translate-x-[6px] translate-y-[6px] md:translate-x-[8px] md:translate-y-[8px]"
            style={{ background: '#0B9C2C', zIndex: 0 }}
            aria-hidden
          />
          <span
            className="relative z-10 inline-block px-4 md:px-6 py-1 text-white font-black"
            style={{ background: '#FF7F00', border: '3px solid #003366' }}
          >
            Research Karega India
          </span>
        </span>

        <br className="hidden md:block" />

        {/* "Toh Badhega India" — navy slab with orange shadow */}
        <span className="inline-block relative mt-1">
          <span
            className="absolute inset-0 translate-x-[6px] translate-y-[6px] md:translate-x-[8px] md:translate-y-[8px]"
            style={{ background: '#FF7F00', zIndex: 0 }}
            aria-hidden
          />
          <span
            className="relative z-10 inline-block px-4 md:px-6 py-1 text-white font-black"
            style={{ background: '#003366', border: '3px solid #003366' }}
          >
            Toh Badhega India
          </span>
        </span>

      </h1>

      {/* ════════════════════════════════
          SUBHEADING
      ════════════════════════════════ */}
      <p className="text-lg sm:text-xl md:text-2xl text-center max-w-3xl mb-12 font-bold text-gray-800">
        DreamXec is India's first online platform that helps raise funds exclusively for student lead innovation projects.      </p>

      {/* ════════════════════════════════
          CALL TO ACTION & ARROW
      ════════════════════════════════ */}
      <div className="relative flex items-center justify-center mb-24 w-full max-w-sm mx-auto">

        {/* Scribble Arrow */}
        <svg
          className="absolute -left-20 top-2 w-24 h-auto hidden sm:block pointer-events-none"
          viewBox="0 0 120 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          <path
            d="M 30 10 C 50 0, 60 20, 40 28 C 20 36, 15 30, 25 22 C 35 14, 55 18, 75 35 C 90 46, 100 48, 112 48"
            stroke="#003366"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M 100 38 L 115 48 L 100 58"
            stroke="#003366"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>


        {/* Button */}
        <button
          className="text-white font-black tracking-widest uppercase px-10 py-4 text-base border-4 border-black transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1"
          style={{ background: '#FF7F00', boxShadow: '7px 7px 0px #003366', borderColor: '#003366' }}
          onClick={() => { window.location.href = '/campaigns'; }}
        >
          Explore Campaigns
        </button>
      </div>

      {/* ════════════════════════════════
          IMAGE GALLERY
      ════════════════════════════════ */}
      <div className="relative flex items-center justify-center w-full max-w-5xl mt-4">

        {/* Top Left Star — green fill */}
        <svg
          className="absolute -left-6 sm:-left-12 -top-10 w-16 md:w-24 h-auto z-30 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
          viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 5 L61 38 L95 38 L67 59 L78 95 L50 74 L22 95 L33 59 L5 38 L39 38 Z"
            fill="#0B9C2C" stroke="#003366" strokeWidth="4" strokeLinejoin="round" />
        </svg>

        {/* LEFT IMAGE — tilted left */}
        <div
          className="w-[30%] aspect-[4/5] border-4 border-black relative z-10 bg-gray-200 overflow-hidden"
          style={{
            borderColor: '#003366',
            boxShadow: '5px 5px 0 #FF7F00',
            transform: 'rotate(-8deg) translateX(-10px)',
          }}
        >
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/19.svg"
            alt="Student Project 1"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: '#FF7F00', borderTop: '3px solid #003366' }}>
            Student Ideas
          </div>
        </div>

        {/* CENTER IMAGE — straight, tallest, on top */}
        <div
          className="w-[45%] md:w-[40%] aspect-square border-4 relative z-20 bg-gray-300 overflow-hidden"
          style={{
            borderColor: '#003366',
            boxShadow: '7px 7px 0 #0B9C2C',
          }}
        >
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/20.svg"
            alt="Student Project 2"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: '#003366', borderTop: '3px solid #003366' }}>
            Funded by India
          </div>
        </div>

        {/* RIGHT IMAGE — tilted right */}
        <div
          className="w-[30%] aspect-[4/5] border-4 border-black relative z-10 bg-gray-200 overflow-hidden"
          style={{
            borderColor: '#003366',
            boxShadow: '5px 5px 0 #0B9C2C',
            transform: 'rotate(8deg) translateX(10px)',
          }}
        >
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
            alt="Student Project 3"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: '#0B9C2C', borderTop: '3px solid #003366' }}>
            Real Impact
          </div>
        </div>

        {/* Bottom Right Star — orange fill */}
        <svg
          className="absolute -right-6 sm:-right-12 -bottom-10 w-16 md:w-24 h-auto z-30 rotate-12 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
          viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 5 L61 38 L95 38 L67 59 L78 95 L50 74 L22 95 L33 59 L5 38 L39 38 Z"
            fill="#FF7F00" stroke="#003366" strokeWidth="4" strokeLinejoin="round" />
        </svg>

      </div>
    </div>
  );
};