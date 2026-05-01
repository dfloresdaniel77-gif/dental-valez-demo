"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  className?: string;
}

const containerVariants: import("framer-motion").Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants: import("framer-motion").Variants = {
  initial: {
    y: 0,
    color: "inherit",
  },
  animate: {
    y: "-120%",
    color: "var(--color-zinc-500)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export const AnimatedInput = ({
  label,
  className = "",
  value,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || value.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <motion.div
        className="absolute top-3 left-0 pointer-events-none text-gray-300 text-lg flex"
        variants={containerVariants}
        initial="initial"
        animate={showLabel ? "animate" : "initial"}
      >
        {label.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={letterVariants}
            style={{ willChange: "transform" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>

      <input
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        {...props}
        className="outline-none border-b border-gray-500 focus:border-white transition-colors py-3 w-full text-lg text-white bg-transparent placeholder-transparent"
      />
    </div>
  );
};
