// ============================================
// ComES Website - Network Security Subgroup Page (Redesigned)
// ============================================

import { motion } from "framer-motion";
import { Link } from "react-router";
import { Shield, Lock, ServerCrash, Scan, KeyRound, ArrowRight } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";

const ease = [0.25, 0.46, 0.45, 0.94];

const focusAreas = [
  {
    icon: Shield,
    title: "Cybersecurity",
    desc: "Defending systems, networks, and programs from digital attacks.",
  },
  {
    icon: Scan,
    title: "Penetration Testing",
    desc: "Ethical hacking and vulnerability assessment of critical systems.",
  },
  {
    icon: Lock,
    title: "Cryptography",
    desc: "Implementing encryption algorithms and secure communication protocols.",
  },
  {
    icon: ServerCrash,
    title: "Network Infrastructure",
    desc: "Designing and securing enterprise network architectures.",
  },
];

const activities = [
  {
    icon: Shield,
    title: "CTF Competitions",
    desc: "Capture The Flag challenges to sharpen cybersecurity skills.",
  },
  {
    icon: KeyRound,
    title: "Security Workshops",
    desc: "Hands-on sessions on tools like Wireshark, Metasploit, and Burp Suite.",
  },
  {
    icon: Lock,
    title: "Awareness Campaigns",
    desc: "Promoting cybersecurity awareness across the university community.",
  },
];

const NetworkSecurityPage = () => (
  <PageTransition>
    <section className="relative overflow-hidden bg-[#050A14] py-20 lg:py-32">
      <div className="circuit-grid absolute inset-0 opacity-30" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
        >
          <Shield className="h-10 w-10 text-white" />
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
            <span className="text-accent-blue">Network Security</span>
          </div>
          <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
            Network Security
          </h1>
          <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
            Protecting digital assets and infrastructure. Exploring cybersecurity, ethical hacking,
            and secure systems design.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="bg-[#0A1628] py-20 lg:py-32">
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
                className="bg-bg-card flex items-start gap-5 rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 transition-all hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
                  <area.icon className="h-6 w-6 text-orange-400" />
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

    <section className="bg-[#050A14] py-20 lg:py-32">
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
                className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 text-center transition-all hover:border-[rgba(14,165,233,0.3)]"
              >
                <act.icon className="mx-auto mb-4 h-10 w-10 text-orange-400" />
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

    <section className="bg-[#0A1628] py-16 lg:py-24">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <FadeInView>
          <h2 className="font-display text-text-primary mb-4 text-2xl font-bold">
            Interested in Network Security?
          </h2>
          <p className="font-body text-text-secondary mb-6">
            Join our subgroup and learn to defend the digital world.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/register"
              className="font-body inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3 font-semibold text-white shadow-lg shadow-orange-500/20"
            >
              Join ComES <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </FadeInView>
      </div>
    </section>
  </PageTransition>
);

export default NetworkSecurityPage;
