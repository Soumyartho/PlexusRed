import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from './gltfConfig';

/**
 * useCenteredModel — loads a GLB, clones it, and computes the transform needed
 * to (a) recenter its geometry on the origin and (b) uniformly scale it so its
 * largest dimension equals `targetSize`. Rotating a group placed at the origin
 * then spins the model about its own center, so no body parts get clipped by
 * the camera frustum regardless of the model's native pivot or scale.
 *
 * Returns { clone, scale, offset } — render as:
 *   <group scale={scale}>
 *     <primitive object={clone} position={[-offset.x, -offset.y, -offset.z]} />
 *   </group>
 */
export function useCenteredModel(url, targetSize = 2) {
  const { scene } = useGLTF(url);

  return useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const offset = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(offset);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    return { clone, scale, offset };
  }, [scene, url, targetSize]);
}
