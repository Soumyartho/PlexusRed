import { useEffect, useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import VisibleCanvas from '../../three/VisibleCanvas';
import { useCenteredModel } from '../../three/useCenteredModel';
import { useGLTF } from '../../three/gltfConfig';
import { useAudio } from '../../hooks/useAudio';
import './Scanner.css';

const SURVEILLANCE = '/models/sci-_fi_surveillance_drone.glb';

/* ---------------- 3D surveillance drone + scan laser ---------------- */
function SurveillanceDrone({ scanning }) {
  const ref = useRef();
  const laserRef = useRef();
  const { clone, scale, offset } = useCenteredModel(SURVEILLANCE, 2);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
    if (laserRef.current) {
      const t = state.clock.elapsedTime;
      laserRef.current.rotation.z = Math.sin(t * 2) * 0.5;
      laserRef.current.visible = scanning;
      laserRef.current.material.opacity = 0.3 + Math.sin(t * 6) * 0.12;
    }
  });

  return (
    <group>
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
        <group ref={ref} scale={scale}>
          <primitive object={clone} position={[-offset.x, -offset.y, -offset.z]} />
        </group>
      </Float>
      {/* scanning laser cone, projected below the centered drone */}
      <mesh ref={laserRef} position={[0, -1.6, 0]}>
        <coneGeometry args={[1.0, 2.4, 24, 1, true]} />
        <meshBasicMaterial
          color="#FFDE42"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function DroneScene({ scanning }) {
  return (
    <VisibleCanvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 5, 5]} intensity={1.4} />
      <pointLight position={[-4, -2, -3]} intensity={0.7} color="#FFDE42" />
      <Suspense fallback={null}>
        <SurveillanceDrone scanning={scanning} />
      </Suspense>
    </VisibleCanvas>
  );
}

/* ---------------- scan simulation ---------------- */
const buildSequence = (target) => [
  { t: 0, cls: 'ok', text: `▸ initializing swarm against ${target}` },
  { t: 400, cls: 'dim', text: 'recon.agent ▸ nmap -sV -T4 …' },
  { t: 900, cls: '', text: '  443/tcp   open  https  nginx/1.25' },
  { t: 1150, cls: '', text: '  5432/tcp  open  postgresql 14.2' },
  { t: 1450, cls: '', text: '  22/tcp    open  ssh  OpenSSH 8.9' },
  { t: 1800, cls: 'dim', text: 'recon.agent ▸ subfinder ▸ 37 subdomains resolved' },
  { t: 2300, cls: 'dim', text: 'strategy.agent ▸ correlating CVE registry (RAG) …' },
  { t: 2800, cls: 'ok', text: 'strategy.agent ▸ 4 candidate templates selected' },
  { t: 3200, cls: 'ok', text: '⏸ HITL checkpoint ▸ attack plan approved' },
  { t: 3700, cls: 'dim', text: 'exploit.agent ▸ microVM sandbox spun up' },
  { t: 4200, cls: 'dim', text: 'exploit.agent ▸ interactsh callback armed' },
  { t: 4700, cls: 'crit', text: '  blind-ssrf ▸ DNS callback received ✓ PROVEN' },
  { t: 5100, cls: 'crit', text: '  exposed-postgres ▸ auth bypass confirmed' },
  { t: 5500, cls: 'dim', text: 'exploit.agent ▸ sandbox destroyed' },
  { t: 5900, cls: 'dim', text: 'report.agent ▸ generating remediation …' },
  { t: 6400, cls: 'ok', text: 'report.agent ▸ SARIF exported ▸ 3 critical / 2 medium' },
  { t: 6800, cls: 'ok', text: '✓ scan complete — zero false positives' },
];

export default function Scanner() {
  const playSound = useAudio();
  const [target, setTarget] = useState('acme-fintech.io');
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const timers = useRef([]);
  const logRef = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const runScan = () => {
    if (scanning) return;
    const clean = target.trim();
    if (!clean) {
      playSound('error');
      setLogs([{ cls: 'crit', text: '✗ error ▸ enter a valid target domain', ts: stamp() }]);
      return;
    }
    playSound('scan');
    setScanning(true);
    setLogs([]);
    setProgress(0);

    const seq = buildSequence(clean);
    const total = seq[seq.length - 1].t + 400;

    seq.forEach((entry) => {
      const id = setTimeout(() => {
        setLogs((prev) => [...prev, { ...entry, ts: stamp() }]);
        setProgress(Math.round((entry.t / total) * 100));
      }, entry.t);
      timers.current.push(id);
    });

    const endId = setTimeout(() => {
      setProgress(100);
      setScanning(false);
      playSound('confirm');
    }, total);
    timers.current.push(endId);
  };

  return (
    <section id="scanner" className="scanner pr-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="pr-eyebrow">Launch On-Demand Scan</span>
        <h2 className="pr-heading">Target intelligence<br />scanner</h2>
        <p className="pr-subheading">
          Enter a target and watch the swarm run a full recon → strategy → exploit → report
          cycle in real time. Every critical finding is validated out-of-band before it is
          ever reported.
        </p>
      </motion.div>

      <div className="scanner-grid">
        {/* Terminal simulator */}
        <div className="terminal">
          <div className="terminal-bar">
            <span className="lights"><i /><i /><i /></span>
            <span>plexusred // swarm-console</span>
          </div>

          <div className="terminal-log" ref={logRef}>
            {logs.length === 0 && (
              <div className="line dim">▸ awaiting target — press // Scan target to begin</div>
            )}
            {logs.map((l, i) => (
              <div key={i} className="line">
                <span className="ts">{l.ts}</span>
                <span className={l.cls}>{l.text}</span>
              </div>
            ))}
          </div>

          <div className="terminal-progress">
            <div className="bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="scan-controls">
            <div className="glow-input">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runScan()}
                placeholder="target.example.com"
                aria-label="Target domain"
                spellCheck="false"
              />
            </div>
            <a
              className={`btn-glitch-fill ${scanning ? 'busy' : ''}`}
              onClick={runScan}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && runScan()}
            >
              <span className="text">{scanning ? '// Scanning' : '// Scan target'}</span>
              <span className="text-decoration"> _</span>
              <span className="decoration">⇒</span>
            </a>
          </div>
        </div>

        {/* Drone viewport */}
        <div className="drone-viewport">
          <div className="reticle" />
          <span className="hud tl">▸ SURVEILLANCE-DRONE // SR-9</span>
          <span className="hud br">FOV 62° · ISO 800</span>
          <DroneScene scanning={scanning} />
          <span className="status-line">
            <span className="dot" />
            {scanning ? 'ACTIVE SWEEP // LASER ARMED' : 'STANDBY // TARGET LOCK READY'}
          </span>
        </div>
      </div>
    </section>
  );
}

const stamp = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

useGLTF.preload(SURVEILLANCE);
