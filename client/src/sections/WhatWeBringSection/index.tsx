import { SectionHeader } from "../../components/SectionHeader";
import React from 'react';

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
    <div className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Headline */}
        <h1
          className="text-center text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold mb-8"
          style={{ animationDelay: "100ms" }}
        >
          Why 95% of Student Projects Die in College Labs
        </h1>

        {/* 3-Column Layout with Whiteboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
          {columns.map((col, index) => (
            <div
              key={index}
              style={{ animationDelay: `${200 + index * 150}ms` }}
              className="card-whiteboard animate-fade-in" // This is now just the container
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
          ))}
        </div>
      </div>
    </div>
  );
};
