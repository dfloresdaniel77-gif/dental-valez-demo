"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";

/**
 * Snaps the scroll through the curtain transition zone between two sections.
 * When the target section is partially visible (transition in progress),
 * it auto-completes the scroll in one smooth motion — no stopping in the middle.
 */
export default function CurtainSnap({ targetId }: { targetId: string }) {
  const snapping = useRef(false);
  const cooldown = useRef(false);

  useLenis((lenis) => {
    if (snapping.current || cooldown.current) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const vh = window.innerHeight;

    // The transition zone: target's top edge is between 10% and 85% of viewport height
    // (meaning the curtain is partially covering the Elevando section)
    const inTransitionZone = rect.top > vh * 0.1 && rect.top < vh * 0.85;

    if (inTransitionZone) {
      snapping.current = true;

      if (lenis.direction > 0) {
        // Scrolling DOWN → snap forward to fully show FounderProfile
        lenis.scrollTo(target, {
          duration: 0.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
          onComplete: () => {
            snapping.current = false;
            // Brief cooldown to prevent re-triggering
            cooldown.current = true;
            setTimeout(() => { cooldown.current = false; }, 500);
          },
        });
      } else {
        // Scrolling UP → snap back to show Elevando fully
        const scrollBack = target.offsetTop - vh;
        lenis.scrollTo(Math.max(0, scrollBack), {
          duration: 0.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            snapping.current = false;
            cooldown.current = true;
            setTimeout(() => { cooldown.current = false; }, 500);
          },
        });
      }
    }
  });

  return null;
}
