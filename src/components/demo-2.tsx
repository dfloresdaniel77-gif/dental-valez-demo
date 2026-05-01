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

import AnimatedTextCycle from '@/components/ui/animated-text-cycle';

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className='w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-24 md:py-40 font-sans flex flex-col justify-center min-h-[70vh]'>
      
      {/* Centered Minimal Header */}
      <div className='w-full flex flex-col items-center justify-center text-center pb-16'>
        <span className='text-xs uppercase tracking-[0.3em] text-gray-400 mb-12 font-medium'>
          La Filosofía Dental Valez
        </span>
        <h2 className='text-5xl md:text-7xl lg:text-[7rem] font-extralight tracking-tighter text-black leading-[1.2] md:leading-[1.1]'>
          Elevando <br className="hidden md:block"/>
          <AnimatedTextCycle 
            words={[
                "el estándar",
                "la excelencia estética",
                "el cuidado sin compromisos",
                "la tecnología avanzada",
                "la experiencia a medida"
            ]}
            interval={3500}
            className={"text-gray-400 italic font-serif font-light"} 
          />
        </h2>
        
        <p className='text-xl md:text-2xl text-gray-500 font-light max-w-2xl mt-16 leading-relaxed'>
           {currentMedia.about.overview}
        </p>
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
