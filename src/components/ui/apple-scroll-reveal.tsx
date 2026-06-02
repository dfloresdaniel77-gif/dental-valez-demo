"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  images: string[];
}

export const AppleScrollReveal = ({ texts, images }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start when the top of container hits the top of viewport
    // End when bottom of container hits bottom of viewport
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  // Increase height significantly based on number of items (e.g. 5 items = 600vh)
  const containerHeight = `${numItems * 120}vh`;

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between overflow-hidden px-8 md:px-16 lg:px-24">
        
        {/* Left Side: Text Reveal */}
        <div className="relative flex h-full w-full md:w-[45%] flex-col justify-center">
          {texts.map((text, index) => {
            const startReveal = index * (1 / numItems);
            const peakReveal = startReveal + (0.3 / numItems);
            const startHide = startReveal + (0.7 / numItems);
            const endHide = startReveal + (1 / numItems);

            const isLast = index === numItems - 1;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [startReveal, peakReveal, startHide, endHide],
              [0, 1, 1, isLast ? 1 : 0]
            );

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const translateY = useTransform(
              scrollYProgress,
              [startReveal, peakReveal, startHide, endHide],
              [50, 0, 0, isLast ? 0 : -50]
            );

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const filter = useTransform(
              scrollYProgress,
              [startReveal, peakReveal, startHide, endHide],
              ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
            );

            return (
              <motion.div
                key={index}
                style={{ opacity, translateY, filter }}
                className="absolute left-0 right-0"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: The Tools Carousel */}
        <div className="hidden h-full w-[50%] md:flex flex-col items-center justify-center">
          {/* Static container for the carousel */}
          <div className="relative w-full h-full max-w-2xl flex items-center justify-center overflow-hidden">
            {/* Map over the images, creating a vertical slide effect! */}
            {images.map((src, index) => {
              const startReveal = index * (1 / numItems);
              const peakReveal = startReveal + (0.2 / numItems);
              const startHide = startReveal + (0.8 / numItems);
              const endHide = startReveal + (1 / numItems);

              const isFirst = index === 0;
              const isLast = index === numItems - 1;

              // Remove opacity fade so there is no "appearing effect", only physical sliding!
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const translateY = useTransform(
                scrollYProgress,
                [startReveal, peakReveal, startHide, endHide],
                [isFirst ? "0vh" : "100vh", "0vh", "0vh", isLast ? "0vh" : "-100vh"]
              );

              return (
                <motion.div
                  key={index}
                  style={{ y: translateY }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Container that rotates the tool upright and scales it massively */}
                  <div className="relative w-full aspect-square rotate-[45deg] scale-[1.7] md:scale-[2]">
                    <Image
                      src={src}
                      alt={`Dental tool ${index + 1}`}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </motion.div>
              );
            })}
            
            {/* Decorative Apple-style blur shadows to anchor the carousel */}
            <div className="absolute -bottom-20 right-10 w-[30rem] h-32 bg-stone-400 rounded-[100%] blur-3xl opacity-20 -z-10" />
            <div className="absolute top-10 -left-10 w-64 h-64 bg-white/40 rounded-full blur-3xl opacity-60 -z-10" />
          </div>
        </div>
        
      </div>
    </div>
  );
};
