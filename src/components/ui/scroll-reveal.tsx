"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  staggerDuration?: number;
  className?: string;
}

export const ScrollReveal = ({ children, staggerDuration = 0.15, className = "" }: ScrollRevealProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDuration,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const RevealItem = ({ children, className = "", delay = 0 }: RevealItemProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { 
                duration: 1, 
                ease: [0.16, 1, 0.3, 1],
                delay: delay
            } 
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
