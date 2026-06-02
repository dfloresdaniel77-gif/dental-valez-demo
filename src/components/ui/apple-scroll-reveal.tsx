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
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 120}vh`;

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between overflow-hidden px-8 md:px-16 lg:px-24">
        
        {/* Left Side: Text — NO appearing effects, just instant swap */}
        <div className="relative flex h-full w-full md:w-[45%] flex-col justify-center">
          {texts.map((text, index) => {
            const start = index / numItems;
            const mid = (index + 0.5) / numItems;
            const end = (index + 1) / numItems;
            const isLast = index === numItems - 1;

            // Simple opacity: 0 -> 1 -> 0. No blur, no translateY, no filters.
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [start, start + 0.02, mid, end - 0.02, end],
              [0, 1, 1, isLast ? 1 : 0, isLast ? 1 : 0]
            );

            return (
              <motion.div
                key={index}
                style={{ opacity }}
                className="absolute left-0 right-0"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Vertical Tools with 3D spin on scroll */}
        <div className="hidden h-full w-[50%] md:flex flex-col items-center justify-center [perspective:1200px]">
          <div className="relative w-full h-[70vh] max-w-md flex items-center justify-center overflow-hidden">
            {images.map((src, index) => {
              const start = index / numItems;
              const peak = (index + 0.15) / numItems;
              const hold = (index + 0.85) / numItems;
              const end = (index + 1) / numItems;
              const isFirst = index === 0;
              const isLast = index === numItems - 1;

              // Slide: come from bottom, hold center, exit up top
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const y = useTransform(
                scrollYProgress,
                [start, peak, hold, end],
                [isFirst ? 0 : 600, 0, 0, isLast ? 0 : -600]
              );

              // 3D spin: rotateY goes from -30 -> 0 -> 30 as it slides through
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const rotateY = useTransform(
                scrollYProgress,
                [start, peak, hold, end],
                [isFirst ? 0 : -40, 0, 0, isLast ? 0 : 40]
              );

              // Slight rotateX tilt for depth
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const rotateX = useTransform(
                scrollYProgress,
                [start, peak, hold, end],
                [isFirst ? 0 : 15, 0, 0, isLast ? 0 : -15]
              );

              // Scale: slightly smaller when entering/exiting
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const scale = useTransform(
                scrollYProgress,
                [start, peak, hold, end],
                [isFirst ? 1 : 0.7, 1, 1, isLast ? 1 : 0.7]
              );

              return (
                <motion.div
                  key={index}
                  style={{
                    y,
                    rotateY,
                    rotateX,
                    scale,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* No rotation class — the images are already generated vertically */}
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`Dental tool ${index + 1}`}
                      fill
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                      priority
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
};
