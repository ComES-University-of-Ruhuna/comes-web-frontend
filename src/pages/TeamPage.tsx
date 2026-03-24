// ============================================
// ComES Website - Team Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Linkedin, Mail } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { teamCategories, getTeamByCategory } from "@/data";
import type { TeamMember } from "@/types";

const ease = [0.25, 0.46, 0.45, 0.94];

const MemberCard = ({ member, large = false }: { member: TeamMember; large?: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    className="group bg-bg-card overflow-hidden rounded-2xl border border-border-d transition-all hover:border-border-h hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]"
  >
    {large && (
      <div className="relative h-56 overflow-hidden">
        <img
          src={
            member.image ||
            `https://placehold.co/300x300/0D1E35/0EA5E9?text=${encodeURIComponent(member.name?.[0] || "?")}`
          }
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1E35] via-transparent to-transparent" />
      </div>
    )}
    <div className={`p-5 ${!large ? "flex items-center gap-4" : ""}`}>
      {!large && (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-border-h">
          <img
            src={
              member.image ||
              `https://placehold.co/100x100/0D1E35/0EA5E9?text=${encodeURIComponent(member.name?.[0] || "?")}`
            }
            alt={member.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-display text-text-primary text-base font-semibold">{member.name}</h3>
        <p className="font-body text-accent-blue mb-2 text-sm">{member.role}</p>
        <div className="flex gap-2">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-blue transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-text-muted hover:text-accent-blue transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

export const TeamPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const members = getTeamByCategory(activeCategory);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
        <div className="circuit-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="font-body text-text-muted mb-6 flex items-center justify-center gap-2 text-sm">
              <Link to="/" className="hover:text-accent-blue transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent-blue">Team</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Our Team
            </h1>
            <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
              Meet the passionate individuals driving ComES forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + Members */}
      <section className="bg-bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {teamCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`font-body rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-bg-card text-text-secondary hover:border-accent-blue/40 border border-border-d"
                  }`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </FadeInView>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {members.map((member, i) => (
                <FadeInView key={member.id} direction="up" delay={i * 0.05}>
                  <MemberCard
                    member={member}
                    large={activeCategory === "all" || activeCategory === "executive"}
                  />
                </FadeInView>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
};

export default TeamPage;
