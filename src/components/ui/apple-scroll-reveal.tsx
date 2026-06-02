"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  imageSrc: string;
}

export const AppleScrollReveal = ({ texts, imageSrc }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate opacity ranges based on the number of text items
  const numItems = texts.length;
  // Let's divide the scroll area into chunks for each text
  // Since we have 4 items usually, chunk size is 0.25

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between overflow-hidden px-8 md:px-16 lg:px-24">
        
        {/* Left Side: Text Reveal */}
        <div className="relative flex h-full w-full md:w-[50%] flex-col justify-center">
          {texts.map((text, index) => {
            const startReveal = index * (1 / numItems);
            const peakReveal = startReveal + (0.5 / numItems);
            const startHide = startReveal + (0.8 / numItems);
            const endHide = startReveal + (1 / numItems);

            const isLast = index === numItems - 1;

            // Opacity transforms
            // Map: startReveal -> 0, peakReveal -> 1, startHide -> 1, endHide -> 0 (unless last item)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [startReveal, peakReveal, startHide, endHide],
              [0, 1, 1, isLast ? 1 : 0]
            );

            // TranslateY transforms for a slight upward drift
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const translateY = useTransform(
              scrollYProgress,
              [startReveal, peakReveal, startHide, endHide],
              [50, 0, 0, isLast ? 0 : -50]
            );

            return (
              <motion.div
                key={index}
                style={{ opacity, translateY }}
                className="absolute left-0 right-0"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: The Tools / Utensil Reveal */}
        <div className="hidden h-full w-[45%] md:flex flex-col items-center justify-center">
          {/* We animate the image container */}
          <motion.div
            style={{
              // The image scales up slightly as you scroll through the entire section
              scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.1]),
              // It also floats up slightly
              y: useTransform(scrollYProgress, [0, 1], [100, -50]),
              // Fade in at the very beginning
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
            }}
            className="relative w-full max-w-lg aspect-square"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-[#e6e2db] shadow-2xl shadow-black/5 overflow-hidden border border-white/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10" />
              
              {/* Premium Dental Utensil SVG Art */}
              <svg viewBox="0 0 100 100" className="w-64 h-64 text-stone-500 stroke-current z-20 opacity-80" fill="none" strokeWidth="1">
                {/* Clean, minimalist scaler / mirror composition */}
                <path d="M 20 80 L 50 50 A 10 10 0 1 1 60 40 A 10 10 0 1 1 50 50" strokeLinecap="round" />
                <path d="M 40 90 L 80 50 Q 85 45 80 40" strokeLinecap="round" />
                <circle cx="55" cy="45" r="4" fill="currentColor" fillOpacity="0.2" />
                <path d="M 30 70 L 60 40" strokeLinecap="round" strokeDasharray="2 2" />
              </svg>
            </div>
            
            {/* Decorative Apple-style blur shadows */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-stone-300 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute top-10 -left-10 w-48 h-48 bg-white/50 rounded-full blur-2xl opacity-60 -z-10" />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};
