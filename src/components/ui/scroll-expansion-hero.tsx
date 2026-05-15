"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";

interface ScrollExpandMediaProps {
  mediaSrc: string;
  mediaType?: "image" | "video";
  posterSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  bgImageSrc: string;
  children?: React.ReactNode;
}

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  mediaSrc,
  mediaType = "image",
  posterSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  bgImageSrc,
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isMobileState, setIsMobileState] = useState(false);

  useEffect(() => {
    const handleGlobalScroll = () => {
      // If the user scrolls back to the very top, re-enable the hero trap
      if (window.scrollY < 10 && mediaFullyExpanded) {
        setMediaFullyExpanded(false);
        setScrollProgress(1.1); // Start near the end so it doesn't snap
      }
    };

    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, [mediaFullyExpanded]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent): void => {
      if (mediaFullyExpanded) return;
      e.preventDefault();
      const scrollDelta = e.deltaY / 1000;
      const newProgress = Math.min(
        Math.max(scrollProgress + scrollDelta, 0),
        1.2
      );
      setScrollProgress(newProgress);
      if (newProgress >= 1) setShowContent(true);
      else setShowContent(false);
      if (newProgress >= 1.2) setMediaFullyExpanded(true);
    };

    const handleTouchStart = (e: TouchEvent): void => {
      if (mediaFullyExpanded) return;
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (mediaFullyExpanded || touchStartY === null) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      const scrollDelta = deltaY / 800;
      const newProgress = Math.min(
        Math.max(scrollProgress + scrollDelta, 0),
        1.2
      );
      setScrollProgress(newProgress);
      if (newProgress >= 1) setShowContent(true);
      else setShowContent(false);
      if (newProgress >= 1.2) setMediaFullyExpanded(true);
    };

    const handleTouchEnd = (): void => setTouchStartY(null);

    const element = sectionRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      element.addEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener,
        { passive: false }
      );
      element.addEventListener('touchend', handleTouchEnd as EventListener);
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener(
          'touchmove',
          handleTouchMove as unknown as EventListener
        );
        element.removeEventListener('touchend', handleTouchEnd as EventListener);
      }
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, isMobileState]);

  const lenis = useLenis();

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      return;
    }

    if (!mediaFullyExpanded) {
      document.body.style.overflow = 'hidden';
      if (lenis) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
      }
    } else {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [mediaFullyExpanded, lenis]);

  useEffect(() => {
    if (!isMobileState) return;
    const handleNativeScroll = () => {
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / 400, 1.2);
      setScrollProgress(progress);
      if (progress >= 1) setShowContent(true);
      else setShowContent(false);
      if (progress >= 1.2) setMediaFullyExpanded(true);
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleNativeScroll);
  }, [isMobileState]);

  useEffect(() => {
    const checkIfMobile = (): void => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const visualProgress = Math.min(scrollProgress, 1);
  const mediaWidth = 300 + visualProgress * (isMobileState ? 1000 : 1250);
  const mediaHeight = 400 + visualProgress * (isMobileState ? 800 : 400);
  const textTranslateX = visualProgress * (isMobileState ? 100 : 80);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={sectionRef} className='transition-colors duration-700 ease-in-out overflow-x-hidden'>
      <section className='relative flex flex-col items-center justify-start min-h-screen'>
        <div className='relative w-full flex flex-col items-center min-h-screen'>
          <motion.div
            className='absolute top-0 left-0 z-0 h-screen w-full overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - visualProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              fill
              className='w-screen h-screen'
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
            <div className='absolute inset-0 bg-black/10' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-screen relative'>
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  borderRadius: `${(1 - visualProgress) * 24}px`,
                  boxShadow: visualProgress >= 1 ? 'none' : '0px 0px 50px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden'
                }}
              >
                {mediaType === 'video' ? (
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-full object-cover rounded-xl'
                  />
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      fill
                      className='w-full h-full object-cover rounded-xl'
                    />
                  </div>
                )}
                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                  {date && (
                    <motion.p
                      className='text-white text-xl md:text-2xl tracking-[0.3em] uppercase drop-shadow-2xl font-light mb-2'
                      style={{ 
                        transform: `translateX(-${textTranslateX}vw)`,
                        opacity: Math.max(1 - visualProgress * 1.5, 0)
                      }}
                    >
                      {date}
                    </motion.p>
                  )}
                  {scrollToExpand && (
                    <motion.p
                      className='text-white/60 text-[10px] md:text-xs tracking-[0.2em] uppercase drop-shadow-xl'
                      style={{ 
                        transform: `translateX(${textTranslateX}vw)`,
                        opacity: Math.max(1 - visualProgress * 1.5, 0)
                      }}
                    >
                      {scrollToExpand}
                    </motion.p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-none'
                  style={{ 
                    transform: `translateX(-${textTranslateX}vw)`,
                    opacity: Math.max(1 - visualProgress * 1.5, 0)
                  }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-3xl md:text-5xl lg:text-6xl font-serif font-light text-center text-white uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-none leading-tight'
                  style={{ 
                    transform: `translateX(${textTranslateX}vw)`,
                    opacity: Math.max(1 - visualProgress * 1.5, 0)
                  }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20 bg-[#ece8e1] relative z-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
