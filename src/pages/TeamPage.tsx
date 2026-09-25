// ============================================
// ComES Website - Team Page
// ============================================

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  UserPlus,
  RefreshCw,
  Twitter,
} from "lucide-react";
import { Button, PageTransition, Section } from "@/components/ui";
import { teamService, teamDepartments, type ApiTeamMember } from "@/services/team.service";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const TeamMemberCard = ({ member }: { member: ApiTeamMember }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const [imageFailed, setImageFailed] = useState(false);

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
        {member.avatar && !imageFailed ? (
          <img
            src={member.avatar}
            alt={member.name}
            onError={() => setImageFailed(true)}
            className={cn(
              "h-16 w-16 shrink-0 rounded-full border object-cover",
              isDark ? "border-slate-700" : "border-gray-200",
            )}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-800"
          >
            {member.name
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </div>
        )}
        <div className="min-w-0 flex-1 pt-1">
          <h3
            className={cn(
              "text-lg leading-tight font-semibold break-words",
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

      {member.bio && (
        <p
          className={cn(
            "mt-4 text-sm leading-6 break-words",
            isDark ? "text-gray-400" : "text-gray-600",
          )}
        >
          {member.bio}
        </p>
      )}

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
              <span className="break-all">{member.contactNo}</span>
            </a>
          )}
        </div>
      )}

      {(member.linkedin || member.github || member.twitter) && (
        <div className="mt-auto flex gap-2 pt-5">
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Twitter`}
              className="flex h-9 w-9 items-center justify-center border border-gray-400 text-gray-500 hover:text-blue-500"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
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
const TeamHero = ({ members, loading }: { members: ApiTeamMember[]; loading: boolean }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const summary = [
    { value: members.length, label: "Team members" },
    {
      value: members.filter((member) => member.department === "executive").length,
      label: "Executive leaders",
    },
    {
      value: members.filter((member) => member.department === "advisory").length,
      label: "Faculty advisors",
    },
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
                  {loading ? "..." : item.value}
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
const AllMembersSection = ({ members }: { members: ApiTeamMember[] }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredMembers = members.filter(
    (member) => activeCategory === "all" || member.department === activeCategory,
  );
  const teamCategories = [{ id: "all", label: "All Members" }, ...teamDepartments];
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
            <TeamMemberCard key={member._id} member={member} />
          ))}
          {filteredMembers.length === 0 && (
            <p className="col-span-full py-8 text-center text-gray-500">
              No committee members published in this category.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
};

// Main Team Page Component
export const TeamPage = () => {
  const [members, setMembers] = useState<ApiTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    teamService
      .getAll()
      .then((response) => {
        if (!response.success || !response.data) throw new Error("Team unavailable");
        if (!cancelled) setMembers(response.data.members.filter((member) => member.isActive));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestVersion]);

  return (
    <PageTransition>
      <TeamHero members={members} loading={loading || error} />
      {loading ? (
        <div role="status" className="px-4 py-16 text-center">
          Loading committee members...
        </div>
      ) : error ? (
        <div role="alert" className="space-y-4 px-4 py-16 text-center">
          <p>Committee details are currently unavailable.</p>
          <Button
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => setRequestVersion((current) => current + 1)}
          >
            Retry
          </Button>
        </div>
      ) : (
        <AllMembersSection members={members} />
      )}
      <JoinTeamSection />
    </PageTransition>
  );
};

export default TeamPage;
