"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";

const LenisController = () => {
  const lenis = useLenis();
  
  React.useEffect(() => {
    if (!lenis) return;
    
    const stopLenis = () => lenis.stop();
    const startLenis = () => lenis.start();
    
    window.addEventListener('stopLenis', stopLenis);
    window.addEventListener('startLenis', startLenis);
    
    return () => {
      window.removeEventListener('stopLenis', stopLenis);
      window.removeEventListener('startLenis', startLenis);
    };
  }, [lenis]);
  
  return null;
};

type CharacterProps = {
  char: any;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
};

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  // Restore the cinematic effects as requested, ensuring they are smooth and optimized
  const x = useTransform(scrollYProgress, [0, 1], [distanceFromCenter * 150, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [distanceFromCenter * 20, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [3, 1]);

  return (
    <motion.span
      className={cn("inline-block text-black", isSpace && "w-4")}
      style={{ x, rotateZ, opacity, scale }}
    >
      {char}
    </motion.span>
  );
};

export const AnimatedTextScroll = ({ 
  text, 
  className 
}: { 
  text: string;
  className?: string;
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  // Explicitly tell Framer Motion to track from when it enters the bottom of the screen
  // to when it reaches exactly the center of the screen.
  const { scrollYProgress } = useScroll({ 
    target: targetRef,
    offset: ["start 90%", "center center"]
  });

  const words = text.split(" ");
  const centerIndex = Math.floor(text.length / 2);
  let globalCharIndex = 0;

  return (
    <div
      ref={targetRef}
      className={cn(
        "relative box-border flex h-[200vh] items-center justify-center overflow-hidden p-[2vw]",
        className
      )}
    >
      <div
        className="w-full max-w-6xl text-center text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter text-black leading-tight"
        style={{ perspective: "500px" }}
      >
        {words.map((word, wIndex) => {
          const chars = word.split("");
          return (
            <React.Fragment key={wIndex}>
              <span className="inline-block whitespace-nowrap">
                {chars.map((char) => {
                  const charComponent = (
                    <CharacterV1
                      key={globalCharIndex}
                      char={char}
                      index={globalCharIndex}
                      centerIndex={centerIndex}
                      scrollYProgress={scrollYProgress}
                    />
                  );
                  globalCharIndex++;
                  return charComponent;
                })}
              </span>
              {/* Add a space after each word except the last one */}
              {wIndex < words.length - 1 && (
                <CharacterV1
                  char=" "
                  index={globalCharIndex++}
                  centerIndex={centerIndex}
                  scrollYProgress={scrollYProgress}
                />
              )}
              {/* Force line break after 'la' (the 3rd word) on mobile */}
              {wIndex === 2 && <br className="md:hidden" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Skiper31 = () => {
  return (
    <ReactLenis root>
      <LenisController />
      <main className="relative w-full bg-[#111111]">
         <div className="absolute top-24 left-1/2 z-10 w-full -translate-x-1/2 flex justify-center text-center text-white/40">
          <span className="relative text-xs uppercase tracking-widest opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-white/30 after:content-['']">
            Desplázate para ver más
          </span>
        </div >
        <AnimatedTextScroll text={"ELEVANDO EL ESTÁNDAR"} className="bg-[#111111] h-[210vh]" />
      </main>
    </ReactLenis>
  );
};

export { CharacterV1, Skiper31 };
