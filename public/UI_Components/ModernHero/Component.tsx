import { ReactLenis } from "lenis/dist/lenis-react";
import {
    motion,
    useMotionTemplate,
    useScroll,
    useTransform,
} from "framer-motion";
import { FiArrowRight, FiMapPin, FiShield } from "react-icons/fi";
import { useRef } from "react";

export const SmoothScrollHero = () => {
    return (
        <div className="bg-zinc-950">

            <Nav />
            <Hero />
            <Schedule />

        </div>
    );
};

const Nav = () => {
    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white">
            <div className="flex items-center gap-2 mix-blend-difference">
                <FiShield className="text-3xl text-[#FFDE42]" />
                <span className="font-bold tracking-wider font-mono text-[#FFDE42]">PLEXUS RED</span>
            </div>
            <button
                onClick={() => {
                    document.getElementById("assessment-timeline")?.scrollIntoView({
                        behavior: "smooth",
                    });
                }}
                className="flex items-center gap-1 text-xs text-[#FFDE42] font-semibold tracking-widest"
            >
                ASSESSMENT TIMELINE <FiArrowRight />
            </button>
        </nav>
    );
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
    return (
        <div
            style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
            className="relative w-full"
        >
            <CenterImage />

            <ParallaxImages />

            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
        </div>
    );
};

const CenterImage = () => {
    const { scrollY } = useScroll();

    const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
    const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

    const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

    const backgroundSize = useTransform(
        scrollY,
        [0, SECTION_HEIGHT + 500],
        ["170%", "100%"]
    );
    const opacity = useTransform(
        scrollY,
        [SECTION_HEIGHT, SECTION_HEIGHT + 500],
        [1, 0]
    );

    return (
        <motion.div
            className="sticky top-0 h-screen w-full"
            style={{
                clipPath,
                backgroundSize,
                opacity,
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        />
    );
};

const ParallaxImages = () => {
    return (
        <div className="mx-auto max-w-5xl px-4 pt-[200px]">
            <ParallaxImg
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                alt="Cyber security concept"
                start={-200}
                end={200}
                className="w-1/3"
            />
            <ParallaxImg
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop"
                alt="Cyber assessment data"
                start={200}
                end={-250}
                className="mx-auto w-2/3"
            />
            <ParallaxImg
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2370&auto=format&fit=crop"
                alt="Digital code grid"
                start={-200}
                end={200}
                className="ml-auto w-1/3"
            />
            <ParallaxImg
                src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2670&auto=format&fit=crop"
                alt="Network hardware"
                start={0}
                end={-500}
                className="ml-24 w-5/12"
            />
        </div>
    );
};

const ParallaxImg = ({ className, alt, src, start, end }) => {
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
        <motion.img
            src={src}
            alt={alt}
            className={className}
            ref={ref}
            style={{ transform, opacity }}
        />
    );
};

const Schedule = () => {
    return (
        <section
            id="assessment-timeline"
            className="mx-auto max-w-5xl px-4 py-48 text-white"
        >
            <motion.h1
                initial={{ y: 48, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.75 }}
                className="mb-20 text-4xl font-black uppercase text-[#FFDE42]"
            >
                Assessment Timeline
            </motion.h1>
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
            transition={{ ease: "easeInOut", duration: 0.75 }}
            className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
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