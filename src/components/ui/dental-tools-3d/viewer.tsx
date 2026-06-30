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

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// ── Where the center-screen descent starts and ends ──
const DESCENT_START = new THREE.Vector3(0, 1.8, 1.5);  // center-top, close to camera
const DESCENT_END = new THREE.Vector3(0, -3.5, 1.5);   // center-bottom, off-screen below

// ── Waiting positions: tools sit at the TOP of the screen spread out ──
const TOP_POSITIONS = [
  new THREE.Vector3(-2.0, 1.8, 0.5),  // Mirror — top-left
  new THREE.Vector3(-1.0, 1.9, 0.5),  // Scaler — top-center-left
  new THREE.Vector3(0.0, 2.0, 0.5),   // Probe  — top-center
  new THREE.Vector3(1.0, 1.9, 0.5),   // Syringe — top-center-right
  new THREE.Vector3(2.0, 1.8, 0.5),   // Forceps — top-right
];

const TOP_ROTATIONS = [
  new THREE.Euler(0.3, 0.6, 0.2),
  new THREE.Euler(-0.2, 0.4, -0.15),
  new THREE.Euler(0.4, -0.2, 0.1),
  new THREE.Euler(-0.15, 0.5, -0.3),
  new THREE.Euler(0.25, -0.3, 0.15),
];

// ── Tray slot positions (final resting place on tray) ──
const TRAY_POSITIONS = [
  new THREE.Vector3(-1.2, -0.75, 0),
  new THREE.Vector3(-0.6, -0.75, 0),
  new THREE.Vector3(0, -0.75, 0),
  new THREE.Vector3(0.6, -0.75, 0),
  new THREE.Vector3(1.2, -0.75, 0),
];

const TRAY_ROTATION = new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0);

// ── Scroll ranges per tool ──
// 7 text pages, each 1/7 ≈ 0.143 wide
// Page 1 (0–0.143):     Intro — all 5 tools floating at top
// Pages 2–6 (tools 0–4): Each tool gathers to center-top, then descends off-screen
// Page 7 (0.857–1.0):   Tray rises with tools 0–3, tool 4 (Forceps) lands on it

const TOOL_SCROLL_RANGES = [
  { gatherRange: [0.143, 0.175] as [number, number], descentRange: [0.175, 0.280] as [number, number] },
  { gatherRange: [0.286, 0.318] as [number, number], descentRange: [0.318, 0.420] as [number, number] },
  { gatherRange: [0.429, 0.460] as [number, number], descentRange: [0.460, 0.565] as [number, number] },
  { gatherRange: [0.571, 0.603] as [number, number], descentRange: [0.603, 0.708] as [number, number] },
  { gatherRange: [0.714, 0.746] as [number, number], descentRange: [0.746, 0.850] as [number, number] },
];

// Final page: tray appears, last tool lands
const FINAL_PAGE_START = 0.857;
const FINAL_TRAY_RISE_END = 0.91;
const FINAL_TOOL_LAND_END = 0.96;
const TRAY_FINAL_Y = -0.8;
const TRAY_HIDDEN_Y = -10;

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  // Reusable objects (avoid GC pressure)
  const qA = useRef(new THREE.Quaternion()).current;
  const qB = useRef(new THREE.Quaternion()).current;
  const qC = useRef(new THREE.Quaternion()).current;
  const qSpin = useRef(new THREE.Quaternion()).current;
  const yAxis = useRef(new THREE.Vector3(0, 1, 0)).current;
  const tempVec = useRef(new THREE.Vector3()).current;
  const descentRot = useRef(new THREE.Euler(0.2, 0, 0.1)).current; // viewing angle during descent

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    const isFinalPage = scroll >= FINAL_PAGE_START;

    // ── TRAY: hidden until final page, then rises ──
    if (trayRef.current) {
      if (isFinalPage) {
        const trayT = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TRAY_RISE_END));
        trayRef.current.position.y = THREE.MathUtils.lerp(TRAY_HIDDEN_Y, TRAY_FINAL_Y, trayT);
      } else {
        trayRef.current.position.y = TRAY_HIDDEN_Y;
      }
    }

    const trayCurrentY = trayRef.current ? trayRef.current.position.y : TRAY_HIDDEN_Y;
    const trayOffset = trayCurrentY - TRAY_FINAL_Y;

    // ── TOOLS ──
    const numTools = TOOL_SCROLL_RANGES.length;
    const lastToolIndex = numTools - 1;

    TOOL_SCROLL_RANGES.forEach((ranges, i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      const isLastTool = i === lastToolIndex;
      const [gatherStart, gatherEnd] = ranges.gatherRange;
      const [, descentEnd] = ranges.descentRange;
      const descentStart = gatherEnd; // descent starts where gather ends

      // ── FINAL PAGE BEHAVIOR ──
      if (isFinalPage) {
        if (!isLastTool) {
          // Tools 0–3: already on the tray, move with it
          ref.position.copy(TRAY_POSITIONS[i]);
          ref.position.y += trayOffset;
          ref.quaternion.setFromEuler(TRAY_ROTATION);
        } else {
          // Last tool: descends from top to tray position during final page
          const landT = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TOOL_LAND_END));
          ref.position.lerpVectors(TOP_POSITIONS[i], TRAY_POSITIONS[i], landT);
          
          qA.setFromEuler(TOP_ROTATIONS[i]);
          qB.setFromEuler(TRAY_ROTATION);
          qC.slerpQuaternions(qA, qB, landT);
          
          // Gentle spin during descent (fades out)
          if (landT < 0.7) {
            const spinAmount = 1 - landT / 0.7;
            qSpin.setFromAxisAngle(yAxis, time * 0.5 * spinAmount);
            qC.multiply(qSpin);
          }
          ref.quaternion.copy(qC);
        }
        return;
      }

      // ── PRE-FINAL PAGE BEHAVIOR ──

      if (scroll < gatherStart) {
        // ── WAITING: floating at top position ──
        ref.position.copy(TOP_POSITIONS[i]);
        ref.position.y += Math.sin(time * 1.2 + i * 1.5) * 0.04;
        
        qA.setFromEuler(TOP_ROTATIONS[i]);
        qSpin.setFromAxisAngle(yAxis, time * 0.2 * (i % 2 === 0 ? 1 : -1));
        qA.multiply(qSpin);
        ref.quaternion.copy(qA);

      } else if (scroll < gatherEnd) {
        // ── GATHERING: move from topPos to center-top ──
        const t = smoothstep(rangeProgress(scroll, gatherStart, gatherEnd));
        ref.position.lerpVectors(TOP_POSITIONS[i], DESCENT_START, t);
        
        qA.setFromEuler(TOP_ROTATIONS[i]);
        qB.setFromEuler(descentRot);
        qC.slerpQuaternions(qA, qB, t);
        ref.quaternion.copy(qC);

      } else if (scroll < descentEnd) {
        // ── DESCENDING: straight down through center (THE FOLLOWING FEEL) ──
        const t = smoothstep(rangeProgress(scroll, descentStart, descentEnd));
        ref.position.lerpVectors(DESCENT_START, DESCENT_END, t);
        
        // Gentle showcase spin that fades out
        qA.setFromEuler(descentRot);
        if (t < 0.6) {
          qSpin.setFromAxisAngle(yAxis, time * 0.5 * (1 - t / 0.6));
          qA.multiply(qSpin);
        }
        ref.quaternion.copy(qA);

      } else {
        // ── GONE: off-screen below, invisible ──
        ref.position.set(0, -5, 0);
        ref.quaternion.setFromEuler(TRAY_ROTATION);
      }
    });
  });

  return (
    <>
      {/* Tray — hidden off-screen until final page */}
      <group ref={trayRef} position={[0, TRAY_HIDDEN_Y, 0]} rotation={[0.15, 0, 0]}>
        <SurgicalTray />
      </group>

      {/* Tools */}
      {DENTAL_TOOLS.map(({ Component }, i) => (
        <group
          key={i}
          ref={(el) => { toolRefs.current[i] = el; }}
          position={TOP_POSITIONS[i]}
          rotation={TOP_ROTATIONS[i]}
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
