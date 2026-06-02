"use client";

import { AnimatedUnderline, UnderlineGroup } from "./ui/animated-underline";
import { AppleScrollReveal } from "./ui/apple-scroll-reveal";

export default function FounderProfile() {
  const texts = [
    <div key="1" className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-700 mb-6">
      <AnimatedUnderline>Transformando Vidas</AnimatedUnderline>
    </div>,
    <h2 key="2" className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-tight">
      "Entendemos el miedo a sonreír. <br />
      <span className="italic font-serif text-stone-700">Ya no tienes por qué esconderlo.</span>"
    </h2>,
    <p key="3" className="text-stone-800 font-light leading-relaxed text-lg md:text-xl">
      Sabemos que vivir con una sonrisa que no te gusta es agotador.
      Taparte la boca al reír, evitar salir en las fotos y sentir
      ansiedad o miedo por ir al dentista son cargas que nadie
      debería tener que soportar.
    </p>,
    <p key="4" className="text-stone-800 font-light leading-relaxed text-lg md:text-xl">
      En Dental Velez, creemos en una experiencia clínica
      completamente libre de estrés para transformar tus
      inseguridades en resultados estéticos impecables. Deja el
      miedo en la puerta; es momento de recuperar tu confianza y
      volver a sonreír con total libertad.
    </p>,
    <div key="5" className="pt-8 flex flex-col items-start gap-1">
      <p className="font-semibold tracking-[0.2em] uppercase text-sm text-stone-900">
        DENTAL VELEZ
      </p>
      <p className="text-xs tracking-[0.1em] text-stone-500 uppercase">
        Visión y Equipo Clínico
      </p>
    </div>
  ];

  return (
    <UnderlineGroup>
      <AppleScrollReveal 
        texts={texts} 
        imageSrc="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop" 
      />
    </UnderlineGroup>
  );
}
