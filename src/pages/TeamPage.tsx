// ============================================
// ComES Website - Team Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Linkedin,
  Github,
  Mail,
  Phone,
  Users,
  UserPlus,
  Sparkles,
  Crown,
  GraduationCap,
  Shield,
} from "lucide-react";
import {
  Section,
  SectionHeader,
  Card,
  Button,
  PageTransition,
  FadeInView,
  HoverScale,
} from "@/components/ui";
import {
  executiveCommittee,
  seniorAdvisors,
  coordinators,
  teamCategories,
  getTeamByCategory,
} from "@/data";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import type { TeamMember } from "@/types";

// Team Member Card Component
const TeamMemberCard = ({ member, index = 0 }: { member: TeamMember; index?: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div whileHover={{ y: -10 }}>
        <Card
          hoverable
          padding="none"
          className={cn("group overflow-hidden", isDark && "border-slate-700/50 bg-slate-800/50")}
        >
          <div className="relative overflow-hidden">
            <motion.img
              src={member.image}
              alt={member.name}
              className="h-48 w-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            {/* Social Links Overlay */}
            <motion.div
              className="absolute right-4 bottom-4 left-4 flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {member.linkedin && (
                <HoverScale scale={1.2}>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-blue-500/50"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </HoverScale>
              )}
              {member.github && (
                <HoverScale scale={1.2}>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-gray-500/50"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </HoverScale>
              )}
              {member.email && (
                <HoverScale scale={1.2}>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-cyan-500/50"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </HoverScale>
              )}
            </motion.div>
          </div>

          <div className="p-6">
            <h3 className={cn("mb-1 text-xl font-bold", isDark ? "text-white" : "text-comesBlue")}>
              {member.name}
            </h3>
            <p className="mb-3 font-semibold text-amber-500">{member.role}</p>
            {member.email && (
              <p
                className={cn(
                  "flex items-center gap-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                <Mail className="h-4 w-4 shrink-0 text-cyan-500" />
                <a
                  href={`mailto:${member.email}`}
                  className="truncate transition-colors hover:text-cyan-500"
                >
                  {member.email}
                </a>
              </p>
            )}
            {member.contactNo && (
              <p
                className={cn(
                  "mt-1 flex items-center gap-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                <Phone className="h-4 w-4 shrink-0 text-cyan-500" />
                <a
                  href={`tel:${member.contactNo}`}
                  className="transition-colors hover:text-cyan-500"
                >
                  {member.contactNo}
                </a>
              </p>
            )}
            {member.batch && (
              <p className={cn("mt-2 text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                Batch of {member.batch}
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Hero Section
const TeamHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section
      background="gradient"
      padding="xl"
      className={isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : ""}
    >
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Animated background elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
          >
            <Users className="h-10 w-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1
            className={cn(
              "mb-6 text-4xl font-bold md:text-5xl lg:text-6xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Meet Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Team
            </span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn("text-xl leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}>
            Dedicated professionals and students working together to build a vibrant tech community.
            Meet the people behind ComES.
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Executive Committee Section
const ExecutiveSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "dark" : "white"}>
      <FadeInView>
        <div className="mb-4 flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-amber-500" />
          <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-comesBlue")}>
            Executive Committee
          </h2>
        </div>
        <p className={cn("mb-12 text-center", isDark ? "text-gray-400" : "text-gray-600")}>
          The leadership team driving ComES forward.
        </p>
      </FadeInView>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {executiveCommittee.map((member, index) => (
          <TeamMemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </Section>
  );
};

// Senior Advisors Section
const AdvisorsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "white" : "gray"}>
      <FadeInView>
        <div className="mb-4 flex items-center justify-center gap-3">
          <GraduationCap className="h-8 w-8 text-blue-500" />
          <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-comesBlue")}>
            Senior Advisors
          </h2>
        </div>
        <p className={cn("mb-12 text-center", isDark ? "text-gray-400" : "text-gray-600")}>
          Faculty members guiding our initiatives with their expertise.
        </p>
      </FadeInView>

      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        {seniorAdvisors.map((member, index) => (
          <TeamMemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </Section>
  );
};

// Coordinators Section
const CoordinatorsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "dark" : "white"}>
      <FadeInView>
        <div className="mb-4 flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-cyan-500" />
          <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-comesBlue")}>
            Coordinators
          </h2>
        </div>
        <p className={cn("mb-12 text-center", isDark ? "text-gray-400" : "text-gray-600")}>
          The driving force behind our events and initiatives.
        </p>
      </FadeInView>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coordinators.map((member, index) => (
          <TeamMemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </Section>
  );
};

// Join Team Section
const JoinTeamSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background="dark" className={isDark ? "bg-slate-900" : ""}>
      <FadeInView>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
          >
            <UserPlus className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Join Our Team</h2>
          <p className={cn("mb-8 text-xl", isDark ? "text-gray-400" : "text-blue-100")}>
            We're always looking for passionate individuals who want to contribute to our mission of
            fostering technological excellence. Be a part of something meaningful.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <HoverScale>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                icon={<Sparkles className="h-5 w-5" />}
              >
                Apply Now
              </Button>
            </HoverScale>
            <HoverScale>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="hover:text-comesBlue border-white text-white hover:bg-white"
              >
                Learn More
              </Button>
            </HoverScale>
          </div>
        </div>
      </FadeInView>
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
    <Section background={isDark ? "white" : "gray"}>
      <FadeInView>
        <SectionHeader
          title="All Team Members"
          subtitle="Browse through all our amazing team members."
        />
      </FadeInView>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {teamCategories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === category.id
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                : isDark
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  : "bg-white text-gray-600 hover:bg-gray-100",
            )}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Members Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
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
      <ExecutiveSection />
      <AdvisorsSection />
      <CoordinatorsSection />
      <AllMembersSection />
      <JoinTeamSection />
    </PageTransition>
  );
};

export default TeamPage;
