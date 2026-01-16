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

  const items = [...data, ...data]; // duplicate for infinite loop

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const container = containerRef.current;

    const animate = () => {
      if (!isPausedRef.current) {
        container.scrollLeft += SPEED;

        // seamless reset (no visual jump)
        if (container.scrollLeft >= container.scrollWidth / 2) {
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
    <div className="mt-10 relative">
      {error && (
        <p className="px-4 text-sm text-red-500">
          Failed to load campaigns
        </p>
      )}

      <div
        ref={containerRef}
        className="
          flex gap-6 px-4
          overflow-x-auto overflow-y-hidden
          scrollbar-hide
          scroll-smooth
        "
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
        onTouchStart={() => (isPausedRef.current = true)}
        onTouchEnd={() => (isPausedRef.current = false)}
      >
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading &&
          items.map((campaign, i) => (
            <CampaignCard
              key={`${campaign.id}-${i}`}
              campaign={campaign}
            />
          ))}
      </div>
    </div>
  );
};
