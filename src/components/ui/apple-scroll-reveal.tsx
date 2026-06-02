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

  // Global 3D transforms for the right side container so all images drift smoothly
  // We use `scrollYProgress` to drift from start to end continuously
  const globalScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.3]);
  const globalY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const globalRotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const globalRotateY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const globalRotateZ = useTransform(scrollYProgress, [0, 1], [-10, 10]);

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

        {/* Right Side: The Tools Reveal */}
        <div className="hidden h-full w-[50%] md:flex flex-col items-center justify-center [perspective:1200px]">
          {/* We animate the entire container in continuous 3D space */}
          <motion.div
            style={{
              scale: globalScale,
              y: globalY,
              rotateX: globalRotateX,
              rotateY: globalRotateY,
              rotateZ: globalRotateZ,
            }}
            className="relative w-full max-w-2xl aspect-square"
          >
            {/* Map over the images, tying their opacity to the exact same ranges as the text! */}
            {images.map((src, index) => {
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

              // Add a slight internal pop scale when the image becomes visible
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const itemScale = useTransform(
                scrollYProgress,
                [startReveal, peakReveal, startHide, endHide],
                [0.8, 1, 1, 1.2]
              );

              return (
                <motion.div
                  key={index}
                  style={{ opacity, scale: itemScale }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={src}
                    alt={`Dental tool ${index + 1}`}
                    fill
                    className="object-contain mix-blend-multiply scale-[1.3]"
                    priority
                  />
                </motion.div>
              );
            })}
            
            {/* Decorative Apple-style blur shadows to anchor the floating tools */}
            <div className="absolute -bottom-20 right-10 w-[30rem] h-32 bg-stone-400 rounded-[100%] blur-3xl opacity-20 -z-10" />
            <div className="absolute top-10 -left-10 w-64 h-64 bg-white/40 rounded-full blur-3xl opacity-60 -z-10" />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};
