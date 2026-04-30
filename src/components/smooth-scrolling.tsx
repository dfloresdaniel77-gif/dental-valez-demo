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
        lerp: 0.05, // Lower lerp makes the scroll smoother and feel slower
        wheelMultiplier: 0.7, // Reduces the amount of scrolling per mouse wheel tick
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
