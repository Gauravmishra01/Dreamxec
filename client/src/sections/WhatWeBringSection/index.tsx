import { SectionHeader } from "../../components/SectionHeader";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Data for the three columns
const columns = [
  {
    title: "The Funding Gap",
    text: "₹50,000 is all it takes to turn a breakthrough idea into reality. Yet brilliant projects die every year because students can't afford equipment, prototyping, or research materials."
  },
  {
    title: "The Lost Potential",
    text: "IIT Bombay's ideaForge started as a student project. Today it's IPO-listed. But most student innovations never get the chance to scale not because of lack of talent, but lack of funding."
  },
  {
    title: "The Solution",
    text: "DreamXec bridges the gap. Alumni who want to give back. Corporates seeking innovation. Students who need support. One platform, infinite possibilities."
  }
];

export const WhatWeBringSection = () => {
  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Headline */}
        <h1
          className="text-center text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold mb-8"
        >
          Why 95% of Student Projects Die in College Labs
        </h1>

        {/* Carousel with Whiteboard Cards */}
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
          spaceBetween={48}
          slidesPerView={1}
          speed={800}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          grabCursor={true}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 48,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 48,
            },
          }}
          className="whiteboard-carousel"
        >
          {columns.map((col, index) => (
            <SwiperSlide key={index}>
              <div
                className="card-whiteboard transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* This new div holds the content */}
                <div className="whiteboard-content mt-8">
                  <div className=" p-2">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-wrap">
                      {col.title}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base text-slate-600 leading-relaxed ">
                      {col.text}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
