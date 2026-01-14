// 'use client';

// import React, { useState } from 'react';
// import { Lightbulb, Cog, Rocket } from 'lucide-react';

// interface LoadingAnimationProps {
//   fullScreen?: boolean;
//   showDarkModeToggle?: boolean;
// }

// export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
//   fullScreen = true,
//   showDarkModeToggle = true,
// }) => {
//   const [darkMode, setDarkMode] = useState(false);

//   const loaderStyles = `
//     @keyframes fadeInScale {
//       0% {
//         opacity: 0;
//         transform: scale(0.8);
//       }
//       100% {
//         opacity: 1;
//         transform: scale(1);
//       }
//     }

//     @keyframes rotateGear {
//       0% {
//         transform: rotate(0deg);
//       }
//       100% {
//         transform: rotate(360deg);
//       }
//     }

//     @keyframes rocketShoot {
//       0% {
//         opacity: 0;
//         transform: translateX(-30px);
//       }
//       50% {
//         opacity: 1;
//       }
//       100% {
//         opacity: 1;
//         transform: translateX(20px);
//       }
//     }

//     @keyframes drawTricolor {
//       0% {
//         width: 0%;
//       }
//       100% {
//         width: 100%;
//       }
//     }

//     @keyframes fadeInOut {
//       0%, 10% {
//         opacity: 0;
//       }
//       20%, 30% {
//         opacity: 1;
//       }
//       35%, 100% {
//         opacity: 0;
//       }
//     }

//     @keyframes fadeInOut-build {
//       0%, 35% {
//         opacity: 0;
//       }
//       45%, 60% {
//         opacity: 1;
//       }
//       65%, 100% {
//         opacity: 0;
//       }
//     }

//     @keyframes fadeInOut-execute {
//       0%, 65% {
//         opacity: 0;
//       }
//       75%, 85% {
//         opacity: 1;
//       }
//       90%, 100% {
//         opacity: 0;
//       }
//     }

//     .dream-step {
//       animation: fadeInScale 0.8s ease-out forwards;
//       animation-delay: 0s;
//     }

//     .build-step {
//       animation: fadeInOut-build 9s ease-in-out infinite;
//     }

//     .execute-step {
//       animation: fadeInOut-execute 9s ease-in-out infinite;
//     }

//     .gear-rotate {
//       animation: rotateGear 2s linear infinite;
//       animation-delay: 0.3s;
//     }

//     .rocket-shoot {
//       animation: rocketShoot 2s ease-in-out infinite;
//     }

//     .tricolor-line {
//       height: 4px;
//       background: linear-gradient(to right, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%);
//       animation: drawTricolor 1.5s ease-out infinite;
//       animation-delay: 1.5s;
//     }

//     @media (max-width: 640px) {
//       .icon-size {
//         width: 48px;
//         height: 48px;
//       }
      
//       .logo-size {
//         width: 60px;
//         height: 60px;
//       }
//     }
//   `;

//   const containerClasses = fullScreen
//     ? `min-h-screen flex items-center justify-center transition-colors duration-300 ${
//         darkMode ? 'bg-gray-900' : 'bg-white'
//       }`
//     : `flex items-center justify-center transition-colors duration-300 ${
//         darkMode ? 'bg-gray-900' : 'bg-white'
//       }`;

//   return (
//     <div className={containerClasses}>
//       <style>{loaderStyles}</style>

//       <div className="flex flex-col items-center justify-center">
//         {/* Logo Container */}
//         <div className="mb-6 relative">
//           <div
//             className={`flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border-2 transition-colors ${
//               darkMode
//                 ? 'border-blue-400 bg-gray-800'
//                 : 'border-blue-500 bg-blue-50'
//             }`}
//           >
//             <div
//               className={`text-center font-bold transition-colors ${
//                 darkMode ? 'text-blue-300' : 'text-blue-600'
//               }`}
//             >
//               <div className="text-2xl md:text-3xl font-black">DreamXec</div>
//               <div className="text-xs md:text-sm opacity-75">
//                 Dream→Build→Execute
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tricolor Underline */}
//         <div className="w-24 md:w-32 mb-8">
//           <div className="tricolor-line" />
//         </div>

//         {/* Animation Steps Container */}
//         <div className="relative h-20 md:h-24 mb-8 flex items-center justify-center">
//           {/* Dream Step */}
//           <div className="absolute dream-step">
//             <div className="flex flex-col items-center gap-2">
//               <Lightbulb
//                 className={`w-12 h-12 md:w-16 md:h-16 transition-colors ${
//                   darkMode ? 'text-yellow-300' : 'text-yellow-500'
//                 }`}
//                 strokeWidth={1.5}
//               />
//               <span
//                 className={`text-sm md:text-base font-semibold transition-colors ${
//                   darkMode ? 'text-gray-200' : 'text-gray-700'
//                 }`}
//               >
//                 Dream
//               </span>
//             </div>
//           </div>

//           {/* Build Step */}
//           <div className="absolute build-step">
//             <div className="flex flex-col items-center gap-2">
//               <div className="gear-rotate">
//                 <Cog
//                   className={`w-12 h-12 md:w-16 md:h-16 transition-colors ${
//                     darkMode ? 'text-purple-300' : 'text-purple-500'
//                   }`}
//                   strokeWidth={1.5}
//                 />
//               </div>
//               <span
//                 className={`text-sm md:text-base font-semibold transition-colors ${
//                   darkMode ? 'text-gray-200' : 'text-gray-700'
//                 }`}
//               >
//                 Build
//               </span>
//             </div>
//           </div>

//           {/* Execute Step */}
//           <div className="absolute execute-step">
//             <div className="flex flex-col items-center gap-2">
//               <div className="rocket-shoot">
//                 <Rocket
//                   className={`w-12 h-12 md:w-16 md:h-16 transition-colors ${
//                     darkMode ? 'text-red-300' : 'text-red-500'
//                   }`}
//                   strokeWidth={1.5}
//                 />
//               </div>
//               <span
//                 className={`text-sm md:text-base font-semibold transition-colors ${
//                   darkMode ? 'text-gray-200' : 'text-gray-700'
//                 }`}
//               >
//                 Execute
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Tagline */}
//         <div
//           className={`text-center mt-4 transition-colors ${
//             darkMode ? 'text-gray-300' : 'text-gray-600'
//           }`}
//         >
//           <p className="text-sm md:text-base font-medium tracking-wide">
//             Research Karega
//           </p>
//           <p className="text-sm md:text-base font-medium tracking-wide">
//             India Toh Badhega India
//           </p>
//         </div>

//         {/* Dark Mode Toggle (Demo Only) */}
//         {showDarkModeToggle && (
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className={`mt-12 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//               darkMode
//                 ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
//                 : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//             }`}
//           >
//             {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoadingAnimation;


'use client';

import React, { useState } from 'react';
import { Lightbulb, Cog, Rocket } from 'lucide-react';
import { Logo } from './Logo';

interface LoadingAnimationProps {
  fullScreen?: boolean;
  showDarkModeToggle?: boolean;
}


export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  fullScreen = true,
  showDarkModeToggle = true,
}) => {
  const [darkMode, setDarkMode] = useState(false);

  const loaderStyles = `
    @keyframes rotateGear {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.1);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    @keyframes rocketShoot {
      0% {
        opacity: 0;
        transform: translateX(-50px) translateY(0px);
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 1;
        transform: translateX(30px) translateY(-20px) rotate(45deg);
      }
    }

    @keyframes typewriter {
      0% {
        width: 0;
      }
      100% {
        width: 100%;
      }
    }

    @keyframes blink {
      0%, 49% {
        border-right-color: rgba(255, 255, 255, 0.75);
      }
      50%, 100% {
        border-right-color: transparent;
      }
    }

    @keyframes throb {
      0%, 100% {
        transform: scale(1);
        filter: brightness(1);
      }
      50% {
        transform: scale(1.02);
        filter: brightness(1.05);
      }
    }

    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .gear-rotate {
      animation: rotateGear 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }

    .rocket-shoot {
      animation: rocketShoot 2.5s ease-in-out infinite;
    }

    .typewriter-text {
      overflow: hidden;
      border-right: 3px solid rgba(255, 255, 255, 0.75);
      animation: typewriter 4s steps(40, end) infinite, blink 0.75s step-end infinite;
      white-space: nowrap;
    }

    .throb-effect {
      animation: throb 2s ease-in-out infinite;
    }

    .slide-up {
      animation: slideUp 0.8s ease-out forwards;
    }

    @media (max-width: 640px) {
      .icon-size {
        width: 48px;
        height: 48px;
      }
    }
  `;

  const containerClasses = fullScreen
    ? `min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`
    : `flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`;

  return (
    <div className={containerClasses}>
      <style>{loaderStyles}</style>

      <div className="flex flex-col items-center justify-center throb-effect">
        {/* Logo Container */}
        <div className="mb-8 relative slide-up">
          <div className="flex items-center justify-center  w-40 h-40 md:w-56 md:h-56">
            <Logo />
          </div>
        </div>

        {/* Tricolor Line - Static */}
        <div className="w-80 md:w-96 mb-10 h-1">
          <div 
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)'
            }}
          />
        </div>

        {/* Animated Text - Dream -> Build -> Execute */}
        <div className="w-full px-4 md:px-8 mb-12">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Dream Step */}
            <div className="flex items-center gap-2 flex-1">
              <Lightbulb
                className={`w-10 h-10 md:w-14 md:h-14 flex-shrink-0 transition-colors ${
                  darkMode ? 'text-yellow-300' : 'text-yellow-600'
                }`}
                strokeWidth={1.5}
              />
              <span
                className={`text-base md:text-lg font-bold transition-colors whitespace-nowrap ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}
              >
                Dream
              </span>
            </div>

            {/* Arrow 1 */}
            <div
              className={`text-2xl md:text-3xl font-bold flex-shrink-0 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              →
            </div>

            {/* Build Step */}
            <div className="flex items-center gap-2 flex-1">
              <div className="gear-rotate flex-shrink-0">
                <Cog
                  className={`w-10 h-10 md:w-14 md:h-14 transition-colors ${
                    darkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`text-base md:text-lg font-bold transition-colors whitespace-nowrap ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}
              >
                Build
              </span>
            </div>

            {/* Arrow 2 */}
            <div
              className={`text-2xl md:text-3xl font-bold flex-shrink-0 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              →
            </div>

            {/* Execute Step */}
            <div className="flex items-center gap-2 flex-1">
              <div className="rocket-shoot flex-shrink-0">
                <Rocket
                  className={`w-10 h-10 md:w-14 md:h-14 transition-colors ${
                    darkMode ? 'text-red-300' : 'text-red-600'
                  }`}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`text-base md:text-lg font-bold transition-colors whitespace-nowrap ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}
              >
                Execute
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`text-center mt-8 transition-colors slide-up ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          <p className="text-2xl md:text-4xl font-black tracking-wider leading-relaxed">
            Research Karega
          </p>
          <p className="text-2xl md:text-4xl font-black tracking-wider leading-relaxed">
            India Toh Badhega India
          </p>
        </div>

        {/* Dark Mode Toggle (Demo Only) */}
        {showDarkModeToggle && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`mt-12 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;