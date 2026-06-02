"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { RevealText } from "@/components/ui/reveal-text";
import { GripVertical } from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/ui/scroll-reveal";

export default function DemoFour() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#ece8e1] flex flex-col items-center py-32 px-8">
      <ScrollReveal className="max-w-4xl w-full flex flex-col items-center">
        <div className="text-center mb-16">
          <RevealItem delay={0.1}>
            <div className="mb-4">
              <RevealText text="TRANSFORMACIONES" fontSize="text-4xl md:text-5xl lg:text-6xl" />
            </div>
          </RevealItem>
          <RevealItem delay={0.2}>
            <p className="text-stone-800 font-light text-lg tracking-wide">
              La sutil diferencia entre el cuidado estándar y el verdadero arte.
            </p>
          </RevealItem>
        </div>

        <RevealItem delay={0.3} className="w-full max-w-2xl mx-auto">
          <div 
            ref={containerRef}
            className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-xl shadow-2xl shadow-black/10 cursor-ew-resize select-none border border-black/10"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
          >
          <div className="absolute inset-0">
            <Image 
              src="/assets/after_new.png" 
              alt="After Transformation" 
              fill 
              className="object-cover object-center pointer-events-none"
            />
          </div>

          {/* Before image (Overlay) using clip-path */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image 
              src="/assets/before_new.png" 
              alt="Before Transformation" 
              fill 
              className="object-cover object-center pointer-events-none"
            />
          </div>

          {/* Slider Line & Handle */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 pointer-events-none text-black">
              <GripVertical size={20} strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium uppercase tracking-widest px-3 py-1 rounded border border-white/10">
            Antes
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium uppercase tracking-widest px-3 py-1 rounded border border-white/10">
            Después
          </div>
          </div>
        </RevealItem>
      </ScrollReveal>
    </section>
  );
}
