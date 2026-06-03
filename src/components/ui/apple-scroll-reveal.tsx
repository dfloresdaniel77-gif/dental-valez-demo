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
        
        {/* Left Side: Text — simple crossfade, no blur or movement */}
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
        <div className="hidden h-full w-[50%] md:flex items-center justify-center">
          <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden" style={{ perspective: "1000px" }}>
            
            {images.map((src, index) => {
              const segmentStart = index / numItems;
              const segmentEnd = (index + 1) / numItems;
              const isFirst = index === 0;
              const isLast = index === numItems - 1;

              // SLIDE Y: Enter from below (+100%), hold center (0%), exit up top (-100%)
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const y = useTransform(
                scrollYProgress,
                [segmentStart, segmentStart + 0.08, segmentEnd - 0.08, segmentEnd],
                [isFirst ? "0%" : "120%", "0%", "0%", isLast ? "0%" : "-120%"]
              );

              // 3D TILT on scroll — gentle rotateX creates "leaning back/forward" depth
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const rotateX = useTransform(
                scrollYProgress,
                [segmentStart, segmentStart + 0.08, segmentEnd - 0.08, segmentEnd],
                [isFirst ? 0 : 25, 0, 0, isLast ? 0 : -25]
              );

              // SHADOW Y offset: shifts down when entering (from below), shifts up when exiting (going up)
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const shadowY = useTransform(
                scrollYProgress,
                [segmentStart, segmentStart + 0.08, segmentEnd - 0.08, segmentEnd],
                [40, 25, 25, 10]
              );

              // SHADOW BLUR: more diffused when far, tighter when centered
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const shadowBlur = useTransform(
                scrollYProgress,
                [segmentStart, segmentStart + 0.08, segmentEnd - 0.08, segmentEnd],
                [60, 40, 40, 60]
              );

              return (
                <motion.div
                  key={index}
                  style={{
                    y,
                    rotateX,
                    transformStyle: "preserve-3d",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* The tool image — big, centered, vertical, no rotation */}
                  <motion.div 
                    className="relative w-[80%] h-[80%]"
                    style={{
                      filter: useTransform(
                        shadowY,
                        [10, 25, 40],
                        [
                          "drop-shadow(0px 10px 60px rgba(0,0,0,0.12))",
                          "drop-shadow(0px 25px 40px rgba(0,0,0,0.2))",
                          "drop-shadow(0px 40px 60px rgba(0,0,0,0.12))",
                        ]
                      ),
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Dental tool ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                    />
                  </motion.div>

                  {/* Floating shadow on the "ground" beneath the tool */}
                  <motion.div
                    className="absolute bottom-[8%] w-[40%] h-4 rounded-[100%] bg-black/10"
                    style={{
                      filter: useTransform(shadowBlur, (v) => `blur(${v}px)`),
                      scaleX: useTransform(
                        scrollYProgress,
                        [segmentStart, segmentStart + 0.08, segmentEnd - 0.08, segmentEnd],
                        [0.5, 1, 1, 0.5]
                      ),
                      opacity: useTransform(
                        scrollYProgress,
                        [segmentStart, segmentStart + 0.08, segmentEnd - 0.08, segmentEnd],
                        [0, 0.6, 0.6, 0]
                      ),
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
};
