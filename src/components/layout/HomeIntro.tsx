import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Brain, Cpu, GitBranch, Shield } from "lucide-react";
import { motion } from "framer-motion";

const domains = [
  { title: "Software Engineering", icon: GitBranch, href: "/subgroups/software-engineering" },
  { title: "AI & Data Science", icon: Brain, href: "/subgroups/ai-data-science" },
  { title: "Electronics & Embedded Systems", icon: Cpu, href: "/subgroups/embedded-electronics" },
  { title: "Network & Cyber Security", icon: Shield, href: "/subgroups/network-security" },
];

export const HomeIntro = () => (
  <>
    <section className="site-home-hero">
      <img
        src="/engineering-board.jpg"
        alt="Electronic components on a circuit board"
        fetchPriority="high"
        className="site-home-photo"
      />
      <div className="site-home-shade" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <p className="mb-5 text-xs font-semibold text-white/85">
          FACULTY OF ENGINEERING / UNIVERSITY OF RUHUNA
        </p>
        <h1>ComES</h1>
        <p className="site-home-subtitle">Computer Engineering Society</p>
        <p className="site-home-description">
          A student community exploring ideas, building connections, and creating practical
          solutions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="site-button site-home-join inline-flex items-center gap-3"
          >
            Join ComES <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link to="/about" className="site-button site-home-about inline-flex items-center gap-3">
            About ComES <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
    <nav aria-label="Engineering subgroups" className="site-domain-band">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {domains.map(({ title, icon: Icon, href }) => (
          <Link key={href} to={href} className="site-domain-link">
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span>{title}</span>
            <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0" />
          </Link>
        ))}
      </div>
    </nav>
  </>
);
