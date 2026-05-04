"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedUnderline, UnderlineGroup } from "./ui/animated-underline";
import SectionWithMockup from "./ui/section-with-mockup";

const MaskedReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <div className="overflow-hidden py-1">
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  </div>
);

export default function FounderProfile() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <UnderlineGroup>
      <SectionWithMockup
        reverseLayout={true}
        title={
          <>
            <MaskedReveal delay={0.1}>
              <div className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-300 mb-4 block">
                <AnimatedUnderline>Transformando Vidas</AnimatedUnderline>
              </div>
            </MaskedReveal>
            <MaskedReveal delay={0.2}>
              <AnimatedUnderline>
                "Entendemos el miedo a sonreír. <span className="italic font-serif text-gray-300">Ya no tienes por qué esconderlo</span>."
              </AnimatedUnderline>
            </MaskedReveal>
          </>
        }
        description={
          <div className="space-y-6 text-gray-200 font-light leading-relaxed mt-4">
            <MaskedReveal delay={0.3}>
              <div className="w-16 h-[1px] bg-gray-500 mb-6"></div>
            </MaskedReveal>
            <MaskedReveal delay={0.4}>
              <p>
                <AnimatedUnderline className="inline">
                  Sabemos que vivir con una sonrisa que no te gusta es agotador. Taparte la boca al reír, evitar salir en las fotos y sentir ansiedad o miedo por ir al dentista son cargas que nadie debería tener que soportar.
                </AnimatedUnderline>
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.5}>
              <p>
                <AnimatedUnderline className="inline">
                  En Dental Valez, creemos en una experiencia clínica completamente libre de estrés para transformar tus inseguridades en resultados estéticos impecables. Deja el miedo en la puerta; es momento de recuperar tu confianza y volver a sonreír con total libertad.
                </AnimatedUnderline>
              </p>
            </MaskedReveal>
            <div className="pt-8">
              <MaskedReveal delay={0.6}>
                <h3 className="text-xl font-medium tracking-widest uppercase text-white">
                  <AnimatedUnderline>Dental Valez</AnimatedUnderline>
                </h3>
              </MaskedReveal>
              <MaskedReveal delay={0.7}>
                <p className="text-xs uppercase tracking-widest text-gray-300 mt-2">
                  <AnimatedUnderline>Visión y Equipo Clínico</AnimatedUnderline>
                </p>
              </MaskedReveal>
            </div>
          </div>
        }
      >
        <div
          className="relative transition-all duration-700 w-full h-full"
          style={{
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image container */}
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            {/* Animated Inner Frame with Corner Accents */}
            <div
              className="absolute inset-4 border border-white/10 transition-all duration-700 pointer-events-none z-30 rounded-[16px]"
              style={{
                borderColor: isHovered ? "rgba(255, 255, 255, 0.3)" : "transparent",
                transform: isHovered ? "scale(0.96)" : "scale(1)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Corner accents */}
              <div
                className="absolute -left-px -top-px h-5 w-px bg-white/80 transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "top",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "50ms",
                }}
              />
              <div
                className="absolute -left-px -top-px h-px w-5 bg-white/80 transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "100ms",
                }}
              />
              <div
                className="absolute -bottom-px -right-px h-5 w-px bg-white/80 transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "bottom",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "150ms",
                }}
              />
              <div
                className="absolute -bottom-px -right-px h-px w-5 bg-white/80 transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "right",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "200ms",
                }}
              />
            </div>

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
          </div>
        </div>
      </SectionWithMockup>
    </UnderlineGroup>
  );
}
