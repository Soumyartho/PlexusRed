import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useAudio } from '../../hooks/useAudio';
import './Pricing.css';

const TIERS = [
  {
    tier: 'Essential',
    audience: 'Series A SaaS · Lean DevSecOps',
    num: '$1,200',
    per: '/ year',
    featured: false,
    cta: 'Start Emulating',
    ctaSolid: false,
    features: [
      'Weekly autonomous web & API scans',
      'Standard React Flow attack-path reporting',
      'Basic compliance tracking',
      'Email + dashboard alerting',
      'Community Nuclei template library',
    ],
  },
  {
    tier: 'Professional',
    audience: 'Mid-market SaaS · FinTech · HealthTech',
    num: '$300',
    per: '/ month · per app',
    featured: true,
    cta: 'Request Access',
    ctaSolid: true,
    features: [
      'Continuous CI/CD-triggered scanning',
      'Zero-false-positive OOB (Interactsh) validation',
      'Deep integrations — Jira, Slack, SARIF exports',
      'Asset-based scaling across environments',
      'Priority swarm queue + human triage',
    ],
  },
  {
    tier: 'Enterprise',
    audience: 'Large Enterprises · Regulated Sectors',
    num: 'Custom',
    per: 'quoted / node-based',
    featured: false,
    cta: 'Talk to Sales',
    ctaSolid: false,
    features: [
      'Full AI Swarm access',
      'R3F Threat Theater — 3D particle topology',
      '180-day compliance log storage',
      'Dedicated Human-in-the-Loop approval panels',
      'Private, internal-network agents',
    ],
  },
];

export default function Pricing() {
  const playSound = useAudio();

  return (
    <section id="pricing" className="pricing pr-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <span className="pr-eyebrow">Scalable Subscriptions</span>
        <h2 className="pr-heading" style={{ marginInline: 'auto' }}>Pricing built to<br />replace the annual audit</h2>
        <p className="pr-subheading" style={{ marginInline: 'auto' }}>
          Predictable, recurring access to elite offensive security — priced to undercut slow
          manual consultancies while scaling with your surface.
        </p>
      </motion.div>

      <div className="pricing-grid">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.tier}
            className={`price-card ${t.featured ? 'featured' : ''}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            onMouseEnter={() => playSound('hover', 0.14)}
          >
            <div className="price-inner">
              <div className="price-tier">{t.tier}</div>
              <div className="price-audience">{t.audience}</div>
              <div className="price-amount">
                <span className="num">{t.num}</span>
                <span className="per">{t.per}</span>
              </div>
            </div>

            <ul className="price-features">
              {t.features.map((f) => (
                <li key={f}><FiCheck size={16} /> {f}</li>
              ))}
            </ul>

            <button
              className={`price-cta ${t.ctaSolid ? 'solid' : ''}`}
              onClick={() => playSound('confirm')}
            >
              {t.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
