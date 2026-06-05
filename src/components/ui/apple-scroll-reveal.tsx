"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the 3D viewer (no SSR — Three.js needs the browser)
const ToolViewer3D = dynamic(
  () => import("./dental-tools-3d/viewer").then((mod) => ({ default: mod.ToolViewer3D })),
  { ssr: false }
);

interface ScrollRevealProps {
  texts: React.ReactNode[];
  toolCount?: number;
}

export const AppleScrollReveal = ({ texts, toolCount = 5 }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 120}vh`;

  // Track which tool should be visible based on scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(Math.floor(latest * numItems), numItems - 1);
    setActiveIndex(idx);
  });

  // Scroll-driven rotation value passed to the 3D viewer
  const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 6]);

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between overflow-hidden px-8 md:px-16 lg:px-24">
        
        {/* Left Side: Text — simple crossfade */}
        <div className="relative flex h-full w-full md:w-[45%] flex-col justify-center">
          {texts.map((text, index) => {
            const start = index / numItems;
            const end = (index + 1) / numItems;
            const isLast = index === numItems - 1;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              scrollYProgress,
              [start, start + 0.02, end - 0.02, end],
              [0, 1, isLast ? 1 : 1, isLast ? 1 : 0]
            );

            return (
              <motion.div
                key={index}
                style={{ opacity }}
                className="absolute left-0 right-0"
              >
                {text}
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: 3D Tool Viewer */}
        <div className="hidden h-full w-[50%] md:flex items-center justify-center">
          <div className="w-full h-[80vh]">
            <ToolViewer3D
              toolIndex={activeIndex}
              scrollRotation={scrollRotation.get()}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};
