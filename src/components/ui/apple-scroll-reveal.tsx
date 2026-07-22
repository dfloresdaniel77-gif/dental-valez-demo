"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  videoSrc?: string;
  /** Path pattern for transparent frame sequence, e.g. "/videos/frames_nobg/frame_" */
  frameBasePath?: string;
  /** Total number of frames in the sequence */
  totalFrames?: number;
}

export const AppleScrollReveal = ({ texts, videoSrc, frameBasePath, totalFrames = 120 }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);

  const useFrameSequence = !!frameBasePath;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 200}vh`;

  // ── FRAME SEQUENCE: preload all PNGs ──
  useEffect(() => {
    if (!useFrameSequence) return;

    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${frameBasePath}${String(i).padStart(4, "0")}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames && !cancelled) {
          setFramesLoaded(true);
        }
      };
      images.push(img);
    }

    framesRef.current = images;

    return () => { cancelled = true; };
  }, [frameBasePath, totalFrames, useFrameSequence]);

  // ── FRAME SEQUENCE: draw current frame to canvas on scroll ──
  const currentFrameRef = useRef(-1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (useFrameSequence && framesLoaded) {
      const frameIndex = Math.min(Math.floor(latest * totalFrames), totalFrames - 1);
      if (frameIndex !== currentFrameRef.current && frameIndex >= 0) {
        currentFrameRef.current = frameIndex;
        const canvas = canvasRef.current;
        const img = framesRef.current[frameIndex];
        if (canvas && img && img.complete) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          }
        }
      }
    }

    // Also update video target time for fallback
    if (!useFrameSequence) {
      const video = videoRef.current;
      if (video && video.duration && !Number.isNaN(video.duration)) {
        targetTimeRef.current = Math.max(0, Math.min(latest * video.duration, video.duration - 0.01));
      }
    }
  });

  // ── VIDEO FALLBACK: rAF seek loop ──
  useEffect(() => {
    if (useFrameSequence) return;
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let lastSetTime = -1;

    const tick = () => {
      if (video.readyState >= 2) {
        const target = targetTimeRef.current;
        if (Math.abs(target - lastSetTime) > 0.03) {
          lastSetTime = target;
          video.currentTime = target;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const onReady = () => {
      video.pause();
      rafId = requestAnimationFrame(tick);
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [useFrameSequence]);

  // Visual styling
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0.6]);

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1] rounded-t-[2rem]">
      <div className="sticky top-0 h-screen w-full">

        {/* ── MEDIA: transparent frame sequence OR video fallback ── */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <motion.div
            className="w-full h-full flex items-center justify-center"
            style={{ scale: videoScale, opacity: videoOpacity }}
          >
            {useFrameSequence ? (
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : videoSrc ? (
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
            ) : null}
          </motion.div>
        </div>

        {/* Text Container */}
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
