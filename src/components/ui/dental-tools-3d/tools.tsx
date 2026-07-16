"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

// ══════════════════════════════════════════════════════
// Premium PBR Chrome Material — looks like real polished steel
// High metalness + low roughness + strong env reflections
// ══════════════════════════════════════════════════════

function ChromeMaterial({ roughness = 0.08, color = "#d4d4d4" }: { roughness?: number; color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={1.0}
      roughness={roughness}
      envMapIntensity={2.5}
    />
  );
}

function GripMaterial({ color = "#999999" }: { color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.85}
      roughness={0.55}
      envMapIntensity={1.5}
    />
  );
}

function MirrorMaterial() {
  return (
    <meshStandardMaterial
      color="#f0f0f0"
      metalness={1.0}
      roughness={0.02}
      envMapIntensity={3.0}
    />
  );
}

// ══════════════════════════════════════════════════════
// HELPER: Create a lathe profile from a set of [radius, y] points
// LatheGeometry gives smooth, realistic cylindrical shapes
// ══════════════════════════════════════════════════════
function useLatheGeometry(profilePoints: [number, number][], segments = 32) {
  return useMemo(() => {
    const points = profilePoints.map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(points, segments);
  }, [profilePoints, segments]);
}

// ══════════════════════════════════════════════════════
// SURGICAL TRAY
// ══════════════════════════════════════════════════════
export function SurgicalTray() {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Tray base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[4.5, 0.08, 2.5]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.25} envMapIntensity={2.0} />
      </mesh>
      {/* Rounded rim walls */}
      {[
        { pos: [0, 0.02, -1.2] as const, size: [4.5, 0.12, 0.08] as const },
        { pos: [0, 0.02, 1.2] as const, size: [4.5, 0.12, 0.08] as const },
        { pos: [-2.22, 0.02, 0] as const, size: [0.08, 0.12, 2.5] as const },
        { pos: [2.22, 0.02, 0] as const, size: [0.08, 0.12, 2.5] as const },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos} castShadow>
          <boxGeometry args={wall.size} />
          <ChromeMaterial roughness={0.2} color="#a8a8a8" />
        </mesh>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════════════════
// TOOL 1: DENTAL MIRROR — detailed lathe profile
// ══════════════════════════════════════════════════════
export function DentalMirror() {
  // Handle profile: knurled grip section + thin neck + slight taper at ends
  const handleProfile: [number, number][] = [
    [0.02, -1.8],   // bottom cap
    [0.055, -1.75],  // bottom flare
    [0.048, -1.5],   // shaft
    [0.048, -0.3],   // shaft continues
    [0.065, -0.25],  // grip flare start
    [0.068, -0.2],   // grip body
    [0.068, 0.5],    // grip body
    [0.065, 0.55],   // grip flare end
    [0.04, 0.6],     // neck taper
    [0.032, 0.7],    // thin neck
    [0.028, 1.0],    // neck continues
    [0.025, 1.15],   // neck end
  ];
  const handleGeo = useLatheGeometry(handleProfile, 32);

  // Neck extension to mirror head
  const neckProfile: [number, number][] = [
    [0.025, 1.15],
    [0.022, 1.3],
    [0.02, 1.45],
    [0.025, 1.5],    // slight bulge at connection
  ];
  const neckGeo = useLatheGeometry(neckProfile, 24);

  return (
    <group>
      {/* Handle + grip */}
      <mesh geometry={handleGeo} castShadow>
        <ChromeMaterial roughness={0.12} />
      </mesh>
      {/* Grip rings (knurled texture simulation) */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, -0.15 + i * 0.08, 0]} castShadow>
          <torusGeometry args={[0.069, 0.004, 6, 32]} />
          <GripMaterial />
        </mesh>
      ))}
      {/* Neck */}
      <mesh geometry={neckGeo} castShadow>
        <ChromeMaterial roughness={0.06} />
      </mesh>
      {/* Mirror head — reflective disc */}
      <mesh position={[0.02, 1.6, 0]} rotation={[0.25, 0, 0.05]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 48]} />
        <MirrorMaterial />
      </mesh>
      {/* Mirror rim */}
      <mesh position={[0.02, 1.6, 0]} rotation={[0.25, 0, 0.05]} castShadow>
        <torusGeometry args={[0.28, 0.012, 12, 48]} />
        <ChromeMaterial roughness={0.06} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -1.82, 0]} castShadow>
        <sphereGeometry args={[0.055, 16, 16]} />
        <ChromeMaterial />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════
// TOOL 2: DENTAL SCALER — double-ended with curved tips
// ══════════════════════════════════════════════════════
export function DentalScaler() {
  const handleProfile: [number, number][] = [
    [0.02, -1.1],
    [0.04, -1.05],
    [0.035, -0.9],
    [0.035, -0.4],
    [0.06, -0.35],  // grip start
    [0.065, -0.3],
    [0.065, 0.3],   // grip body
    [0.06, 0.35],    // grip end
    [0.035, 0.4],
    [0.035, 0.9],
    [0.04, 0.95],
    [0.02, 1.0],
  ];
  const handleGeo = useLatheGeometry(handleProfile, 32);

  // Curved scaler tip (top)
  const topTipCurve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 25; i++) {
      const t = i / 25;
      const angle = t * Math.PI * 0.5;
      pts.push(new THREE.Vector3(
        Math.sin(angle) * 0.12,
        1.0 + t * 0.6,
        Math.cos(angle) * 0.05 - 0.05
      ));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  // Curved scaler tip (bottom, mirrored)
  const bottomTipCurve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 25; i++) {
      const t = i / 25;
      const angle = t * Math.PI * 0.5;
      pts.push(new THREE.Vector3(
        -Math.sin(angle) * 0.12,
        -1.1 - t * 0.6,
        Math.cos(angle) * 0.05 - 0.05
      ));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <group>
      <mesh geometry={handleGeo} castShadow>
        <ChromeMaterial roughness={0.1} />
      </mesh>
      {/* Grip rings */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, -0.25 + i * 0.1, 0]} castShadow>
          <torusGeometry args={[0.066, 0.005, 6, 32]} />
          <GripMaterial />
        </mesh>
      ))}
      {/* Top tip */}
      <mesh castShadow>
        <tubeGeometry args={[topTipCurve, 25, 0.018, 12, false]} />
        <ChromeMaterial roughness={0.05} color="#c8c8c8" />
      </mesh>
      {/* Bottom tip */}
      <mesh castShadow>
        <tubeGeometry args={[bottomTipCurve, 25, 0.018, 12, false]} />
        <ChromeMaterial roughness={0.05} color="#c8c8c8" />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════
// TOOL 3: DENTAL PROBE (Explorer)
// ══════════════════════════════════════════════════════
export function DentalProbe() {
  const handleProfile: [number, number][] = [
    [0.018, -1.3],
    [0.04, -1.25],
    [0.038, -1.0],
    [0.038, -0.3],
    [0.058, -0.25],
    [0.062, -0.2],
    [0.062, 0.5],
    [0.058, 0.55],
    [0.032, 0.6],
    [0.025, 0.8],
    [0.018, 1.0],
  ];
  const handleGeo = useLatheGeometry(handleProfile, 32);

  // Sharp curved explorer tip
  const tipCurve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      pts.push(new THREE.Vector3(
        Math.sin(t * Math.PI * 0.7) * 0.08,
        1.0 + t * 0.55,
        -Math.sin(t * Math.PI * 0.3) * 0.04
      ));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <group>
      <mesh geometry={handleGeo} castShadow>
        <ChromeMaterial roughness={0.1} />
      </mesh>
      {/* Grip rings */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, -0.15 + i * 0.09, 0]} castShadow>
          <torusGeometry args={[0.063, 0.004, 6, 32]} />
          <GripMaterial />
        </mesh>
      ))}
      {/* Explorer tip — fine and sharp */}
      <mesh castShadow>
        <tubeGeometry args={[tipCurve, 30, 0.012, 10, false]} />
        <ChromeMaterial roughness={0.04} color="#cccccc" />
      </mesh>
      {/* Tip end point */}
      <mesh position={[0.075, 1.55, -0.03]} castShadow>
        <sphereGeometry args={[0.008, 8, 8]} />
        <ChromeMaterial roughness={0.03} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -1.32, 0]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <ChromeMaterial />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════
// TOOL 4: DENTAL SYRINGE — cartridge type
// ══════════════════════════════════════════════════════
export function DentalSyringe() {
  // Barrel profile
  const barrelProfile: [number, number][] = [
    [0.01, -1.4],     // needle tip
    [0.015, -1.3],
    [0.025, -1.25],   // hub start
    [0.06, -1.2],     // hub flare
    [0.06, -1.05],    // hub end
    [0.08, -1.0],     // barrel start
    [0.085, -0.95],
    [0.085, 0.4],     // barrel body
    [0.08, 0.45],
    [0.07, 0.5],      // barrel end
  ];
  const barrelGeo = useLatheGeometry(barrelProfile, 32);

  // Plunger
  const plungerProfile: [number, number][] = [
    [0.035, 0.5],
    [0.04, 0.55],
    [0.04, 1.1],
    [0.055, 1.12],    // thumb ring start
    [0.055, 1.15],
    [0.035, 1.18],
    [0.015, 1.2],     // thumb ring inner
    [0.035, 1.22],
    [0.055, 1.25],
    [0.055, 1.28],
    [0.04, 1.3],
    [0.01, 1.32],
  ];
  const plungerGeo = useLatheGeometry(plungerProfile, 24);

  return (
    <group>
      {/* Barrel body */}
      <mesh geometry={barrelGeo} castShadow>
        <ChromeMaterial roughness={0.1} />
      </mesh>
      {/* Finger grip wings */}
      <mesh position={[-0.14, -0.98, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.03]} />
        <ChromeMaterial roughness={0.15} />
      </mesh>
      <mesh position={[0.14, -0.98, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.03]} />
        <ChromeMaterial roughness={0.15} />
      </mesh>
      {/* Glass cartridge (visible through barrel) */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 1.1, 24]} />
        <meshStandardMaterial
          color="#e8f4f8"
          metalness={0.1}
          roughness={0.1}
          transparent
          opacity={0.4}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Plunger */}
      <mesh geometry={plungerGeo} castShadow>
        <ChromeMaterial roughness={0.12} color="#b8b8b8" />
      </mesh>
      {/* Needle */}
      <mesh position={[0, -1.55, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.003, 0.3, 8]} />
        <ChromeMaterial roughness={0.03} color="#e0e0e0" />
      </mesh>
      {/* Barrel rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[0, -0.8 + i * 0.5, 0]} castShadow>
          <torusGeometry args={[0.086, 0.004, 6, 32]} />
          <ChromeMaterial roughness={0.15} color="#aaaaaa" />
        </mesh>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════════════════
// TOOL 5: DENTAL FORCEPS — spring-loaded extraction
// ══════════════════════════════════════════════════════
export function DentalForceps() {
  // Left arm curve (handle to beak)
  const leftArm = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = -0.08 - Math.sin(t * Math.PI * 0.6) * 0.15;
      const y = t * 2.8 - 1.4;
      const z = Math.sin(t * Math.PI * 0.2) * 0.02;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  // Right arm curve
  const rightArm = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = 0.08 + Math.sin(t * Math.PI * 0.6) * 0.15;
      const y = t * 2.8 - 1.4;
      const z = Math.sin(t * Math.PI * 0.2) * 0.02;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <group position={[0, -0.2, 0]}>
      {/* Left arm */}
      <mesh castShadow>
        <tubeGeometry args={[leftArm, 30, 0.035, 12, false]} />
        <ChromeMaterial roughness={0.12} />
      </mesh>
      {/* Right arm */}
      <mesh castShadow>
        <tubeGeometry args={[rightArm, 30, 0.035, 12, false]} />
        <ChromeMaterial roughness={0.12} />
      </mesh>
      {/* Pivot joint */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
        <ChromeMaterial roughness={0.08} color="#aaaaaa" />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <torusGeometry args={[0.06, 0.008, 8, 24]} />
        <ChromeMaterial roughness={0.1} />
      </mesh>
      {/* Grip textures - left */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`l${i}`} position={[-0.14, -0.9 + i * 0.12, 0]} rotation={[0, 0, -0.1]} castShadow>
          <torusGeometry args={[0.04, 0.005, 6, 16]} />
          <GripMaterial />
        </mesh>
      ))}
      {/* Grip textures - right */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`r${i}`} position={[0.14, -0.9 + i * 0.12, 0]} rotation={[0, 0, 0.1]} castShadow>
          <torusGeometry args={[0.04, 0.005, 6, 16]} />
          <GripMaterial />
        </mesh>
      ))}
      {/* Beaked tips - left */}
      <mesh position={[-0.06, 1.35, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.008, 0.035, 0.35, 12]} />
        <ChromeMaterial roughness={0.06} />
      </mesh>
      {/* Beaked tips - right */}
      <mesh position={[0.06, 1.35, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.008, 0.035, 0.35, 12]} />
        <ChromeMaterial roughness={0.06} />
      </mesh>
    </group>
  );
}

// ── Tool registry ──
export const DENTAL_TOOLS = [
  { name: "mirror", Component: DentalMirror },
  { name: "scaler", Component: DentalScaler },
  { name: "probe", Component: DentalProbe },
  { name: "syringe", Component: DentalSyringe },
  { name: "forceps", Component: DentalForceps },
] as const;
