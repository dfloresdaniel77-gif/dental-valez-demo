"use client";

import React, { useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  videoSrc: string;
}

export const AppleScrollReveal = ({ texts, videoSrc }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 120}vh`;

  // Sync video playback to scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      video.currentTime = latest * video.duration;
    }
  });

  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  // Dynamic shadow that shifts with scroll for 3D depth
  const shadowX = useTransform(scrollYProgress, [0, 0.5, 1], [10, -10, 10]);
  const shadowY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 30, 20]);

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        
        {/* Left Side: Text */}
        <div className="relative flex h-full w-full md:w-[45%] flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
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
                className="absolute left-0 right-0 px-8 md:px-16 lg:px-24"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Video as 3D overlay */}
        <div className="hidden h-full w-[55%] md:flex items-center justify-center relative">
          {/* The video — background removed via blend mode, floating with shadow */}
          <motion.div
            className="relative h-[90vh] w-full flex items-center justify-center"
            style={{
              filter: useTransform(
                scrollYProgress,
                [0, 0.5, 1],
                [
                  "drop-shadow(10px 20px 40px rgba(0,0,0,0.25)) contrast(1.15)",
                  "drop-shadow(-10px 30px 50px rgba(0,0,0,0.3)) contrast(1.15)",
                  "drop-shadow(10px 20px 40px rgba(0,0,0,0.25)) contrast(1.15)",
                ]
              ),
            }}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoLoad}
              className="h-full w-auto max-w-full object-contain"
              style={{
                mixBlendMode: "multiply",
              }}
            />
          </motion.div>

          {/* Subtle ground reflection */}
          <motion.div
            className="absolute bottom-[4%] w-[30%] h-6 rounded-[100%] bg-black/8"
            style={{
              filter: "blur(20px)",
              scaleX: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]),
            }}
          />
        </div>
        
      </div>
    </div>
  );
};
