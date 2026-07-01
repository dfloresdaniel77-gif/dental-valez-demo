"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { DENTAL_TOOLS, SurgicalTray } from "./tools";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

function ResponsiveScene({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 6.5);
  return <group scale={scale}>{children}</group>;
}

// Camera: FIXED at position=[0, 0, 7], fov=35
// NO camera movement. The tool moves through the viewport instead.
// Visible Y range at z=0: approximately -2.2 to +2.2

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// ── The "following curve" ──
// Determines the tool's Y position as a function of progress t (0→1).
// - Entry (0→15%):  tool enters from top, quickly settles near center
// - Follow (15→85%): tool stays near center, drifts very slowly down (THE FOLLOWING FEEL)
// - Exit (85→100%): tool smoothly exits at the bottom
function followY(t: number): number {
  if (t < 0.15) {
    // Entry: top of viewport → near center
    const e = smoothstep(t / 0.15);
    return 2.0 * (1 - e) + 0.2 * e;  // 2.0 → 0.2
  } else if (t < 0.85) {
    // Center zone: slow drift downward (this IS the following feel)
    const mid = (t - 0.15) / 0.70;
    return 0.2 - mid * 0.4;  // 0.2 → -0.2
  } else {
    // Exit: near center → bottom of viewport
    const e = smoothstep((t - 0.85) / 0.15);
    return -0.2 * (1 - e) + (-2.0) * e;  // -0.2 → -2.0
  }
}

const TOOL_Z = 1.5; // close to camera for nice size

// ── Alternating sides: odd tools left, even tools right ──
// This leaves the opposite side clear for readable text
const TOOL_X = [-1.5, 1.5, -1.5, 1.5, -1.5];  // L R L R L

// ── Per-tool show rotations (angled to face center, reduces "flat" look) ──
const SHOW_ROTATIONS = [
  new THREE.Euler(0.2, 0.4, 0.1),    // Mirror — angled right toward text
  new THREE.Euler(0.2, -0.4, -0.1),  // Scaler — angled left toward text
  new THREE.Euler(0.15, 0.35, 0.08), // Probe — angled right
  new THREE.Euler(0.15, -0.35, -0.08), // Syringe — angled left
  new THREE.Euler(0.2, 0.3, 0.1),    // Forceps — angled right
];

// ── Tool ranges: CONTINUOUS, no gaps ──
// Each tool occupies exactly one text page (1/7 of total scroll ≈ 0.143)
// Pages: 1=intro, 2-6=tools, 7=finale
const TOOL_RANGES: [number, number][] = [
  [0.143, 0.286],  // Mirror   (text page 2)
  [0.286, 0.429],  // Scaler   (text page 3)
  [0.429, 0.571],  // Probe    (text page 4)
  [0.571, 0.714],  // Syringe  (text page 5)
  [0.714, 0.857],  // Forceps  (text page 6)
];

// ── Tray (finale only) ──
const TRAY_POSITIONS = [
  new THREE.Vector3(-1.2, -0.75, 0),
  new THREE.Vector3(-0.6, -0.75, 0),
  new THREE.Vector3(0, -0.75, 0),
  new THREE.Vector3(0.6, -0.75, 0),
  new THREE.Vector3(1.2, -0.75, 0),
];
const TRAY_ROTATION = new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0);
const FINAL_PAGE_START = 0.857;
const TRAY_HIDDEN_Y = -10;
const TRAY_FINAL_Y = -0.8;

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  // Reusable objects (no allocations per frame)
  const qShow = useRef(new THREE.Quaternion()).current;
  const qSpin = useRef(new THREE.Quaternion()).current;
  const yAxis = useRef(new THREE.Vector3(0, 1, 0)).current;
  const qA = useRef(new THREE.Quaternion()).current;
  const qB = useRef(new THREE.Quaternion()).current;

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    const isFinalPage = scroll >= FINAL_PAGE_START;

    // ── Camera stays FIXED ──
    state.camera.position.y = 0;

    // ── Tray: hidden until finale ──
    if (trayRef.current) {
      if (isFinalPage) {
        const t = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, 0.92));
        trayRef.current.position.y = THREE.MathUtils.lerp(TRAY_HIDDEN_Y, TRAY_FINAL_Y, t);
      } else {
        trayRef.current.position.y = TRAY_HIDDEN_Y;
      }
    }

    const trayOffset = trayRef.current
      ? trayRef.current.position.y - TRAY_FINAL_Y
      : TRAY_HIDDEN_Y - TRAY_FINAL_Y;

    // ── Tools ──
    TOOL_RANGES.forEach(([start, end], i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      const isLastTool = i === TOOL_RANGES.length - 1;

      // ── FINALE: tray with all tools ──
      if (isFinalPage) {
        ref.visible = true;
        if (!isLastTool) {
          // Tools 0-3: already on tray, move with it
          ref.position.copy(TRAY_POSITIONS[i]);
          ref.position.y += trayOffset;
          ref.quaternion.setFromEuler(TRAY_ROTATION);
        } else {
          // Last tool: lands on tray during finale
          const landT = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, 0.96));
          ref.position.set(
            THREE.MathUtils.lerp(TOOL_X[i], TRAY_POSITIONS[i].x, landT),
            THREE.MathUtils.lerp(0.5, TRAY_POSITIONS[i].y + trayOffset, landT),
            THREE.MathUtils.lerp(TOOL_Z, TRAY_POSITIONS[i].z, landT)
          );
          qA.setFromEuler(SHOW_ROTATIONS[i]);
          qB.setFromEuler(TRAY_ROTATION);
          qShow.slerpQuaternions(qA, qB, landT);
          ref.quaternion.copy(qShow);
        }
        return;
      }

      // ── INTRO page (scroll < 0.143): show first tool peeking from above ──
      if (scroll < 0.143 && i === 0) {
        ref.visible = true;
        // First tool slowly enters from above during intro
        const introT = scroll / 0.143;
        ref.position.set(TOOL_X[0], THREE.MathUtils.lerp(3.5, 2.0, smoothstep(introT)), TOOL_Z);
        qShow.setFromEuler(SHOW_ROTATIONS[0]);
        qSpin.setFromAxisAngle(yAxis, time * 0.3);
        qShow.multiply(qSpin);
        ref.quaternion.copy(qShow);
        return;
      }

      // ── TOOL PAGE: the main animation ──
      if (scroll >= start && scroll < end) {
        ref.visible = true;

        // Pure linear progress — Lenis smooth scrolling handles the smoothness
        const t = (scroll - start) / (end - start);

        // The following curve: tool enters from top, stays centered, exits bottom
        const y = followY(t);

        ref.position.set(TOOL_X[i], y, TOOL_Z);

        // Gentle showcase rotation (per-tool angle + slow spin)
        qShow.setFromEuler(SHOW_ROTATIONS[i]);
        qSpin.setFromAxisAngle(yAxis, time * 0.35);
        qShow.multiply(qSpin);
        ref.quaternion.copy(qShow);
      } else {
        // Not active: completely hidden
        ref.visible = false;
        ref.position.set(0, -50, 0);
      }
    });
  });

  return (
    <>
      <group ref={trayRef} position={[0, TRAY_HIDDEN_Y, 0]} rotation={[0.15, 0, 0]}>
        <SurgicalTray />
      </group>
      {DENTAL_TOOLS.map(({ Component }, i) => (
        <group
          key={i}
          ref={(el) => { toolRefs.current[i] = el; }}
          position={[0, -50, 0]}
          visible={false}
        >
          <Component />
        </group>
      ))}
    </>
  );
}

export function ToolViewer3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 35 }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 8, 5]} intensity={0.7} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[0, 3, -5]} intensity={0.4} color="#e0e0ff" />
      <directionalLight position={[0, -5, 5]} intensity={0.3} color="#ffe0d0" />
      <pointLight position={[-4, 0, -3]} intensity={0.8} color="#c0d0ff" />
      <pointLight position={[4, 0, -3]} intensity={0.8} color="#ffd0c0" />
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.6} />
        <ResponsiveScene>
          <SceneAnimator scrollYProgress={scrollYProgress} />
          <ContactShadows position={[0, -0.95, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </ResponsiveScene>
      </Suspense>
    </Canvas>
  );
}
