"use client";

import { invalidate, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, use, useRef } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const MTL_URL = "/camera/Camera.mtl";
const OBJ_URL = "/camera/Camera.obj";

const cameraModelPromise = (async () => {
  const mtlLoader = new MTLLoader();
  const materials = await mtlLoader.loadAsync(MTL_URL);
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  return objLoader.loadAsync(OBJ_URL);
})();

/** Smaller on-screen footprint so copy is not competing with mesh / baked texture labels. */
const TARGET_SIZE = 1.75;

/**
 * MTL sets Kd to 0,0,0 expecting the diffuse map to carry color. MeshPhongMaterial
 * multiplies map by `color`, so black Kd zeros the texture and reads as a flat silhouette.
 */
function fixPhongMaterialsForMaps(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material)
      ? child.material
      : [child.material];
    for (const mat of mats) {
      if (mat instanceof THREE.MeshPhongMaterial) {
        if (mat.map) {
          mat.color.setRGB(1, 1, 1);
          mat.map.colorSpace = THREE.SRGBColorSpace;
        }
        mat.needsUpdate = true;
      }
    }
  });
}

function usePreparedCameraModel() {
  const object = use(cameraModelPromise);
  return useMemo(() => {
    const root = object.clone(true);
    fixPhongMaterialsForMaps(root);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1e-3);
    const s = TARGET_SIZE / maxDim;
    root.scale.setScalar(s);
    root.updateMatrixWorld(true);
    return root;
  }, [object]);
}

export type HeroCameraModelProps = {
  scrollProgress: number;
  /** When true, parallax is disabled (static pose). */
  reducedMotion: boolean;
};

const CURSOR_ROT_Y = 0.22;
const CURSOR_ROT_X = 0.16;
const CURSOR_SMOOTH = 0.12;

export function HeroCameraModel({
  scrollProgress,
  reducedMotion,
}: HeroCameraModelProps) {
  const prepared = usePreparedCameraModel();
  const parallaxRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorCurrent = useRef({ x: 0, y: 0 });

  const progress = reducedMotion ? 0 : scrollProgress;

  useEffect(() => {
    invalidate();
  }, [prepared]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      cursorTarget.current.x = (e.clientX / w) * 2 - 1;
      cursorTarget.current.y = (e.clientY / h) * 2 - 1;
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    cursorTarget.current = { x: 0, y: 0 };
    cursorCurrent.current = { x: 0, y: 0 };
    const t = tiltRef.current;
    if (t) {
      t.rotation.x = 0;
      t.rotation.y = 0;
    }
    invalidate();
  }, [reducedMotion]);

  useFrame(() => {
    if (reducedMotion) return;
    const t = tiltRef.current;
    if (!t) return;
    let changed = false;
    const smooth = CURSOR_SMOOTH;
    for (const axis of ["x", "y"] as const) {
      const d = cursorTarget.current[axis] - cursorCurrent.current[axis];
      if (Math.abs(d) > 0.0005) {
        cursorCurrent.current[axis] += d * smooth;
        changed = true;
      }
    }
    t.rotation.y = cursorCurrent.current.x * CURSOR_ROT_Y;
    t.rotation.x = -cursorCurrent.current.y * CURSOR_ROT_X;
    if (changed) invalidate();
  });

  useLayoutEffect(() => {
    const g = parallaxRef.current;
    if (!g) return;
    const maxTravel = 1.35;
    g.position.y = -progress * maxTravel * 0.5;
    invalidate();
  }, [progress]);

  return (
    <group ref={parallaxRef}>
      {/* Shift model off the headline column (viewer right + slightly down). */}
      <group ref={tiltRef} position={[1.05, -0.42, 0]}>
        <Center>
          <primitive object={prepared} />
        </Center>
      </group>
    </group>
  );
}
