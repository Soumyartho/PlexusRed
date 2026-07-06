import { useAudio } from '../../hooks/useAudio';
import './Footer.css';

const COLUMNS = [
  {
    heading: '// SERVICES',
    links: ['External Pentesting', 'API Security Audit', 'Red Team Simulation', 'Threat Intel Scan'],
  },
  {
    heading: '// PLATFORM',
    links: ['Portal Login', 'Request Access', 'Pricing Plans', 'Documentation'],
  },
  {
    heading: '// COMPANY',
    links: ['About PlexusRed', 'Research Blog', 'Contact Control', 'Careers'],
  },
];

export default function Footer() {
  const playSound = useAudio();

  return (
    <footer className="cyber-footer">
      <div className="video-overlay" />
      <video className="footer-video-bg" autoPlay muted loop playsInline>
        <source src="/videos/0101_v2.mp4" type="video/mp4" />
      </video>

      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <svg className="shield-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h2>PLEXUS RED</h2>
            </div>
            <p className="brand-desc">
              Continuous autonomous threat emulation and target intelligence. PlexusRed is built
              for modern cloud infrastructures.
            </p>
            <div className="system-status">
              <span className="status-dot" />
              <span className="status-text">ALL SYSTEMS OPERATIONAL // SECURE</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h3>{col.heading}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a onMouseEnter={() => playSound('hover', 0.1)} onClick={() => playSound('click')}>
                      <span>&gt; </span>{link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="bottom-left">
            <p>© 2026 PLEXUS RED. ALL RIGHTS RESERVED // TARGET LOCKED</p>
          </div>
          <div className="bottom-right">
            <ul className="footer-socials">
              {['GH-REPO', 'DISCORD', 'TWITTER', 'SIGNAL'].map((s) => (
                <li key={s}><a onClick={() => playSound('click')}>{s}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
