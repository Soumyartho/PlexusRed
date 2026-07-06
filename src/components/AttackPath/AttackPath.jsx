import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BaseEdge,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import { line, curveCatmullRom } from 'd3';
import { motion } from 'framer-motion';
import { FiGlobe, FiDatabase, FiKey, FiServer, FiUnlock } from 'react-icons/fi';
import { useAudio } from '../../hooks/useAudio';
import './AttackPath.css';

/* ---------------- custom node ---------------- */
function AttackNode({ data }) {
  return (
    <div className={`attack-node sev-${data.severity}`}>
      <Handle type="target" position={Position.Left} />
      <span className="an-sev">{data.severity}</span>
      <div className="an-icon">{data.icon}</div>
      <div>
        <div className="an-title">{data.label}</div>
        <div className="an-meta">{data.meta}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

/* ---------------- custom edge: Catmull-Rom spline (PRD §4.5) ---------------- */
function CatmullEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }) {
  const path = useMemo(() => {
    const mx = (sourceX + targetX) / 2;
    const my = (sourceY + targetY) / 2;
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const k = 0.16; // organic bow
    const cx = mx - dy * k;
    const cy = my + dx * k;
    return line().curve(curveCatmullRom.alpha(0.5))([
      [sourceX, sourceY],
      [cx, cy],
      [targetX, targetY],
    ]);
  }, [sourceX, sourceY, targetX, targetY]);

  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />;
}

const nodeTypes = { attack: AttackNode };
const edgeTypes = { catmull: CatmullEdge };

/* ---------------- graph data ---------------- */
const NODES = [
  { id: '1', type: 'attack', position: { x: 0, y: 150 },
    data: { label: 'Exposed API Gateway', meta: '443/tcp · nginx', severity: 'medium', icon: <FiGlobe /> } },
  { id: '2', type: 'attack', position: { x: 300, y: 20 },
    data: { label: 'Blind SSRF', meta: 'oob · interactsh', severity: 'high', icon: <FiUnlock /> } },
  { id: '3', type: 'attack', position: { x: 300, y: 280 },
    data: { label: 'Exposed RDS Database', meta: '5432/tcp · postgres', severity: 'critical', icon: <FiDatabase /> } },
  { id: '4', type: 'attack', position: { x: 620, y: 150 },
    data: { label: 'Stolen JWT Token', meta: 'HS256 · none-alg', severity: 'high', icon: <FiKey /> } },
  { id: '5', type: 'attack', position: { x: 930, y: 150 },
    data: { label: 'Active Directory Misconfig', meta: 'kerberoast · GPO', severity: 'critical', icon: <FiServer /> } },
];

const edgeStyle = { stroke: '#FFDE42', strokeWidth: 2, strokeDasharray: '6 4' };
const marker = { type: MarkerType.ArrowClosed, color: '#FFDE42', width: 18, height: 18 };
const mkEdge = (id, s, t) => ({ id, source: s, target: t, type: 'catmull', animated: true, style: edgeStyle, markerEnd: marker });

const EDGES = [
  mkEdge('e1-2', '1', '2'),
  mkEdge('e1-3', '1', '3'),
  mkEdge('e2-4', '2', '4'),
  mkEdge('e3-4', '3', '4'),
  mkEdge('e4-5', '4', '5'),
];

/* ---------------- per-node forensic detail ---------------- */
const DETAILS = {
  '1': {
    http: `GET /api/v1/status HTTP/1.1\nHost: acme-fintech.io\nX-Forwarded-For: 127.0.0.1\nUser-Agent: plexusred-recon/2.4`,
    proof: `nuclei ▸ exposed-panel matched\nserver header leaks nginx/1.25.3`,
    remediation: 'Restrict management endpoints behind an authenticated gateway and strip version-disclosing response headers.',
  },
  '2': {
    http: `POST /api/import HTTP/1.1\nHost: acme-fintech.io\nContent-Type: application/json\n\n{ "url": "http://c8f2a1.oob.plexusred.io/x" }`,
    proof: `interactsh ▸ DNS lookup received for\nc8f2a1.oob.plexusred.io — payload parsed ✓\nfull HTTP callback ▸ outbound request PROVEN`,
    remediation: 'Enforce an allow-list of outbound hosts for the import service and block link-local / metadata IP ranges (169.254.0.0/16).',
  },
  '3': {
    http: `psql "host=db.acme-fintech.io port=5432\n     user=app dbname=core sslmode=disable"\n-- weak credential reuse from leaked .env`,
    proof: `interactsh ▸ egress confirmed from RDS subnet\ntable users ▸ 1.2M rows readable`,
    remediation: 'Rotate database credentials, disable public network exposure on the RDS instance, and enforce IAM auth + SSL-only connections.',
  },
  '4': {
    http: `GET /account HTTP/1.1\nHost: acme-fintech.io\nAuthorization: Bearer eyJhbGciOiJub25lI...`,
    proof: `jwt ▸ alg downgraded HS256 → none\nsignature check bypassed ▸ admin claim forged`,
    remediation: 'Pin the accepted JWT algorithm server-side, reject "none", and validate signatures against a rotating secret in a KMS.',
  },
  '5': {
    http: `GetUserSPNs.py acme.local/app:'***'\n-request -dc-ip 10.0.4.10`,
    proof: `kerberoast ▸ TGS extracted for svc-sql\noffline crack ▸ Domain Admin path reached`,
    remediation: 'Set strong 25+ char service-account passwords, enable AES-only Kerberos, and remove excessive GPO delegation rights.',
  },
};

const sevColor = { critical: '#ff5f56', high: '#ffbd2e', medium: '#FFDE42' };

export default function AttackPath() {
  const playSound = useAudio();
  const [selected, setSelected] = useState(null);

  const onNodeClick = useCallback((_, node) => {
    playSound('click');
    setSelected(node);
  }, [playSound]);

  const closeDrawer = () => {
    playSound('close');
    setSelected(null);
  };

  const detail = selected ? DETAILS[selected.id] : null;

  return (
    <section id="attack-paths" className="attackpath pr-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="pr-eyebrow">Interactive Attack Paths</span>
        <h2 className="pr-heading">Findings as chains,<br />not isolated alerts</h2>
        <p className="pr-subheading">
          An attacker chains minor flaws into a critical breach. PlexusRed renders the swarm's
          hypothesized paths as an interactive graph — click any node to open the raw HTTP
          request, the Interactsh OOB proof, and LLM remediation advice.
        </p>
      </motion.div>

      <div className="flow-shell">
        <ReactFlow
          nodes={NODES}
          edges={EDGES}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          minZoom={0.4}
          maxZoom={1.5}
        >
          <Background color="#313E17" gap={28} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>

        {!selected && <span className="drawer-hint">▸ click a node to inspect evidence</span>}

        {/* Side drawer */}
        <div className={`flow-drawer ${selected ? 'open' : ''}`}>
          {selected && detail && (
            <>
              <div className="drawer-head">
                <div>
                  <h3>{selected.data.label}</h3>
                  <span
                    className="sev-pill"
                    style={{ background: sevColor[selected.data.severity], color: '#1b0c0c' }}
                  >
                    {selected.data.severity} severity
                  </span>
                </div>
                <button className="drawer-close" onClick={closeDrawer} aria-label="Close">✕</button>
              </div>
              <div className="drawer-body">
                <div className="drawer-section">
                  <div className="label">▸ Raw HTTP Request</div>
                  <pre>{detail.http}</pre>
                </div>
                <div className="drawer-section">
                  <div className="label">▸ Interactsh OOB Proof</div>
                  <pre className="proof">{detail.proof}</pre>
                </div>
                <div className="drawer-section">
                  <div className="label">▸ LLM Remediation Advice</div>
                  <p className="remediation">{detail.remediation}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
