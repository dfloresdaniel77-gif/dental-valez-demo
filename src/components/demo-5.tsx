"use client";

import { useState } from "react";
import { AnimatedInput } from "@/components/ui/animated-input";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function DemoFive() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // We already have the state, but we can still construct data for the API
    const data = {
      Nombre: name,
      Email: email,
      Teléfono: phone
    };

    if (!email && !phone) {
      setErrorMsg("Por favor, proporciona un correo electrónico o número de teléfono.");
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch("https://submit-form.com/l4Eni4jKF", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="relative w-full bg-[#2a2a2a] flex flex-col items-center py-32 px-8 min-h-screen justify-center">
      <div className="max-w-xl w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">
            Comienza Tu Viaje
          </h2>
          <p className="text-gray-200 font-light text-lg tracking-wide">
            Programa una consulta privada y descubre el futuro del cuidado dental premium.
          </p>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-8 bg-[#333333] border border-gray-700 shadow-xl shadow-black/30 rounded-2xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">¡Gracias!</h3>
            <p className="text-gray-400 text-center text-lg leading-relaxed max-w-md">
              Hemos recibido tu información. Nos pondremos en contacto contigo pronto para confirmar tu cita.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <AnimatedInput
              label="Nombre Completo"
              name="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex flex-col gap-6">
              <AnimatedInput
                label="Correo Electrónico"
                name="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="flex items-center justify-center pt-2">
                <div className="h-px bg-gray-800 flex-grow"></div>
                <span className="px-4 text-gray-400 text-xs font-medium tracking-widest uppercase">O</span>
                <div className="h-px bg-gray-800 flex-grow"></div>
              </div>

              <div className="pb-2">
                <AnimatedInput
                  label="Número de Teléfono"
                  name="Teléfono"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm font-medium tracking-wide text-center animate-in fade-in">
                {errorMsg}
              </p>
            )}

            <HoverBorderGradient
              as="button"
              type="submit"
              disabled={isSubmitting}
              containerClassName="w-full mt-8 rounded"
              className="w-full bg-[#2a2a2a] text-white py-4 px-8 text-sm uppercase tracking-widest font-medium transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Solicitar Cita"
              )}
            </HoverBorderGradient>
          </form>
        )}
      </div>
    </section>
  );
}
