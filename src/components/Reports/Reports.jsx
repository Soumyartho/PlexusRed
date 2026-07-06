import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import './Reports.css';

const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="16" width="16">
    <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12l2 2l4-4" />
    </g>
  </svg>
);

const METRICS = [
  { title: 'Threats Blocked', value: '12,480', pct: '+18%', down: false, fill: 76 },
  { title: 'Active Scans', value: '89 / 100', pct: '+9%', down: false, fill: 89 },
  { title: 'OOB Validations', value: '3,204', pct: '+27%', down: false, fill: 64 },
  { title: 'False Positives', value: '0.00%', pct: '-100%', down: true, fill: 4 },
];

const TILT_CARDS = [
  {
    title: 'Pentest Report',
    copy: 'Vulnerability assessment and red team simulation completed for production environments.',
    month: 'JULY',
    day: '06',
  },
  {
    title: 'Vulnerability Audit',
    copy: 'Full API and external surface audit with out-of-band validated exploit evidence.',
    month: 'JUNE',
    day: '29',
  },
];

const COMPLIANCE = [
  { k: 'SARIF EXPORT', v: <>Native <strong>SARIF 2.1.0</strong> for CI/CD, GitHub Advanced Security & SIEM ingestion.</> },
  { k: 'OOB EVIDENCE', v: <>Cryptographic <strong>Interactsh</strong> callbacks prove blind SSRF, SQLi & XXE.</> },
  { k: 'HITL CONTROL', v: <>Every exploit gated by a <strong>human approval</strong> checkpoint before execution.</> },
  { k: 'LOG RETENTION', v: <><strong>180-day</strong> TimescaleDB hypertables satisfy CERT-In & SOC 2 audits.</> },
];

export default function Reports() {
  const playSound = useAudio();

  return (
    <section id="reports" className="reports pr-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="pr-eyebrow">Threat Metrics & Reporting</span>
        <h2 className="pr-heading">Actionable posture,<br />not raw data</h2>
        <p className="pr-subheading">
          Live security telemetry drawn from the swarm — surfaced as decisions, with every
          report backed by an immutable cryptographic ledger of every payload executed.
        </p>
      </motion.div>

      {/* Metrics grid */}
      <div className="metrics-grid">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.title}
            className="metric-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onMouseEnter={() => playSound('hover', 0.12)}
          >
            <div className="title">
              <span className="icon"><ShieldIcon /></span>
              <p className="title-text">{m.title}</p>
              <p className={`percent ${m.down ? 'down' : ''}`}><ChevronUp /> {m.pct}</p>
            </div>
            <div className="data">
              <p className="value">{m.value}</p>
              <div className="range">
                <motion.div
                  className="fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.fill}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D tilt report cards + intro copy */}
      <div className="reports-lower">
        <div className="tilt-row">
          {TILT_CARDS.map((c) => (
            <div className="tilt-parent" key={c.title} onMouseEnter={() => playSound('hover', 0.12)}>
              <div className="tilt-card">
                <div className="tilt-content">
                  <span className="card-title">{c.title}</span>
                  <p className="card-copy">{c.copy}</p>
                  <span className="see-more" onClick={() => playSound('click')}>View Report</span>
                </div>
                <div className="tilt-date">
                  <span className="month">{c.month}</span>
                  <span className="day">{c.day}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white font-headings uppercase">Deliverables that survive an audit</h3>
          <p className="pr-subheading" style={{ marginTop: 14 }}>
            Each engagement produces a tilt-interactive report card, a downloadable SARIF bundle,
            and a code-level remediation roadmap tailored to the exact frameworks detected during
            reconnaissance — hover a card to inspect it in 3D.
          </p>
        </motion.div>
      </div>

      {/* Compliance / architecture strip with the TimescaleDB security pin */}
      <div className="compliance-strip">
        <div className="compliance-head">
          <ShieldIcon /> Architecture & Compliance Guarantees
        </div>
        <div className="compliance-grid">
          {COMPLIANCE.map((c) => (
            <div className="compliance-item" key={c.k}>
              <div className="k">{c.k}</div>
              <div className="v">{c.v}</div>
            </div>
          ))}
        </div>
        <div className="compliance-pin">
          <span className="tag">SECURITY PIN</span>
          TimescaleDB pinned to <strong>&nbsp;&gt;= 2.25.2</strong>&nbsp; — mitigates&nbsp;
          <span className="cve">CVE-2026-29089</span>&nbsp; (untrusted search_path during extension upgrade).
        </div>
      </div>
    </section>
  );
}
