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
    // Force scroll to top on load to ensure sequence starts at 0
    window.scrollTo(0, 0);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 1. The Trap Phase (Expansion)
  useEffect(() => {
    if (phase !== "trap") return;

    const handleWheel = (e: WheelEvent) => {
      if (phase !== "trap") return;
      
      // Allow normal scroll if we are at the top and scrolling up
      if (e.deltaY < 0 && scrollProgress <= 0) return;
      
      e.preventDefault();
      const delta = e.deltaY / 1200; // Slightly faster for responsiveness
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nextProgress);
      
      if (nextProgress >= 1) {
        setPhase("flow");
        document.body.style.overflow = "";
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (phase !== "trap" || touchStartY === null) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      const delta = deltaY / (isMobile ? 300 : 800);
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nextProgress);
      if (nextProgress >= 1) {
        setPhase("flow");
        document.body.style.overflow = "";
      }
    };

    const element = sectionRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    // Only lock body if we are actually in the expansion phase
    if (phase === "trap" && scrollProgress > 0 && scrollProgress < 1) {
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop();
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

  // Reset logic: Re-engage trap when at the top
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

  const { scrollYProgress: nativeScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Master Timeline Mapping
  // 0.0 - 0.2: Trap Expansion (First Hero)
  // 0.2 - 0.6: Zoom Surge (Second Hero / Elevando)
  // 0.6 - 0.8: Transition Settle
  // 0.8 - 1.0: Founder Profile Reveal

  // Expansion logic (Purely driven by Trap Progress)
  const width = useTransform(nativeScroll, [0, 0.1], [scrollProgress < 1 ? "300px" : "100vw", "100vw"]);
  const height = useTransform(nativeScroll, [0, 0.1], [scrollProgress < 1 ? "400px" : "100vh", "100vh"]);
  const radius = useTransform(nativeScroll, [0, 0.1], [scrollProgress < 1 ? "24px" : "0px", "0px"]);
  
  // Custom interpolate function to handle the Trap + Scroll mix
  const visualProgress = useTransform(nativeScroll, [0, 0.2, 0.6, 1], [scrollProgress * 0.2, 0.2, 0.6, 1]);

  // Visual Properties
  const bgOpacity = useTransform(visualProgress, [0, 0.15], [1, 0]);
  const imgScale = useTransform(visualProgress, [0.2, 0.5, 0.7], [1, 1.8, 1]);
  const elevandoOpacity = useTransform(visualProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const elevandoY = useTransform(visualProgress, [0.3, 0.5, 0.7], [100, 0, -100]);
  
  const titleOpacity = useTransform(visualProgress, [0, 0.15], [1, 0]);
  const titleXLeft = useTransform(visualProgress, [0, 0.2], ["0vw", "-100vw"]);
  const titleXRight = useTransform(visualProgress, [0, 0.2], ["0vw", "100vw"]);

  const contentOpacity = useTransform(visualProgress, [0.8, 0.95], [0, 1]);
  const finalMediaOpacity = useTransform(visualProgress, [0.9, 1], [1, 0]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[600vh] bg-[#ece8e1]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Layer 0: Background Image (Only visible at start) */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: bgOpacity }}
        >
          <Image src={bgImageSrc} alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Layer 1: The Main Media Container (The Expansion & Zoom) */}
        <motion.div
          style={{
            width: scrollProgress < 1 ? width : "100vw",
            height: scrollProgress < 1 ? height : "100vh",
            borderRadius: scrollProgress < 1 ? radius : "0px",
            opacity: finalMediaOpacity,
          }}
          className="relative z-10 overflow-hidden shadow-2xl flex items-center justify-center bg-black"
        >
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={mediaSrc} alt="Hero" fill className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-black/20" />

          {/* Phase 1: Card Text */}
          <div className="relative z-20 flex flex-col items-center">
             <motion.p style={{ x: titleXLeft, opacity: titleOpacity }} className="text-white text-xl tracking-widest uppercase">{date}</motion.p>
             <motion.p style={{ x: titleXRight, opacity: titleOpacity }} className="text-white/60 text-xs tracking-widest uppercase mt-2">Desplázate para Explorar</motion.p>
          </div>

          {/* Phase 2: Elevando el Estándar Text */}
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

        {/* Layer 2: Entrance Titles (Floating outside card) */}
        <div className="absolute z-20 flex flex-col items-center gap-4 text-center pointer-events-none">
          <motion.h2 style={{ x: titleXLeft, opacity: titleOpacity }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl">
            {firstWord}
          </motion.h2>
          <motion.h2 style={{ x: titleXRight, opacity: titleOpacity }} className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl">
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Layer 3: Final Reveal (Founder Profile) */}
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
