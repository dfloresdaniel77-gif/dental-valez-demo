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

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// ── Descent path (world-space) ──
const DESCENT_START_Y = 1.8;
const DESCENT_END_Y = -6.0;  // far below camera — tool disappears off-screen
const DESCENT_Z = 1.5;       // close to camera for drama

// ── How far above camera center the "top" tools float ──
const TOP_OFFSET_Y = 1.6;    // ~top of visible frustum (frustum is ±2.2)

// ── Spread the waiting tools horizontally ──
const TOP_X_POSITIONS = [-2.0, -1.0, 0.0, 1.0, 2.0];
const TOP_Z = 0.5;

const TOP_ROTATIONS = [
  new THREE.Euler(0.3, 0.6, 0.2),
  new THREE.Euler(-0.2, 0.4, -0.15),
  new THREE.Euler(0.4, -0.2, 0.1),
  new THREE.Euler(-0.15, 0.5, -0.3),
  new THREE.Euler(0.25, -0.3, 0.15),
];

// ── Tray slot positions ──
const TRAY_POSITIONS = [
  new THREE.Vector3(-1.2, -0.75, 0),
  new THREE.Vector3(-0.6, -0.75, 0),
  new THREE.Vector3(0, -0.75, 0),
  new THREE.Vector3(0.6, -0.75, 0),
  new THREE.Vector3(1.2, -0.75, 0),
];

const TRAY_ROTATION = new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0);

// ── Scroll ranges per tool (7 text pages, each ~0.143) ──
const TOOL_SCROLL_RANGES = [
  { gatherRange: [0.143, 0.175] as [number, number], descentRange: [0.175, 0.280] as [number, number] },
  { gatherRange: [0.286, 0.318] as [number, number], descentRange: [0.318, 0.420] as [number, number] },
  { gatherRange: [0.429, 0.460] as [number, number], descentRange: [0.460, 0.565] as [number, number] },
  { gatherRange: [0.571, 0.603] as [number, number], descentRange: [0.603, 0.708] as [number, number] },
  { gatherRange: [0.714, 0.746] as [number, number], descentRange: [0.746, 0.850] as [number, number] },
];

// ── Final page constants ──
const FINAL_PAGE_START = 0.857;
const FINAL_TRAY_RISE_END = 0.91;
const FINAL_TOOL_LAND_END = 0.96;
const TRAY_FINAL_Y = -0.8;
const TRAY_HIDDEN_Y = -20;

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  // Reusable objects
  const qA = useRef(new THREE.Quaternion()).current;
  const qB = useRef(new THREE.Quaternion()).current;
  const qC = useRef(new THREE.Quaternion()).current;
  const qSpin = useRef(new THREE.Quaternion()).current;
  const yAxis = useRef(new THREE.Vector3(0, 1, 0)).current;
  const descentRot = useRef(new THREE.Euler(0.2, 0, 0.1)).current;

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    const isFinalPage = scroll >= FINAL_PAGE_START;
    const numTools = TOOL_SCROLL_RANGES.length;
    const lastToolIndex = numTools - 1;

    // ════════════════════════════════════════════════
    // 1. CAMERA TRACKING — follow the active tool down
    // ════════════════════════════════════════════════
    let cameraTargetY = 0;
    let directTrack = false;

    if (!isFinalPage) {
      for (let i = 0; i < numTools; i++) {
        const { gatherRange, descentRange } = TOOL_SCROLL_RANGES[i];
        const [gatherStart, gatherEnd] = gatherRange;
        const [, descentEnd] = descentRange;

        if (scroll >= gatherStart && scroll < gatherEnd) {
          // GATHERING: camera smoothly moves up to the tool
          const t = smoothstep(rangeProgress(scroll, gatherStart, gatherEnd));
          cameraTargetY = THREE.MathUtils.lerp(0, DESCENT_START_Y, t);
          directTrack = true;
          break;
        } else if (scroll >= gatherEnd && scroll < descentEnd) {
          // DESCENDING: camera directly follows the tool (scroll-linked, no lag)
          const t = smoothstep(rangeProgress(scroll, gatherEnd, descentEnd));
          cameraTargetY = THREE.MathUtils.lerp(DESCENT_START_Y, DESCENT_END_Y, t);
          directTrack = true;
          break;
        }
      }
    } else {
      // Final page: camera settles at tray level
      const t = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TRAY_RISE_END));
      cameraTargetY = THREE.MathUtils.lerp(0, TRAY_FINAL_Y, t);
      directTrack = true;
    }

    // Apply camera Y — direct during active descent, smooth lerp otherwise
    if (directTrack) {
      state.camera.position.y = cameraTargetY;
    } else {
      state.camera.position.y += (cameraTargetY - state.camera.position.y) * 0.08;
    }

    const camY = state.camera.position.y;

    // ════════════════════════════════════════════════
    // 2. TRAY — hidden until final page
    // ════════════════════════════════════════════════
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

    // ════════════════════════════════════════════════
    // 3. TOOLS
    // ════════════════════════════════════════════════
    TOOL_SCROLL_RANGES.forEach((ranges, i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      const isLastTool = i === lastToolIndex;
      const [gatherStart, gatherEnd] = ranges.gatherRange;
      const [, descentEnd] = ranges.descentRange;

      // ── FINAL PAGE ──
      if (isFinalPage) {
        ref.visible = true;
        if (!isLastTool) {
          // Tools 0–3: on the tray, rise with it
          ref.position.copy(TRAY_POSITIONS[i]);
          ref.position.y += trayOffset;
          ref.quaternion.setFromEuler(TRAY_ROTATION);
        } else {
          // Last tool: descends from top-of-viewport to tray slot
          const landT = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TOOL_LAND_END));
          const startY = camY + TOP_OFFSET_Y;
          ref.position.set(
            THREE.MathUtils.lerp(TOP_X_POSITIONS[i], TRAY_POSITIONS[i].x, landT),
            THREE.MathUtils.lerp(startY, TRAY_POSITIONS[i].y, landT),
            THREE.MathUtils.lerp(TOP_Z, TRAY_POSITIONS[i].z, landT)
          );
          
          qA.setFromEuler(TOP_ROTATIONS[i]);
          qB.setFromEuler(TRAY_ROTATION);
          qC.slerpQuaternions(qA, qB, landT);
          if (landT < 0.7) {
            qSpin.setFromAxisAngle(yAxis, time * 0.5 * (1 - landT / 0.7));
            qC.multiply(qSpin);
          }
          ref.quaternion.copy(qC);
        }
        return;
      }

      // ── PRE-FINAL PAGE ──

      if (scroll < gatherStart) {
        // ── WAITING: floating at top of viewport (camera-relative) ──
        ref.visible = true;
        ref.position.set(TOP_X_POSITIONS[i], camY + TOP_OFFSET_Y, TOP_Z);
        ref.position.y += Math.sin(time * 1.2 + i * 1.5) * 0.04;

        qA.setFromEuler(TOP_ROTATIONS[i]);
        qSpin.setFromAxisAngle(yAxis, time * 0.2 * (i % 2 === 0 ? 1 : -1));
        qA.multiply(qSpin);
        ref.quaternion.copy(qA);

      } else if (scroll < gatherEnd) {
        // ── GATHERING: top → center of screen (camera follows, so tool stays centered) ──
        ref.visible = true;
        const t = smoothstep(rangeProgress(scroll, gatherStart, gatherEnd));
        
        // Tool moves from its top-of-viewport position to DESCENT_START
        const startX = TOP_X_POSITIONS[i];
        const startY = camY + TOP_OFFSET_Y;
        
        ref.position.set(
          THREE.MathUtils.lerp(startX, 0, t),
          THREE.MathUtils.lerp(startY, DESCENT_START_Y, t),
          THREE.MathUtils.lerp(TOP_Z, DESCENT_Z, t)
        );

        qA.setFromEuler(TOP_ROTATIONS[i]);
        qB.setFromEuler(descentRot);
        qC.slerpQuaternions(qA, qB, t);
        ref.quaternion.copy(qC);

      } else if (scroll < descentEnd) {
        // ── DESCENDING: straight down, camera follows = tool stays centered ──
        ref.visible = true;
        const t = smoothstep(rangeProgress(scroll, gatherEnd, descentEnd));
        
        ref.position.set(
          0,
          THREE.MathUtils.lerp(DESCENT_START_Y, DESCENT_END_Y, t),
          DESCENT_Z
        );

        // Gentle spin fading out
        qA.setFromEuler(descentRot);
        if (t < 0.6) {
          qSpin.setFromAxisAngle(yAxis, time * 0.5 * (1 - t / 0.6));
          qA.multiply(qSpin);
        }
        ref.quaternion.copy(qA);

      } else {
        // ── GONE: invisible ──
        ref.visible = false;
        ref.position.set(0, -50, 0);
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
          position={[TOP_X_POSITIONS[i], TOP_OFFSET_Y, TOP_Z]}
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
