import { motion } from 'framer-motion';
import './BrandingBanner.css';

/**
 * BrandingBanner — center-fold transition (PRD §4.6).
 * Text_bg.mp4 loops behind a massive gold "PLEXUS RED" headline.
 * Placed between the Scanner simulator and the metrics grids.
 */
export default function BrandingBanner() {
  return (
    <section className="branding-banner" aria-label="PlexusRed">
      <div className="branding-video-layer">
        <video
          className="branding-video-bg"
          src="/videos/Text_bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className="branding-video-mask" />

      <motion.div
        className="branding-foreground"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <h2 className="headline">PLEXUS RED</h2>
        <p className="sub">Continuous · Autonomous · Red Teaming</p>
      </motion.div>
    </section>
  );
}
