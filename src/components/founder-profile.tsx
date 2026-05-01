"use client";

import Image from "next/image";

export default function FounderProfile() {
  return (
    <section className="w-full bg-[#2a2a2a] flex flex-col md:flex-row items-center justify-center py-32 px-8 min-h-screen">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Image */}
        <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden max-w-md mx-auto lg:mx-0">
          <Image 
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
            alt="Lead Doctor Portrait"
            fill
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
          />
          {/* Subtle overlay to soften */}
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col space-y-10 max-w-2xl">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-300">Transformando Vidas</h4>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.2]">
              "Entendemos el miedo a sonreír. <span className="italic font-serif text-gray-300 underline decoration-1 underline-offset-[6px]">No se tiene que esconder nunca más</span>."
            </h2>
          </div>

          <div className="w-16 h-[1px] bg-gray-500"></div>

          <div className="space-y-6 text-gray-200 font-light leading-relaxed">
            <p>
              Sabemos que vivir con una sonrisa que no te gusta es agotador. Taparte la boca al reír, evitar salir en las fotos y sentir ansiedad o miedo por ir al dentista son cargas que nadie debería tener que soportar.
            </p>
            <p>
              En Dental Valez, somos la solución a ese problema. Hemos diseñado una experiencia clínica completamente libre de estrés para transformar tus inseguridades en resultados estéticos impecables. Deja el miedo en la puerta; es momento de recuperar tu confianza y volver a sonreír con total libertad.
            </p>
          </div>

          {/* Signature or Name */}
          <div className="pt-8">
            <h3 className="text-xl font-medium tracking-widest uppercase text-white">Dental Valez</h3>
            <p className="text-xs uppercase tracking-widest text-gray-300 mt-2">Visión y Equipo Clínico</p>
          </div>
        </div>

      </div>
    </section>
  );
}
