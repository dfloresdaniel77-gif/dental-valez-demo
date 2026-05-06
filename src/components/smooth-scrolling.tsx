"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";

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
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        wheelMultiplier: 1.1,
        smoothWheel: true,
        syncTouch: false,
        // Disable on mobile to prevent conflicts with native touch/address bar behavior
        enabled: typeof window !== 'undefined' && window.innerWidth > 768,
      }}
    >
      <LenisControls />
      {children}
    </ReactLenis>
  );
}
