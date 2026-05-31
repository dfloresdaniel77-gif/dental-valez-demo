"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ScrollExpandMediaProps {
  mediaSrc: string;
  mediaType?: "image" | "video";
  posterSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  bgImageSrc: string;
  children?: React.ReactNode;
}

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  mediaSrc,
  mediaType = "image",
  posterSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  bgImageSrc,
  children,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobileState, setIsMobileState] = useState(false);

  useEffect(() => {
    const checkIfMobile = (): void => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Track scroll progress of the entire container track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Calculate visual progress (clamped between 0 and 1)
  const visualProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  // Interpolated dimensions using calc() to guarantee full-screen coverage with no gaps
  const mediaWidth = useTransform(visualProgress, (v) => `calc(300px + (100vw - 300px) * ${v})`);
  const mediaHeight = useTransform(visualProgress, (v) => `calc(400px + (var(--hero-vh) - 400px) * ${v})`);
  
  // Smoothly morph border radius from rounded card to straight viewport edges
  const borderRadius = useTransform(visualProgress, (v) => `${(1 - v) * 24}px`);

  // Background and title fade out as the user scrolls
  const bgOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  
  // Subtle scaling effect inside the media frame
  const imgScale = useTransform(visualProgress, [0, 1], [1.3, 1.0]);

  // Translate header/titles left and right on scroll
  const leftTranslateX = useTransform(visualProgress, (v) => `-${v * (isMobileState ? 100 : 80)}vw`);
  const rightTranslateX = useTransform(visualProgress, (v) => `${v * (isMobileState ? 100 : 80)}vw`);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="w-full bg-[#ece8e1]">
      {/* Scroll track defines the scroll animation distance */}
      <div 
        ref={trackRef} 
        className="relative w-full h-[140vh] md:h-[180vh] bg-[#111111]"
      >
        {/* Sticky viewport container */}
        <div 
          className="sticky top-0 w-full overflow-hidden flex flex-col items-center justify-start z-10"
          style={{ height: "var(--hero-vh)" }}
        >
          {/* Background Dentist Image */}
          <motion.div
            className="absolute top-0 left-0 z-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ opacity: bgOpacity }}
          >
            <Image
              src={bgImageSrc}
              alt="Background"
              fill
              className="w-full h-full object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          {/* Core Visual Elements Container */}
          <div className="container mx-auto h-full flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-full relative">
              
              {/* Expanding Image/Video Frame */}
              <motion.div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0px_0px_50px_rgba(0,0,0,0.3)] overflow-hidden"
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                  borderRadius: borderRadius,
                }}
              >
                {mediaType === "video" ? (
                  <motion.div 
                    className="w-full h-full relative overflow-hidden"
                    style={{ scale: imgScale }}
                  >
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                ) : (
                  <div className="relative w-full h-full overflow-hidden">
                    <motion.div 
                      className="w-full h-full relative"
                      style={{ scale: imgScale }}
                    >
                      <Image
                        src={mediaSrc}
                        alt={title || "Media content"}
                        fill
                        className="w-full h-full object-cover rounded-xl"
                        priority
                      />
                    </motion.div>
                  </div>
                )}
                
                {/* Secondary metadata inside the frame */}
                <div className="flex flex-col items-center text-center relative z-10 mt-4">
                  {date && (
                    <motion.p
                      className="text-white text-xl md:text-2xl tracking-[0.3em] uppercase drop-shadow-2xl font-light mb-2"
                      style={{ 
                        x: leftTranslateX,
                        opacity: textOpacity
                      }}
                    >
                      {date}
                    </motion.p>
                  )}
                  {scrollToExpand && (
                    <motion.p
                      className="text-white/60 text-[10px] md:text-xs tracking-[0.2em] uppercase drop-shadow-xl"
                      style={{ 
                        x: rightTranslateX,
                        opacity: textOpacity
                      }}
                    >
                      {scrollToExpand}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Main Heading Text */}
              <div
                className={cn(
                  "flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col",
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                )}
              >
                <motion.h2
                  className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  style={{ 
                    x: leftTranslateX,
                    opacity: textOpacity
                  }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-center text-white uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-tight"
                  style={{ 
                    x: rightTranslateX,
                    opacity: textOpacity
                  }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Beige content section that scrolls up naturally from underneath */}
      <div className="relative w-full z-20 bg-[#ece8e1]">
        {children}
      </div>
    </div>
  );
};

export default ScrollExpandMedia;

