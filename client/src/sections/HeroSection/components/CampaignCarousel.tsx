import { useEffect, useRef, useState } from "react";
import { useHeroCampaigns } from "../../../hooks/useHeroCampaigns";
import { CampaignCard } from "./CampaignCard";
import { SkeletonCard } from "./SkeletonCard";

const SPEED = 1;

export const CampaignCarousel = () => {
  const { data, loading, error } = useHeroCampaigns();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }

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

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });

    setTimeout(() => {
      isPausedRef.current = false;
      checkScroll();
    }, 500);
  };

  return (
    <div className="mt-10 relative w-full overflow-hidden">

      {error && (
        <p className="px-4 text-sm text-red-500">Failed to load campaigns</p>
      )}

      {/* Left arrow */}
      {!loading && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-6 flex items-center justify-center bg-white/80 backdrop-blur rounded-full shadow-md opacity-70 hover:opacity-100 transition-all duration-200"
          aria-label="Scroll left"
        >
          <svg width="12" height="26" viewBox="0 0 12 26" fill="none">
            <line
              x1="11" y1="1" x2="1" y2="13"
              stroke="#000080" strokeWidth="1.75" strokeLinecap="round"
              className="group-hover:stroke-[#FF7F00] transition-all duration-200"
            />
            <line
              x1="1" y1="13" x2="11" y2="25"
              stroke="#000080" strokeWidth="1.75" strokeLinecap="round"
              className="group-hover:stroke-[#FF7F00] transition-all duration-200"
            />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {!loading && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-6 flex items-center justify-center bg-white/80 backdrop-blur rounded-full shadow-md opacity-70 hover:opacity-100 transition-all duration-200"
          aria-label="Scroll right"
        >
          <svg width="12" height="26" viewBox="0 0 12 26" fill="none">
            <line
              x1="1" y1="1" x2="11" y2="13"
              stroke="#000080" strokeWidth="1.75" strokeLinecap="round"
              className="group-hover:stroke-[#FF7F00] transition-all duration-200"
            />
            <line
              x1="11" y1="13" x2="1" y2="25"
              stroke="#000080" strokeWidth="1.75" strokeLinecap="round"
              className="group-hover:stroke-[#FF7F00] transition-all duration-200"
            />
          </svg>
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
        style={{ alignItems: 'stretch', scrollBehavior: 'auto' }}
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
        onTouchStart={() => (isPausedRef.current = true)}
        onTouchEnd={() => (isPausedRef.current = false)}
      >
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px]">
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