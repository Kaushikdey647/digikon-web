"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { HeroCameraModel } from "@/components/marketing/hero-camera-model";

function CameraLoadingFallback() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[0.9, 0.55, 0.35]} />
      <meshStandardMaterial
        color="#1a2a24"
        metalness={0.35}
        roughness={0.55}
      />
    </mesh>
  );
}

export type HeroCameraCanvasProps = {
  scrollProgress: number;
  reducedMotion: boolean;
};

export default function HeroCameraCanvas({
  scrollProgress,
  reducedMotion,
}: HeroCameraCanvasProps) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: [-0.42, 0.08, 5.75], fov: 40, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.92;
      }}
    >
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[5, 4, 6]}
        intensity={1.35}
        color="#fff8f0"
      />
      <directionalLight
        position={[-6, -2, -4]}
        intensity={0.85}
        color="#6ee7c8"
      />
      <directionalLight
        position={[0, -3, 5]}
        intensity={0.35}
        color="#0d3d2e"
      />
      <Suspense fallback={<CameraLoadingFallback />}>
        <HeroCameraModel
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
