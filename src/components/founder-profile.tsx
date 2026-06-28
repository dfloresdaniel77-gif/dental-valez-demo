"use client";

import { AppleScrollReveal } from "./ui/apple-scroll-reveal";

export default function FounderProfile() {
  const typographyClass = "text-4xl md:text-6xl lg:text-[7rem] font-bold tracking-tighter text-stone-900/15 leading-[0.9] max-w-6xl mx-auto";

  const texts = [
    // Page 1: Intro — all tools floating, no tray
    <div key="1" className="flex flex-col gap-6">
      <div className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-700 block">
        Nuestros Instrumentos
      </div>
      <h2 className={typographyClass}>
        "Entendemos el miedo a sonreír."
      </h2>
    </div>,
    // Page 2: Mirror featured
    <h2 key="2" className={typographyClass}>
      "Ya no tienes por qué <span className="italic font-serif text-stone-900/25">esconderlo.</span>"
    </h2>,
    // Page 3: Scaler featured
    <h2 key="3" className={typographyClass}>
      "Cada detalle importa en tu sonrisa."
    </h2>,
    // Page 4: Probe featured
    <h2 key="4" className={typographyClass}>
      "Vivir con una sonrisa que no te gusta es agotador."
    </h2>,
    // Page 5: Syringe featured
    <h2 key="5" className={typographyClass}>
      "Creemos en una experiencia clínica completamente libre de estrés."
    </h2>,
    // Page 6: Forceps featured
    <h2 key="6" className={typographyClass}>
      "Precisión y cuidado en cada procedimiento."
    </h2>,
    // Page 7: Finale — all tools on tray
    <div key="7" className="flex flex-col gap-12">
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
