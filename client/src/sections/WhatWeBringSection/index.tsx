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
         <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white"
              style={{ background: '#003366', border: '2px solid #003366' }}
            >
              ★ DreamXec Insight
            </span>
          </div>
         {/* Main heading with stamp highlight */}
          <h2 className="font-black leading-tight mb-3">
            <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-dreamxec-navy uppercase tracking-tight">
              Why 95% of Student Projects 
            </span>
            <span className="block mt-1 sm:mt-2">
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 translate-x-[4px] translate-y-[4px] sm:translate-x-[6px] sm:translate-y-[6px]"
                  style={{ background: '#0B9C2C' }}
                  aria-hidden
                />
                <span
                  className="relative z-10 inline-block px-3 sm:px-5 py-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white font-black uppercase tracking-tight"
                  style={{ background: '#003366', border: '3px solid #003366' }}
                >
                  Die in College Labs
                </span>
              </span>
            </span>
          </h2>

        {/* Carousel with Whiteboard Cards */}
        <Swiper
          modules={[Pagination, Keyboard, A11y, Autoplay]}
          spaceBetween={48}
          slidesPerView={1}
          speed={800}
        
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
                className="card-whiteboard"
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
