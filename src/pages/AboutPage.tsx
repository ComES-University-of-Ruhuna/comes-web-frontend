// ============================================
// ComES Website - About Page (Redesigned)
// ============================================

import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Target,
  Eye,
  Lightbulb,
  Users,
  Heart,
  Globe,
  Rocket,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";

const ease = [0.25, 0.46, 0.45, 0.94];

// Hero Section
const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#050A14] py-20 lg:py-32">
    <div className="circuit-grid absolute inset-0 opacity-30" />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
    />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="text-center"
      >
        {/* Breadcrumb */}
        <div className="font-body text-text-muted mb-6 flex items-center justify-center gap-2 text-sm">
          <Link to="/" className="hover:text-accent-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-accent-blue">About</span>
        </div>

        <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
          About ComES
        </h1>
        <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
          The Computer Engineering Society empowering the next generation of engineers at the
          University of Ruhuna, Faculty of Engineering.
        </p>
      </motion.div>
    </div>
  </section>
);

// Mission & Vision
const MissionVision = () => (
  <section className="bg-[#0A1628] py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <FadeInView direction="right">
          <motion.div whileHover={{ scale: 1.01, y: -2 }} className="glass h-full rounded-2xl p-8">
            <div className="bg-accent-blue/10 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl">
              <Target className="text-accent-blue h-6 w-6" />
            </div>
            <h2 className="font-display text-text-primary mb-4 text-2xl font-bold">Our Mission</h2>
            <p className="font-body text-text-secondary leading-relaxed">
              To empower computer engineering students with the knowledge, skills, and connections
              needed to excel in the ever-evolving tech landscape. We foster innovation through
              hands-on learning, collaborative projects, industry engagement, and a culture of
              excellence.
            </p>
          </motion.div>
        </FadeInView>

        <FadeInView direction="left" delay={0.1}>
          <motion.div whileHover={{ scale: 1.01, y: -2 }} className="glass h-full rounded-2xl p-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
              <Eye className="h-6 w-6 text-cyan-400" />
            </div>
            <h2 className="font-display text-text-primary mb-4 text-2xl font-bold">Our Vision</h2>
            <p className="font-body text-text-secondary leading-relaxed">
              To become the leading student engineering society in Sri Lanka, recognized for
              producing innovative thinkers, industry-ready engineers, and tech leaders who drive
              meaningful change in society through technology.
            </p>
          </motion.div>
        </FadeInView>
      </div>
    </div>
  </section>
);

// History Timeline
const HistoryTimeline = () => {
  const milestones = [
    {
      year: "2026",
      title: "ComES Founded",
      desc: "Computer Engineering Society established at the Faculty of Engineering, University of Ruhuna.",
    },
    {
      year: "2026",
      title: "First Workshop Series",
      desc: "Launched a successful series of technical workshops covering web development and IoT.",
    },
    {
      year: "2026",
      title: "Subgroups Formed",
      desc: "Established four specialized subgroups: Software Engineering, AI & Data Science, Embedded Electronics, and Network Security.",
    },
    {
      year: "2026",
      title: "First Hackathon",
      desc: "Organized our inaugural inter-university hackathon with participants from across Sri Lanka.",
    },
  ];

  return (
    <section className="bg-[#050A14] py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-16 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Our Journey
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              History & Milestones
            </h2>
          </div>
        </FadeInView>

        <div className="relative">
          {/* Vertical line */}
          <div className="from-accent-blue/40 via-accent-blue/20 absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b to-transparent" />

          {milestones.map((milestone, i) => (
            <FadeInView key={i} direction={i % 2 === 0 ? "right" : "left"} delay={i * 0.15}>
              <div
                className={`mb-12 flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-bg-card inline-block rounded-2xl border border-[rgba(14,165,233,0.15)] p-6"
                  >
                    <span className="text-accent-blue mb-2 block font-mono text-sm">
                      {milestone.year}
                    </span>
                    <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                      {milestone.title}
                    </h3>
                    <p className="font-body text-text-secondary text-sm">{milestone.desc}</p>
                  </motion.div>
                </div>
                {/* Dot */}
                <div className="bg-accent-blue relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full shadow-[0_0_12px_rgba(14,165,233,0.5)]" />
                <div className="flex-1" />
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

// Values Grid
const ValuesSection = () => {
  const values = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      desc: "Encouraging creative solutions through technology.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      desc: "Working together to achieve greatness.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Learning",
      desc: "Continuous growth through knowledge sharing.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passion",
      desc: "Driven by passion for engineering excellence.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Community",
      desc: "Building a strong, inclusive tech community.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Excellence",
      desc: "Striving for the highest standards in everything.",
    },
  ];

  return (
    <section className="bg-[#0A1628] py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              What Drives Us
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Our Core Values
            </h2>
          </div>
        </FadeInView>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <FadeInView key={v.title} direction="up" delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 text-center transition-all hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
              >
                <div className="bg-accent-blue/10 text-accent-blue mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  {v.icon}
                </div>
                <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="font-body text-text-secondary text-sm">{v.desc}</p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

// Faculty Affiliation
const FacultySection = () => (
  <section className="bg-[#050A14] py-20 lg:py-28">
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <FadeInView>
        <motion.div whileHover={{ scale: 1.01 }} className="glass rounded-2xl p-10">
          <div className="bg-accent-blue/10 mb-4 inline-block rounded-xl border border-[rgba(14,165,233,0.2)] p-3">
            <img
              src="https://placehold.co/80x80/0D1E35/0EA5E9?text=UoR"
              alt="University of Ruhuna"
              className="h-14 w-14 rounded-lg"
            />
          </div>
          <h3 className="font-display text-text-primary mb-3 text-xl font-bold">
            Faculty of Engineering
          </h3>
          <p className="font-body text-text-secondary mb-4">
            ComES operates under the Faculty of Engineering at the University of Ruhuna, Hapugala,
            Galle, Sri Lanka. We are recognized as the official student society for the Department
            of Computer Engineering.
          </p>
          <Link
            to="/contact"
            className="font-body text-accent-blue inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            Get in Touch <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </FadeInView>
    </div>
  </section>
);

// Main
export const AboutPage = () => (
  <PageTransition>
    <HeroSection />
    <MissionVision />
    <HistoryTimeline />
    <ValuesSection />
    <FacultySection />
  </PageTransition>
);

export default AboutPage;
