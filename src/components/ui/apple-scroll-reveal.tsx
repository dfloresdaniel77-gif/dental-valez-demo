"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

// ═══════════════════════════════════════════
// Tool image data — alternating left/right
// ═══════════════════════════════════════════
const TOOL_IMAGES = [
  { src: "/tools/mirror.png", alt: "Dental Mirror", side: "left" as const },
  { src: "/tools/scaler.png", alt: "Dental Scaler", side: "right" as const },
  { src: "/tools/probe.png", alt: "Dental Probe", side: "left" as const },
  { src: "/tools/syringe.png", alt: "Dental Syringe", side: "right" as const },
  { src: "/tools/forceps.png", alt: "Dental Forceps", side: "left" as const },
];

// ═══════════════════════════════════════════
// Parallax tool image — scroll-driven Y offset
// creates "following" depth effect
// ═══════════════════════════════════════════
function ToolImage({
  src,
  alt,
  side,
  scrollYProgress,
  pageStart,
  pageEnd,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
  scrollYProgress: MotionValue<number>;
  pageStart: number;
  pageEnd: number;
}) {
  // Opacity: fade in → hold → fade out
  const opacity = useTransform(
    scrollYProgress,
    [pageStart, pageStart + 0.02, pageEnd - 0.02, pageEnd],
    [0, 1, 1, 0]
  );

  // Parallax Y: image moves SLOWER than scroll = depth effect
  // Enters from below (+200px), drifts up past center, exits above (-200px)
  const y = useTransform(
    scrollYProgress,
    [pageStart, pageEnd],
    [200, -200]
  );

  // Subtle scale: slightly smaller at entry/exit, full size at center
  const scale = useTransform(
    scrollYProgress,
    [pageStart, pageStart + 0.03, pageEnd - 0.03, pageEnd],
    [0.9, 1, 1, 0.9]
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`absolute top-0 h-full w-[55%] md:w-[48%] z-10 pointer-events-none flex items-center ${
        side === "left" ? "left-0 justify-start pl-4 md:pl-12" : "right-0 justify-end pr-4 md:pr-12"
      }`}
    >
      <div className="relative w-full h-[70vh] max-h-[800px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-2xl"
          sizes="(max-width: 768px) 55vw, 48vw"
          priority
        />
      </div>
    </motion.div>
  );
}

interface ScrollRevealProps {
  texts: React.ReactNode[];
  videoSrc?: string;
}

export const AppleScrollReveal = ({ texts }: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const numItems = texts.length;
  const containerHeight = `${numItems * 200}vh`;

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative w-full bg-[#ece8e1] rounded-t-[2rem]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Tool Images — parallax scroll-driven */}
        {TOOL_IMAGES.map((tool, i) => {
          // Tools map to pages 1-5 (page 0 = intro, page 6 = finale)
          const pageIndex = i + 1;
          const pageStart = pageIndex / numItems;
          const pageEnd = (pageIndex + 1) / numItems;

          return (
            <ToolImage
              key={i}
              src={tool.src}
              alt={tool.alt}
              side={tool.side}
              scrollYProgress={scrollYProgress}
              pageStart={pageStart}
              pageEnd={pageEnd}
            />
          );
        })}

        {/* Text Container */}
        <div className="absolute inset-0 w-full h-full z-20 overflow-hidden flex flex-col items-center justify-center pointer-events-none pb-48 md:pb-64">
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

            // For tool pages (1-5), align text to the OPPOSITE side of the tool
            const toolIndex = index - 1; // 0-based tool index
            const hasToolImage = toolIndex >= 0 && toolIndex < TOOL_IMAGES.length;
            const toolSide = hasToolImage ? TOOL_IMAGES[toolIndex].side : null;
            const textAlign = toolSide === "left" ? "text-right pr-8 md:pr-20 pl-[55%]" 
                           : toolSide === "right" ? "text-left pl-8 md:pl-20 pr-[55%]"
                           : "text-center";

            return (
              <motion.div
                key={index}
                style={{ opacity, y }}
                className={`absolute w-full px-4 pointer-events-auto ${textAlign}`}
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
