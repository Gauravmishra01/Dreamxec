'use client';

import React, { useState } from 'react';
import { Lightbulb, Cog, Rocket } from 'lucide-react';
import dxLogo from '../assets/dx-logo-2.png';

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

    @keyframes glow {
      0%, 100% {
        filter: drop-shadow(0 0 5px currentColor) drop-shadow(0 0 10px currentColor);
      }
      50% {
        filter: drop-shadow(0 0 15px currentColor) drop-shadow(0 0 25px currentColor) drop-shadow(0 0 35px currentColor);
      }
    }

    .gear-rotate {
      animation: rotateGear 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }

    .rocket-shoot {
      animation: rocketShoot 2.5s ease-in-out infinite;
    }

    .bulb-glow {
      animation: glow 2s ease-in-out infinite;
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
    ? `min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`
    : `flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`;

  return (
    <div className={containerClasses}>
      <style>{loaderStyles}</style>

      <div className="flex flex-col items-center justify-center throb-effect">
        {/* Logo Container - BIGGER */}
        <div className="mb-8 relative slide-up">
          <div className="flex items-center justify-center">
            <img
              src={dxLogo}
              alt="DreamXec Logo"
              className="w-64 md:w-96 h-auto object-contain"
            />
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
            {/* Dream Step - WITH GLOW */}
            <div className="flex items-center gap-2 flex-1">
              <Lightbulb
                className={`w-10 h-10 md:w-14 md:h-14 flex-shrink-0 transition-colors bulb-glow ${darkMode ? 'text-yellow-300' : 'text-yellow-600'
                  }`}
                strokeWidth={1.5}
              />
              <span
                className={`text-base md:text-lg font-bold transition-colors whitespace-nowrap ${darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}
              >
                Dream
              </span>
            </div>

            {/* Arrow 1 */}
            <div
              className={`text-2xl md:text-3xl font-bold flex-shrink-0 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              →
            </div>

            {/* Build Step */}
            <div className="flex items-center gap-2 flex-1">
              <div className="gear-rotate flex-shrink-0">
                <Cog
                  className={`w-10 h-10 md:w-14 md:h-14 transition-colors ${darkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`text-base md:text-lg font-bold transition-colors whitespace-nowrap ${darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}
              >
                Build
              </span>
            </div>

            {/* Arrow 2 */}
            <div
              className={`text-2xl md:text-3xl font-bold flex-shrink-0 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              →
            </div>

            {/* Execute Step */}
            <div className="flex items-center gap-2 flex-1">
              <div className="rocket-shoot flex-shrink-0">
                <Rocket
                  className={`w-10 h-10 md:w-14 md:h-14 transition-colors ${darkMode ? 'text-red-300' : 'text-red-600'
                    }`}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`text-base md:text-lg font-bold transition-colors whitespace-nowrap ${darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}
              >
                Execute
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`text-center mt-8 transition-colors slide-up ${darkMode ? 'text-gray-200' : 'text-gray-800'
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
            className={`mt-12 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${darkMode
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
