"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

export const DentalKitScroll = ({
  src,
  title,
  badge,
}: {
  src?: string;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className="flex min-h-[200vh] w-full shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-50 md:scale-100 md:py-80 bg-[#ece8e1]"
    >
      <motion.div
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="mb-20 text-center max-w-4xl px-8"
      >
        {title}
      </motion.div>
      
      {/* Lid */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      
      {/* Base area (The Tray) */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-[#c5c5c5] shadow-2xl shadow-black/20 border-b-8 border-[#999999]">
        {/* Tray Rim highlight */}
        <div className="absolute inset-x-0 top-0 h-2 w-full bg-gradient-to-b from-white/60 to-transparent" />
        
        {/* Tray Inside */}
        <div className="absolute inset-2 rounded-xl bg-[#dcdcdc] shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Dentist Tools Image */}
          <img 
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop" 
            alt="Premium Dental Tools"
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#999999] to-[#c5c5c5]" />
        
        <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-[#ece8e1] via-[#ece8e1]/80 to-transparent"></div>
        {badge && <div className="absolute bottom-4 left-4 z-50">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#e6e6e6] p-2 border border-stone-300 shadow-lg shadow-black/5"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #d4d4d4 inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#f0f0f0]"
        >
          {/* Outside Logo */}
          <span className="text-stone-400 opacity-50 font-serif italic text-2xl tracking-widest">
            DENTAL VELEZ
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#e6e6e6] p-2 border border-stone-300 shadow-2xl shadow-black/20"
      >
        <div className="absolute inset-0 rounded-lg bg-white" />
        <img
          src={src as string}
          alt="Dental Professional"
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </motion.div>
    </div>
  );
};
