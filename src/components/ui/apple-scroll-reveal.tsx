"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

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
        <div className="hidden h-full w-[45%] md:flex flex-col items-center justify-center [perspective:1000px]">
          {/* We animate the image container in 3D */}
          <motion.div
            style={{
              // The image scales up slightly as you scroll through the entire section
              scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.1]),
              // It also floats up slightly
              y: useTransform(scrollYProgress, [0, 1], [150, -100]),
              // 3D Rotations for a premium hardware feel
              rotateX: useTransform(scrollYProgress, [0, 1], [15, -5]),
              rotateY: useTransform(scrollYProgress, [0, 1], [-15, 5]),
              // Fade in at the very beginning
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
            }}
            className="relative w-full max-w-lg aspect-square"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/dental_tools_premium.png"
                alt="Premium Dental Tools"
                fill
                className="object-cover object-center mix-blend-multiply" 
                priority
              />
            </div>
            
            {/* Decorative Apple-style blur shadows to anchor the floating tools */}
            <div className="absolute -bottom-20 right-0 w-64 h-24 bg-stone-400 rounded-full blur-3xl opacity-30 -z-10" />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};
