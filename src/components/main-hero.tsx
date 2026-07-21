'use client';

import { useState } from 'react';
import ScalerScrollHero from '@/components/ui/scaler-scroll-hero';
import AnimatedTextCycle from '@/components/ui/animated-text-cycle';
import ShimmerText from '@/components/ui/shimmer-text';
import { motion } from 'framer-motion';

const UltimateReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div className="overflow-hidden py-1">
    <motion.div
      initial={{ y: '100%', opacity: 0, filter: 'blur(12px)' }}
      whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ margin: '-10%' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  </div>
);

const ElevandoContent = () => (
  <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 pt-40 pb-24 font-sans flex flex-col justify-center min-h-screen">
    {/* Centered Minimal Header */}
    <div className="w-full flex flex-col items-center justify-center text-center pb-16">
      <UltimateReveal delay={0.1}>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-12 font-medium block">
          La Filosofía Dental Velez
        </span>
      </UltimateReveal>

      <h2 className="text-4xl md:text-6xl lg:text-[7rem] font-medium font-serif tracking-tighter text-black leading-[1.2] md:leading-[1.1] flex flex-col items-center w-full mt-4">
        <UltimateReveal delay={0.2}>
          <ShimmerText duration={3}>Elevando</ShimmerText>
        </UltimateReveal>

        <UltimateReveal delay={0.3}>
          <div className="w-full flex justify-center mt-2 md:mt-4">
            <AnimatedTextCycle
              words={[
                'tu confianza',
                'el estándar',
                'la excelencia estética',
                'el cuidado sin compromisos',
                'la tecnología avanzada',
              ]}
              interval={2500}
              className={
                'text-stone-700 italic font-serif font-light text-center w-full max-w-[90vw] whitespace-normal md:whitespace-nowrap'
              }
            />
          </div>
        </UltimateReveal>
      </h2>

      <UltimateReveal delay={0.4}>
        <p className="text-xl md:text-2xl text-stone-600 font-serif font-light max-w-2xl mt-16 leading-relaxed">
          Experimenta el pináculo de la odontología moderna en un entorno de lujo diseñado para tu
          comodidad y objetivos estéticos.
        </p>
      </UltimateReveal>
    </div>
  </div>
);

const MainHero = () => {
  return (
    <div className="relative z-20">
      <ScalerScrollHero videoSrc="/videos/scaler-spin.mp4">
        <ElevandoContent />
      </ScalerScrollHero>
    </div>
  );
};

export default MainHero;
