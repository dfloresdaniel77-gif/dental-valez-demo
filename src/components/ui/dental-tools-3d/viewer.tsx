"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { DENTAL_TOOLS, SurgicalTray } from "./tools";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

function ResponsiveScene({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 6.5);
  return <group scale={scale}>{children}</group>;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// ════════════════════════════════════════════════════════════
// DESIGN: Continuous camera descent = "following" the tool
//
// The camera continuously goes DOWN as the user scrolls.
// Each tool is positioned relative to the camera:
//   - Enters from TOP of viewport
//   - Drifts DOWN through center (the "following" zone)
//   - Exits at BOTTOM of viewport
//
// Because the CAMERA is also descending, the user feels like
// they're chasing/following the tool down. No resets, no jumps.
// ════════════════════════════════════════════════════════════

// Camera descends this many units over the entire tool section
const TOTAL_DESCENT = 40;

// Tool appears at this Y relative to camera (+1.8 = near top of frustum)
const SCREEN_ENTER = 1.8;
// Tool exits at this Y relative to camera (-1.8 = near bottom of frustum)
const SCREEN_EXIT = -1.8;

const TOOL_Z = 1.5;

// Alternating left/right
const TOOL_X = [-1.5, 1.5, -1.5, 1.5, -1.5];

// Per-tool rotation (angled to show widest profile)
const SHOW_ROTATIONS = [
  new THREE.Euler(0.3, 0.6, 0.15),
  new THREE.Euler(0.3, -0.6, -0.15),
  new THREE.Euler(0.25, 0.5, 0.12),
  new THREE.Euler(0.25, -0.5, -0.12),
  new THREE.Euler(0.3, 0.55, 0.15),
];

// Tray slot offsets (relative to tray center)
const TRAY_SLOT_X = [-1.2, -0.6, 0, 0.6, 1.2];
const TRAY_SLOT_Y_OFFSET = 0.05; // slightly above tray surface
const TRAY_ROTATION = new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0);

// Scroll boundaries
const SECTION_START = 0.143;  // where tools section begins
const SECTION_END = 0.857;    // where tools section ends / finale begins
const NUM_TOOLS = 5;

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  // Reusable math objects (zero allocations per frame)
  const qShow = useRef(new THREE.Quaternion()).current;
  const qSpin = useRef(new THREE.Quaternion()).current;
  const yAxis = useRef(new THREE.Vector3(0, 1, 0)).current;
  const qA = useRef(new THREE.Quaternion()).current;
  const qB = useRef(new THREE.Quaternion()).current;

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    const isFinalPage = scroll >= SECTION_END;

    // ════════════════════════════════════
    // 1. CAMERA — continuous descent
    // ════════════════════════════════════
    const sectionProgress = rangeProgress(scroll, SECTION_START, SECTION_END);
    let camY: number;

    if (scroll < SECTION_START) {
      // Intro: camera at origin
      camY = 0;
    } else if (!isFinalPage) {
      // Tool section: camera descends linearly with scroll
      camY = -sectionProgress * TOTAL_DESCENT;
    } else {
      // Finale: camera continues down a bit more for tray reveal
      const finalT = smoothstep(rangeProgress(scroll, SECTION_END, 0.95));
      camY = THREE.MathUtils.lerp(-TOTAL_DESCENT, -TOTAL_DESCENT - 4, finalT);
    }

    state.camera.position.y = camY;

    // ════════════════════════════════════
    // 2. TRAY — hidden until finale, positioned relative to camera
    // ════════════════════════════════════
    if (trayRef.current) {
      if (isFinalPage) {
        const trayT = smoothstep(rangeProgress(scroll, SECTION_END, 0.93));
        // Tray rises from below camera to slightly below center
        const trayScreenY = THREE.MathUtils.lerp(-8, -0.8, trayT);
        trayRef.current.position.y = camY + trayScreenY;
      } else {
        // Hidden far below camera
        trayRef.current.position.y = camY - 15;
      }
    }

    // ════════════════════════════════════
    // 3. TOOLS — one at a time, drift through viewport
    // ════════════════════════════════════

    // Which tool is active? (continuous, no gaps)
    const rawIndex = sectionProgress * NUM_TOOLS; // 0 → 5
    const activeIndex = isFinalPage ? -1 : Math.min(Math.floor(rawIndex), NUM_TOOLS - 1);
    const localT = activeIndex >= 0 ? rawIndex - activeIndex : 0; // 0 → 1 per tool

    for (let i = 0; i < NUM_TOOLS; i++) {
      const ref = toolRefs.current[i];
      if (!ref) continue;

      const isLast = i === NUM_TOOLS - 1;

      // ── FINALE: all tools on tray ──
      if (isFinalPage) {
        ref.visible = true;
        const trayWorldY = trayRef.current ? trayRef.current.position.y : camY - 15;

        if (!isLast) {
          // Tools 0-3: already placed on tray
          ref.position.set(TRAY_SLOT_X[i], trayWorldY + TRAY_SLOT_Y_OFFSET, 0);
          ref.quaternion.setFromEuler(TRAY_ROTATION);
        } else {
          // Tool 4 (Forceps): lands on tray during finale
          const landT = smoothstep(rangeProgress(scroll, SECTION_END, 0.97));
          ref.position.set(
            THREE.MathUtils.lerp(TOOL_X[i], TRAY_SLOT_X[i], landT),
            THREE.MathUtils.lerp(camY + SCREEN_ENTER, trayWorldY + TRAY_SLOT_Y_OFFSET, landT),
            THREE.MathUtils.lerp(TOOL_Z, 0, landT)
          );
          qA.setFromEuler(SHOW_ROTATIONS[i]);
          qB.setFromEuler(TRAY_ROTATION);
          qShow.slerpQuaternions(qA, qB, landT);
          ref.quaternion.copy(qShow);
        }
        continue;
      }

      // ── INTRO: first tool peeks from above ──
      if (scroll < SECTION_START && i === 0) {
        ref.visible = true;
        const introT = scroll / SECTION_START;
        const screenY = THREE.MathUtils.lerp(3.5, SCREEN_ENTER, smoothstep(introT));
        ref.position.set(TOOL_X[0], camY + screenY, TOOL_Z);
        qShow.setFromEuler(SHOW_ROTATIONS[0]);
        qSpin.setFromAxisAngle(yAxis, Math.sin(time * 0.8) * 0.25);
        qShow.multiply(qSpin);
        ref.quaternion.copy(qShow);
        continue;
      }

      // ── ACTIVE TOOL: drifts through viewport as camera follows ──
      if (i === activeIndex) {
        ref.visible = true;

        // Screen-relative Y: enters top, drifts through center, exits bottom
        // Linear mapping = directly tied to scroll = maximum "following" feel
        const screenY = THREE.MathUtils.lerp(SCREEN_ENTER, SCREEN_EXIT, localT);

        // World position = camera position + screen offset
        ref.position.set(TOOL_X[i], camY + screenY, TOOL_Z);

        // Gentle oscillation (no full spin)
        qShow.setFromEuler(SHOW_ROTATIONS[i]);
        qSpin.setFromAxisAngle(yAxis, Math.sin(time * 0.6 + i * 1.2) * 0.25);
        qShow.multiply(qSpin);
        ref.quaternion.copy(qShow);
        continue;
      }

      // ── HIDDEN ──
      ref.visible = false;
      ref.position.set(0, -200, 0);
    }
  });

  return (
    <>
      <group ref={trayRef} position={[0, -200, 0]} rotation={[0.15, 0, 0]}>
        <SurgicalTray />
      </group>
      {DENTAL_TOOLS.map(({ Component }, i) => (
        <group
          key={i}
          ref={(el) => { toolRefs.current[i] = el; }}
          position={[0, -200, 0]}
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
        </ResponsiveScene>
      </Suspense>
    </Canvas>
  );
}
