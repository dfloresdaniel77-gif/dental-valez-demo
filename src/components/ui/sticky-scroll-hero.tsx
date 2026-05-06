"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StickyScrollHeroProps {
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

export const StickyScrollHero: React.FC<StickyScrollHeroProps> = ({
  mediaSrc,
  mediaType = "image",
  title,
  date,
  scrollToExpand,
  textBlend = false,
  bgImageSrc,
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // visualProgress maps the first 60% of the container scroll to the expansion animation
  const visualProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  // bgOpacity fades the background image as we scroll
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useMotionValueEvent(visualProgress, "change", (latest) => {
    setProgress(latest);
    if (latest >= 0.95) setShowContent(true);
    else setShowContent(false);
  });

  // Dynamic values driven by scroll
  const width = useTransform(visualProgress, [0, 1], ["300px", "100vw"]);
  const height = useTransform(visualProgress, [0, 1], ["400px", "100vh"]);
  const radius = useTransform(visualProgress, [0, 0.8], ["24px", "0px"]);
  const textXLeft = useTransform(visualProgress, [0, 0.8], ["0vw", "-100vw"]);
  const textXRight = useTransform(visualProgress, [0, 0.8], ["0vw", "100vw"]);
  const overlayOpacity = useTransform(visualProgress, [0, 1], [0.6, 0.3]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[250vh] bg-[#111111]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Cinematic Background Layer */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: bgOpacity }}
        >
          <Image
            src={bgImageSrc}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        {/* The Expanding Media Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          <motion.div
            style={{
              width,
              height,
              borderRadius: radius,
              overflow: "hidden",
              boxShadow: progress >= 0.99 ? "none" : "0 20px 50px rgba(0,0,0,0.5)",
            }}
            className="relative flex items-center justify-center pointer-events-auto"
          >
            {mediaType === "video" ? (
              <video
                src={mediaSrc}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={mediaSrc}
                alt={title || "Hero Media"}
                fill
                className="object-cover"
              />
            )}
            
            {/* Darken overlay inside media */}
            <motion.div 
              className="absolute inset-0 bg-black" 
              style={{ opacity: overlayOpacity }}
            />

            {/* Content inside the image (Date/Scroll text) */}
            <div className="relative z-20 flex flex-col items-center gap-2">
              {date && (
                <motion.p 
                  style={{ x: textXLeft }}
                  className="text-white text-2xl font-light tracking-widest uppercase drop-shadow-lg"
                >
                  {date}
                </motion.p>
              )}
              {scrollToExpand && (
                <motion.p 
                  style={{ x: textXRight }}
                  className="text-white/70 text-sm tracking-[0.3em] uppercase drop-shadow-lg"
                >
                  {scrollToExpand}
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Main Floating Title (Splits away during expansion) */}
        <div className={cn(
          "absolute z-20 flex flex-col items-center gap-4 text-center px-6 pointer-events-none",
          textBlend ? "mix-blend-difference" : ""
        )}>
          <motion.h2 
            style={{ x: textXLeft, opacity: 1 - progress }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl"
          >
            {firstWord}
          </motion.h2>
          <motion.h2 
            style={{ x: textXRight, opacity: 1 - progress }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl"
          >
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Revealed Content (Shows when fully expanded) */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 flex items-center justify-center p-8 overflow-y-auto"
            >
              <div className="w-full max-w-4xl mx-auto">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StickyScrollHero;
