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
  mediaType = "image",
  title,
  date,
  scrollToExpand,
  bgImageSrc,
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sticky Logic for the Lens Blur Engine
  const { scrollYProgress: containerScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // 1. Frame expansion
  const width = useTransform(containerScroll, [0, 0.6], ["300px", "100vw"]);
  const height = useTransform(containerScroll, [0, 0.6], ["400px", "100vh"]);
  const radius = useTransform(containerScroll, [0, 0.5], ["24px", "0px"]);
  
  // 2. The Lens Blur Reveal (The 'Trap' Soul)
  // Starts blurry and dark, then clears as you expand
  const blurValue = useTransform(containerScroll, [0, 0.5], [20, 0]);
  const brightnessValue = useTransform(containerScroll, [0, 0.5], [0.4, 1]);
  const imgScale = useTransform(containerScroll, [0, 0.6], [1.3, 1]); // Settles from zoom
  
  // 3. UI Elements
  const textXLeft = useTransform(containerScroll, [0, 0.5], ["0vw", "-100vw"]);
  const textXRight = useTransform(containerScroll, [0, 0.5], ["0vw", "100vw"]);
  const bgOpacity = useTransform(containerScroll, [0, 0.2], [1, 0]);
  const contentOpacity = useTransform(containerScroll, [0.7, 0.9], [0, 1]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[300vh] bg-[#111111]"
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

        {/* Media Container (The Lens) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <motion.div
            style={{
              width,
              height,
              borderRadius: radius,
              overflow: "hidden",
              filter: useTransform(blurValue, (v) => `blur(${v}px) brightness(${brightnessValue.get()})`),
            }}
            className="relative flex items-center justify-center shadow-2xl"
          >
            {/* The Image inside */}
            <motion.div 
              style={{ scale: imgScale }} 
              className="absolute inset-0"
            >
                {mediaType === "video" ? (
                    <video src={mediaSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                    <Image src={mediaSrc} alt="Hero" fill className="object-cover" />
                )}
            </motion.div>

            <motion.div className="absolute inset-0 bg-black/20" />
            
            {/* Split Title inside Media */}
            <div className="relative z-20 flex flex-col items-center">
               <motion.p style={{ x: textXLeft }} className="text-white text-xl tracking-widest uppercase">{date}</motion.p>
               <motion.p style={{ x: textXRight }} className="text-white/60 text-xs tracking-widest uppercase mt-2">{scrollToExpand}</motion.p>
            </div>
          </motion.div>
        </div>

        {/* Floating Titles */}
        <div className="absolute z-20 flex flex-col items-center gap-4 text-center pointer-events-none">
          <motion.h2 style={{ x: textXLeft, opacity: useTransform(containerScroll, [0, 0.4], [1, 0]) }} className="text-4xl md:text-6xl lg:text-[6.5rem] font-serif font-medium text-white uppercase tracking-tighter leading-tight drop-shadow-xl">
            {firstWord}
          </motion.h2>
          <motion.h2 style={{ x: textXRight, opacity: useTransform(containerScroll, [0, 0.4], [1, 0]) }} className="text-4xl md:text-6xl lg:text-[6.5rem] font-serif font-medium text-white uppercase tracking-tighter leading-tight drop-shadow-xl">
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Revealed Content */}
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
            <div className="max-w-4xl p-8 pointer-events-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                {children}
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UltimateHero;
