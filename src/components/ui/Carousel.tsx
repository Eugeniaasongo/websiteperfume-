'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
}

export function Carousel({ slides, autoPlayInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, slides.length, autoPlayInterval]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full h-[70vh] min-h-[480px] max-h-[750px] overflow-hidden bg-ink"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out transform scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-20 text-paper z-20">
            <span className="text-gold tracking-[0.25em] text-xs font-semibold uppercase mb-2">
              {slide.subtitle}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-paper max-w-2xl leading-tight mb-6">
              {slide.title}
            </h2>
            <div>
              <a
                href={slide.ctaLink}
                className="inline-block bg-gold hover:bg-gold-deep text-white px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-300 border border-gold"
              >
                {slide.ctaText}
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 text-paper/70 hover:text-gold bg-ink/30 hover:bg-ink/60 border border-paper/10 transition-colors focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 text-paper/70 hover:text-gold bg-ink/30 hover:bg-ink/60 border border-paper/10 transition-colors focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-paper/40 hover:bg-paper/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
