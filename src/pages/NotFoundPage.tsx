// ============================================
// ComES Website - 404 Not Found Page (Redesigned)
// ============================================

import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";
import { PageTransition } from "@/components/ui";

const ease = [0.25, 0.46, 0.45, 0.94];

export const NotFoundPage = () => (
  <PageTransition>
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050A14]">
      <div className="circuit-grid absolute inset-0 opacity-30" />

      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-xl px-4 text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease }}
        >
          <h1 className="font-display mb-4 bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-[10rem] leading-none font-bold text-transparent">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <h2 className="font-display text-text-primary mb-4 text-2xl font-bold lg:text-3xl">
            Page Not Found
          </h2>
          <p className="font-body text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved to a different URL.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
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
            <button
              onClick={() => window.history.back()}
              className="border-accent-blue/50 font-body text-accent-blue hover:bg-accent-blue/10 inline-flex items-center gap-2 rounded-full border px-8 py-3 font-semibold transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  </PageTransition>
);

export default NotFoundPage;
