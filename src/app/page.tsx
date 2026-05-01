import DemoOne from "@/components/demo-1";
import DemoTwo from "@/components/demo-2";
import DemoThree from "@/components/demo-3";
import DemoFour from "@/components/demo-4";
import DemoFive from "@/components/demo-5";
import FounderProfile from "@/components/founder-profile";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ece8e1] text-black">
      {/* Dental Valez Header */}
      <header className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center pointer-events-none mix-blend-difference">
        <div className="text-white font-bold text-xl tracking-widest uppercase">Dental Valez</div>
        <div className="text-white text-sm tracking-wide lowercase">Estudio Dental</div>
      </header>

      {/* Header and Hero Section */}
      <section className="w-full">
        <DemoTwo />
      </section>

      {/* Founder Profile Section */}
      <div id="nuestro-enfoque">
        <FounderProfile />
      </div>

      {/* Services Section */}
      <div id="servicios">
        <DemoThree />
      </div>

      {/* Transformations Slider Section */}
      <DemoFour />

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
            <div className="text-black font-bold text-2xl tracking-widest uppercase">Dental Valez</div>
            <div className="text-gray-500 text-sm tracking-wide lowercase">Estudio Dental</div>
          </div>
          
          <div className="flex space-x-8 text-sm font-light text-gray-500">
            <a href="#servicios" className="hover:text-black transition-colors">Servicios</a>
            <a href="#nuestro-enfoque" className="hover:text-black transition-colors">Nuestro Enfoque</a>
            <a href="#historias" className="hover:text-black transition-colors">Historias de Pacientes</a>
            <a href="#contacto" className="hover:text-black transition-colors">Contacto</a>
          </div>
          
          <div className="text-gray-400 text-xs font-light">
            &copy; {new Date().getFullYear()} Dental Valez. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
