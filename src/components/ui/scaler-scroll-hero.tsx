"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

interface ScalerScrollHeroProps {
  videoSrc: string;
  children?: React.ReactNode;
}

export default function ScalerScrollHero({ videoSrc, children }: ScalerScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Scroll tracking across the full scroll distance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // The scrub zone: first 50% of the scroll track = full video playback
  const videoProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  // Scale: video grows from centered card to near-full-screen
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.55, 1.08]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.45], [32, 0]);

  // Text animations — fade and slide out
  const textOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  // Scroll indicator pulse
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Sync video currentTime to scroll
  useMotionValueEvent(videoProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !videoDuration || !isVideoReady) return;
    const targetTime = latest * videoDuration;
    if (Math.abs(video.currentTime - targetTime) > 0.016) {
      video.currentTime = targetTime;
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setVideoDuration(video.duration);
      setIsVideoReady(true);
      // Pause at first frame — scroll controls playback
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    // Trigger if already cached
    if (video.readyState >= 1) handleLoaded();

    return () => video.removeEventListener("loadedmetadata", handleLoaded);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      // Tall scroll track: 220vh for the sticky hero + 300vh for the content below
      style={{ minHeight: "520vh" }}
    >
      {/* ── STICKY VIEWPORT ── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* Beige site background fills everything */}
        <div className="absolute inset-0 bg-[#ece8e1]" />

        {/* ── SCALER VIDEO (scroll-scrubbed) ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <motion.div
            className="relative overflow-hidden shadow-2xl"
            style={{
              scale,
              borderRadius,
              width: "100%",
              height: "100%",
            }}
          >
            {/* mix-blend-mode: multiply → beige/white bg on the video becomes invisible */}
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
        </motion.div>

        {/* ── HERO TEXT OVERLAY ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 pointer-events-none"
          style={{ opacity: textOpacity, y: textY, zIndex: 20 }}
        >
          {/* Brand */}
          <motion.p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-stone-500 mb-6 font-medium">
            Dental Velez · Estudio Dental
          </motion.p>

          {/* Main headline */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-stone-800 tracking-tight text-center leading-[1.1] px-4"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            Precisión que
            <br />
            <em className="not-italic text-stone-500">transforma</em>
          </h1>

          <p className="mt-5 text-base md:text-lg text-stone-500 font-light text-center max-w-xs leading-relaxed px-4">
            Instrumentación de élite.<br />Resultados sin igual.
          </p>
        </motion.div>

        {/* ── SCROLL INDICATOR ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: indicatorOpacity, zIndex: 20 }}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-medium">
            Desplázate
          </span>
          <div className="w-px h-10 bg-stone-400/40 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 w-full bg-stone-500 rounded-full"
              animate={{ y: ["0%", "100%"], height: ["0%", "60%"] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── CONTENT SECTION (slides in as curtain after video playback) ── */}
      <div
        className="relative w-full"
        style={{ marginTop: "-100dvh" }}
      >
        {/* Spacer to keep content pinned until scroll passes the video zone */}
        <div style={{ height: "260vh" }} />

        {/* The actual page content */}
        <div className="relative z-30 bg-[#ece8e1] rounded-t-[2.5rem]"
          style={{ boxShadow: "0 -24px 60px rgba(0,0,0,0.10)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
