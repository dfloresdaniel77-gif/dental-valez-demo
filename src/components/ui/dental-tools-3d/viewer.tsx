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
// Visible Y: ~-2.2 to +2.2 at z=0

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function rangeProgress(scroll: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// ── Descent path ──
// The tool starts at the top of the viewport and drops below it.
// The camera follows, so the tool appears to stay centered the whole time.
const TOOL_START_Y = 1.8;    // top of viewport
const TOOL_END_Y = -6.0;     // far below viewport
const TOOL_Z = 1.5;          // close to camera

// ── Top positions (for intro + between tools) ──
const TOP_OFFSET_Y = 1.6;
const TOP_X = [-2.0, -1.0, 0.0, 1.0, 2.0];
const TOP_Z = 0.5;

const TOP_ROTATIONS = [
  new THREE.Euler(0.3, 0.6, 0.2),
  new THREE.Euler(-0.2, 0.4, -0.15),
  new THREE.Euler(0.4, -0.2, 0.1),
  new THREE.Euler(-0.15, 0.5, -0.3),
  new THREE.Euler(0.25, -0.3, 0.15),
];

// ── Tray slots ──
const TRAY_POSITIONS = [
  new THREE.Vector3(-1.2, -0.75, 0),
  new THREE.Vector3(-0.6, -0.75, 0),
  new THREE.Vector3(0, -0.75, 0),
  new THREE.Vector3(0.6, -0.75, 0),
  new THREE.Vector3(1.2, -0.75, 0),
];
const TRAY_ROTATION = new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0);

// ── ONE scroll range per tool (no separate gather/descent — one smooth motion) ──
// 7 text pages each ~0.143. Page 1=intro, Pages 2-6=tools, Page 7=finale
const TOOL_RANGES: [number, number][] = [
  [0.143, 0.280],  // Mirror
  [0.286, 0.420],  // Scaler
  [0.429, 0.565],  // Probe
  [0.571, 0.708],  // Syringe
  [0.714, 0.850],  // Forceps
];

// Final page
const FINAL_PAGE_START = 0.857;
const FINAL_TRAY_RISE_END = 0.92;
const FINAL_TOOL_LAND_END = 0.97;
const TRAY_FINAL_Y = -0.8;
const TRAY_HIDDEN_Y = -20;

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);
  const trayRef = useRef<THREE.Group | null>(null);

  const qA = useRef(new THREE.Quaternion()).current;
  const qB = useRef(new THREE.Quaternion()).current;
  const qC = useRef(new THREE.Quaternion()).current;
  const qSpin = useRef(new THREE.Quaternion()).current;
  const yAxis = useRef(new THREE.Vector3(0, 1, 0)).current;
  const showRot = useRef(new THREE.Euler(0.15, 0, 0.05)).current;

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    const isFinalPage = scroll >= FINAL_PAGE_START;
    const lastIdx = TOOL_RANGES.length - 1;

    // ════════════════════════════════════
    // 1. Find the active tool (if any)
    // ════════════════════════════════════
    let activeIndex = -1;
    let activeT = 0;

    if (!isFinalPage) {
      for (let i = 0; i < TOOL_RANGES.length; i++) {
        const [start, end] = TOOL_RANGES[i];
        if (scroll >= start && scroll < end) {
          activeIndex = i;
          activeT = rangeProgress(scroll, start, end);
          break;
        }
      }
    }

    // ════════════════════════════════════
    // 2. Camera — follows active tool
    // ════════════════════════════════════
    let cameraTargetY = 0;

    if (activeIndex >= 0) {
      // Smooth ease for descent: tool stays screen-centered the whole time
      const easedT = smoothstep(activeT);
      cameraTargetY = THREE.MathUtils.lerp(TOOL_START_Y, TOOL_END_Y, easedT);
    } else if (isFinalPage) {
      const t = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TRAY_RISE_END));
      cameraTargetY = THREE.MathUtils.lerp(0, TRAY_FINAL_Y, t);
    }

    // Smooth camera return between tools (no snapping)
    if (activeIndex >= 0 || isFinalPage) {
      state.camera.position.y = cameraTargetY;
    } else {
      // Smooth ease back to 0 between tools
      state.camera.position.y += (cameraTargetY - state.camera.position.y) * 0.06;
    }

    const camY = state.camera.position.y;

    // ════════════════════════════════════
    // 3. Tray — hidden until final page
    // ════════════════════════════════════
    if (trayRef.current) {
      if (isFinalPage) {
        const t = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TRAY_RISE_END));
        trayRef.current.position.y = THREE.MathUtils.lerp(TRAY_HIDDEN_Y, TRAY_FINAL_Y, t);
      } else {
        trayRef.current.position.y = TRAY_HIDDEN_Y;
      }
    }

    const trayCurrentY = trayRef.current ? trayRef.current.position.y : TRAY_HIDDEN_Y;
    const trayOffset = trayCurrentY - TRAY_FINAL_Y;

    // ════════════════════════════════════
    // 4. Tools
    // ════════════════════════════════════
    TOOL_RANGES.forEach((range, i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      const [rangeStart, rangeEnd] = range;
      const isLastTool = i === lastIdx;
      const isActive = i === activeIndex;
      const isGone = !isFinalPage && scroll >= rangeEnd;

      // ── FINAL PAGE ──
      if (isFinalPage) {
        ref.visible = true;
        if (!isLastTool) {
          ref.position.copy(TRAY_POSITIONS[i]);
          ref.position.y += trayOffset;
          ref.quaternion.setFromEuler(TRAY_ROTATION);
        } else {
          const landT = smoothstep(rangeProgress(scroll, FINAL_PAGE_START, FINAL_TOOL_LAND_END));
          ref.position.set(
            THREE.MathUtils.lerp(TOP_X[i], TRAY_POSITIONS[i].x, landT),
            THREE.MathUtils.lerp(camY + TOP_OFFSET_Y, TRAY_POSITIONS[i].y, landT),
            THREE.MathUtils.lerp(TOP_Z, TRAY_POSITIONS[i].z, landT)
          );
          qA.setFromEuler(TOP_ROTATIONS[i]);
          qB.setFromEuler(TRAY_ROTATION);
          qC.slerpQuaternions(qA, qB, landT);
          if (landT < 0.7) {
            qSpin.setFromAxisAngle(yAxis, time * 0.4 * (1 - landT / 0.7));
            qC.multiply(qSpin);
          }
          ref.quaternion.copy(qC);
        }
        return;
      }

      // ── GONE: already descended, invisible ──
      if (isGone) {
        ref.visible = false;
        ref.position.set(0, -50, 0);
        return;
      }

      // ── ACTIVE: this tool is descending (camera follows = stays centered) ──
      if (isActive) {
        ref.visible = true;
        const easedT = smoothstep(activeT);

        // One smooth motion: top → off-screen below
        ref.position.set(
          0,
          THREE.MathUtils.lerp(TOOL_START_Y, TOOL_END_Y, easedT),
          TOOL_Z
        );

        // Slowly rotate during descent — gentle showcase
        qA.setFromEuler(showRot);
        qSpin.setFromAxisAngle(yAxis, time * 0.35);
        qA.multiply(qSpin);
        ref.quaternion.copy(qA);
        return;
      }

      // ── WAITING: not yet active ──
      // Only visible when NO tool is active (intro + between tools)
      if (activeIndex >= 0) {
        // Another tool is descending — HIDE this one
        ref.visible = false;
        return;
      }

      // No tool active — show waiting tools at top of viewport
      ref.visible = true;
      ref.position.set(TOP_X[i], camY + TOP_OFFSET_Y, TOP_Z);
      ref.position.y += Math.sin(time * 1.2 + i * 1.5) * 0.04;

      qA.setFromEuler(TOP_ROTATIONS[i]);
      qSpin.setFromAxisAngle(yAxis, time * 0.2 * (i % 2 === 0 ? 1 : -1));
      qA.multiply(qSpin);
      ref.quaternion.copy(qA);
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
          position={[TOP_X[i], TOP_OFFSET_Y, TOP_Z]}
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
