"use client";

import { ReactLenis } from "lenis/react";

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
      {children}
    </ReactLenis>
  );
}
