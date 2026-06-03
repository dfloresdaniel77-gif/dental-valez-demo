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

  // ── GLOBAL 3D SPIN tied to the entire scroll ──
  // This creates a continuous back-and-forth rotation as the user scrolls
  // through the ENTIRE section, making the tool feel like it's spinning in 3D
  const globalRotateY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    [0, 35, 0, -35, 0, 35, 0, -35, 0, 35, 0]
  );

  const globalRotateX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [5, -10, 8, -8, 10, -5, 5]
  );

  const globalRotateZ = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -3, 0, 3, 0]
  );

  // Shadow that moves dynamically with the rotation
  const shadowX = useTransform(
    globalRotateY,
    [-35, 0, 35],
    ["-20px", "0px", "20px"]
  );

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between overflow-hidden px-8 md:px-16 lg:px-24">
        
        {/* Left Side: Text — simple crossfade */}
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

        {/* Right Side: 3D Spinning Tools */}
        <div 
          className="hidden h-full w-[50%] md:flex items-center justify-center"
          style={{ perspective: "800px" }}
        >
          {/* This outer wrapper applies the GLOBAL 3D spin to ALL tools */}
          <motion.div
            style={{
              rotateY: globalRotateY,
              rotateX: globalRotateX,
              rotateZ: globalRotateZ,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full h-[85vh] flex items-center justify-center"
          >
            {/* Inner container clips tool sliding in/out */}
            <div className="relative w-full h-full overflow-hidden">
              {images.map((src, index) => {
                const segmentStart = index / numItems;
                const segmentEnd = (index + 1) / numItems;
                const isFirst = index === 0;
                const isLast = index === numItems - 1;

                // SLIDE Y: tool enters from below, holds center, exits up and out
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const toolY = useTransform(
                  scrollYProgress,
                  [segmentStart, segmentStart + 0.06, segmentEnd - 0.06, segmentEnd],
                  [isFirst ? 0 : 800, 0, 0, isLast ? 0 : -800]
                );

                return (
                  <motion.div
                    key={index}
                    style={{ y: toolY }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <div className="relative w-full h-full max-w-sm">
                      <Image
                        src={src}
                        alt={`Dental tool ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        priority={index < 2}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dynamic shadow beneath the 3D object */}
            <motion.div
              className="absolute -bottom-4 w-[60%] h-6 rounded-[100%] bg-black/15"
              style={{
                x: shadowX,
                filter: "blur(20px)",
                scaleX: useTransform(
                  scrollYProgress,
                  [0, 0.5, 1],
                  [0.8, 1.2, 0.8]
                ),
              }}
            />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};
