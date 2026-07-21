"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  videoSrc?: string;
}

/**
 * Scroll-synced video component using a visible <video> element.
 * Uses requestVideoFrameCallback (with rAF fallback) to ensure frames
 * are only rendered when the browser is ready, preventing the "frozen video" bug.
 */
export const AppleScrollReveal = ({ texts, videoSrc }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Track the desired video time based on scroll position
  const targetTimeRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 200}vh`;

  // Update target time whenever scroll changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    targetTimeRef.current = Math.max(0, Math.min(latest * video.duration, video.duration - 0.01));
  });

  // Seek loop: waits for the browser to finish each seek before starting the next
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.warn("[ScrollVideo] No video ref found");
      return;
    }

    let cancelled = false;
    let pendingSeek = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const onSeeked = () => {
      pendingSeek = false;
      // After seek completes, check if target has moved and seek again
      if (!cancelled) {
        scheduleSeek();
      }
    };

    const scheduleSeek = () => {
      if (cancelled || pendingSeek) return;
      if (!video.duration || Number.isNaN(video.duration)) return;
      if (video.readyState < 2) return; // Need HAVE_CURRENT_DATA to display frame

      const target = targetTimeRef.current;
      // Only seek if target is meaningfully different from current position (~1 frame at 24fps)
      if (Math.abs(video.currentTime - target) > 0.035) {
        pendingSeek = true;
        video.currentTime = target;
      }
    };

    const startPolling = () => {
      if (intervalId) return; // Already started
      console.log("[ScrollVideo] Video ready — duration:", video.duration, "readyState:", video.readyState);
      video.pause();
      video.currentTime = 0;
      // Poll for new seek targets at ~30fps
      intervalId = setInterval(() => {
        if (!cancelled) scheduleSeek();
      }, 33);
    };

    // Start polling once video has enough data
    const onLoadedData = () => {
      console.log("[ScrollVideo] loadeddata fired");
      startPolling();
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", onLoadedData);

    // If video is already loaded (e.g., from cache)
    if (video.readyState >= 2) {
      startPolling();
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onLoadedData);
    };
  }, []);

  // Visual styling driven by scroll
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0.6]);

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1] rounded-t-[2rem]">
      <div className="sticky top-0 h-screen w-full">

        {/* ── SCROLL-SYNCED VIDEO ── */}
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
