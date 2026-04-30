"use client";

import { AnimatedTextScroll } from "@/components/ui/text-scroll-animation";
import { MoveRight } from "lucide-react";

export default function DemoThree() {
  const services = [
    {
      title: "Cerámica Estética",
      description: "Carillas ultrafinas hechas a mano que imitan la translucidez natural del esmalte orgánico para una sonrisa impecable.",
    },
    {
      title: "Implantes de Precisión",
      description: "Soluciones restaurativas de microingeniería que se integran a la perfección con tu biología y estética.",
    },
    {
      title: "Alineación Invisible",
      description: "Terapia de alineadores transparentes de última generación que utiliza modelado predictivo 3D avanzado para una alineación perfecta.",
    },
    {
      title: "Diseño de Sonrisa Digital",
      description: "Planificación virtual avanzada para diseñar y previsualizar los resultados de tu tratamiento antes de comenzar.",
    },
    {
      title: "Blanqueamiento Láser",
      description: "Tratamiento de blanqueamiento profundo y seguro para devolver el brillo natural a tu sonrisa en una sola sesión.",
    },
    {
      title: "Odontología Preventiva",
      description: "Cuidado integral y limpiezas profundas para mantener una salud bucal óptima y prevenir futuros problemas.",
    },
  ];

  return (
    <section className="relative w-full bg-[#f5f4f3] flex flex-col items-center pb-32">
      {/* Animated Text Header */}
      <AnimatedTextScroll text="Te mereces la mejor sonrisa" className="h-[150vh] -mb-[50vh]" />

      <div className="w-full max-w-7xl px-8 z-10 mb-6">
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-500 font-medium">
          Lo que ofrecemos
        </p>
      </div>

      {/* Services Grid */}
      <div className="w-full max-w-7xl px-8 z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div 
            key={index}
            className="group relative flex flex-col p-8 border border-black/10 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2"
          >
            <div className="text-black mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <MoveRight strokeWidth={1} size={32} />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-wide text-black mb-4">
              {service.title}
            </h3>
            <p className="text-gray-500 font-light text-sm leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
