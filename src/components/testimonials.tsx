"use client";

import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="w-full bg-[#111] text-white flex flex-col items-center justify-center py-32 md:py-48 px-8">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-12">
        
        {/* Subtle Icon */}
        <div className="text-white/20">
          <Quote size={48} strokeWidth={1} />
        </div>

        {/* Main Quote */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.3] text-white/90">
          "No solo recuperé mi sonrisa. <br className="hidden md:block"/> 
          Recuperé mi <span className="italic font-serif text-white/60">presencia</span>."
        </h2>

        {/* Supporting text */}
        <p className="text-gray-400 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
          La verdadera medida de nuestro trabajo no recae en los espejos, sino en la risa desinhibida y la innegable confianza de las personas que confían en nosotros.
        </p>

        {/* Client Name */}
        <div className="pt-8 flex flex-col items-center space-y-2">
          <div className="w-8 h-[1px] bg-white/20 mb-4"></div>
          <p className="text-sm tracking-[0.2em] uppercase font-medium">E. Vanderbilt</p>
          <p className="text-xs tracking-widest uppercase text-white/40">Cliente de Carillas a Medida</p>
        </div>

      </div>
    </section>
  );
}
