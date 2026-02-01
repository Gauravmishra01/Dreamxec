import { useEffect, useState } from 'react';

interface Doodle {
  id: number;
  type: 'star' | 'sparkle';
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

/**
 * FloatingDoodles Component
 * 
 * Displays subtle floating doodles (stars and sparkles) across the screen
 * with slow, gentle animations. Respects prefers-reduced-motion for accessibility.
 * 
 * @example
 * ```tsx
 * <FloatingDoodles count={8} />
 * ```
 */
export default function FloatingDoodles({ count = 8 }: { count?: number }) {
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Generate random doodles
    const newDoodles: Doodle[] = [];
    for (let i = 0; i < count; i++) {
      newDoodles.push({
        id: i,
        type: Math.random() > 0.5 ? 'star' : 'sparkle',
        x: Math.random() * 90 + 5, // 5% to 95% of viewport width
        y: Math.random() * 90 + 5, // 5% to 95% of viewport height
        duration: Math.random() * 15 + 20, // 20-35 seconds
        delay: Math.random() * 5, // 0-5 second delay
        size: Math.random() * 20 + 20, // 20-40px
      });
    }
    setDoodles(newDoodles);
  }, [count]);

  if (reducedMotion) {
    // Don't render animations if user prefers reduced motion
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {doodles.map((doodle) => (
        <div
          key={doodle.id}
          className="absolute"
          style={{
            left: `${doodle.x}%`,
            top: `${doodle.y}%`,
            width: `clamp(20px, ${doodle.size}px, 40px)`,
            height: `clamp(20px, ${doodle.size}px, 40px)`,
            animation: `floatDoodle ${doodle.duration}s ease-in-out ${doodle.delay}s infinite alternate`,
            opacity: 0.3,
          }}
        >
          {doodle.type === 'star' ? (
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 20,5 L 23,15 L 34,15 L 25,22 L 28,33 L 20,26 L 12,33 L 15,22 L 6,15 L 17,15 Z"
                fill="#FF7F00"
                stroke="#000080"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="12" r="2" fill="#FFFFFF" opacity="0.7" />
            </svg>
          ) : (
            <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <g fill="#FF7F00" stroke="#000080" strokeWidth="2">
                <path d="M 15,2 L 16,12 L 14,12 Z" />
                <path d="M 28,15 L 18,16 L 18,14 Z" />
                <path d="M 15,28 L 14,18 L 16,18 Z" />
                <path d="M 2,15 L 12,14 L 12,16 Z" />
              </g>
              <circle cx="15" cy="15" r="4" fill="#0B9C2C" stroke="#000080" strokeWidth="2" />
              <circle cx="13" cy="13" r="1.5" fill="#FFFFFF" opacity="0.8" />
            </svg>
          )}
        </div>
      ))}

      <style>{`
        @keyframes floatDoodle {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(-3deg);
          }
          75% {
            transform: translate(15px, -15px) rotate(7deg);
          }
          100% {
            transform: translate(0, -30px) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
