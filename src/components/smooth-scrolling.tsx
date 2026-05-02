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
        lerp: 0.15, // Higher lerp makes it snappier and less laggy
        wheelMultiplier: 1.1, // Slightly faster wheel response
        smoothWheel: true,
        syncTouch: false, // Must be false for native-feeling mobile scroll
      }}
    >
      <LenisControls />
      {children}
    </ReactLenis>
  );
}
