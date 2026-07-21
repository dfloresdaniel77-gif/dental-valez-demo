"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  videoSrc?: string;
}

export const AppleScrollReveal = ({ texts, videoSrc }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  // Keep the same generous scroll space per page
  const containerHeight = `${numItems * 200}vh`;

  // ── VIDEO SCROLL SYNC ──
  const targetTime = useRef(0);

  // Map overall scroll progress → target video time
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!videoRef.current || Number.isNaN(videoRef.current.duration)) return;
    targetTime.current = latest * videoRef.current.duration;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const loop = () => {
      if (video.readyState >= 1 && !Number.isNaN(video.duration)) {
        const diff = targetTime.current - video.currentTime;
        if (Math.abs(diff) > 0.02) {
          video.currentTime += diff * 0.15;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    const handleLoaded = () => {
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    if (video.readyState >= 1) handleLoaded();
    
    // Start the rAF loop once
    loop();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Subtle scale pulse for the video — grows slightly as you scroll deeper
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0.6]);

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1] rounded-t-[2rem]">
      <div className="sticky top-0 h-screen w-full">

        {/* ── SCROLL-SYNCED VIDEO BACKGROUND ── */}
        {videoSrc && (
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              style={{ scale: videoScale, opacity: videoOpacity }}
            >
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                preload="auto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  mixBlendMode: "multiply",
                  display: "block",
                }}
              />
            </motion.div>
          </div>
        )}

        {/* Text Container — curtain wipe effect for quotes */}
        <div className="absolute inset-0 w-full h-full z-10 overflow-hidden flex flex-col items-center justify-center pointer-events-none pb-48 md:pb-64">
          {texts.map((text, index) => {
            const start = index / numItems;
            const end = (index + 1) / numItems;
            const isLast = index === numItems - 1;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [start, start + 0.05, end - 0.05, end],
              [0, 1, isLast ? 1 : 1, isLast ? 1 : 0]
            );

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(
              scrollYProgress,
              [start, start + 0.05, end - 0.05, end],
              [20, 0, 0, isLast ? 0 : -20]
            );

            return (
              <motion.div
                key={index}
                style={{ opacity, y }}
                className="absolute w-full px-4 text-center pointer-events-auto"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
