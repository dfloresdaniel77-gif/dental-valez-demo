"use client";

import { AppleScrollReveal } from "./ui/apple-scroll-reveal";

export default function FounderProfile() {
  const typographyClass = "text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-tight";

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
      "Ya no tienes por qué <span className="italic font-serif text-stone-700">esconderlo.</span>"
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
      <div className="flex flex-col items-start gap-1">
        <p className="font-semibold tracking-[0.2em] uppercase text-sm text-stone-900">
          DENTAL VELEZ
        </p>
        <p className="text-xs tracking-[0.1em] text-stone-500 uppercase">
          Visión y Equipo Clínico
        </p>
      </div>
    </div>
  ];

  const images = [
    "/images/tool_mirror_final.png",
    "/images/tool_scaler_final.png",
    "/images/tool_probe_final.png",
    "/images/tool_syringe_final.png",
    "/images/tool_forceps_final.png"
  ];

  return (
    <AppleScrollReveal 
      texts={texts} 
      images={images} 
    />
  );
}
