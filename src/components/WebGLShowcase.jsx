import { useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useTexture, Float, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import VisibleCanvas from '../three/VisibleCanvas';
import { useCenteredModel } from '../three/useCenteredModel';
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
  const rotRef = useRef();
  const maxScroll = useRef(1);
  const { clone, scale, offset } = useCenteredModel(MECHA, 2.2);

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
    clone.traverse((child) => {
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
  }, [clone, textureMap]);

  // Cache the scrollable height instead of reading layout every frame
  // (reading offsetHeight per frame forces a synchronous reflow → scroll jank).
  useEffect(() => {
    const calc = () => {
      maxScroll.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useFrame(() => {
    if (!rotRef.current) return;
    const scrollPercent = window.scrollY / maxScroll.current; // window.scrollY is cheap (no reflow)
    rotRef.current.rotation.y = scrollPercent * Math.PI * 2 + performance.now() * 0.00006;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
      <group ref={rotRef} scale={scale}>
        <primitive object={clone} position={[-offset.x, -offset.y, -offset.z]} />
      </group>
    </Float>
  );
}

export default function WebGLShowcase() {
  return (
    <div className="h-[560px] w-full relative">
      <VisibleCanvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 45 }}
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
      </VisibleCanvas>
    </div>
  );
}

useGLTF.preload(MECHA);
