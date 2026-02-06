import { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './CardCarousel.css';

interface CardCarouselProps {
  children: ReactNode[];
  slidesPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  spaceBetween?: number;
  className?: string;
  ariaLabel?: string;
}

export const CardCarousel = ({
  children,
  slidesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  spaceBetween = 24,
  className = '',
  ariaLabel = 'Content carousel',
}: CardCarouselProps) => {
  return (
    <div 
      className={`card-carousel-container ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      <Swiper
        modules={[Navigation, Pagination, Keyboard, A11y]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView.mobile}
        navigation={{
          nextEl: '.card-carousel-button-next',
          prevEl: '.card-carousel-button-prev',
        }}
        pagination={{
          el: '.card-carousel-pagination',
          clickable: true,
          bulletActiveClass: 'card-carousel-pagination-bullet-active',
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        breakpoints={{
          // Mobile: default slides per view
          320: {
            slidesPerView: slidesPerView.mobile || 1,
            spaceBetween: 16,
          },
          // Tablet
          768: {
            slidesPerView: slidesPerView.tablet || 2,
            spaceBetween: 20,
          },
          // Desktop
          1024: {
            slidesPerView: slidesPerView.desktop || 3,
            spaceBetween: spaceBetween,
          },
        }}
        className="card-carousel-swiper"
        a11y={{
          prevSlideMessage: 'Previous card',
          nextSlideMessage: 'Next card',
          paginationBulletMessage: 'Go to card {{index}}',
        }}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button
        className="card-carousel-button-prev"
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
        className="card-carousel-button-next"
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
      <div className="card-carousel-pagination"></div>
    </div>
  );
};
