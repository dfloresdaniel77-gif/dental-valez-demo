"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";

function LenisControls() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Disable smooth scrolling on mobile
    if (window.innerWidth <= 768) {
      lenis.stop();
    }

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
      }}
    >
      <LenisControls />
      {children}
    </ReactLenis>
  );
}
