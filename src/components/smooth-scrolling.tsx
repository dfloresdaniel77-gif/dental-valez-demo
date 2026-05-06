"use client";

import { ReactLenis, useLenis } from "lenis/react";
import React, { useEffect, useState } from "react";

function LenisControls() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const stopLenis = () => {
      lenis.stop();
    };
    
    const startLenis = () => {
      lenis.start();
    };

    window.addEventListener("stopLenis", stopLenis);
    window.addEventListener("startLenis", startLenis);

    return () => {
      window.removeEventListener("stopLenis", stopLenis);
      window.removeEventListener("startLenis", startLenis);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScrolling({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState(true);
  
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
  }, []);

  // On mobile, completely bypass Lenis to avoid any potential CSS/overflow conflicts
  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        wheelMultiplier: 1.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <LenisControls />
      {children}
    </ReactLenis>
  );
}
