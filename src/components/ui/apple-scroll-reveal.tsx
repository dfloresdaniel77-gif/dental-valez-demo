"use client";

import React, { useRef, useEffect, useCallback } from "react";
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

  // ── Sync video playback to scroll position ──
  // When scroll is at 0%, video is at 0:00
  // When scroll is at 100%, video is at the end
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      video.currentTime = latest * video.duration;
    }
  });

  // Make sure video is loaded and paused (we control time manually)
  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

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

        {/* Right Side: Scroll-synced video */}
        <div className="hidden h-full w-[50%] md:flex items-center justify-center">
          <div className="relative w-full h-[85vh] flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoLoad}
              className="h-full w-auto max-w-full object-contain"
              style={{
                /* Remove video background — blend with section bg */
                mixBlendMode: "multiply",
              }}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};
