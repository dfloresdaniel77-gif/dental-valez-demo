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
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import ShimmerText from "@/components/ui/shimmer-text";

interface MasterSequenceHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  title: string;
  date: string;
  children?: React.ReactNode; // This will be the Founder Profile content
}

export const MasterSequenceHero: React.FC<MasterSequenceHeroProps> = ({
  mediaSrc,
  bgImageSrc,
  title,
  date,
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [phase, setPhase] = useState<"trap" | "flow">("trap");
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 1. The Trap Phase (The First Hero Page Experience)
  // This allows the "back and forth" between the Card and the Background
  useEffect(() => {
    if (phase !== "trap") return;

    const handleWheel = (e: WheelEvent) => {
      if (phase !== "trap") return;
      
      // If we are scrolling UP and at the start, don't prevent default
      if (e.deltaY < 0 && scrollProgress <= 0) return;
      
      e.preventDefault();
      const delta = e.deltaY / 1500;
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nextProgress);
      if (nextProgress >= 1) setPhase("flow");
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (phase !== "trap" || touchStartY === null) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      const delta = deltaY / (isMobile ? 400 : 1000);
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nextProgress);
      if (nextProgress >= 1) setPhase("flow");
    };

    const element = sectionRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    // Lock body only if we are in the middle of the expansion
    if (scrollProgress > 0 && scrollProgress < 1) {
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop();
    } else {
        document.body.style.overflow = "";
        if (lenis) lenis.start();
    }

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

  // Reset logic: Re-engage trap when at the very top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10 && phase === "flow") {
        setPhase("trap");
        setScrollProgress(1);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // sequenceProgress maps the entire journey
  // 0.0 - 0.25: Trap Expansion (First Hero Page)
  // 0.25 - 0.5: Mega Zoom (Second Hero kicks in)
  // 0.5 - 0.75: Zoom Out / Settle
  // 0.75 - 1.0: Reveal Founder Profile
  const sequenceProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [scrollProgress * 0.25, 1]
  );

  // Phase 1: Expansion (First Hero)
  const width = useTransform(sequenceProgress, [0, 0.25], ["300px", "100vw"]);
  const height = useTransform(sequenceProgress, [0, 0.25], ["400px", "100vh"]);
  const radius = useTransform(sequenceProgress, [0, 0.2], ["24px", "0px"]);
  const bgOpacity = useTransform(sequenceProgress, [0, 0.2], [1, 0]); // Background fades as card fills screen
  
  // Titles and Text
  const titleOpacity = useTransform(sequenceProgress, [0, 0.15], [1, 0]);
  const titleXLeft = useTransform(sequenceProgress, [0, 0.2], ["0vw", "-100vw"]);
  const titleXRight = useTransform(sequenceProgress, [0, 0.2], ["0vw", "100vw"]);

  // Phase 2 & 3: Mega Zoom & Settle (Second Hero)
  const imgScale = useTransform(sequenceProgress, [0.25, 0.5, 0.75], [1, 1.8, 1]);
  const elevandoOpacity = useTransform(sequenceProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
  const elevandoY = useTransform(sequenceProgress, [0.35, 0.5, 0.65], [50, 0, -50]);

  // Phase 4: Reveal Content
  const contentOpacity = useTransform(sequenceProgress, [0.8, 0.95], [0, 1]);
  const mediaFinalOpacity = useTransform(sequenceProgress, [0.85, 1], [1, 0]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[600vh] bg-[#ece8e1]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Layer (The First Hero's Background) */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: bgOpacity }}
        >
          <Image src={bgImageSrc} alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Foreground Layer (The Expanding Card / The Hero Content) */}
        <motion.div
          style={{
            width,
            height,
            borderRadius: radius,
            opacity: mediaFinalOpacity,
          }}
          className="relative z-10 overflow-hidden shadow-2xl flex items-center justify-center"
        >
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={mediaSrc} alt="Hero" fill className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-black/20" />

          {/* Phase 1 Overlay Text */}
          <div className="relative z-20 flex flex-col items-center">
             <motion.p style={{ x: titleXLeft }} className="text-white text-xl tracking-widest uppercase">{date}</motion.p>
             <motion.p style={{ x: titleXRight }} className="text-white/60 text-xs tracking-widest uppercase mt-2">Desplázate para Explorar</motion.p>
          </div>

          {/* Phase 2 Overlay: Elevando el Estándar */}
          <motion.div 
            style={{ opacity: elevandoOpacity, y: elevandoY }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/70 mb-4 font-medium">
              La Filosofía Dental Velez
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-extralight tracking-tighter text-white leading-tight">
              <ShimmerText duration={3}>Elevando</ShimmerText>
              <div className="mt-4">
                <AnimatedTextCycle 
                    words={["tu confianza", "el estándar", "la excelencia", "tu sonrisa"]}
                    interval={2500}
                    className="text-white/60 italic font-serif font-light" 
                />
              </div>
            </h2>
          </motion.div>
        </motion.div>

        {/* Phase 1 Floating Entrance Titles */}
        <div className="absolute z-20 flex flex-col items-center gap-4 text-center pointer-events-none">
          <motion.h2 style={{ x: titleXLeft, opacity: titleOpacity }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl">
            {firstWord}
          </motion.h2>
          <motion.h2 style={{ x: titleXRight, opacity: titleOpacity }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl">
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Phase 4 Content Reveal */}
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="absolute inset-0 z-40 overflow-y-auto bg-[#ece8e1]"
        >
           <div className="w-full">
                {children}
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterSequenceHero;
