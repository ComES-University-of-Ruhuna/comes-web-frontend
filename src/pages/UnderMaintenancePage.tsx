// ============================================
// ComES Website - Under Maintenance Page (Redesigned)
// ============================================

import { motion } from "framer-motion";
import { Link } from "react-router";
import { Wrench, Home, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

const ease = [0.25, 0.46, 0.45, 0.94];

export const UnderMaintenancePage = () => (
  <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="circuit-grid absolute inset-0 opacity-20" />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
      />
    </div>

    <div className="relative z-10 mx-auto max-w-xl text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30"
      >
        <Wrench className="h-10 w-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <h1 className="font-display text-text-primary mb-4 text-4xl font-bold lg:text-5xl">
          Under Maintenance
        </h1>
        <p className="font-body text-text-secondary mb-8 text-lg">
          We're currently performing scheduled maintenance to improve your experience. We'll be back
          shortly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease }}
        className="flex flex-col justify-center gap-4 sm:flex-row"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/"
            className="font-body inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-sky-500/25"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 inline-flex items-center gap-2 rounded-full border px-8 py-3 font-semibold transition-all"
          >
            <Mail className="h-4 w-4" />
            Contact Us
          </a>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

export default UnderMaintenancePage;
