import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentCampaigns } from '../lib/recentCampaigns';
import type { Campaign } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RecentlyViewedCarousel() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(getRecentCampaigns());
  }, []);

  useEffect(() => {
    checkScroll();
  }, [items]);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setTimeout(checkScroll, 300);
  };

  if (items.length < 2) return null;

  return (
    <section className="mt-14 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-bold text-dreamxec-navy font-display">
          Recently Viewed
        </h3>
        <span className="text-sm text-dreamxec-navy/60 font-medium">
          Continue exploring
        </span>
      </div>

      {/* Carousel Container with Navigation Buttons */}
      <div className="relative px-12">
        {/* Left Navigation Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Right Navigation Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-dreamxec-navy shadow-lg flex items-center justify-center hover:bg-dreamxec-orange hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Carousel */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
        {items.map(campaign => {
          const progress = Math.min(
            (campaign.currentAmount / campaign.goalAmount) * 100,
            100
          );

          return (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaign/${campaign.id}`)}
              className="
                min-w-[280px]
                max-w-[280px]
                bg-dreamxec-cream
                rounded-xl
                border-2 border-dreamxec-navy
                shadow-pastel-card
                cursor-pointer
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="h-40 w-full object-contain bg-dreamxec-black rounded-t-xl"
                />

                {/* Category badge */}
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-white/90 border-2 border-dreamxec-navy rounded-full text-dreamxec-navy">
                  {campaign.category}
                </span>

                {/* Progress chip */}
                <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold bg-dreamxec-green text-white rounded-full border-2 border-dreamxec-navy">
                  {progress.toFixed(0)}%
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-bold text-dreamxec-navy text-base leading-snug line-clamp-2 mb-3">
                  {campaign.title}
                </h4>

                {/* Funding */}
                <div className="space-y-2">
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-dreamxec-navy/20">
                    <div
                      className="h-full bg-gradient-to-r from-dreamxec-green to-dreamxec-saffron"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-medium text-dreamxec-navy/80">
                    <span>
                      ₹{campaign.currentAmount.toLocaleString()} raised
                    </span>
                    <span>
                      ₹{campaign.goalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
