import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Footer carousel illustration cards data
const footerCards = [
  {
    id: 1,
    image: 'assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg',
    alt: 'Innovation Illustration',
  },
  {
    id: 2,
    image: 'assets/icon-pack/DX-ILLUSTRATION-PACK/8.svg',
    alt: 'Support Illustration',
  },
  {
    id: 3,
    image: 'assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg',
    alt: 'Company Illustration',
  },
];

export const FooterCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    // Setup keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!swiperRef.current) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        swiperRef.current.slidePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        swiperRef.current.slideNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="footer-carousel-container w-full max-w-7xl mx-auto px-4 py-8"
      role="region"
      aria-label="Footer illustrations carousel"
    >
      <Swiper
        modules={[Navigation, Pagination, Keyboard, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          nextEl: '.footer-carousel-button-next',
          prevEl: '.footer-carousel-button-prev',
        }}
        pagination={{
          el: '.footer-carousel-pagination',
          clickable: true,
          bulletActiveClass: 'footer-carousel-pagination-bullet-active',
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        breakpoints={{
          // Mobile: 1 card
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          // Tablet: 2 cards
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // Desktop: 3 cards
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="footer-carousel-swiper"
        a11y={{
          prevSlideMessage: 'Previous illustration',
          nextSlideMessage: 'Next illustration',
          paginationBulletMessage: 'Go to illustration {{index}}',
        }}
      >
        {footerCards.map((card) => (
          <SwiperSlide key={card.id}>
            <div 
              className="footer-carousel-card"
              tabIndex={0}
              role="group"
              aria-label={card.alt}
            >
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button
        className="footer-carousel-button-prev"
        aria-label="Previous slide"
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        className="footer-carousel-button-next"
        aria-label="Next slide"
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="footer-carousel-pagination"></div>
    </div>
  );
};
