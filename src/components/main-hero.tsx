'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldCheck, Star } from 'lucide-react';
import MasterSequenceHero from '@/components/ui/master-sequence-hero';
import FounderProfile from '@/components/founder-profile';
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

import UltimateHero from '@/components/ui/ultimate-hero';

const sampleMediaContent: MediaContentCollection = {
  video: {
    src: 'https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1',
    poster: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1920&auto=format&fit=crop',
    title: 'Elevando el Estándar',
    date: 'Dental Velez',
    scrollToExpand: 'Desplázate para Explorar',
    about: {
      overview: 'Experimenta el pináculo de la odontología moderna en un entorno de lujo diseñado para tu comodidad y objetivos estéticos.',
      conclusion: 'Nuestras instalaciones de vanguardia combinan tecnología avanzada con una experiencia sin igual.'
    },
  },
  image: {
    src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1280&auto=format&fit=crop', // Surgeons
    background: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1920&auto=format&fit=crop', // Dentist/X-ray
    title: 'Elevando el Estándar',
    date: 'Dental Velez',
    scrollToExpand: 'Desplázate para Explorar',
    about: {
      overview: 'Experimenta el pináculo de la odontología moderna en un entorno de lujo diseñado para tu comodidad y objetivos estéticos.',
      conclusion: 'Nuestras instalaciones de vanguardia combinan tecnología avanzada con una experiencia sin igual.'
    },
  },
};

// ... keep UltimateReveal, ShimmerText, etc. imports ...

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-20 px-6'>
      <UltimateReveal delay={0.1}>
        <span className='text-xs uppercase tracking-[0.3em] text-white/60 mb-12 font-medium block'>
          La Filosofía Dental Velez
        </span>
      </UltimateReveal>
      
      <h2 className='text-4xl md:text-6xl lg:text-[7rem] font-extralight tracking-tighter text-white leading-[1.1] flex flex-col items-center w-full'>
        <UltimateReveal delay={0.2}>
          <ShimmerText duration={3}>Elevando</ShimmerText>
        </UltimateReveal>
        
        <UltimateReveal delay={0.3}>
          <div className="w-full flex justify-center mt-4">
              <AnimatedTextCycle 
              words={[
                  "tu confianza",
                  "el estándar",
                  "la excelencia estética",
                  "el cuidado sin compromisos",
                  "la tecnología avanzada"
              ]}
              interval={2500}
              className={"text-white/40 italic font-serif font-light text-center w-full max-w-[90vw] whitespace-normal md:whitespace-nowrap"} 
            />
          </div>
        </UltimateReveal>
      </h2>
      
      <UltimateReveal delay={0.4}>
        <p className='text-xl md:text-2xl text-white/60 font-light max-w-2xl mt-16 leading-relaxed'>
           {currentMedia.about.overview}
        </p>
      </UltimateReveal>
    </div>
  );
};

const MainHero = () => {
  const [mediaType] = useState('image'); 
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <UltimateHero
      mediaType={mediaType as 'video' | 'image'}
      mediaSrc={currentMedia.src}
      bgImageSrc={currentMedia.background}
      title={currentMedia.title}
      date={currentMedia.date}
      scrollToExpand={currentMedia.scrollToExpand}
    >
      <MediaContent mediaType={mediaType as 'video' | 'image'} />
    </UltimateHero>
  );
};

export default MainHero;



