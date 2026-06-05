"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollRevealProps {
  texts: React.ReactNode[];
  videoSrc: string;
}

export const AppleScrollReveal = ({ texts, videoSrc }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 120}vh`;

  // ── Draw video frame to canvas with background removal ──
  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Match canvas size to video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample the background color from corner pixels (top-left 5x5 area)
    let bgR = 0, bgG = 0, bgB = 0, samples = 0;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const i = (y * canvas.width + x) * 4;
        bgR += data[i];
        bgG += data[i + 1];
        bgB += data[i + 2];
        samples++;
      }
    }
    bgR = Math.round(bgR / samples);
    bgG = Math.round(bgG / samples);
    bgB = Math.round(bgB / samples);

    // Remove pixels similar to the background color
    const threshold = 60; // How different a pixel must be to keep it
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Distance from background color
      const dist = Math.sqrt(
        (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
      );

      if (dist < threshold) {
        // Close to background → fully transparent
        data[i + 3] = 0;
      } else if (dist < threshold + 30) {
        // Edge zone → partial transparency for smooth edges
        const alpha = Math.round(((dist - threshold) / 30) * 255);
        data[i + 3] = alpha;
      }
      // else: keep pixel fully opaque
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  // ── Sync video to scroll + redraw canvas ──
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      video.currentTime = latest * video.duration;
    }
  });

  // Redraw canvas whenever video seeks to a new frame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", onSeeked);

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onSeeked);
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

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

        {/* Right Side: Canvas with transparent background */}
        <div className="hidden h-full w-[55%] md:flex items-center justify-center relative">
          <div className="relative h-[90vh] w-full flex items-center justify-center">
            {/* Hidden video element (source for canvas) */}
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              onLoadedMetadata={handleVideoLoad}
              className="hidden"
            />

            {/* Visible canvas with background removed */}
            <canvas
              ref={canvasRef}
              className="h-full w-auto max-w-full object-contain"
              style={{
                filter: "drop-shadow(0px 25px 50px rgba(0,0,0,0.25)) contrast(1.1)",
              }}
            />
          </div>

          {/* Ground shadow */}
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
