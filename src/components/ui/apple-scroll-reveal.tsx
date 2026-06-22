"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the 3D viewer (no SSR — Three.js needs the browser)
const ToolViewer3D = dynamic(
  () => import("./dental-tools-3d/viewer").then((mod) => ({ default: mod.ToolViewer3D })),
  { ssr: false }
);

interface ScrollRevealProps {
  texts: React.ReactNode[];
  // videoSrc is no longer used, kept in interface if you don't want to break other pages right away
  videoSrc?: string; 
}

export const AppleScrollReveal = ({ texts }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  // Increase height a bit so user has plenty of scroll space for the assembly animation
  const containerHeight = `${numItems * 130}vh`;

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 h-screen w-full">
        
        {/* 3D Viewer Background — NO overflow-hidden so tools are never clipped */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ToolViewer3D scrollYProgress={scrollYProgress} />
        </div>

        {/* Text Container — has overflow-hidden for the curtain wipe effect */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden flex flex-col items-center justify-center pointer-events-none pb-48 md:pb-64">
          {texts.map((text, index) => {
            const start = index / numItems;
            const end = (index + 1) / numItems;
            const isLast = index === numItems - 1;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [start, start + 0.05, end - 0.05, end],
              [0, 1, isLast ? 1 : 1, isLast ? 1 : 0]
            );

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(
              scrollYProgress,
              [start, start + 0.05, end - 0.05, end],
              [20, 0, 0, isLast ? 0 : -20]
            );

            return (
              <motion.div
                key={index}
                style={{ opacity, y }}
                className="absolute w-full px-4 text-center pointer-events-auto"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
