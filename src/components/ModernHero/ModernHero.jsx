import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { FiArrowRight, FiMapPin, FiShield } from 'react-icons/fi';
import './ModernHero.css';

const SECTION_HEIGHT = 1500;

export default function ModernHero() {
  return (
    <div id="hero" className="hero-wrap">
      <Hero />
      <Schedule />
    </div>
  );
}

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterVideo />
      <HeroCopy />
      <ParallaxPanels />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
};

const HeroCopy = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <motion.div className="hero-headline" style={{ opacity, y }}>
      <span className="kicker">Continuous Autonomous Red Teaming</span>
      <h1>
        Emulate the breach.<br />
        <span className="accent">Prove the exposure.</span>
      </h1>
      <p>
        PlexusRed orchestrates a swarm of specialized AI agents to run continuous
        penetration tests with deterministic, zero-false-positive out-of-band validation —
        the velocity of automation with the safety of human-in-the-loop control.
      </p>
    </motion.div>
  );
};

const CenterVideo = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const scale = useTransform(scrollY, [0, SECTION_HEIGHT + 500], [1.7, 1]);
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full overflow-hidden"
      style={{ clipPath, opacity }}
    >
      <motion.video
        src="/videos/Hero_video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        style={{ scale }}
      />
      <div className="pointer-events-none absolute inset-0 bg-background/30" />
    </motion.div>
  );
};

const PANELS = [
  {
    cls: 'px-1',
    title: 'recon.agent',
    start: -200,
    end: 200,
    body: (
      <>
        <div><span className="k">$</span> nmap -sV target</div>
        <div>443/tcp open  https</div>
        <div>5432/tcp open <span className="k"> postgres</span></div>
        <div>subfinder ▸ 42 hosts</div>
      </>
    ),
  },
  {
    cls: 'px-2 media',
    media: '/videos/globe_network.mp4',
    start: 200,
    end: -250,
  },
  {
    cls: 'px-3',
    title: 'exploit.agent',
    start: -200,
    end: 200,
    body: (
      <>
        <div><span className="k">OOB</span> interactsh armed</div>
        <div>payload ▸ blind-ssrf</div>
        <div className="warn">DNS callback ✓ proven</div>
        <div>sandbox ▸ destroyed</div>
      </>
    ),
  },
  {
    cls: 'px-4',
    title: 'report.agent',
    start: 0,
    end: -500,
    body: (
      <>
        <div><span className="k">SARIF</span> export ready</div>
        <div>severity ▸ critical x3</div>
        <div>remediation ▸ generated</div>
        <div>pushed ▸ CI/CD gate</div>
      </>
    ),
  },
];

const ParallaxPanels = () => (
  <div className="parallax-stage">
    {PANELS.map((p, i) => (
      <ParallaxPanel key={i} {...p} />
    ))}
  </div>
);

const ParallaxPanel = ({ cls, title, body, media, start, end }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div ref={ref} className={`px-panel ${cls}`} style={{ transform, opacity }}>
      {media ? (
        <video src={media} autoPlay muted loop playsInline />
      ) : (
        <>
          <div className="panel-head">
            <span>{title}</span>
            <span className="dot-row"><i className="live" /><i /><i /></span>
          </div>
          <div className="panel-body">{body}</div>
        </>
      )}
    </motion.div>
  );
};

const Schedule = () => {
  return (
    <section
      id="assessment-timeline"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
        className="mb-20"
      >
        <span className="pr-eyebrow flex items-center gap-2">
          <FiShield /> Engagement Schedule
        </span>
        <h2 className="mt-3 text-4xl font-black uppercase text-primary font-headings">
          Assessment Timeline
        </h2>
      </motion.div>

      <ScheduleItem title="External Penetration Test" date="July 12th" location="Staging Environment" />
      <ScheduleItem title="API Security Assessment" date="July 24th" location="Cloud Gateway" />
      <ScheduleItem title="Social Engineering Drill" date="Aug 10th" location="Corporate Directory" />
      <ScheduleItem title="Internal Active Directory Audit" date="Aug 28th" location="HQ Corporate Network" />
      <ScheduleItem title="Red Team Simulation" date="Sept 15th" location="Production Infrastructure" />
      <ScheduleItem title="Compliance Scan" date="Oct 05th" location="SOC2 Trust Criteria" />
      <ScheduleItem title="Full Vulnerability Audit" date="Oct 20th" location="All Endpoints" />
    </section>
  );
};

const ScheduleItem = ({ title, date, location }) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-tertiary px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};
