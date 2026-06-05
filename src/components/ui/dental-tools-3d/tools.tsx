"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";

// ── Shared metallic material props ──
const STEEL_COLOR = "#c0c0c0";
const STEEL_DARK = "#8a8a8a";
const GRIP_COLOR = "#a0a0a0";

function SteelMaterial({ roughness = 0.18, color = STEEL_COLOR }: { roughness?: number; color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.95}
      roughness={roughness}
    />
  );
}

// ═══════════════════════════════════════
// TOOL 1: DENTAL MIRROR
// ═══════════════════════════════════════
export function DentalMirror() {
  return (
    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
      {/* Handle - bottom section */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.055, 2.0, 16]} />
        <SteelMaterial />
      </mesh>

      {/* Grip - knurled section (slightly thicker, darker) */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
        <SteelMaterial roughness={0.45} color={GRIP_COLOR} />
      </mesh>

      {/* Neck - thin connecting rod angled slightly */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.03, 0.04, 0.7, 12]} />
        <SteelMaterial roughness={0.12} />
      </mesh>

      {/* Mirror head - flat reflective disc */}
      <mesh position={[0.02, 0.75, 0]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.03, 32]} />
        <meshStandardMaterial
          color="#e8e8e8"
          metalness={1.0}
          roughness={0.05}
        />
      </mesh>

      {/* Mirror rim */}
      <mesh position={[0.02, 0.75, 0]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.25, 0.015, 8, 32]} />
        <SteelMaterial roughness={0.1} />
      </mesh>

      {/* Handle end cap */}
      <mesh position={[0, -2.8, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <SteelMaterial />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════
// TOOL 2: DENTAL SCALER
// ═══════════════════════════════════════
export function DentalScaler() {
  const curvePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = Math.sin(t * Math.PI * 0.6) * 0.15;
      const y = t * 0.8;
      points.push(new THREE.Vector3(x, y + 0.5, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group position={[0, -0.3, 0]}>
      {/* Handle - bottom */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.055, 2.2, 16]} />
        <SteelMaterial />
      </mesh>

      {/* Grip section */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.9, 8]} />
        <SteelMaterial roughness={0.45} color={GRIP_COLOR} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.5, 12]} />
        <SteelMaterial roughness={0.12} />
      </mesh>

      {/* Curved blade tip */}
      <mesh position={[0, 0.5, 0]}>
        <tubeGeometry args={[curvePoints, 20, 0.02, 8, false]} />
        <SteelMaterial roughness={0.08} color="#d0d0d0" />
      </mesh>

      {/* Handle end cap */}
      <mesh position={[0, -2.9, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <SteelMaterial />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════
// TOOL 3: DENTAL EXPLORER PROBE
// ═══════════════════════════════════════
export function DentalProbe() {
  const hookPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      // Creates a hook shape
      const x = Math.sin(t * Math.PI * 1.2) * 0.12 * t;
      const y = t * 0.7;
      points.push(new THREE.Vector3(x, y + 0.5, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group position={[0, -0.3, 0]}>
      {/* Handle */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.055, 2.2, 16]} />
        <SteelMaterial />
      </mesh>

      {/* Grip with grooves */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 1.0, 12]} />
        <SteelMaterial roughness={0.5} color={GRIP_COLOR} />
      </mesh>

      {/* Thin neck */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.6, 12]} />
        <SteelMaterial roughness={0.1} />
      </mesh>

      {/* Hooked tip */}
      <mesh position={[0, 0.5, 0]}>
        <tubeGeometry args={[hookPoints, 20, 0.015, 8, false]} />
        <SteelMaterial roughness={0.06} color="#d5d5d5" />
      </mesh>

      {/* End cap */}
      <mesh position={[0, -2.9, 0]}>
        <sphereGeometry args={[0.058, 12, 12]} />
        <SteelMaterial />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════
// TOOL 4: DENTAL SYRINGE
// ═══════════════════════════════════════
export function DentalSyringe() {
  return (
    <group position={[0, 0.2, 0]}>
      {/* Ring handle at top */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.03, 12, 24]} />
        <SteelMaterial />
      </mesh>

      {/* Ring connector */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 12]} />
        <SteelMaterial />
      </mesh>

      {/* Plunger rod */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <SteelMaterial roughness={0.1} />
      </mesh>

      {/* Barrel - main body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 16]} />
        <SteelMaterial roughness={0.2} />
      </mesh>

      {/* Barrel window (glass section) */}
      <mesh position={[0.001, -0.2, 0.08]}>
        <boxGeometry args={[0.06, 0.8, 0.03]} />
        <meshStandardMaterial
          color="#c8d8e8"
          metalness={0.1}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Grip ring - bottom of barrel */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.1, 16]} />
        <SteelMaterial roughness={0.4} color={GRIP_COLOR} />
      </mesh>

      {/* Needle hub */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.06, 0.03, 0.3, 12]} />
        <SteelMaterial roughness={0.15} />
      </mesh>

      {/* Needle */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.008, 0.005, 1.0, 8]} />
        <SteelMaterial roughness={0.05} color="#d8d8d8" />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════
// TOOL 5: DENTAL FORCEPS
// ═══════════════════════════════════════
export function DentalForceps() {
  const leftArmCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = -0.15 + Math.sin(t * Math.PI) * 0.2;
      const y = t * 2.5 - 1.2;
      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const rightArmCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = 0.15 - Math.sin(t * Math.PI) * 0.2;
      const y = t * 2.5 - 1.2;
      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group position={[0, -0.3, 0]}>
      {/* Left arm */}
      <mesh>
        <tubeGeometry args={[leftArmCurve, 20, 0.04, 8, false]} />
        <SteelMaterial roughness={0.2} />
      </mesh>

      {/* Right arm */}
      <mesh>
        <tubeGeometry args={[rightArmCurve, 20, 0.04, 8, false]} />
        <SteelMaterial roughness={0.2} />
      </mesh>

      {/* Pivot joint */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <SteelMaterial roughness={0.15} color={STEEL_DARK} />
      </mesh>

      {/* Left grip */}
      <mesh position={[-0.15, -1.0, 0]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.055, 0.05, 0.6, 8]} />
        <SteelMaterial roughness={0.45} color={GRIP_COLOR} />
      </mesh>

      {/* Right grip */}
      <mesh position={[0.15, -1.0, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.055, 0.05, 0.6, 8]} />
        <SteelMaterial roughness={0.45} color={GRIP_COLOR} />
      </mesh>

      {/* Left beak tip */}
      <mesh position={[-0.05, 1.15, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.01, 0.04, 0.3, 8]} />
        <SteelMaterial roughness={0.1} />
      </mesh>

      {/* Right beak tip */}
      <mesh position={[0.05, 1.15, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.01, 0.04, 0.3, 8]} />
        <SteelMaterial roughness={0.1} />
      </mesh>
    </group>
  );
}

// ── Tool selector ──
export const DENTAL_TOOLS = [
  { name: "mirror", Component: DentalMirror },
  { name: "scaler", Component: DentalScaler },
  { name: "probe", Component: DentalProbe },
  { name: "syringe", Component: DentalSyringe },
  { name: "forceps", Component: DentalForceps },
] as const;
