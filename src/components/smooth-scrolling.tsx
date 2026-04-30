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
        lerp: 0.1, // A higher lerp ensures the scroll is highly precise and responsive
        wheelMultiplier: 1, // Standard wheel speed prevents stuttering on fast scrolls
        smoothWheel: true,
        syncTouch: true, // Ensures touch scrolling is perfectly synced
      }}
    >
      <LenisControls />
      {children}
    </ReactLenis>
  );
}
