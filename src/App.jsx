import { lazy, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import BGGrid from './components/BGGrid/BGGrid';
import Navbar from './components/Navbar/Navbar';
import ModernHero from './components/ModernHero/ModernHero';
import SwarmWorkflow from './components/Swarm/SwarmWorkflow';
import BrandingBanner from './components/BrandingBanner/BrandingBanner';
import Reports from './components/Reports/Reports';
import Pricing from './components/Pricing/Pricing';
import Footer from './components/Footer/Footer';

// Heavy, below-the-fold sections are code-split so WebGL (three/fiber/drei)
// and React Flow (xyflow/d3) stay out of the initial bundle (PRD §7).
const Showcase = lazy(() => import('./components/Showcase/Showcase'));
const Scanner = lazy(() => import('./components/Scanner/Scanner'));
const AttackPath = lazy(() => import('./components/AttackPath/AttackPath'));

const SectionFallback = ({ label }) => (
  <div
    style={{
      minHeight: 480,
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'monospace',
      letterSpacing: '0.25em',
      color: '#FFDE42',
      fontSize: 12,
      opacity: 0.7,
    }}
  >
    ▸ LOADING {label}…
  </div>
);

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {/* Fixed cybernetic shader grid behind everything */}
      <BGGrid />

      {/* Sticky navigation */}
      <Navbar />

      <main>
        {/* Parallax hero + assessment timeline */}
        <ModernHero />

        {/* 4-phase AI swarm workflow */}
        <SwarmWorkflow />

        {/* 3D Mecha showcase + floating D.S.E.V drone */}
        <Suspense fallback={<SectionFallback label="PLATFORM" />}>
          <Showcase />
        </Suspense>

        {/* Target domain simulator + surveillance drone */}
        <Suspense fallback={<SectionFallback label="SCANNER" />}>
          <Scanner />
        </Suspense>

        {/* Center-fold branding banner (Text_bg.mp4) — between scanner & metrics */}
        <BrandingBanner />

        {/* Threat metrics + 3D tilt report cards + compliance strip */}
        <Reports />

        {/* React Flow interactive attack paths */}
        <Suspense fallback={<SectionFallback label="ATTACK PATHS" />}>
          <AttackPath />
        </Suspense>

        {/* SaaS pricing matrix */}
        <Pricing />
      </main>

      {/* Binary-rain footer (0101_v2.mp4) */}
      <Footer />
    </ReactLenis>
  );
}
