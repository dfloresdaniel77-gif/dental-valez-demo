import DemoOne from "@/components/demo-1";
import MainHero from "@/components/main-hero";
import DemoThree from "@/components/demo-3";
import DemoFour from "@/components/demo-4";
import DemoFive from "@/components/demo-5";
import FounderProfile from "@/components/founder-profile";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ece8e1] text-black">
      {/* Dental Velez Header */}
      <header className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center pointer-events-none mix-blend-difference">
        <div className="text-white font-bold text-xl tracking-widest uppercase">Dental Velez</div>
        <a href="#contacto" className="text-white text-xs md:text-sm tracking-widest uppercase border border-white/50 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors pointer-events-auto duration-300">
          Contacto
        </a>
      </header>

      <section id="inicio" className="w-full">
        <MainHero />
      </section>

      {/* Founder Profile Section — slides OVER the sticky "Elevando" content like a curtain.
           -mt-[15vh] creates a very short overlap so the transition completes in one scroll. */}
      <div 
        id="nuestro-enfoque" 
        className="relative z-30 -mt-[15vh] rounded-t-[2rem]"
        style={{ boxShadow: '0 -20px 60px rgba(0,0,0,0.12)' }}
      >
        <FounderProfile />
      </div>

      {/* Services Section */}
      <div id="servicios">
        <DemoThree />
      </div>

      {/* Transformations Slider Section */}
      <div id="transformaciones">
        <DemoFour />
      </div>

      {/* Testimonials Section */}
      <div id="historias">
        <Testimonials />
      </div>

      {/* Booking Section (Custom Form) */}
      <div id="contacto">
        <DemoFive />
      </div>


      {/* Luxury Footer */}
      <footer className="w-full bg-[#ece8e1] px-8 py-16 md:py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="text-black font-bold text-2xl tracking-widest uppercase">Dental Velez</div>
            <div className="text-gray-500 text-sm tracking-wide lowercase">Estudio Dental</div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-light text-gray-500">
            <a href="#inicio" className="hover:text-black transition-colors">Inicio</a>
            <a href="#nuestro-enfoque" className="hover:text-black transition-colors">Nuestro Enfoque</a>
            <a href="#servicios" className="hover:text-black transition-colors">Servicios</a>
            <a href="#transformaciones" className="hover:text-black transition-colors">Transformaciones</a>
            <a href="#historias" className="hover:text-black transition-colors">Historias de Pacientes</a>
            <a href="#contacto" className="hover:text-black transition-colors">Contacto</a>
          </div>
          
          <div className="text-gray-400 text-xs font-light">
            &copy; {new Date().getFullYear()} Dental Velez. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
