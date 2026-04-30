"use client";

import * as React from "react";
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/blocks/animated-cards-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    id: "testimonial-3",
    name: "James S.",
    profession: "Paciente de Blanqueamiento",
    rating: 5,
    description:
      "Una experiencia increíble. El equipo fue muy profesional y el resultado superó todas mis expectativas. ¡Recomendado 100%!",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "testimonial-1",
    name: "Jessica H.",
    profession: "Paciente de Ortodoncia",
    rating: 4.5,
    description:
      "La atención al detalle en cada consulta es excepcional. Estoy realmente impresionada con el producto final de mi sonrisa.",
    avatarUrl:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "testimonial-2",
    name: "Lisa M.",
    profession: "Paciente de Carillas",
    rating: 5,
    description:
      "Trabajar con ellos cambió por completo mi confianza. Su profesionalismo es de otro nivel, superaron todo lo que esperaba.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "testimonial-4",
    name: "Jane D.",
    profession: "Paciente de Implantes",
    rating: 4.5,
    description:
      "La calidad del trabajo y la comunicación durante todo el proceso fueron sobresalientes. Me devolvieron la sonrisa.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#111] text-white py-32 md:py-48 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col items-center text-center px-8">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.3] text-white/90">
          Lo que dicen nuestros <br className="hidden md:block" />
          <span className="italic font-serif text-white/60">pacientes</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-gray-400 font-light text-lg md:text-xl">
          La verdadera medida de nuestro trabajo no recae en los espejos, sino en
          la risa desinhibida de las personas que confían en nosotros.
        </p>
      </div>

      <ContainerScroll className="container mx-auto h-[300vh] w-full">
        <div className="sticky left-0 top-0 h-svh w-full py-12 flex items-center justify-center">
          <CardsContainer className="mx-auto size-full h-[450px] w-[350px] md:w-[400px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                arrayLength={TESTIMONIALS.length}
                key={testimonial.id}
                variant="dark"
                index={index + 2}
                role="article"
                aria-labelledby={`card-${testimonial.id}-title`}
                aria-describedby={`card-${testimonial.id}-content`}
              >
                <div className="flex flex-col items-center space-y-6 text-center">
                  <ReviewStars
                    className="text-[#e2b050]"
                    rating={testimonial.rating}
                  />
                  <div className="mx-auto w-full px-2 text-lg text-white">
                    <blockquote cite="#">"{testimonial.description}"</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <Avatar className="!size-12 border border-stone-700">
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Portrait of ${testimonial.name}`}
                    />
                    <AvatarFallback className="text-black bg-stone-200">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="block text-lg font-semibold tracking-tight md:text-xl text-white">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-stone-400">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  );
}
