"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShimmerText } from "./shimmer-text";

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for at least 1.5 seconds to ensure the animation plays nicely
    const minWaitPromise = new Promise(resolve => setTimeout(resolve, 1500));
    
    const finishLoading = () => {
      minWaitPromise.then(() => {
        setIsLoading(false);
      });
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    // Cleanup listener
    return () => window.removeEventListener("load", finishLoading);
  }, []);

  // To prevent scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090909]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="text-sm md:text-base font-semibold tracking-[0.4em] uppercase text-gray-300">
            <ShimmerText duration={1.5}>Dental Valez</ShimmerText>
          </div>
          {/* Subtle loading line below the text */}
          <motion.div 
            className="w-12 h-[1px] bg-white/20 mt-6 overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full bg-white/80 w-1/3"
              animate={{ 
                x: ["-100%", "300%"] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
