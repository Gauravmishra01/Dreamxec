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

  useEffect(() => { setItems(getRecentCampaigns()); }, []);
  useEffect(() => { checkScroll(); }, [items]);

  const checkScroll = () => {
    const c = scrollContainerRef.current;
    if (!c) return;
    setCanScrollLeft(c.scrollLeft > 0);
    setCanScrollRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    const c = scrollContainerRef.current;
    if (!c) return;
    c.scrollTo({
      left: direction === 'left' ? c.scrollLeft - 300 : c.scrollLeft + 300,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 300);
  };

  if (items.length < 2) return null;

  return (
    <section className="mt-14 relative">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-7 bg-dreamxec-orange flex-shrink-0" />
          <h3 className="text-xl sm:text-2xl font-black text-dreamxec-navy uppercase tracking-tight">
            Recently Viewed
          </h3>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-widest text-dreamxec-navy/50 px-2.5 py-1"
          style={{ border: '2px dashed #000080' }}
        >
          Continue exploring
        </span>
      </div>

      {/* ── Carousel wrapper ── */}
      <div className="relative px-10 sm:px-12">

        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white transition-all hover:bg-dreamxec-navy hover:translate-x-[-1px] hover:translate-y-[-1px] group"
            style={{ border: '3px solid #000080', boxShadow: '3px 3px 0 #FF7F00' }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-dreamxec-navy group-hover:text-white transition-colors" />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white transition-all hover:bg-dreamxec-navy hover:translate-x-[-1px] hover:translate-y-[-1px] group"
            style={{ border: '3px solid #000080', boxShadow: '3px 3px 0 #FF7F00' }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-dreamxec-navy group-hover:text-white transition-colors" />
          </button>
        )}

        {/* Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map(campaign => {
            const progress = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);

            return (
              <div
                key={campaign.id}
                onClick={() => navigate(`/campaign/${campaign.id}`)}
                className="min-w-[260px] max-w-[260px] sm:min-w-[280px] sm:max-w-[280px] bg-white flex flex-col cursor-pointer transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px] flex-shrink-0"
                style={{ border: '3px solid #000080', boxShadow: '5px 5px 0 #FF7F00' }}
              >
                {/* Top stripe */}
                <div className="h-1.5 bg-dreamxec-orange flex-shrink-0" />

                {/* Image */}
                <div className="relative h-36 sm:h-40 w-full bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-fill"
                  />

                  {/* Progress chip */}
                  <div
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-black text-white"
                    style={{ background: '#0B9C2C', border: '2px solid #000080' }}
                  >
                    {progress.toFixed(0)}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">

                  {/* Category */}
                  <span
                    className="inline-block mb-2 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-widest self-start"
                    style={{ background: '#FF7F00', border: '2px solid #000080' }}
                  >
                    {campaign.club?.college || 'Dreamxec'}
                  </span>

                  {/* Title */}
                  <h4 className="font-black text-dreamxec-navy text-sm sm:text-base uppercase tracking-tight leading-snug line-clamp-2 mb-3">
                    {campaign.title}
                  </h4>

                  <div className="mt-auto space-y-1.5">
                    {/* Progress bar */}
                    <div
                      className="w-full h-2.5 overflow-hidden"
                      style={{ border: '2px solid #000080', background: '#f3f4f6' }}
                    >
                      <div
                        className="h-full bg-dreamxec-orange transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Amounts */}
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] sm:text-xs font-black text-dreamxec-navy">
                        ₹{campaign.currentAmount.toLocaleString()} raised
                      </span>
                      <span className="text-[10px] font-bold text-dreamxec-navy/50">
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