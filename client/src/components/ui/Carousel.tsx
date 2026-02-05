import { ReactNode, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: ReactNode;
  autoplay?: boolean;
  autoplaySpeed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  dots?: boolean;
  arrows?: boolean;
  pauseOnHover?: boolean;
  infinite?: boolean;
  responsive?: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
    };
  }>;
  className?: string;
}

const Carousel = ({
  children,
  autoplay = true,
  autoplaySpeed = 4000,
  slidesToShow = 3,
  slidesToScroll = 1,
  dots = true,
  arrows = true,
  pauseOnHover = true,
  infinite = true,
  responsive,
  className = '',
}: CarouselProps) => {
  const sliderRef = useRef<Slider>(null);

  const defaultResponsive = responsive || [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(slidesToShow, 2),
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ];

  const settings = {
    dots,
    infinite,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    pauseOnHover,
    arrows: false, // We'll use custom arrows
    responsive: defaultResponsive,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    accessibility: true,
    swipeToSlide: true,
    touchThreshold: 10,
    useCSS: true,
    useTransform: true,
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div className={`relative carousel-container ${className}`}>
      <style>{`
        .carousel-container .slick-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .carousel-container .slick-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        
        .carousel-container .slick-dots li button {
          width: 8px;
          height: 8px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: rgba(0, 51, 102, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0;
          line-height: 0;
          cursor: pointer;
        }
        
        .carousel-container .slick-dots li button:before {
          display: none;
        }
        
        .carousel-container .slick-dots li.slick-active button {
          width: 24px;
          border-radius: 4px;
          background: linear-gradient(135deg, #FF9933, #FF7F00);
          box-shadow: 0 2px 8px rgba(255, 127, 0, 0.3);
        }
        
        .carousel-container .slick-dots li button:hover {
          background: rgba(255, 127, 0, 0.6);
          transform: scale(1.2);
        }

        .carousel-container .slick-track {
          display: flex;
          gap: 1.5rem;
        }

        .carousel-container .slick-slide {
          padding: 0 0.75rem;
          opacity: 0.6;
          transform: scale(0.95);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .carousel-container .slick-slide.slick-active {
          opacity: 1;
          transform: scale(1);
        }

        .carousel-container .slick-slide > div {
          height: 100%;
        }

        .carousel-container .slick-list {
          padding: 20px 0;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-container * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 1024px) {
          .carousel-container .slick-slide {
            padding: 0 0.5rem;
          }
        }

        @media (max-width: 640px) {
          .carousel-container .slick-slide {
            padding: 0 0.25rem;
          }
          
          .carousel-container .slick-track {
            gap: 1rem;
          }
        }
      `}</style>
      
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>

      {arrows && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-dreamxec-orange hover:border-dreamxec-orange transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dreamxec-orange focus:ring-offset-2 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-dreamxec-navy group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-dreamxec-orange hover:border-dreamxec-orange transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dreamxec-orange focus:ring-offset-2 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-dreamxec-navy group-hover:text-white transition-colors" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;

