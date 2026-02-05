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
          width: 10px;
          height: 10px;
          padding: 0;
          border: 2px solid #003366;
          border-radius: 50%;
          background: transparent;
          transition: all 0.3s ease;
          font-size: 0;
          line-height: 0;
        }
        
        .carousel-container .slick-dots li button:before {
          display: none;
        }
        
        .carousel-container .slick-dots li.slick-active button {
          background: #FF7F00;
          border-color: #FF7F00;
          transform: scale(1.2);
        }
        
        .carousel-container .slick-dots li button:hover {
          background: #0B9C2C;
          border-color: #0B9C2C;
        }

        .carousel-container .slick-track {
          display: flex;
          gap: 1rem;
        }

        .carousel-container .slick-slide {
          padding: 0 0.5rem;
        }

        .carousel-container .slick-slide > div {
          height: 100%;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-container * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border-3 border-dreamxec-navy rounded-full p-3 shadow-pastel-card hover:bg-dreamxec-orange hover:border-dreamxec-orange transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dreamxec-navy focus:ring-offset-2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-dreamxec-navy" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border-3 border-dreamxec-navy rounded-full p-3 shadow-pastel-card hover:bg-dreamxec-orange hover:border-dreamxec-orange transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dreamxec-navy focus:ring-offset-2"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-dreamxec-navy" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;

