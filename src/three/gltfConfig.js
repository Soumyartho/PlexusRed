import { useGLTF } from '@react-three/drei';

// Configure the GLTF loader's Draco decoder path globally so compressed
// models (e.g. the Mecha Warrior) decode against the locally-served binaries
// in /public/draco (PRD §5.1). Importing this module once, early, is enough.
useGLTF.setDecoderPath('/draco/');

export { useGLTF };
