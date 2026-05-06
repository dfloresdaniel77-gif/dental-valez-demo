import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

export default function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Calculate and set the maximum width once to prevent layout reflow during cycling
  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      let maxWidth = 0;
      for (let i = 0; i < elements.length; i++) {
        const w = elements[i].getBoundingClientRect().width;
        if (w > maxWidth) maxWidth = w;
      }
      if (maxWidth > 0) {
        setWidth(`${maxWidth + 10}px`); // Buffer to prevent wrapping
      }
    }
  }, [words]);

  useEffect(() => {
    if (!isInView) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length, isInView]);

  // Container animation for the whole word
  const containerVariants: import("framer-motion").Variants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  };

  return (
    <>
      {/* Hidden measurement div with all words rendered */}
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      {/* Visible animated word */}
      <motion.span 
        ref={containerRef}
        className="relative inline-block"
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
