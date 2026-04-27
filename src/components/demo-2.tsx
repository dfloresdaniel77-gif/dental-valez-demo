'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldCheck, Star } from 'lucide-react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  video: {
    src: 'https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1',
    poster:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1280&auto=format&fit=crop', // updated poster
    background:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1920&auto=format&fit=crop', // updated bg
    title: 'Experiencia Dental Inmersiva',
    date: 'Dental Valez',
    scrollToExpand: 'Desplázate para Explorar',
    about: {
      overview:
        'Esta es una demostración del componente ScrollExpandMedia con un video. A medida que te desplazas, el video se expande para llenar más la pantalla, creando una experiencia inmersiva.',
      conclusion:
        'Experimenta el pináculo de la odontología moderna en un entorno de lujo diseñado para tu comodidad y objetivos estéticos.',
    },
  },
  image: {
    src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1280&auto=format&fit=crop', // Modern clinic interior
    background:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1920&auto=format&fit=crop', // Dental tools/room
    title: 'El Arte de la Odontología',
    date: 'Dental Valez',
    scrollToExpand: 'Desplázate para Explorar',
    about: {
      overview:
        'Experimenta el pináculo de la odontología moderna en un entorno de lujo diseñado para tu comodidad y objetivos estéticos.',
      conclusion:
        'Nuestras instalaciones de vanguardia combinan tecnología avanzada con una experiencia sin igual para crear la sonrisa que mereces.',
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className='w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-24 md:py-40 font-sans'>
      
      {/* Top Minimal Header */}
      <div className='w-full flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-gray-200 pb-16 mb-20'>
        <div className='flex flex-col'>
          <span className='text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 font-medium'>La Filosofía Dental Valez</span>
          <h2 className='text-6xl md:text-7xl lg:text-[7rem] font-extralight tracking-tighter text-black leading-[1.05]'>
            Elevando el <br/><span className='text-gray-400 italic font-serif'>Estándar</span>
          </h2>
        </div>
        
        <p className='text-xl md:text-2xl text-gray-500 font-light max-w-xl mt-12 lg:mt-0 leading-relaxed lg:text-right'>
           {currentMedia.about.overview}
        </p>
      </div>

      {/* Ultra Minimal Feature Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20'>
        
        <div className='flex flex-col space-y-8'>
          <div className='w-full h-[1px] bg-black/10'></div>
          <div className='flex justify-between items-center px-1'>
            <span className='text-[10px] font-semibold tracking-widest text-black uppercase'>01</span>
            <Sparkles className='w-5 h-5 text-gray-800' strokeWidth={1} />
          </div>
          <div className='flex flex-col space-y-4'>
            <h3 className='text-2xl font-light tracking-wide text-black'>Excelencia Estética</h3>
            <p className='text-sm text-gray-500 font-light leading-relaxed'>
              Combinando la precisión clínica con el ojo de un artista para crear sonrisas notablemente naturales e impresionantes.
            </p>
          </div>
        </div>

        <div className='flex flex-col space-y-8'>
          <div className='w-full h-[1px] bg-black/10'></div>
          <div className='flex justify-between items-center px-1'>
            <span className='text-[10px] font-semibold tracking-widest text-black uppercase'>02</span>
            <ShieldCheck className='w-5 h-5 text-gray-800' strokeWidth={1} />
          </div>
          <div className='flex flex-col space-y-4'>
            <h3 className='text-2xl font-light tracking-wide text-black'>Cuidado sin Compromisos</h3>
            <p className='text-sm text-gray-500 font-light leading-relaxed'>
              Protocolos de esterilización de grado quirúrgico integrados a la perfección en un entorno de lujo de cinco estrellas.
            </p>
          </div>
        </div>

        <div className='flex flex-col space-y-8'>
          <div className='w-full h-[1px] bg-black/10'></div>
          <div className='flex justify-between items-center px-1'>
            <span className='text-[10px] font-semibold tracking-widest text-black uppercase'>03</span>
            <Activity className='w-5 h-5 text-gray-800' strokeWidth={1} />
          </div>
          <div className='flex flex-col space-y-4'>
            <h3 className='text-2xl font-light tracking-wide text-black'>Tecnología Avanzada</h3>
            <p className='text-sm text-gray-500 font-light leading-relaxed'>
              Aprovechando imágenes en 3D y diagnósticos impulsados por IA para tratamientos ultra mínimamente invasivos.
            </p>
          </div>
        </div>

        <div className='flex flex-col space-y-8'>
          <div className='w-full h-[1px] bg-black/10'></div>
          <div className='flex justify-between items-center px-1'>
            <span className='text-[10px] font-semibold tracking-widest text-black uppercase'>04</span>
            <Star className='w-5 h-5 text-gray-800' strokeWidth={1} />
          </div>
          <div className='flex flex-col space-y-4'>
            <h3 className='text-2xl font-light tracking-wide text-black'>Experiencia a Medida</h3>
            <p className='text-sm text-gray-500 font-light leading-relaxed'>
              Desde paisajes sonoros personalizados hasta conserjes dedicados, odontología diseñada completamente a su alrededor.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export const VideoExpansionTextBlend = () => {
  const mediaType = 'video';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansionTextBlend = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const VideoExpansion = () => {
  const mediaType = 'video';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansion = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

const Demo = () => {
  const [mediaType, setMediaType] = useState('image'); // default to image for dental demo
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  return (
    <div className='min-h-screen'>
      {/* Removed the video/image toggle buttons for a cleaner demo presentation */}
      <ScrollExpandMedia
        mediaType={mediaType as 'video' | 'image'}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType as 'video' | 'image'} />
      </ScrollExpandMedia>
    </div>
  );
};

export default Demo;
