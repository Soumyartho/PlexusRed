import { useEffect, useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Services', target: 'swarm', caret: true },
  { label: 'Platform', target: 'showcase', caret: true },
  { label: 'Attack Paths', target: 'attack-paths', caret: true },
  { label: 'Pricing', target: 'pricing', caret: false },
];

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  const playSound = useAudio();
  const [scrolled, setScrolled] = useState(false);
  const [announce, setAnnounce] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    playSound('click');
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`pr-nav-fixed ${scrolled ? 'scrolled' : ''}`}>
      {announce && (
        <div className="announcement-bar">
          <span>PlexusRed On-Demand Autonomous Testing Platform Is Now Live</span>
          <a href="#showcase" onClick={(e) => { e.preventDefault(); go('showcase'); }}>
            Learn More
          </a>
          <button
            className="close-btn"
            aria-label="Dismiss announcement"
            onClick={() => { playSound('close'); setAnnounce(false); }}
          >
            &#10005;
          </button>
        </div>
      )}

      <nav className="pr-navbar">
        <div className="logo" onClick={() => go('hero')}>
          <div className="logo-icon" aria-hidden="true">
            <span></span>
            <span></span>
          </div>
          <h2>PlexusRed</h2>
        </div>

        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li
              key={l.label}
              onMouseEnter={() => playSound('hover', 0.16)}
              onClick={() => go(l.target)}
            >
              {l.label}
              {l.caret && <span className="caret">⌄</span>}
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            className="btn-outline"
            onMouseEnter={() => playSound('hover', 0.16)}
            onClick={() => go('scanner')}
          >
            Portal
          </button>
          <button
            className="btn-dark"
            onMouseEnter={() => playSound('hover', 0.16)}
            onClick={() => go('pricing')}
          >
            Contact
          </button>
        </div>

        <button
          className="nav-burger"
          aria-label="Toggle menu"
          onClick={() => { playSound('click'); setMenuOpen((o) => !o); }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <ul className={`pr-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <li key={l.label} onClick={() => go(l.target)}>{l.label}</li>
        ))}
        <div className="mobile-cta">
          <button className="btn-outline" onClick={() => go('scanner')}>Portal</button>
          <button className="btn-dark" onClick={() => go('pricing')}>Contact</button>
        </div>
      </ul>
    </header>
  );
}
