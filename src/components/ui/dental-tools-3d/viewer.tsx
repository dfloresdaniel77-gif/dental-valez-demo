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

// Camera: position=[0, 0, 7], fov=35
// Visible Y range at z=0: approximately -2.2 to +2.2
// Visible X range at 16:9: approximately -3.9 to +3.9

// ── Per-tool animation config ──
// Each tool has:
//   scatteredPos/Rot — initial floating position (intro)
//   featuredPos/Rot  — center-stage showcase position
//   trayPos/Rot      — final resting position on the tray
//   featuredRange    — [start, end] scroll range when this tool is featured
//   landingRange     — [start, end] scroll range when tool flies from featured → tray

const TOOL_PAGES = [
  {
    name: "Mirror",
    scatteredPos: new THREE.Vector3(-1.8, 1.5, -1),
    scatteredRot: new THREE.Euler(Math.PI / 4, Math.PI, Math.PI / 3),
    featuredPos: new THREE.Vector3(0, 0.3, 1.5),
    featuredRot: new THREE.Euler(0.3, Math.PI * 0.8, 0.1),
    trayPos: new THREE.Vector3(-1.2, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    featuredRange: [0.08, 0.20],
    landingRange: [0.20, 0.28],
  },
  {
    name: "Scaler",
    scatteredPos: new THREE.Vector3(1.8, 1.5, 1),
    scatteredRot: new THREE.Euler(-Math.PI / 3, Math.PI / 2, -Math.PI / 4),
    featuredPos: new THREE.Vector3(0, 0.3, 1.5),
    featuredRot: new THREE.Euler(-0.2, Math.PI * 0.3, 0.15),
    trayPos: new THREE.Vector3(-0.6, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    featuredRange: [0.22, 0.34],
    landingRange: [0.34, 0.42],
  },
  {
    name: "Probe",
    scatteredPos: new THREE.Vector3(0.3, 1.7, -2),
    scatteredRot: new THREE.Euler(Math.PI / 2, -Math.PI / 4, Math.PI / 6),
    featuredPos: new THREE.Vector3(0, 0.3, 1.5),
    featuredRot: new THREE.Euler(0.4, -Math.PI * 0.2, -0.1),
    trayPos: new THREE.Vector3(0, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    featuredRange: [0.36, 0.48],
    landingRange: [0.48, 0.56],
  },
  {
    name: "Syringe",
    scatteredPos: new THREE.Vector3(-2.0, 0.3, 1),
    scatteredRot: new THREE.Euler(-Math.PI / 6, Math.PI / 3, -Math.PI / 2),
    featuredPos: new THREE.Vector3(0, 0.3, 1.5),
    featuredRot: new THREE.Euler(-0.3, Math.PI * 0.6, 0.2),
    trayPos: new THREE.Vector3(0.6, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    featuredRange: [0.50, 0.62],
    landingRange: [0.62, 0.70],
  },
  {
    name: "Forceps",
    scatteredPos: new THREE.Vector3(2.0, 0.2, 2),
    scatteredRot: new THREE.Euler(Math.PI / 3, -Math.PI / 6, Math.PI / 4),
    featuredPos: new THREE.Vector3(0, 0.3, 1.5),
    featuredRot: new THREE.Euler(0.2, -Math.PI * 0.4, -0.15),
    trayPos: new THREE.Vector3(1.2, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    featuredRange: [0.64, 0.76],
    landingRange: [0.76, 0.84],
  },
];

// Smoothstep easing
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// Clamp and normalize a value within a range to 0–1
function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;

    // ── Tray animation: rises as tools land ──
    // Tray starts at y=-4 (off-screen below) and rises to y=-0.8 (final)
    // It rises progressively as each tool lands
    if (trayRef.current) {
      let landedCount = 0;
      TOOL_PAGES.forEach((page) => {
        const landT = rangeProgress(scroll, page.landingRange[0], page.landingRange[1]);
        if (landT >= 1) landedCount++;
        else if (landT > 0) landedCount += landT; // partial credit during landing
      });

      // Map 0–5 landed tools to tray Y position: -4 → -0.8
      const trayProgress = Math.min(1, landedCount / TOOL_PAGES.length);
      const trayY = THREE.MathUtils.lerp(-4, -0.8, smoothstep(trayProgress));
      trayRef.current.position.y = trayY;
    }

    // ── Tool animations ──
    TOOL_PAGES.forEach((page, i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      const featStart = page.featuredRange[0];
      const featEnd = page.featuredRange[1];
      const landStart = page.landingRange[0];
      const landEnd = page.landingRange[1];

      // Determine tool state and interpolation
      let targetPos: THREE.Vector3;
      let targetRot: THREE.Euler;
      let addFloat = false;
      let addShowcaseSpin = false;

      if (scroll < featStart) {
        // ── SCATTERED: floating at start position ──
        // Fade from scattered toward featured as we approach featStart
        const approachT = smoothstep(rangeProgress(scroll, Math.max(0, featStart - 0.08), featStart));
        targetPos = new THREE.Vector3().lerpVectors(page.scatteredPos, page.featuredPos, approachT);
        targetRot = page.scatteredRot; // keep scattered rotation until featured
        addFloat = true;

      } else if (scroll >= featStart && scroll < featEnd) {
        // ── FEATURED: center stage, slowly spinning ──
        targetPos = page.featuredPos.clone();
        targetRot = page.featuredRot;
        addShowcaseSpin = true;
        addFloat = true;

      } else if (scroll >= featEnd && scroll < landEnd) {
        // ── LANDING: flying from featured position to tray slot ──
        const landT = smoothstep(rangeProgress(scroll, landStart, landEnd));
        targetPos = new THREE.Vector3().lerpVectors(page.featuredPos, page.trayPos, landT);
        
        // Interpolate rotation using quaternions for smooth transition
        const qFeat = new THREE.Quaternion().setFromEuler(page.featuredRot);
        const qTray = new THREE.Quaternion().setFromEuler(page.trayRot);
        const qCurrent = new THREE.Quaternion().slerpQuaternions(qFeat, qTray, landT);
        ref.quaternion.copy(qCurrent);
        ref.position.copy(targetPos);
        return; // skip the general rotation code below

      } else {
        // ── LANDED: resting in tray slot ──
        targetPos = page.trayPos.clone();
        targetRot = page.trayRot;
      }

      // Apply position
      ref.position.copy(targetPos);

      // Apply rotation (with optional effects)
      const qTarget = new THREE.Quaternion().setFromEuler(targetRot);

      if (addShowcaseSpin) {
        // Gentle Y-axis showcase rotation
        const spin = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          time * 0.4
        );
        qTarget.multiply(spin);
      }

      if (addFloat) {
        // Subtle floating bob
        ref.position.y += Math.sin(time * 1.5 + i * 1.2) * 0.06;
        
        // Very subtle floating rotation
        if (!addShowcaseSpin) {
          const floatSpin = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            time * 0.3 * (i % 2 === 0 ? 1 : -1)
          );
          qTarget.multiply(floatSpin);
        }
      }

      ref.quaternion.copy(qTarget);
    });
  });

  return (
    <>
      {/* Tray — starts off-screen, rises as tools land */}
      <group ref={trayRef} position={[0, -4, 0]} rotation={[0.15, 0, 0]}>
        <SurgicalTray />
      </group>

      {/* Tools */}
      {DENTAL_TOOLS.map(({ Component }, i) => (
        <group
          key={i}
          ref={(el) => { toolRefs.current[i] = el; }}
          position={TOOL_PAGES[i].scatteredPos}
          rotation={TOOL_PAGES[i].scatteredRot}
        >
          <Component />
        </group>
      ))}
    </>
  );
}

// ── Main 3D Viewer ──
export function ToolViewer3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 35 }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      {/* Balanced Lighting setup for metallic look */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 8, 5]} intensity={0.7} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[0, 3, -5]} intensity={0.4} color="#e0e0ff" />
      <directionalLight position={[0, -5, 5]} intensity={0.3} color="#ffe0d0" />

      {/* Symmetrical rim lights for edge highlights */}
      <pointLight position={[-4, 0, -3]} intensity={0.8} color="#c0d0ff" />
      <pointLight position={[4, 0, -3]} intensity={0.8} color="#ffd0c0" />

      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.6} />
        
        <ResponsiveScene>
          <SceneAnimator scrollYProgress={scrollYProgress} />

          {/* Realistic ground shadow below the tray */}
          <ContactShadows position={[0, -0.95, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </ResponsiveScene>
      </Suspense>
    </Canvas>
  );
}
