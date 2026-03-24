// ============================================
// ComES Website - Home Page (Redesigned)
// ============================================

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import {
  ArrowRight,
  ChevronDown,
  Users,
  Calendar,
  Cpu,
  Shield,
  Brain,
  GitBranch,
  Rocket,
  Mail,
  FolderGit2,
  Clock,
} from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { getFeaturedEvents, getFeaturedProjects } from "@/data";
import { cn } from "@/utils";

// ─── Ease curve used throughout ───
const ease = [0.25, 0.46, 0.45, 0.94];

// ─── Animated Counter ───
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display text-text-primary text-4xl font-bold lg:text-5xl">
      {count}
      {suffix}
    </span>
  );
};

// ─── Section 1: Hero ───
const HeroSection = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050A14]">
    {/* Animated circuit grid background */}
    <div className="circuit-grid absolute inset-0 opacity-40" />

    {/* Animated gradient orbs */}
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute top-20 left-10 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"
    />
    <motion.div
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute right-10 bottom-20 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-3xl"
    />

    <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
        {/* Left — Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="text-accent-blue mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(14,165,233,0.3)] bg-[rgba(14,165,233,0.1)] px-4 py-1.5 font-mono text-xs font-medium tracking-widest uppercase">
              Est. 2026 · UoR Faculty of Engineering
            </span>
          </motion.div>

          {/* Headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-accent-blue mb-3 font-mono text-sm tracking-[0.3em] uppercase"
          >
            Computer Engineering Society
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="font-display text-text-primary mb-2 text-5xl leading-tight font-bold md:text-7xl lg:text-8xl"
          >
            Build. Innovate.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="font-display mb-8 bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-5xl leading-tight font-bold text-transparent md:text-7xl lg:text-8xl"
          >
            Engineer the Future.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="font-body text-text-secondary mx-auto mb-10 max-w-xl text-lg leading-relaxed lg:mx-0"
          >
            University of Ruhuna · Faculty of Engineering
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/events"
                className="font-body inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40"
              >
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 inline-flex items-center gap-2 rounded-full border px-8 py-3.5 font-semibold transition-all"
              >
                Join ComES
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — Abstract geometric shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="hidden flex-1 items-center justify-center lg:flex"
        >
          <div className="relative h-80 w-80">
            {/* Rotating cube wireframe */}
            <motion.div
              animate={{ rotateY: 360, rotateX: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", perspective: "800px" }}
            >
              <div
                className="absolute inset-8 rounded-2xl border border-sky-500/30"
                style={{ transform: "translateZ(60px)" }}
              />
              <div
                className="absolute inset-8 rounded-2xl border border-cyan-500/20"
                style={{ transform: "translateZ(-60px)" }}
              />
              <div
                className="absolute inset-8 rounded-2xl border border-sky-400/15"
                style={{ transform: "rotateY(90deg) translateZ(60px)" }}
              />
            </motion.div>
            {/* Central glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-sky-500/20 blur-2xl" />
              <div className="absolute h-16 w-16 rounded-full bg-cyan-400/30 blur-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="text-text-muted h-6 w-6" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ─── Section 2: Stats Bar ───
const StatsSection = () => {
  const stats = [
    { icon: <Users className="h-5 w-5" />, value: 150, suffix: "+", label: "Members" },
    { icon: <Calendar className="h-5 w-5" />, value: 25, suffix: "+", label: "Events Held" },
    { icon: <FolderGit2 className="h-5 w-5" />, value: 12, suffix: "+", label: "Projects" },
    { icon: <Clock className="h-5 w-5" />, value: 1, suffix: "", label: "Year Active" },
  ];

  return (
    <section className="relative border-y border-[rgba(14,165,233,0.1)] bg-[#0A1628]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeInView key={stat.label} direction="up" delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="text-accent-blue mb-3">{stat.icon}</div>
                <Counter value={stat.value} suffix={stat.suffix} />
                <span className="font-body text-text-muted mt-1 text-sm">{stat.label}</span>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section 3: About Teaser ───
const AboutTeaser = () => (
  <section className="bg-[#050A14] py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <FadeInView direction="right">
          <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
            About ComES
          </p>
          <h2 className="font-display text-text-primary mb-6 text-3xl font-bold lg:text-5xl">
            Empowering Future Engineers
          </h2>
          <p className="font-body text-text-secondary mb-6 text-lg leading-relaxed">
            ComES is dedicated to creating an environment where students can thrive, innovate, and
            make meaningful contributions to the field of computer engineering. Through workshops,
            hackathons, and industry connections, we prepare students for successful careers in
            technology.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/about"
              className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 inline-flex items-center gap-2 rounded-full border px-6 py-3 font-semibold transition-all"
            >
              Read More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </FadeInView>

        <FadeInView direction="left">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "Our Mission",
                text: "Empower students through innovation and collaboration in computer engineering.",
              },
              {
                title: "Our Vision",
                text: "A globally connected community of tech leaders from University of Ruhuna.",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-accent-blue mb-3 text-sm font-bold tracking-wider">
                  {card.title}
                </h3>
                <p className="font-body text-text-secondary text-sm">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </FadeInView>
      </div>
    </div>
  </section>
);

// ─── Section 4: Subgroups ───
const SubgroupsSection = () => {
  const subgroups = [
    {
      icon: <GitBranch className="h-7 w-7" />,
      name: "Software Engineering",
      desc: "Web, mobile, DevOps, and software architecture.",
      href: "/subgroups/software-engineering",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Brain className="h-7 w-7" />,
      name: "AI & Data Science",
      desc: "Machine learning, deep learning, and data analytics.",
      href: "/subgroups/ai-data-science",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: <Cpu className="h-7 w-7" />,
      name: "Embedded Electronics",
      desc: "Microcontrollers, PCB design, robotics, and IoT.",
      href: "/subgroups/embedded-electronics",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Shield className="h-7 w-7" />,
      name: "Network Security",
      desc: "Cybersecurity, pentesting, and cryptography.",
      href: "/subgroups/network-security",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section className="bg-[#0A1628] py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Our Subgroups
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Specialized Divisions
            </h2>
          </div>
        </FadeInView>

        <div className="grid gap-6 md:grid-cols-2">
          {subgroups.map((sg, i) => (
            <FadeInView key={sg.name} direction="up" delay={i * 0.1}>
              <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ ease }}>
                <Link
                  to={sg.href}
                  className="group bg-bg-card flex items-start gap-5 rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 transition-all hover:border-[rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
                      sg.gradient,
                    )}
                  >
                    {sg.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-text-primary mb-1 text-lg font-semibold">
                      {sg.name}
                    </h3>
                    <p className="font-body text-text-secondary text-sm">{sg.desc}</p>
                  </div>
                  <ArrowRight className="text-text-muted group-hover:text-accent-blue mt-1 h-5 w-5 shrink-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section 5: Featured Events ───
const FeaturedEvents = () => {
  const events = getFeaturedEvents(3);

  return (
    <section className="bg-[#050A14] py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Events
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Upcoming & Recent Events
            </h2>
          </div>
        </FadeInView>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <FadeInView key={event.id} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-bg-card flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(14,165,233,0.15)] transition-all hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
              >
                {/* Image placeholder */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://placehold.co/600x300/0D1E35/0EA5E9?text=${encodeURIComponent(event.title)}`}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-accent-blue/90 rounded-full px-3 py-1 font-mono text-xs font-medium text-white">
                      {event.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1 backdrop-blur-sm">
                    <Calendar className="text-accent-blue h-3.5 w-3.5" />
                    <span className="font-body text-xs text-white">{event.date}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                    {event.title}
                  </h3>
                  <p className="font-body text-text-secondary mb-4 line-clamp-2 flex-1 text-sm">
                    {event.description}
                  </p>
                  <Link
                    to="/events"
                    className="font-body text-accent-blue hover:text-accent-cyan inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    Learn More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/events"
              className="font-body inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-sky-500/20"
            >
              View All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Section 6: Featured Projects ───
const FeaturedProjects = () => {
  const projects = getFeaturedProjects(3);

  return (
    <section className="bg-[#0A1628] py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Projects
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              What We&apos;re Building
            </h2>
          </div>
        </FadeInView>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <FadeInView key={project.id} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-bg-card flex h-full flex-col rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 transition-all hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-accent-blue/15 text-accent-blue rounded-full px-3 py-1 font-mono text-xs">
                    {project.status}
                  </span>
                  <span className="font-body text-text-muted text-xs">{project.category}</span>
                </div>
                <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                  {project.title}
                </h3>
                <p className="font-body text-text-secondary mb-4 flex-1 text-sm">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-text-secondary rounded-lg border border-[rgba(14,165,233,0.15)] bg-white/5 px-2 py-0.5 font-mono text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/projects"
              className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 inline-flex items-center gap-2 rounded-full border px-8 py-3 font-semibold transition-all"
            >
              Explore Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Section 7: Team Spotlight ───
const TeamSpotlight = () => {
  const team = [
    { name: "President", img: "https://placehold.co/120x120/0D1E35/0EA5E9?text=P" },
    { name: "Vice President", img: "https://placehold.co/120x120/0D1E35/0EA5E9?text=VP" },
    { name: "Secretary", img: "https://placehold.co/120x120/0D1E35/0EA5E9?text=S" },
    { name: "Treasurer", img: "https://placehold.co/120x120/0D1E35/0EA5E9?text=T" },
    { name: "Tech Lead", img: "https://placehold.co/120x120/0D1E35/0EA5E9?text=TL" },
    { name: "Event Lead", img: "https://placehold.co/120x120/0D1E35/0EA5E9?text=EL" },
  ];

  return (
    <section className="bg-[#050A14] py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Our Team
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Meet the Executive Committee
            </h2>
          </div>
        </FadeInView>

        <div className="flex justify-center gap-6 overflow-x-auto pb-4">
          {team.map((member, i) => (
            <FadeInView key={member.name} direction="up" delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex flex-col items-center"
              >
                <div className="hover:border-accent-blue mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-[rgba(14,165,233,0.3)] transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <span className="font-body text-text-secondary text-sm font-medium">
                  {member.name}
                </span>
              </motion.div>
            </FadeInView>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/team"
            className="font-body text-accent-blue text-sm font-medium hover:underline"
          >
            View Full Team →
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Section 8: Blog Posts ───
const BlogSection = () => {
  const posts = [
    {
      title: "Getting Started with Embedded Systems",
      date: "Mar 2026",
      category: "Tutorial",
      excerpt: "A beginner's guide to microcontroller programming and circuit design.",
    },
    {
      title: "AI in Sri Lankan Agriculture",
      date: "Feb 2026",
      category: "Research",
      excerpt: "How machine learning can improve crop yield prediction in tropical climates.",
    },
    {
      title: "Web Security Best Practices",
      date: "Jan 2026",
      category: "Security",
      excerpt: "Essential security patterns every web developer should implement.",
    },
  ];

  return (
    <section className="bg-[#0A1628] py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Blog
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Latest from ComES
            </h2>
          </div>
        </FadeInView>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <FadeInView key={post.title} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-bg-card flex h-full flex-col rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 transition-all hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-accent-blue/15 text-accent-blue rounded-full px-3 py-1 font-mono text-xs">
                    {post.category}
                  </span>
                  <span className="font-body text-text-muted text-xs">{post.date}</span>
                </div>
                <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                  {post.title}
                </h3>
                <p className="font-body text-text-secondary mb-4 flex-1 text-sm">{post.excerpt}</p>
                <Link
                  to="/blog"
                  className="font-body text-accent-blue inline-flex items-center gap-1 text-sm font-medium"
                >
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section 9: CTA Banner ───
const CTABanner = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-sky-900/40 via-[#0A1628] to-cyan-900/30 py-20 lg:py-28">
    {/* Animated gradient mesh bg */}
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 5, repeat: Infinity }}
      className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-cyan-500/10"
    />

    <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
      <FadeInView>
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30">
          <Rocket className="h-7 w-7 text-white" />
        </div>
        <h2 className="font-display text-text-primary mb-6 text-3xl font-bold lg:text-5xl">
          Ready to Build the Future?
        </h2>
        <p className="font-body text-text-secondary mb-8 text-lg">
          Join a vibrant community of passionate engineers. Learn, grow, and make lasting
          connections.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              className="font-body inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/25"
            >
              Register as Student
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 inline-flex items-center gap-2 rounded-full border px-8 py-3.5 font-semibold transition-all"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </FadeInView>
    </div>
  </section>
);

// ─── Section 10: Newsletter ───
const NewsletterSection = () => (
  <section className="bg-[#050A14] py-20 lg:py-28">
    <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
      <FadeInView>
        <div className="bg-accent-blue/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(14,165,233,0.2)]">
          <Mail className="text-accent-blue h-6 w-6" />
        </div>
        <h2 className="font-display text-text-primary mb-3 text-2xl font-bold">Stay in the Loop</h2>
        <p className="font-body text-text-secondary mb-8">
          Get updates on events, projects, and opportunities from ComES.
        </p>
        <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-bg-card font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue flex-1 rounded-full border border-[rgba(14,165,233,0.2)] px-6 py-3 text-sm transition-colors outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="font-body rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20"
          >
            Subscribe
          </motion.button>
        </form>
      </FadeInView>
    </div>
  </section>
);

// ─── Main HomePage ───
export const HomePage = () => {
  return (
    <PageTransition>
      <HeroSection />
      <StatsSection />
      <AboutTeaser />
      <SubgroupsSection />
      <FeaturedEvents />
      <FeaturedProjects />
      <TeamSpotlight />
      <BlogSection />
      <CTABanner />
      <NewsletterSection />
    </PageTransition>
  );
};

export default HomePage;
