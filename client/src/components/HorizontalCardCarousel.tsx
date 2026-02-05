import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardData {
  title: string;
  description?: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
}

interface HorizontalCardCarouselProps {
  cards: CardData[];
  autoScrollInterval?: number; // in milliseconds (default: 4000)
  showPagination?: boolean;
  cardClassName?: string;
  containerClassName?: string;
}

export const HorizontalCardCarousel: React.FC<HorizontalCardCarouselProps> = ({
  cards,
  autoScrollInterval = 4000,
  showPagination = true,
  cardClassName = '',
  containerClassName = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Calculate how many cards are visible at once based on screen size
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width >= 1024) return 3; // lg: 3 cards
    if (width >= 768) return 2; // md: 2 cards
    return 1; // sm: 1 card
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || isInteracting) return;

    const maxIndex = Math.max(0, cards.length - visibleCards);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next > maxIndex ? 0 : next;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [isPaused, isInteracting, cards.length, visibleCards, autoScrollInterval]);

  // Scroll to index
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.scrollWidth / cards.length;
    const scrollPosition = currentIndex * cardWidth;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }, [currentIndex, cards.length]);

  const handlePrevious = () => {
    setIsInteracting(true);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setTimeout(() => setIsInteracting(false), 1000);
  };

  const handleNext = () => {
    setIsInteracting(true);
    const maxIndex = Math.max(0, cards.length - visibleCards);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    setTimeout(() => setIsInteracting(false), 1000);
  };

  const handleDotClick = (index: number) => {
    setIsInteracting(true);
    setCurrentIndex(index);
    setTimeout(() => setIsInteracting(false), 1000);
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      handleNext();
    } else if (touchStart - touchEnd < -75) {
      // Swipe right
      handlePrevious();
    }
    setTimeout(() => setIsInteracting(false), 1000);
  };

  const maxIndex = Math.max(0, cards.length - visibleCards);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div
      className={`relative w-full ${containerClassName}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        aria-label="Previous cards"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          canGoPrevious
            ? 'opacity-100 hover:scale-110 hover:shadow-xl'
            : 'opacity-50 cursor-not-allowed'
        } -ml-4 md:-ml-6`}
      >
        <ChevronLeft className="w-6 h-6 text-dreamxec-navy" />
      </button>

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Next cards"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          canGoNext
            ? 'opacity-100 hover:scale-110 hover:shadow-xl'
            : 'opacity-50 cursor-not-allowed'
        } -mr-4 md:-mr-6`}
      >
        <ChevronRight className="w-6 h-6 text-dreamxec-navy" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-hidden scrollbar-hide scroll-smooth"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-6 md:gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`flex-shrink-0 ${
                visibleCards === 1
                  ? 'w-full'
                  : visibleCards === 2
                  ? 'w-[calc(50%-1rem)]'
                  : 'w-[calc(33.333%-1.33rem)]'
              }`}
            >
              <div
                className={`
                  w-full min-h-96 
                  bg-white 
                  rounded-2xl 
                  border-4 border-dreamxec-navy 
                  shadow-pastel-card
                  p-6 md:p-8
                  flex flex-col
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-pastel-glow-saffron
                  ${cardClassName}
                `}
              >
                {/* Icon (if provided) */}
                {card.icon && (
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center text-dreamxec-orange">
                      {card.icon}
                    </div>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-4 font-display text-center">
                  {card.title}
                </h3>

                {/* Description or Custom Content */}
                {card.content ? (
                  <div className="flex-1 overflow-y-auto">{card.content}</div>
                ) : (
                  <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed font-sans text-center">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {showPagination && cards.length > visibleCards && (
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Carousel pagination">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              role="tab"
              aria-selected={currentIndex === index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-dreamxec-orange w-8'
                  : 'bg-dreamxec-navy/30 hover:bg-dreamxec-navy/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
