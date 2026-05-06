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
import { useLenis } from "lenis/react";

interface UltimateHeroProps {
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

export const UltimateHero: React.FC<UltimateHeroProps> = ({
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [phase, setPhase] = useState<"trap" | "sticky">("trap");
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 1. The Trap Phase Logic (JS Listeners)
  useEffect(() => {
    if (phase !== "trap" || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      if (phase !== "trap") return;
      e.preventDefault();
      
      const delta = e.deltaY / 1500;
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      
      setScrollProgress(nextProgress);
      
      // The Handover: Once we reach 50% expansion, switch to sticky phase
      if (nextProgress >= 0.5) {
        setPhase("sticky");
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (phase !== "trap" || touchStartY === null) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      const delta = deltaY / 1000;
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nextProgress);
      if (nextProgress >= 0.5) setPhase("sticky");
    };

    const element = sectionRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    // Lock body during trap phase
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
      }
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [phase, scrollProgress, touchStartY, isMobile, lenis]);

  // 2. The Sticky Phase Logic (Native Scroll)
  const { scrollYProgress: containerScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // visualProgress combines both phases
  // If in trap phase, use the state. If in sticky, use the container scroll.
  const visualProgress = useTransform(
    containerScroll,
    [0, 0.2, 1],
    [scrollProgress, 0.5, 1] // Maps the native scroll from 0.2 to 1 into the second half of expansion
  );

  const opacity = useTransform(visualProgress, [0, 0.2], [1, 0]);
  const width = useTransform(visualProgress, [0, 1], ["300px", "100vw"]);
  const height = useTransform(visualProgress, [0, 1], ["400px", "100vh"]);
  const radius = useTransform(visualProgress, [0, 0.8], ["24px", "0px"]);
  const textXLeft = useTransform(visualProgress, [0, 0.8], ["0vw", "-100vw"]);
  const textXRight = useTransform(visualProgress, [0, 0.8], ["0vw", "100vw"]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className={cn(
        "relative transition-colors duration-700",
        isMobile ? "h-auto" : "h-[300vh] bg-[#111111]"
      )}
    >
      <div className={cn(
        "sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center",
        isMobile && "relative h-auto py-20"
      )}>
        
        {/* Background Layer */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: isMobile ? 1 : opacity }}
        >
          <Image src={bgImageSrc} alt="BG" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        {/* Media Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <motion.div
            style={{
              width: isMobile ? "90vw" : width,
              height: isMobile ? "60vh" : height,
              borderRadius: isMobile ? "16px" : radius,
              overflow: "hidden",
            }}
            className="relative flex items-center justify-center shadow-2xl"
          >
            {mediaType === "video" ? (
              <video src={mediaSrc} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <Image src={mediaSrc} alt="Hero" fill className="object-cover" />
            )}
            <motion.div className="absolute inset-0 bg-black" style={{ opacity: useTransform(visualProgress, [0, 1], [0.6, 0.3]) }} />
            
            {/* Split Title inside Media */}
            <div className="relative z-20 flex flex-col items-center">
               <motion.p style={{ x: textXLeft }} className="text-white text-xl tracking-widest uppercase">{date}</motion.p>
               <motion.p style={{ x: textXRight }} className="text-white/60 text-xs tracking-widest uppercase mt-2">{scrollToExpand}</motion.p>
            </div>
          </motion.div>
        </div>

        {/* Floating Titles */}
        <div className="absolute z-20 flex flex-col items-center gap-4 text-center pointer-events-none">
          <motion.h2 style={{ x: textXLeft, opacity: useTransform(visualProgress, [0, 0.5], [1, 0]) }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter">
            {firstWord}
          </motion.h2>
          <motion.h2 style={{ x: textXRight, opacity: useTransform(visualProgress, [0, 0.5], [1, 0]) }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter">
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Children Content */}
        <AnimatePresence>
          {scrollProgress > 0.9 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <div className="max-w-4xl p-8">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default UltimateHero;
