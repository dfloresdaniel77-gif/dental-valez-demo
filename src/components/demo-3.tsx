"use client";

import { AnimatedTextScroll } from "@/components/ui/text-scroll-animation";
import { 
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover 
} from "@/components/blocks/animated-slideshow";

export default function DemoThree() {
  const services = [
    {
      title: "Cerámica Estética",
      imageUrl: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=2400&auto=format&fit=crop",
    },
    {
      title: "Implantes de Precisión",
      imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=2486&auto=format&fit=crop",
    },
    {
      title: "Alineación Invisible",
      imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2486&auto=format&fit=crop",
    },
    {
      title: "Diseño de Sonrisa",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2486&auto=format&fit=crop",
    },
    {
      title: "Blanqueamiento Láser",
      imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2400&auto=format&fit=crop",
    },
    {
      title: "Odontología Preventiva",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2486&auto=format&fit=crop",
    },
  ];

  return (
    <section className="relative w-full bg-[#f5f4f3] flex flex-col items-center pb-32">
      {/* Animated Text Header */}
      <AnimatedTextScroll text="Te mereces la mejor sonrisa" className="h-[70vh] -mb-[10vh]" />

      <div className="w-full max-w-7xl px-8 z-10 mb-16 text-center md:text-left">
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-500 font-medium">
          Lo que ofrecemos
        </p>
      </div>

      {/* Services Hover Slider */}
      <HoverSlider className="w-full max-w-7xl px-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
          <div className="flex flex-col space-y-6 md:space-y-8 w-full md:w-1/2 text-left items-start">
            {services.map((service, index) => (
              <TextStaggerHover
                key={service.title}
                index={index}
                className="cursor-pointer text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-black whitespace-nowrap"
                text={service.title}
              />
            ))}
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <HoverSliderImageWrap className="w-full max-w-[500px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              {services.map((service, index) => (
                <div key={index} className="size-full">
                  <HoverSliderImage
                    index={index}
                    imageUrl={service.imageUrl}
                    src={service.imageUrl}
                    alt={service.title}
                    className="size-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ))}
            </HoverSliderImageWrap>
          </div>
        </div>
      </HoverSlider>
    </section>
  );
}
