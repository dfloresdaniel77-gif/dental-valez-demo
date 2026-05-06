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
  secondMediaSrc?: string;
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
  secondMediaSrc,
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
  const [internalScale, setInternalScale] = useState(1.1); // Zoomed in slightly at start
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Option 2: Trap logic controls the INTERNAL SCALE only
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only trap zoom if we are at the top of the section
      if (window.scrollY > 100) return;
      
      const delta = e.deltaY / 2000;
      setInternalScale(prev => Math.min(Math.max(prev + delta, 1), 1.8));
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === null || window.scrollY > 100) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      const delta = deltaY / 1500;
      setInternalScale(prev => Math.min(Math.max(prev + delta, 1), 1.8));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [touchStartY, isMobile]);

  // Sticky Logic for the Frame
  const { scrollYProgress: containerScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const width = useTransform(containerScroll, [0, 0.6], ["300px", "100vw"]);
  const height = useTransform(containerScroll, [0, 0.6], ["400px", "100vh"]);
  const radius = useTransform(containerScroll, [0, 0.5], ["24px", "0px"]);
  const textXLeft = useTransform(containerScroll, [0, 0.5], ["0vw", "-100vw"]);
  const textXRight = useTransform(containerScroll, [0, 0.5], ["0vw", "100vw"]);
  const bgOpacity = useTransform(containerScroll, [0, 0.2], [1, 0]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[250vh] bg-[#111111]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Layer */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: bgOpacity }}
        >
          <Image src={bgImageSrc} alt="BG" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        {/* Media Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <motion.div
            style={{
              width,
              height,
              borderRadius: radius,
              overflow: "hidden",
            }}
            className="relative flex items-center justify-center shadow-2xl"
          >
            {/* The Image inside zooms with the Trap data */}
            <motion.div 
              style={{ scale: internalScale }} 
              className="absolute inset-0"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                {mediaType === "video" ? (
                    <video src={mediaSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                    <Image src={mediaSrc} alt="Hero" fill className="object-cover" />
                )}
            </motion.div>

            <motion.div className="absolute inset-0 bg-black/40" />
            
            {/* Split Title inside Media */}
            <div className="relative z-20 flex flex-col items-center">
               <motion.p style={{ x: textXLeft }} className="text-white text-xl tracking-widest uppercase">{date}</motion.p>
               <motion.p style={{ x: textXRight }} className="text-white/60 text-xs tracking-widest uppercase mt-2">{scrollToExpand}</motion.p>
            </div>
          </motion.div>
        </div>

        {/* Floating Titles */}
        <div className="absolute z-20 flex flex-col items-center gap-4 text-center pointer-events-none">
          <motion.h2 style={{ x: textXLeft, opacity: useTransform(containerScroll, [0, 0.4], [1, 0]) }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter">
            {firstWord}
          </motion.h2>
          <motion.h2 style={{ x: textXRight, opacity: useTransform(containerScroll, [0, 0.4], [1, 0]) }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter">
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Children Content */}
        <AnimatePresence>
          {internalScale > 1.4 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-md">
                <div className="max-w-4xl p-8">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default UltimateHero;
