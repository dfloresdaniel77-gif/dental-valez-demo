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
      className="flex min-h-[200vh] w-full shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:1000px] sm:scale-50 md:scale-100 md:py-64 bg-[#ece8e1]"
    >
      <motion.div
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="mb-32 text-center max-w-4xl px-8"
      >
        {title}
      </motion.div>
      
      {/* Lid (Folio Cover) */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      
      {/* Base area (Folio Base) */}
      <div className="relative -z-10 h-[32rem] w-[26rem] md:w-[30rem] overflow-hidden rounded-xl bg-[#dfdbd3] shadow-2xl shadow-black/10 border border-stone-300">
        
        {/* Folio Inner Pages */}
        <div className="absolute inset-2 md:inset-4 rounded-lg bg-[#f8f6f3] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center justify-center border border-stone-200">
          
          {/* Custom Creative Dentist Tools SVG Graphic */}
          <div className="w-full h-full flex flex-col items-center justify-center p-8 opacity-40">
            <svg viewBox="0 0 100 100" className="w-48 h-48 text-stone-400 stroke-current" fill="none" strokeWidth="1.5">
              {/* Dental Mirror */}
              <path d="M 30 70 L 60 40 M 60 40 A 8 8 0 1 1 70 30 A 8 8 0 1 1 60 40" />
              {/* Dental Explorer / Scaler */}
              <path d="M 40 80 L 70 50 Q 80 40 75 35" />
              {/* Forceps / Pliers shape */}
              <path d="M 20 50 L 45 25 M 30 60 L 55 35 M 45 25 C 50 20 60 25 55 35 M 20 50 C 15 55 25 65 30 60" />
            </svg>
            <div className="mt-8 text-stone-500 font-serif italic text-xl tracking-widest uppercase">
              Clínica Dental Velez
            </div>
            <div className="mt-2 text-stone-400 font-light text-sm tracking-widest uppercase">
              Arte & Precisión
            </div>
          </div>
        </div>
        
        {/* Bottom edge shadow */}
        <div className="absolute inset-x-0 bottom-0 z-50 h-24 w-full bg-gradient-to-t from-[#ece8e1] to-transparent"></div>
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
    <div className="relative [perspective:1000px]">
      {/* Outside Cover (Visible when closed) */}
      <div
        style={{
          transform: "perspective(1000px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative h-[12rem] w-[26rem] md:w-[30rem] rounded-xl bg-[#d4cfc7] border border-stone-400 shadow-xl shadow-black/10"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #c4bfae inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#dfdbd3]"
        >
          {/* Outside Logo */}
          <span className="text-stone-500 font-serif italic text-2xl tracking-widest">
            DENTAL VELEZ
          </span>
        </div>
      </div>
      
      {/* Inside Cover (Visible when opening) */}
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="absolute inset-0 h-[32rem] w-[26rem] md:w-[30rem] rounded-xl bg-[#dfdbd3] p-3 border border-stone-300 shadow-2xl shadow-black/20"
      >
        <div className="absolute inset-0 rounded-lg bg-[#f8f6f3]" />
        
        {/* Founder Image inside the Folio Cover */}
        <div className="absolute inset-3 rounded-lg overflow-hidden border border-stone-200">
          <img
            src={src as string}
            alt="Dental Professional"
            className="absolute inset-0 h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </motion.div>
    </div>
  );
};
