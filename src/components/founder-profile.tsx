"use client";

import { AppleScrollReveal } from "./ui/apple-scroll-reveal";

export default function FounderProfile() {
  const typographyClass = "text-4xl md:text-6xl lg:text-[7rem] font-bold tracking-tighter text-stone-900/15 leading-[0.9] max-w-6xl mx-auto";

  const texts = [
    <div key="1" className="flex flex-col gap-6">
      <div className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-700 block">
        Transformando Vidas
      </div>
      <h2 className={typographyClass}>
        "Entendemos el miedo a sonreír."
      </h2>
    </div>,
    <h2 key="2" className={typographyClass}>
      "Ya no tienes por qué <span className="italic font-serif text-stone-900/25">esconderlo.</span>"
    </h2>,
    <h2 key="3" className={typographyClass}>
      "Vivir con una sonrisa que no te gusta es agotador."
    </h2>,
    <h2 key="4" className={typographyClass}>
      "Creemos en una experiencia clínica completamente libre de estrés."
    </h2>,
    <div key="5" className="flex flex-col gap-12">
      <h2 className={typographyClass}>
        "Es momento de recuperar tu confianza y volver a sonreír."
      </h2>
      <div className="flex flex-col items-center gap-2">
        <p className="font-bold tracking-[0.3em] uppercase text-sm text-stone-900/40">
          DENTAL VELEZ
        </p>
        <p className="text-xs tracking-[0.1em] text-stone-500 uppercase">
          Visión y Equipo Clínico
        </p>
      </div>
    </div>
  ];

  return (
    <AppleScrollReveal 
      texts={texts} 
      videoSrc="/videos/kling_20260606_VIDEO_Tool_2___D_342_0.mp4"
    />
  );
}
