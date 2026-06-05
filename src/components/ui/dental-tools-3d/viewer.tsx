"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { DENTAL_TOOLS } from "./tools";
import * as THREE from "three";

// ── Spinning wrapper: continuously rotates the tool ──
function SpinningTool({
  toolIndex,
  scrollRotation,
}: {
  toolIndex: number;
  scrollRotation: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { Component } = DENTAL_TOOLS[toolIndex] || DENTAL_TOOLS[0];

  // Continuous gentle rotation + scroll-driven rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Continuous slow spin on Y axis
      groupRef.current.rotation.y += delta * 0.5;
      // Add scroll-driven rotation for extra responsiveness
    }
  });

  return (
    <group ref={groupRef} rotation={[0.1, scrollRotation, 0]}>
      <Component />
    </group>
  );
}

// ── Main 3D Viewer ──
export function ToolViewer3D({
  toolIndex = 0,
  scrollRotation = 0,
}: {
  toolIndex: number;
  scrollRotation: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Transparent background */}
      <color attach="background" args={["#ece8e1"]} />

      {/* Lighting setup for metallic look */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, 3, -3]} intensity={0.6} color="#e0e0ff" />
      <directionalLight position={[0, -3, 3]} intensity={0.3} color="#ffe0d0" />

      {/* Rim light for edge highlights */}
      <pointLight position={[-2, 0, -3]} intensity={0.8} color="#c0d0ff" />
      <pointLight position={[2, 0, -3]} intensity={0.8} color="#ffd0c0" />

      <Suspense fallback={null}>
        {/* Environment map for realistic metallic reflections */}
        <Environment preset="studio" environmentIntensity={0.6} />

        <SpinningTool
          toolIndex={toolIndex}
          scrollRotation={scrollRotation}
        />
      </Suspense>
    </Canvas>
  );
}
