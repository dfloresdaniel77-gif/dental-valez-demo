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

// Smoothstep easing for graceful animations
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// Clamp and normalize a scroll value within a range to 0–1
function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// ── The top-of-screen position where each tool starts its descent ──
// High Y = top of viewport, z=2 = close to camera for dramatic entrance
const DESCENT_TOP_Y = 2.5;
const DESCENT_TOP_Z = 2.0;

// ── Per-tool animation config ──
// Each tool lifecycle: scattered → gather (move to top) → descent (top→tray) → landed
// The "following" feel comes from the descent: the tool moves DOWN proportionally to scroll.
// Text pages are evenly spaced at 1/7 increments: 0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857

const TOOL_PAGES = [
  {
    name: "Mirror",
    // Scattered: floating position (all z >= 0.5 so nothing is behind the scene)
    scatteredPos: new THREE.Vector3(-1.8, 1.2, 1.0),
    scatteredRot: new THREE.Euler(0.4, 0.8, 0.3),
    // Tray slot: final resting position
    trayPos: new THREE.Vector3(-1.2, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    // Scroll ranges (aligned with text page 2: 0.143–0.286)
    gatherRange: [0.143, 0.185] as [number, number],   // scattered → top of screen
    descentRange: [0.185, 0.280] as [number, number],   // top → tray (THE FOLLOWING FEEL)
  },
  {
    name: "Scaler",
    scatteredPos: new THREE.Vector3(1.8, 1.3, 0.8),
    scatteredRot: new THREE.Euler(-0.3, 0.5, -0.2),
    trayPos: new THREE.Vector3(-0.6, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    // Aligned with text page 3: 0.286–0.429
    gatherRange: [0.286, 0.325] as [number, number],
    descentRange: [0.325, 0.420] as [number, number],
  },
  {
    name: "Probe",
    scatteredPos: new THREE.Vector3(0.3, 1.5, 1.2),
    scatteredRot: new THREE.Euler(0.5, -0.3, 0.2),
    trayPos: new THREE.Vector3(0, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    // Aligned with text page 4: 0.429–0.571
    gatherRange: [0.429, 0.465] as [number, number],
    descentRange: [0.465, 0.560] as [number, number],
  },
  {
    name: "Syringe",
    scatteredPos: new THREE.Vector3(-2.0, 0.5, 0.6),
    scatteredRot: new THREE.Euler(-0.2, 0.6, -0.4),
    trayPos: new THREE.Vector3(0.6, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    // Aligned with text page 5: 0.571–0.714
    gatherRange: [0.571, 0.605] as [number, number],
    descentRange: [0.605, 0.700] as [number, number],
  },
  {
    name: "Forceps",
    scatteredPos: new THREE.Vector3(2.0, 0.4, 0.9),
    scatteredRot: new THREE.Euler(0.3, -0.4, 0.2),
    trayPos: new THREE.Vector3(1.2, -0.75, 0),
    trayRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    // Aligned with text page 6: 0.714–0.857
    gatherRange: [0.714, 0.750] as [number, number],
    descentRange: [0.750, 0.850] as [number, number],
  },
];

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  // Reusable quaternions (avoid allocating every frame)
  const qA = useRef(new THREE.Quaternion()).current;
  const qB = useRef(new THREE.Quaternion()).current;
  const qC = useRef(new THREE.Quaternion()).current;
  const tempVec = useRef(new THREE.Vector3()).current;

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;

    // ── Tray animation ──
    // Tray rises from y=-4 (off-screen) to y=-0.8 (final) throughout the section.
    // It starts rising when the first tool begins descending and is fully up by the last tool landing.
    if (trayRef.current) {
      const trayProgress = smoothstep(rangeProgress(scroll, 0.15, 0.85));
      const trayY = THREE.MathUtils.lerp(-4, -0.8, trayProgress);
      trayRef.current.position.y = trayY;
    }

    // ── Tool animations ──
    TOOL_PAGES.forEach((page, i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      const [gatherStart, gatherEnd] = page.gatherRange;
      const [descentStart, descentEnd] = page.descentRange;

      // The descent top position: centered horizontally, at the top of the screen
      const descentTopPos = tempVec.set(0, DESCENT_TOP_Y, DESCENT_TOP_Z);

      if (scroll < gatherStart) {
        // ── SCATTERED: floating at start position ──
        ref.position.copy(page.scatteredPos);
        
        // Gentle floating bob + rotation
        ref.position.y += Math.sin(time * 1.5 + i * 1.3) * 0.08;
        
        qA.setFromEuler(page.scatteredRot);
        qB.setFromAxisAngle(new THREE.Vector3(0, 1, 0), time * 0.3 * (i % 2 === 0 ? 1 : -1));
        qA.multiply(qB);
        ref.quaternion.copy(qA);

      } else if (scroll < gatherEnd) {
        // ── GATHERING: move from scattered position to top of screen ──
        const t = smoothstep(rangeProgress(scroll, gatherStart, gatherEnd));
        
        ref.position.lerpVectors(page.scatteredPos, descentTopPos, t);
        
        // Interpolate rotation from scattered to a nice viewing angle
        qA.setFromEuler(page.scatteredRot);
        qB.setFromEuler(new THREE.Euler(0.2, 0, 0.1)); // upright-ish for viewing
        qC.slerpQuaternions(qA, qB, t);
        ref.quaternion.copy(qC);

      } else if (scroll < descentEnd) {
        // ── DESCENDING: top of screen → tray slot (THE "FOLLOWING" FEEL) ──
        // The tool moves DOWN proportionally to scroll. User scrolls = tool descends.
        const t = smoothstep(rangeProgress(scroll, descentStart, descentEnd));
        
        // Position: interpolate from descent top to tray position
        ref.position.lerpVectors(descentTopPos, page.trayPos, t);
        
        // Rotation: showcase spin that transitions into tray rotation
        qA.setFromEuler(new THREE.Euler(0.2, 0, 0.1)); // viewing angle
        qB.setFromEuler(page.trayRot);
        qC.slerpQuaternions(qA, qB, t);
        
        // Add a gentle showcase spin during the first 70% of descent
        if (t < 0.7) {
          const spinAmount = (1 - t / 0.7); // fades out as it approaches tray
          const spin = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            time * 0.6 * spinAmount
          );
          qC.multiply(spin);
        }
        
        ref.quaternion.copy(qC);

      } else {
        // ── LANDED: resting in tray slot ──
        ref.position.copy(page.trayPos);
        ref.quaternion.setFromEuler(page.trayRot);
      }
    });
  });

  return (
    <>
      {/* Tray — starts off-screen below, rises as tools land */}
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
