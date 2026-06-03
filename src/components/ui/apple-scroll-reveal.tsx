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

  // ── Gentle 3D rotation — subtle enough to never look paper-thin ──
  const globalRotateY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87, 1],
    [0, 12, 0, -12, 0, 12, 0, -12, 0]
  );

  const globalRotateX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [3, -5, 3, -5, 3, -5]
  );

  // Shadow shifts with rotation for realistic lighting
  const shadowX = useTransform(globalRotateY, [-12, 0, 12], [-8, 0, 8]);

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between overflow-hidden px-8 md:px-16 lg:px-24">
        
        {/* Left Side: Text */}
        <div className="relative flex h-full w-full md:w-[45%] flex-col justify-center">
          {texts.map((text, index) => {
            const start = index / numItems;
            const end = (index + 1) / numItems;
            const isLast = index === numItems - 1;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [start, start + 0.02, end - 0.02, end],
              [0, 1, isLast ? 1 : 1, isLast ? 1 : 0]
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

        {/* Right Side: 3D Floating Tools */}
        <div 
          className="hidden h-full w-[50%] md:flex items-center justify-center"
          style={{ perspective: "600px" }}
        >
          <motion.div
            style={{
              rotateY: globalRotateY,
              rotateX: globalRotateX,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full h-[80vh] flex items-center justify-center"
          >
            {/* Clip container for slide in/out */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              {images.map((src, index) => {
                const segmentStart = index / numItems;
                const segmentEnd = (index + 1) / numItems;
                const isFirst = index === 0;
                const isLast = index === numItems - 1;

                // Slide Y: enter from bottom, hold, exit top
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const toolY = useTransform(
                  scrollYProgress,
                  [segmentStart, segmentStart + 0.06, segmentEnd - 0.06, segmentEnd],
                  [isFirst ? 0 : 900, 0, 0, isLast ? 0 : -900]
                );

                return (
                  <motion.div
                    key={index}
                    style={{ y: toolY }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Floating animation wrapper */}
                    <div className="relative w-[70%] h-[70%] animate-float">
                      <Image
                        src={src}
                        alt={`Dental tool ${index + 1}`}
                        fill
                        className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                        sizes="(max-width: 768px) 100vw, 35vw"
                        priority={index < 2}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ground shadow */}
            <motion.div
              className="absolute -bottom-2 w-[50%] h-8 rounded-[100%] bg-black/10"
              style={{
                x: shadowX,
                filter: "blur(24px)",
              }}
            />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};
