"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedUnderline, UnderlineGroup } from "./ui/animated-underline";

export default function FounderProfile() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <UnderlineGroup>
      <section className="w-full bg-[#111111] flex flex-col md:flex-row items-center justify-center py-32 px-8 min-h-screen">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Image with Frame */}
          <div
            className="relative transition-all duration-700 max-w-md mx-auto lg:mx-0 w-full"
            style={{
              transform: isHovered ? "translateX(4px) translateY(-4px)" : "translateX(0) translateY(0)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Frame outline */}
            <div
              className="absolute -inset-3 border transition-all duration-700 md:-inset-4 pointer-events-none"
              style={{
                borderColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "transparent",
                transform: isHovered ? "scale(1.01)" : "scale(1)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />

            {/* Image container */}
            <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden">
              <div
                className="absolute -inset-1 transition-all duration-700 z-10 pointer-events-none"
                style={{
                  boxShadow: isHovered ? "0 24px 64px rgba(255, 255, 255, 0.05)" : "0 0 0 transparent",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <Image 
                src="/founder-no-tattoos.png"
                alt="Lead Doctor Portrait"
                fill
                className="object-cover object-center transition-all duration-1000"
                style={{
                  filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
                  transform: isHovered ? "scale(1.03)" : "scale(1)",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              {/* Subtle overlay to soften */}
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply z-10 pointer-events-none"></div>
              
              {/* Corner accents */}
              <div
                className="absolute left-2 top-2 h-5 w-px bg-white/80 transition-all duration-500 md:left-3 md:top-3 md:h-6 z-20 pointer-events-none"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "top",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "50ms",
                }}
              />
              <div
                className="absolute left-2 top-2 h-px w-5 bg-white/80 transition-all duration-500 md:left-3 md:top-3 md:w-6 z-20 pointer-events-none"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "100ms",
                }}
              />
              <div
                className="absolute bottom-2 right-2 h-5 w-px bg-white/80 transition-all duration-500 md:bottom-3 md:right-3 md:h-6 z-20 pointer-events-none"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "bottom",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "150ms",
                }}
              />
              <div
                className="absolute bottom-2 right-2 h-px w-5 bg-white/80 transition-all duration-500 md:bottom-3 md:right-3 md:w-6 z-20 pointer-events-none"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "right",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "200ms",
                }}
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col space-y-10 max-w-2xl">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-300">
                <AnimatedUnderline>Transformando Vidas</AnimatedUnderline>
              </h4>
              <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.2]">
                <AnimatedUnderline>
                  "Entendemos el miedo a sonreír. <span className="italic font-serif text-gray-300">Ya no tienes por qué esconderlo</span>."
                </AnimatedUnderline>
              </h2>
            </div>

            <div className="w-16 h-[1px] bg-gray-500"></div>

            <div className="space-y-6 text-gray-200 font-light leading-relaxed">
              <p>
                <AnimatedUnderline className="inline">
                  Sabemos que vivir con una sonrisa que no te gusta es agotador. Taparte la boca al reír, evitar salir en las fotos y sentir ansiedad o miedo por ir al dentista son cargas que nadie debería tener que soportar.
                </AnimatedUnderline>
              </p>
              <p>
                <AnimatedUnderline className="inline">
                  En Dental Valez, creemos en una experiencia clínica completamente libre de estrés para transformar tus inseguridades en resultados estéticos impecables. Deja el miedo en la puerta; es momento de recuperar tu confianza y volver a sonreír con total libertad.
                </AnimatedUnderline>
              </p>
            </div>

            {/* Signature or Name */}
            <div className="pt-8">
              <h3 className="text-xl font-medium tracking-widest uppercase text-white">
                <AnimatedUnderline>Dental Valez</AnimatedUnderline>
              </h3>
              <p className="text-xs uppercase tracking-widest text-gray-300 mt-2">
                <AnimatedUnderline>Visión y Equipo Clínico</AnimatedUnderline>
              </p>
            </div>
          </div>

        </div>
      </section>
    </UnderlineGroup>
  );
}
