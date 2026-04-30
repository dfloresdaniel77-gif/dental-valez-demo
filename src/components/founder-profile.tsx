"use client";

import Image from "next/image";

export default function FounderProfile() {
  return (
    <section className="w-full bg-[#111] flex flex-col md:flex-row items-center justify-center py-32 px-8 min-h-screen">
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
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-500">El Arquitecto de la Sonrisa</h4>
            <h2 className="text-4xl md:text-5xl font-light text-white/90 tracking-tight leading-[1.2]">
              "La odontología no se trata solo de la perfección clínica, se trata de restaurar el <span className="italic font-serif text-white/60">espíritu humano</span>."
            </h2>
          </div>

          <div className="w-16 h-[1px] bg-gray-700"></div>

          <div className="space-y-6 text-gray-400 font-light leading-relaxed">
            <p>
              Este estudio fue fundado con una visión singular: desmantelar la ansiedad históricamente asociada con el cuidado dental y reemplazarla con una sensación de profunda serenidad y empoderamiento.
            </p>
            <p>
              Cada material seleccionado, cada luz colocada y cada protocolo establecido ha sido meticulosamente diseñado en torno a la experiencia del paciente. Aquí no solo tratamos dientes. Adaptamos resultados estéticos a medida que armonizan perfectamente con su estructura facial e identidad personal.
            </p>
          </div>

          {/* Signature or Name */}
          <div className="pt-8">
            <h3 className="text-xl font-medium tracking-widest uppercase text-white">Dental Valez</h3>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Visión y Equipo Clínico</p>
          </div>
        </div>

      </div>
    </section>
  );
}
