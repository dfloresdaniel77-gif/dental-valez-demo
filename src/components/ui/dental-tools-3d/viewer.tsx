"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { DENTAL_TOOLS, SurgicalTray } from "./tools";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

// Configuration for how each tool scatters and lands
const TOOL_ANIMATIONS = [
  {
    // Mirror
    startPos: new THREE.Vector3(-2.0, 2.4, -1),
    startRot: new THREE.Euler(Math.PI / 4, Math.PI, Math.PI / 3),
    endPos: new THREE.Vector3(-1.2, -0.75, 0),
    endRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    scrollRange: [0.0, 0.20],
  },
  {
    // Scaler
    startPos: new THREE.Vector3(2.0, 2.4, 1),
    startRot: new THREE.Euler(-Math.PI / 3, Math.PI / 2, -Math.PI / 4),
    endPos: new THREE.Vector3(-0.6, -0.75, 0),
    endRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    scrollRange: [0.15, 0.35],
  },
  {
    // Probe
    startPos: new THREE.Vector3(0, 2.4, -2),
    startRot: new THREE.Euler(Math.PI / 2, -Math.PI / 4, Math.PI / 6),
    endPos: new THREE.Vector3(0, -0.75, 0),
    endRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    scrollRange: [0.30, 0.50],
  },
  {
    // Syringe
    startPos: new THREE.Vector3(-2.2, 0.5, 1),
    startRot: new THREE.Euler(-Math.PI / 6, Math.PI / 3, -Math.PI / 2),
    endPos: new THREE.Vector3(0.6, -0.75, 0),
    endRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    scrollRange: [0.45, 0.65],
  },
  {
    // Forceps
    startPos: new THREE.Vector3(2.2, 0.2, 2),
    startRot: new THREE.Euler(Math.PI / 3, -Math.PI / 6, Math.PI / 4),
    endPos: new THREE.Vector3(1.2, -0.75, 0),
    endRot: new THREE.Euler(-Math.PI / 2 + 0.15, 0, 0),
    scrollRange: [0.60, 0.82],
  },
];

function SceneAnimator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const toolRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, delta) => {
    const scroll = scrollYProgress.get();

    TOOL_ANIMATIONS.forEach((anim, i) => {
      const ref = toolRefs.current[i];
      if (!ref) return;

      // Calculate interpolation factor (0 to 1) for this specific tool's range
      const [start, end] = anim.scrollRange;
      // Clamp and normalize progress for this tool
      let t = Math.max(0, Math.min(1, (scroll - start) / (end - start)));
      
      // Apply easing function (smoothstep) for graceful landing
      t = t * t * (3 - 2 * t);

      // Interpolate Position
      ref.position.lerpVectors(anim.startPos, anim.endPos, t);

      // Interpolate Rotation (using Quaternions for smooth 3D rotation)
      const qStart = new THREE.Quaternion().setFromEuler(anim.startRot);
      const qEnd = new THREE.Quaternion().setFromEuler(anim.endRot);
      const qCurrent = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, t);
      
      // Add a slight continuous floating spin if it hasn't landed yet
      if (t < 1) {
        const floatSpin = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          state.clock.elapsedTime * 0.5 * (i % 2 === 0 ? 1 : -1)
        );
        qCurrent.multiply(floatSpin);
        
        // Add a gentle hover effect based on time
        ref.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.1 * (1 - t);
      }

      ref.quaternion.copy(qCurrent);
    });
  });

  return (
    <>
      {/* The Tray is static at the bottom */}
      <group position={[0, -0.8, 0]} rotation={[0.15, 0, 0]}>
        <SurgicalTray />
      </group>

      {/* The Tools */}
      {DENTAL_TOOLS.map(({ Component }, i) => (
        <group 
          key={i} 
          ref={(el) => { toolRefs.current[i] = el; }}
          // Ensure they start at their initial scattered positions before useFrame kicks in
          position={TOOL_ANIMATIONS[i].startPos}
          rotation={TOOL_ANIMATIONS[i].startRot}
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
        
        <SceneAnimator scrollYProgress={scrollYProgress} />

        {/* Realistic ground shadow below the tray */}
        <ContactShadows position={[0, -0.95, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Suspense>
    </Canvas>
  );
}
