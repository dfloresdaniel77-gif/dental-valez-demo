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

  // Sticky Logic for the 3D Depth Engine
  const { scrollYProgress: containerScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // 1. Frame expansion (happens first 60%)
  const width = useTransform(containerScroll, [0, 0.6], ["300px", "100vw"]);
  const height = useTransform(containerScroll, [0, 0.6], ["400px", "100vh"]);
  const radius = useTransform(containerScroll, [0, 0.5], ["24px", "0px"]);
  
  // 2. 3D Zoom Effect (happens over the whole scroll)
  // We zoom from 1.0 to 1.5 to create that deep immersion
  const imgScale = useTransform(containerScroll, [0, 1], [1, 1.6]);
  const imgZ = useTransform(containerScroll, [0, 1], [0, 100]); // Moves "toward" the camera
  
  // 3. UI Elements
  const textXLeft = useTransform(containerScroll, [0, 0.5], ["0vw", "-100vw"]);
  const textXRight = useTransform(containerScroll, [0, 0.5], ["0vw", "100vw"]);
  const bgOpacity = useTransform(containerScroll, [0, 0.2], [1, 0]);
  const contentOpacity = useTransform(containerScroll, [0.7, 0.9], [0, 1]);
  const contentY = useTransform(containerScroll, [0.7, 0.9], [50, 0]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[300vh] bg-[#111111] perspective-1000"
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

        {/* Media Container (The Frame) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <motion.div
            style={{
              width,
              height,
              borderRadius: radius,
              overflow: "hidden",
              z: imgZ, // Perspective shift
            }}
            className="relative flex items-center justify-center shadow-2xl"
          >
            {/* The Image (The Depth) */}
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

        {/* Revealed Content (Now using the same sticky scroll) */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
            <div className="max-w-4xl p-8 pointer-events-auto bg-black/20 backdrop-blur-md rounded-3xl">
                {children}
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UltimateHero;
