// ============================================
// ComES Website - AI & Data Science Subgroup Page (Redesigned)
// ============================================

import { motion } from "framer-motion";
import { Link } from "react-router";
import { Brain, BarChart3, Database, Cpu, Network, ArrowRight } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";

const ease = [0.25, 0.46, 0.45, 0.94];

const focusAreas = [
  {
    icon: Brain,
    title: "Machine Learning",
    desc: "Building intelligent models for prediction, classification, and automation.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    desc: "Extracting insights from complex datasets using statistical methods.",
  },
  {
    icon: Network,
    title: "Deep Learning",
    desc: "Neural networks, computer vision, and natural language processing.",
  },
  {
    icon: Database,
    title: "Data Engineering",
    desc: "Building data pipelines, ETL processes, and data warehousing solutions.",
  },
];

const activities = [
  {
    icon: Brain,
    title: "ML Workshops",
    desc: "Hands-on workshops covering scikit-learn, TensorFlow, and PyTorch.",
  },
  {
    icon: BarChart3,
    title: "Kaggle Competitions",
    desc: "Team participation in data science competitions and challenges.",
  },
  {
    icon: Cpu,
    title: "Research Projects",
    desc: "Collaborative research in AI applications for Sri Lankan context.",
  },
];

const AIDataSciencePage = () => (
  <PageTransition>
    <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-32">
      <div className="circuit-grid absolute inset-0 opacity-30" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30"
        >
          <Brain className="h-10 w-10 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="font-body text-text-muted mb-6 flex items-center justify-center gap-2 text-sm">
            <Link to="/" className="hover:text-accent-blue">
              Home
            </Link>
            <span>/</span>
            <span className="text-accent-blue">AI & Data Science</span>
          </div>
          <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
            AI & Data Science
          </h1>
          <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
            Unlocking intelligence from data. Exploring the frontiers of artificial intelligence and
            machine learning.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="bg-bg-secondary py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              Expertise
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Focus Areas
            </h2>
          </div>
        </FadeInView>
        <div className="grid gap-6 md:grid-cols-2">
          {focusAreas.map((area, i) => (
            <FadeInView key={area.title} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-bg-card flex items-start gap-5 rounded-2xl border border-border-d p-6 transition-all hover:border-border-h hover:shadow-glow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                  <area.icon className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-display text-text-primary mb-1 text-lg font-semibold">
                    {area.title}
                  </h3>
                  <p className="font-body text-text-secondary text-sm">{area.desc}</p>
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-bg-primary py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView>
          <div className="mb-12 text-center">
            <p className="text-accent-blue mb-4 font-mono text-sm tracking-widest uppercase">
              What We Do
            </p>
            <h2 className="font-display text-text-primary text-3xl font-bold lg:text-5xl">
              Activities
            </h2>
          </div>
        </FadeInView>
        <div className="grid gap-6 md:grid-cols-3">
          {activities.map((act, i) => (
            <FadeInView key={act.title} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-bg-card rounded-2xl border border-border-d p-6 text-center transition-all hover:border-border-h"
              >
                <act.icon className="mx-auto mb-4 h-10 w-10 text-violet-400" />
                <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                  {act.title}
                </h3>
                <p className="font-body text-text-secondary text-sm">{act.desc}</p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <FadeInView>
          <h2 className="font-display text-text-primary mb-4 text-2xl font-bold">
            Interested in AI & Data Science?
          </h2>
          <p className="font-body text-text-secondary mb-6">
            Join our subgroup and explore the world of artificial intelligence.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/register"
              className="font-body inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3 font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              Join ComES <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </FadeInView>
      </div>
    </section>
  </PageTransition>
);

export default AIDataSciencePage;
