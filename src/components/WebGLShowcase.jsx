import { useRef, useMemo, useLayoutEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useTexture, Float, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '../three/gltfConfig';

const MECHA = '/models/bot_mecha_warrior_3d_by_oscar_creativo.glb';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ fontFamily: 'monospace', color: '#FFDE42', fontSize: 12, letterSpacing: '0.2em' }}>
        RENDERING ▸ {Math.floor(progress)}%
      </div>
    </Html>
  );
}

function MechaMesh() {
  const meshRef = useRef();
  const { scene } = useGLTF(MECHA);
  const model = useMemo(() => scene.clone(true), [scene]);

  // Load optimized WebP PBR maps (PRD §5.2).
  const textureMap = useTexture({
    roughnessMap: '/textures/MetalPlates005_1K-JPG_Roughness.webp',
    normalMap: '/textures/MetalPlates005_1K-JPG_NormalGL.webp',
    metalnessMap: '/textures/MetalPlates005_1K-JPG_Metalness.webp',
  });

  // Apply PBR parameters across every mesh material — robust against the
  // model's internal material naming rather than assuming `materials.ArmorPlate`.
  useLayoutEffect(() => {
    Object.values(textureMap).forEach((t) => {
      if (t) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.colorSpace = THREE.NoColorSpace;
      }
    });
    model.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (!mat || !('metalness' in mat)) return;
        mat.roughnessMap = textureMap.roughnessMap;
        mat.normalMap = textureMap.normalMap;
        mat.metalnessMap = textureMap.metalnessMap;
        mat.roughness = 0.45;
        mat.metalness = 0.95;
        mat.envMapIntensity = 1.2;
        mat.needsUpdate = true;
      });
      child.castShadow = true;
    });
  }, [model, textureMap]);

  // Rotate with scroll progress + a gentle idle drift.
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const doc = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = doc > 0 ? window.scrollY / doc : 0;
    meshRef.current.rotation.y = scrollPercent * Math.PI * 2 + performance.now() * 0.00006;
    meshRef.current.rotation.x = THREE.MathUtils.degToRad(-4);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <primitive ref={meshRef} object={model} scale={2.2} position={[0, -1.6, 0]} />
    </Float>
  );
}

export default function WebGLShowcase() {
  return (
    <div className="h-[560px] w-full relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-8, -2, -6]} intensity={0.8} color="#FFDE42" />
        <spotLight position={[0, 8, 4]} angle={0.4} penumbra={0.8} intensity={1.1} color="#ff6b6b" />
        <Suspense fallback={<Loader />}>
          <MechaMesh />
          <Environment files="/hdri/studio_small_08_1k.hdr" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MECHA);
