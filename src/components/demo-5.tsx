"use client";

import { useState } from "react";

export default function DemoFive() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const email = data.Email as string;
    const phone = data.Teléfono as string;

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
    <section className="relative w-full bg-[#1c1c1c] flex flex-col items-center py-32 px-8 min-h-screen justify-center">
      <div className="max-w-xl w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-white/90 text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">
            Comienza Tu Viaje
          </h2>
          <p className="text-gray-400 font-light text-lg tracking-wide">
            Programa una consulta privada y descubre el futuro del cuidado dental premium.
          </p>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-8 bg-[#1a1a1a] border border-gray-800 shadow-xl shadow-black/50 rounded-2xl animate-in fade-in zoom-in duration-500">
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
            <div className="relative group">
              <input 
                type="text" 
                id="fullName" 
                name="Nombre"
                className="w-full bg-transparent border-b border-gray-700 py-3 text-lg text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                placeholder="Nombre Completo"
                required 
              />
              <label 
                htmlFor="fullName" 
                className="absolute left-0 top-3 text-gray-500 text-lg transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white cursor-text"
              >
                Nombre Completo
              </label>
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative group">
                <input 
                  type="email" 
                  id="email" 
                  name="Email"
                  className="w-full bg-transparent border-b border-gray-700 py-3 text-lg text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                  placeholder="Correo Electrónico"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 top-3 text-gray-500 text-lg transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white cursor-text"
                >
                  Correo Electrónico
                </label>
              </div>

              <div className="flex items-center justify-center pt-2">
                <div className="h-px bg-gray-800 flex-grow"></div>
                <span className="px-4 text-gray-600 text-xs font-medium tracking-widest uppercase">O</span>
                <div className="h-px bg-gray-800 flex-grow"></div>
              </div>

              <div className="relative group pb-2">
                <input 
                  type="tel" 
                  id="phone" 
                  name="Teléfono"
                  className="w-full bg-transparent border-b border-gray-700 py-3 text-lg text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                  placeholder="Teléfono"
                />
                <label 
                  htmlFor="phone" 
                  className="absolute left-0 top-3 text-gray-500 text-lg transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white cursor-text"
                >
                  Número de Teléfono
                </label>
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm font-medium tracking-wide text-center animate-in fade-in">
                {errorMsg}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-8 bg-white text-black py-4 px-8 text-sm uppercase tracking-widest font-medium hover:bg-white/80 hover:shadow-2xl transition-all duration-300 rounded disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Solicitar Cita"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
