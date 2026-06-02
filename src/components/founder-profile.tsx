"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { AnimatedUnderline, UnderlineGroup } from "./ui/animated-underline";
import { DentalKitScroll } from "./ui/dental-kit-scroll";

export default function FounderProfile() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  return (
    <UnderlineGroup>
      <div ref={containerRef} className="w-full bg-[#ece8e1] overflow-hidden">
        <DentalKitScroll
          src="/assets/about.png"
          title={
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-700 mb-6 block">
                <AnimatedUnderline>Transformando Vidas</AnimatedUnderline>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-tight">
                "Entendemos el miedo a sonreír. <br />
                <span className="italic font-serif text-stone-700">Ya no tienes por qué esconderlo.</span>"
              </h2>
              
              <div className="mt-12 space-y-6 text-stone-800 font-light leading-relaxed max-w-2xl mx-auto text-left md:text-center text-lg">
                <p>
                  Sabemos que vivir con una sonrisa que no te gusta es agotador.
                  Taparte la boca al reír, evitar salir en las fotos y sentir
                  ansiedad o miedo por ir al dentista son cargas que nadie
                  debería tener que soportar.
                </p>
                <p>
                  En Dental Velez, creemos en una experiencia clínica
                  completamente libre de estrés para transformar tus
                  inseguridades en resultados estéticos impecables. Deja el
                  miedo en la puerta; es momento de recuperar tu confianza y
                  volver a sonreír con total libertad.
                </p>
                <div className="pt-8 flex flex-col items-center gap-1">
                  <p className="font-semibold tracking-[0.2em] uppercase text-sm text-stone-900">
                    DENTAL VELEZ
                  </p>
                  <p className="text-xs tracking-[0.1em] text-stone-500 uppercase">
                    Visión y Equipo Clínico
                  </p>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </UnderlineGroup>
  );
}
