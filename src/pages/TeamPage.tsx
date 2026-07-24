// ============================================
// ComES Website - Team Page
// ============================================

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Phone, UserPlus } from "lucide-react";
import { Button, PageTransition, Section } from "@/components/ui";
import {
  allTeamMembers,
  executiveCommittee,
  seniorAdvisors,
  teamCategories,
  getTeamByCategory,
} from "@/data";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import type { TeamMember } from "@/types";

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <article
      className={cn(
        "flex h-full flex-col border p-5 transition-colors",
        isDark
          ? "border-slate-800 bg-slate-900 hover:border-slate-700"
          : "border-gray-200 bg-white hover:border-gray-300",
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        <img
          src={member.image}
          alt={member.name}
          className={cn(
            "h-16 w-16 shrink-0 rounded-full border object-cover",
            isDark ? "border-slate-700" : "border-gray-200",
          )}
        />
        <div className="min-w-0 flex-1 pt-1">
          <h3
            className={cn(
              "text-lg leading-tight font-semibold",
              isDark ? "text-white" : "text-gray-950",
            )}
          >
            {member.name}
          </h3>
          <p className={cn("mt-1 text-sm font-medium", isDark ? "text-blue-300" : "text-blue-700")}>
            {member.role}
          </p>
          {member.batch && (
            <p className={cn("mt-1 text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
              Batch of {member.batch}
            </p>
          )}
        </div>
      </div>

      {(member.email || member.contactNo) && (
        <div
          className={cn(
            "mt-5 space-y-2 border-t pt-4 text-sm",
            isDark ? "border-slate-800 text-gray-400" : "border-gray-100 text-gray-600",
          )}
        >
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex min-w-0 items-center gap-2 transition-colors hover:text-blue-500"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{member.email}</span>
            </a>
          )}
          {member.contactNo && (
            <a
              href={`tel:${member.contactNo}`}
              className="flex items-center gap-2 transition-colors hover:text-blue-500"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>{member.contactNo}</span>
            </a>
          )}
        </div>
      )}

      {(member.linkedin || member.github) && (
        <div className="mt-auto flex gap-2 pt-5">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className={cn(
                "flex h-9 w-9 items-center justify-center border transition-colors",
                isDark
                  ? "border-slate-700 text-gray-400 hover:border-blue-400 hover:text-blue-300"
                  : "border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-700",
              )}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on GitHub`}
              className={cn(
                "flex h-9 w-9 items-center justify-center border transition-colors",
                isDark
                  ? "border-slate-700 text-gray-400 hover:border-gray-400 hover:text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-950",
              )}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </article>
  );
};

// Hero Section
const TeamHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const summary = [
    { value: allTeamMembers.length, label: "Team members" },
    { value: executiveCommittee.length, label: "Executive leaders" },
    { value: seniorAdvisors.length, label: "Faculty advisors" },
  ];

  return (
    <section
      className={cn(
        "border-b pt-16 pb-14 sm:pt-20 sm:pb-16",
        isDark ? "border-slate-800 bg-slate-950" : "border-gray-200 bg-white",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div
              className={cn(
                "mb-4 text-sm font-semibold tracking-wider uppercase",
                isDark ? "text-blue-300" : "text-blue-700",
              )}
            >
              Leadership and community
            </div>
            <h1
              className={cn(
                "text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl",
                isDark ? "text-white" : "text-gray-950",
              )}
            >
              The people behind ComES
            </h1>
            <p
              className={cn(
                "mt-5 max-w-2xl text-base leading-7 sm:text-lg",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              Students, faculty advisors, and coordinators working together to strengthen the
              computer engineering community at the University of Ruhuna.
            </p>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={cn(
              "grid grid-cols-3 divide-x border-y py-5 lg:min-w-[420px]",
              isDark ? "divide-slate-800 border-slate-800" : "divide-gray-200 border-gray-200",
            )}
          >
            {summary.map((item) => (
              <div key={item.label} className="px-3 text-center sm:px-5">
                <dd className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-950")}>
                  {item.value}
                </dd>
                <dt
                  className={cn(
                    "mt-1 text-xs leading-4",
                    isDark ? "text-gray-500" : "text-gray-500",
                  )}
                >
                  {item.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
};

// Join Team Section
const JoinTeamSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "dark" : "white"} padding="lg">
      <div
        className={cn(
          "grid items-center gap-8 border px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-10",
          isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-gray-50",
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "hidden h-12 w-12 shrink-0 items-center justify-center sm:flex",
              isDark ? "bg-blue-400 text-slate-950" : "bg-blue-800 text-white",
            )}
          >
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-950")}>
              Contribute to the community
            </h2>
            <p
              className={cn("mt-2 max-w-2xl leading-7", isDark ? "text-gray-400" : "text-gray-600")}
            >
              Help organize events, lead technical initiatives, and build meaningful connections
              across the faculty.
            </p>
          </div>
        </div>
        <Button
          href="https://volunteers.comesuor.lk"
          external
          size="lg"
          icon={<ArrowRight className="h-5 w-5" />}
          className="w-full lg:w-auto"
        >
          Apply to volunteer
        </Button>
      </div>
    </Section>
  );
};

// All Members Section with Filter
const AllMembersSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredMembers = getTeamByCategory(activeCategory);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "dark" : "gray"} padding="lg">
      <div className="mb-9 flex flex-col gap-5 border-b border-[var(--border-color)] pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-950")}>
            Team directory
          </h2>
          <p className={cn("mt-2", isDark ? "text-gray-400" : "text-gray-600")}>
            Browse the current committee, advisors, and working groups.
          </p>
        </div>
        <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
          Showing {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
        </p>
      </div>

      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Team categories"
      >
        {teamCategories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "shrink-0 border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? isDark
                    ? "border-blue-400 bg-blue-400 text-slate-950"
                    : "border-blue-800 bg-blue-800 text-white"
                  : isDark
                    ? "border-slate-700 bg-slate-900 text-gray-300 hover:border-slate-500"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
};

// Main Team Page Component
export const TeamPage = () => {
  return (
    <PageTransition>
      <TeamHero />
      <AllMembersSection />
      <JoinTeamSection />
    </PageTransition>
  );
};

export default TeamPage;
