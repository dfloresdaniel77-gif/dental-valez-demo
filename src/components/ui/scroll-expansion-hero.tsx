"use client";
 
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
 
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
 
  const lenis = useLenis();
 
  // Detect mobile width
  useEffect(() => {
    const checkIfMobile = (): void => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
 
  // Dynamically set CSS variables for viewport dimensions.
  // --hero-vh and --hero-vw are scaled by 1/0.9 on desktop to ensure the background image fills the physical viewport.
  // --media-vh is kept at the unscaled window.innerHeight to maintain the original 21stDev card layout and sizing.
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      if (vw >= 1024) {
        document.documentElement.style.setProperty("--hero-vh", `${vh / 0.9}px`);
        document.documentElement.style.setProperty("--hero-vw", `${vw / 0.9}px`);
        document.documentElement.style.setProperty("--media-vh", `${vh}px`);
      } else {
        document.documentElement.style.setProperty("--hero-vh", `${vh}px`);
        document.documentElement.style.setProperty("--hero-vw", `${vw}px`);
        document.documentElement.style.setProperty("--media-vh", `${vh}px`);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  // Lock body scroll on desktop while the media is expanding
  useEffect(() => {
    if (isMobileState || mediaFullyExpanded) return;
 
    // Reset to top and lock overflow
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
 
    return () => {
      document.body.style.overflow = "";
    };
  }, [mediaFullyExpanded, isMobileState]);
 
  // Synchronize Lenis smooth scrolling state
  useEffect(() => {
    if (isMobileState) return;
 
    if (!mediaFullyExpanded) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
 
    return () => {
      if (lenis) lenis.start();
    };
  }, [mediaFullyExpanded, lenis, isMobileState]);
 
  // Handle native scroll link on mobile
  useEffect(() => {
    if (!isMobileState) return;
 
    const handleNativeScroll = () => {
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / 250, 1.25);
      setScrollProgress(progress);
      if (progress >= 1.2) {
        setMediaFullyExpanded(true);
      }
    };
 
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleNativeScroll);
  }, [isMobileState]);
 
  // Handle manual wheel/touch scroll interception on desktop
  useEffect(() => {
    if (mediaFullyExpanded || isMobileState) return;
 
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollDelta = e.deltaY / 800;
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + scrollDelta, 0), 1.25);
        if (next >= 1.2) {
          setMediaFullyExpanded(true);
        }
        return next;
      });
    };
 
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };
 
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === null) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      const scrollDelta = deltaY / 600;
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + scrollDelta, 0), 1.25);
        if (next >= 1.2) {
          setMediaFullyExpanded(true);
        }
        return next;
      });
    };
 
    const handleTouchEnd = () => {
      setTouchStartY(null);
    };
 
    const element = trackRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("touchstart", handleTouchStart, { passive: true });
      element.addEventListener("touchmove", handleTouchMove, { passive: false });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });
    }
 
    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [mediaFullyExpanded, isMobileState, touchStartY]);
 
  // Relock scroll and re-enable wheel contraction when scrolling back to the top on desktop
  useEffect(() => {
    if (isMobileState || !mediaFullyExpanded) return;
 
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setMediaFullyExpanded(false);
        setScrollProgress(1.2);
      }
    };
 
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mediaFullyExpanded, isMobileState]);
 
  // Synchronize state with Framer Motion values
  const motionProgress = useMotionValue(0);
  useEffect(() => {
    motionProgress.set(scrollProgress);
  }, [scrollProgress]);
 
  // Calculate visual progress (clamped between 0 and 1)
  const visualProgress = useTransform(motionProgress, [0, 1.0], [0, 1]);
 
  // Interpolated dimensions using calc() to guarantee full-screen coverage with no gaps
  const mediaWidth = useTransform(visualProgress, (v) => `calc(300px + (100vw - 300px) * ${v})`);
  const mediaHeight = useTransform(visualProgress, (v) => `calc(400px + (var(--media-vh) - 400px) * ${v})`);
  
  // Smoothly morph border radius from rounded card to straight viewport edges
  const borderRadius = useTransform(visualProgress, (v) => `${(1 - v) * 24}px`);
 
  // Background and title fade out as the user scrolls
  const bgOpacity = useTransform(motionProgress, [0, 0.45], [1, 0]);
  const textOpacity = useTransform(motionProgress, [0, 0.4], [1, 0]);
  
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
        className="relative w-full h-[140vh] md:h-[180vh] bg-[#ece8e1]"
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

