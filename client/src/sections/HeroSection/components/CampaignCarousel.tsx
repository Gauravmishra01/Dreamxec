import { useEffect, useRef } from "react";
import { useHeroCampaigns } from "../../../hooks/useHeroCampaigns";
import { CampaignCard } from "./CampaignCard";
import { SkeletonCard } from "./SkeletonCard";

const SPEED = 0.4; // px per frame (adjust for speed)

export const CampaignCarousel = () => {
  const { data, loading, error } = useHeroCampaigns();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // Triple the items for smoother infinite loop
  const items = data.length > 0 ? [...data, ...data, ...data] : [];

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const container = containerRef.current;

    const animate = () => {
      if (!isPausedRef.current) {
        container.scrollLeft += SPEED;

        // Seamless reset when reaching the second set
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [data.length]);

  return (
    <div className="mt-10 relative w-full overflow-hidden">
      {error && (
        <p className="px-4 text-sm text-red-500">
          Failed to load campaigns
        </p>
      )}

      <div
        ref={containerRef}
        className="
          flex gap-4 sm:gap-6 px-4
          overflow-x-auto overflow-y-hidden
          scrollbar-hide
          scroll-smooth
          pb-2
        "
        style={{
          // Ensure cards maintain equal height in flexbox
          alignItems: 'stretch'
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
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] h-auto"
            >
              <CampaignCard campaign={campaign} />
            </div>
          ))}
      </div>

      
    </div>
  );
};
