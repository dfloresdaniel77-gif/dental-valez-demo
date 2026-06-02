"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  letterImages?: string[];
  className?: string;
}

export function RevealText({
  text = "STUNNING",
  textColor = "text-stone-900",
  overlayColor = "text-stone-400",
  fontSize = "text-4xl md:text-5xl lg:text-6xl",
  letterDelay = 0.06,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  letterImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ],
  className = ""
}: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showRedText, setShowRedText] = useState(false);
  
  useEffect(() => {
    const lastLetterDelay = (text.length - 1) * letterDelay;
    const totalDelay = (lastLetterDelay * 1000) + springDuration;
    
    const timer = setTimeout(() => {
      setShowRedText(true);
    }, totalDelay);
    
    return () => clearTimeout(timer);
  }, [text.length, letterDelay, springDuration]);

  // Handle words/spaces smoothly by splitting characters but rendering a non-breaking space for actual spaces
  return (
    <div className={`flex items-center justify-center relative flex-wrap ${className}`}>
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`${fontSize} font-bold tracking-tight cursor-default relative overflow-hidden`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: index * letterDelay,
            type: "spring",
            damping: 8,
            stiffness: 200,
            mass: 0.8,
          }}
        >
          {/* Main solid text layer */}
          <motion.span 
            className={`absolute inset-0 ${textColor}`}
            animate={{ opacity: hoveredIndex === index ? 0 : 1 }}
            transition={{ duration: 0.1 }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          
          {/* Hover image mask layer */}
          <motion.span
            className="text-transparent bg-clip-text bg-cover bg-no-repeat"
            animate={{ 
              opacity: hoveredIndex === index && letter !== " " ? 1 : 0,
              backgroundPosition: hoveredIndex === index ? "10% center" : "0% center"
            }}
            transition={{ 
              opacity: { duration: 0.1 },
              backgroundPosition: { duration: 3, ease: "easeInOut" }
            }}
            style={{
              backgroundImage: letter !== " " ? `url('${letterImages[index % letterImages.length]}')` : 'none',
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          
          {/* Highlight overlay layer */}
          {showRedText && letter !== " " && (
            <motion.span
              className={`absolute inset-0 ${overlayColor} pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                delay: index * overlayDelay,
                duration: overlayDuration,
                times: [0, 0.1, 0.7, 1],
                ease: "easeInOut"
              }}
            >
              {letter}
            </motion.span>
          )}

          {/* Invisible layout structure so the div has the right dimensions */}
          <span className="invisible opacity-0">{letter === " " ? "\u00A0" : letter}</span>
        </motion.span>
      ))}
    </div>
  );
}
