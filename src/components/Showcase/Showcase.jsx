import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import WebGLShowcase from '../WebGLShowcase';
import VisibleCanvas from '../../three/VisibleCanvas';
import { useCenteredModel } from '../../three/useCenteredModel';
import { useGLTF } from '../../three/gltfConfig';
import './Showcase.css';

const DSEV = '/models/d.s.e.v._drone.glb';

function DsevDrone() {
  const ref = useRef();
  const { clone, scale, offset } = useCenteredModel(DSEV, 2);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.9}>
      <group ref={ref} scale={scale}>
        <primitive object={clone} position={[-offset.x, -offset.y, -offset.z]} />
      </group>
    </Float>
  );
}

function DroneCanvas() {
  return (
    <VisibleCanvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5.5], fov: 45 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.4} />
      <pointLight position={[-5, -3, -2]} intensity={0.6} color="#FFDE42" />
      <Suspense fallback={null}>
        <DsevDrone />
      </Suspense>
    </VisibleCanvas>
  );
}

const SPECS = [
  ['01', 'Ephemeral sandbox execution', 'Every generated exploit runs inside a disposable Docker-in-Docker microVM, destroyed the instant a test concludes — a hard boundary from your host infrastructure.'],
  ['02', 'Stateful LangGraph orchestration', 'The swarm is modeled as a durable state machine. If a scan runs for hours and a worker crashes, it resumes from the last checkpoint.'],
  ['03', 'Nuclei + Interactsh core', '8,000+ community templates driven by an AI strategy layer, validated by self-hosted out-of-band callback servers.'],
];

export default function Showcase() {
  return (
    <section id="showcase" className="showcase pr-section">
      <div className="showcase-grid">
        {/* Left: 3D mecha showcase */}
        <div className="showcase-canvas-wrap" style={{ minHeight: 560 }}>
          <span className="showcase-tag">▸ PLEXUS-CORE // UNIT-07</span>
          <WebGLShowcase />
        </div>

        {/* Right: copy + floating drone */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="pr-eyebrow">Platform Emulation</span>
            <h2 className="pr-heading">The Autonomous<br />Red Team Swarm</h2>
            <p className="pr-subheading">
              PlexusRed replaces point-in-time manual pentests with a continuously running
              swarm of specialized agents. Elite offensive capability, delivered as software —
              scanning your surface the moment it changes, not once a year.
            </p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            <ul className="spec-list">
              {SPECS.map(([n, title, body]) => (
                <li key={n}>
                  <span className="bullet">{n}</span>
                  <span><strong>{title}.</strong> {body}</span>
                </li>
              ))}
            </ul>

            {/* Floating D.S.E.V surveillance drone */}
            <div
              style={{
                position: 'absolute',
                right: -10,
                top: -120,
                width: 180,
                height: 180,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <DroneCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(DSEV);
