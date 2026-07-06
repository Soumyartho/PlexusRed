import { motion } from 'framer-motion';
import { FiSearch, FiGitBranch, FiTarget, FiFileText } from 'react-icons/fi';
import { useAudio } from '../../hooks/useAudio';
import './SwarmWorkflow.css';

const PHASES = [
  {
    icon: <FiSearch />,
    tag: 'Phase 01',
    title: 'Recon Agent',
    body: 'Wraps Nmap and Subfinder via subprocess to map open ports, running services and subdomains, parsing raw output into structured JSON on the shared graph state.',
    chip: { label: 'Nmap · Subfinder', hitl: false },
  },
  {
    icon: <FiGitBranch />,
    tag: 'Phase 02',
    title: 'Strategy Agent',
    body: 'A high-reasoning LLM correlates services against CVE data and the Nuclei registry via RAG, then halts and persists state for human review before anything fires.',
    chip: { label: 'HITL Approval Pause', hitl: true },
  },
  {
    icon: <FiTarget />,
    tag: 'Phase 03',
    title: 'Exploit Agent',
    body: 'Runs exclusively inside an ephemeral Docker-in-Docker microVM, arming Interactsh correlation IDs and proving blind vulnerabilities via out-of-band callbacks.',
    chip: { label: 'microVM Sandbox', hitl: false },
  },
  {
    icon: <FiFileText />,
    tag: 'Phase 04',
    title: 'Reporting Agent',
    body: 'Synthesizes exploits and OOB evidence into code-level remediation, exporting standardized SARIF ready for CI/CD, GitHub Advanced Security and SIEM ingestion.',
    chip: { label: 'SARIF Export', hitl: false },
  },
];

export default function SwarmWorkflow() {
  const playSound = useAudio();

  return (
    <section id="swarm" className="swarm pr-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="pr-eyebrow">The 4-Phase Swarm Workflow</span>
        <h2 className="pr-heading">One deterministic<br />chain of custody</h2>
        <p className="pr-subheading">
          Modeled in LangGraph as a stateful, resumable state machine — every finding is
          reasoned out methodically, executed safely in isolation, and delivered as
          audit-grade evidence.
        </p>
      </motion.div>

      <div className="swarm-rail">
        {PHASES.map((p, i) => (
          <motion.div
            key={p.title}
            className="phase-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            onMouseEnter={() => playSound('hover', 0.14)}
          >
            <div className="phase-index">{p.icon}</div>
            <span className="phase-tag">{p.tag}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <span className={`phase-chip ${p.chip.hitl ? 'hitl' : ''}`}>
              <span className="pulse" />
              {p.chip.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
