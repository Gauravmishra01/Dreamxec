import { useEffect, useRef, useState } from "react";
import { useHeroCampaigns } from "../../../hooks/useHeroCampaigns";
import { CampaignCard } from "./CampaignCard";
import { SkeletonCard } from "./SkeletonCard";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SPEED = 1; // px per frame (increased for better visibility)

export const CampaignCarousel = () => {
  const { data, loading, error } = useHeroCampaigns();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Triple the items for smoother infinite loop
  const items = data.length > 0 ? [...data, ...data, ...data] : [];

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    let lastCheck = 0;

    const animate = () => {
      if (!isPausedRef.current && container) {
        container.scrollLeft += SPEED;

        // Seamless reset when reaching the second set
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
        
        // Check scroll position periodically (every 100ms)
        const now = Date.now();
        if (now - lastCheck > 100) {
          checkScroll();
          lastCheck = now;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [data.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    isPausedRef.current = true;
    const scrollAmount = 350;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isPausedRef.current = false;
      checkScroll();
    }, 500);
  };

  return (
    <div className="mt-10 relative w-full overflow-hidden px-12">
      {error && (
        <p className="px-4 text-sm text-red-500">
          Failed to load campaigns
        </p>
      )}

      {/* Left Navigation Button */}
      {!loading && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Navigation Button */}
      {!loading && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="
          flex gap-4 sm:gap-6 px-4
          overflow-x-auto overflow-y-hidden
          scrollbar-hide
          pb-2
        "
        style={{
          alignItems: 'stretch',
          scrollBehavior: 'auto'
        }}
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
        onTouchStart={() => (isPausedRef.current = true)}
        onTouchEnd={() => (isPausedRef.current = false)}
      >
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px]"
            >
              <SkeletonCard />
            </div>
          ))}

        {!loading &&
          items.map((campaign, i) => (
            <div
              key={`${campaign.id}-${i}`}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] h-auto transition-transform duration-500 ease-in-out"
            >
              <CampaignCard campaign={campaign} />
            </div>
          ))}
      </div>
    </div>
  );
};
