// ============================================
// ComES Website - Projects Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Code2, Sparkles, Lightbulb, Users } from "lucide-react";
import {
  Section,
  SectionHeader,
  Card,
  Button,
  Badge,
  PageTransition,
  FadeInView,
  HoverScale,
} from "@/components/ui";
import { useProjects, useFeaturedProjects, useProjectCategories } from "@/hooks/useApi";
import { CollectionPagination } from "@/components/ui/CollectionPagination";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import type { ApiProject as Project } from "@/services/projects.service";

// Project Card Component
const ProjectCard = ({ project, index = 0 }: { project: Project; index?: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const teamMembers = project.teamMembers ?? project.team.map((member) => member.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      case "Planning":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div>
        <Card
          hoverable
          padding="none"
          className={cn(
            "flex h-full flex-col overflow-hidden",
            isDark && "border-slate-700/50 bg-slate-800/50",
          )}
        >
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1 p-6 [overflow-wrap:anywhere]">
            {/* Badges */}
            <div className="mb-4 flex items-center justify-between">
              <Badge
                variant={
                  getStatusColor(project.status) as "success" | "info" | "warning" | "secondary"
                }
                size="sm"
              >
                {project.status.replace("-", " ")}
              </Badge>
              <Badge variant="secondary" size="sm">
                {project.category}
              </Badge>
            </div>

            {/* Title & Description */}
            <h3 className={cn("mb-3 text-xl font-bold", isDark ? "text-white" : "text-comesBlue")}>
              {project.title}
            </h3>
            <p className={cn("mb-4 line-clamp-3", isDark ? "text-gray-400" : "text-gray-600")}>
              {project.shortDescription || project.description}
            </p>

            {/* Technologies */}
            <div className="mb-4 flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium",
                    isDark ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600",
                  )}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span
                  className={cn(
                    "rounded px-2 py-1 text-xs",
                    isDark ? "bg-slate-700 text-gray-500" : "bg-gray-100 text-gray-400",
                  )}
                >
                  +{project.technologies.length - 5} more
                </span>
              )}
            </div>

            {/* Team Members */}
            <div
              className={cn(
                "mb-4 flex items-center gap-1 text-sm",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">Team: </span>
              {teamMembers.join(", ") || "ComES"}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3 px-6 pb-6">
            {project.githubUrl && (
              <HoverScale>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                    isDark
                      ? "border-slate-600 text-gray-300 hover:bg-slate-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <Github className="h-4 w-4" />
                  <span className="text-sm font-medium">Source</span>
                </a>
              </HoverScale>
            )}
            {project.demoUrl && (
              <HoverScale>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-accent-panel flex flex-1 items-center justify-center gap-2 rounded-lg from-blue-500 to-cyan-500 px-4 py-2 text-white transition-opacity hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm font-medium">Live Demo</span>
                </a>
              </HoverScale>
            )}
          </div>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Featured Project Card (larger)
const FeaturedProjectCard = ({ project, index = 0 }: { project: Project; index?: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const teamMembers = project.teamMembers ?? project.team.map((member) => member.name);

  return (
    <FadeInView direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.2}>
      <motion.div>
        <Card
          hoverable
          padding="none"
          className={cn("overflow-hidden lg:flex", isDark && "border-slate-700/50 bg-slate-800/50")}
        >
          <div className="site-accent-panel relative flex flex-col justify-center overflow-hidden from-blue-600 via-cyan-500 to-blue-700 p-8 text-white lg:w-2/5">
            <Badge variant="secondary" size="sm" className="mb-4 self-start">
              ⭐ Featured Project
            </Badge>
            <h3 className="mb-4 text-2xl font-bold">{project.title}</h3>
            <p className="mb-6 text-blue-100">{project.description}</p>
            <div className="flex gap-3">
              {project.githubUrl && (
                <HoverScale>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 transition-colors hover:bg-white/30"
                  >
                    <Github className="h-4 w-4" />
                    <span className="text-sm font-medium">View Source</span>
                  </a>
                </HoverScale>
              )}
              {project.demoUrl && (
                <HoverScale>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-blue-900 transition-colors hover:bg-amber-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm font-medium">Live Demo</span>
                  </a>
                </HoverScale>
              )}
            </div>
          </div>
          <div className={cn("p-8 lg:w-3/5", isDark && "bg-slate-800/50")}>
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="mb-6 aspect-video w-full rounded-lg object-cover"
                loading="lazy"
              />
            )}
            <div className="mb-4 flex items-center gap-3">
              <Badge variant={project.status === "completed" ? "success" : "info"} size="sm">
                {project.status.replace("-", " ")}
              </Badge>
              <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-500")}>
                {project.category}
              </span>
            </div>

            <h4
              className={cn(
                "mb-3 flex items-center gap-2 font-semibold",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Code2 className="h-4 w-4 text-blue-500" />
              Technologies Used
            </h4>
            <div className="mb-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm",
                    isDark ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600",
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>

            <h4
              className={cn(
                "mb-3 flex items-center gap-2 font-semibold",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Users className="h-4 w-4 text-blue-500" />
              Team Members
            </h4>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <span
                  key={member}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm",
                    isDark ? "bg-blue-900/50 text-blue-300" : "bg-comesBlue/10 text-comesBlue",
                  )}
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Hero Section

// Featured Projects Section
const FeaturedProjectsSection = () => {
  const { data, error } = useFeaturedProjects();
  const featuredProjects = error ? [] : (data ?? []).slice(0, 2);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  if (!featuredProjects.length) return null;

  return (
    <Section background={isDark ? "dark" : "white"}>
      <FadeInView>
        <SectionHeader
          title="Featured Projects"
          subtitle="Highlighted projects showcasing our community's best work."
          light={isDark}
        />
      </FadeInView>

      <div className="space-y-8">
        {featuredProjects.map((project, index) => (
          <FeaturedProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
};

// All Projects Section
const AllProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const { data, isLoading, error, refetch, pagination } = useProjects({
    category: activeCategory === "All" ? undefined : activeCategory,
    page,
    limit: 9,
  });
  const { data: categories } = useProjectCategories();
  const filteredProjects = data ?? [];

  return (
    <Section background={isDark ? "white" : "gray"} className={isDark ? "bg-slate-950" : ""}>
      <FadeInView>
        <SectionHeader
          title="All Projects"
          subtitle="Browse through all our community projects."
          light={isDark}
        />
      </FadeInView>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {["All", ...(categories ?? [])].map((category) => (
          <motion.button
            key={category}
            aria-pressed={activeCategory === category}
            onClick={() => {
              setActiveCategory(category);
              setPage(1);
            }}
            className={cn(
              "site-filter rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeCategory === category
                ? "site-accent-panel from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                : isDark
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  : "bg-white text-gray-600 hover:bg-gray-100",
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <p role="status" className="py-12 text-center">
          Loading projects...
        </p>
      ) : error ? (
        <div role="alert" className="py-12 text-center">
          <p>{error}</p>
          <button type="button" onClick={refetch} className="mt-3 underline">
            Retry
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className={cn("text-lg", isDark ? "text-gray-500" : "text-gray-500")}>
                No projects in this category yet.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <CollectionPagination
        page={page}
        pages={pagination?.pages ?? 0}
        onChange={setPage}
        disabled={isLoading}
      />
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background="dark" className={isDark ? "bg-slate-900" : ""}>
      <FadeInView>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="site-accent-panel mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
          >
            <Lightbulb className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Have a Project Idea?</h2>
          <p className={cn("mb-8 text-xl", isDark ? "text-gray-400" : "text-blue-100")}>
            We're always looking for innovative project ideas. Share your vision with us and let's
            build something amazing together!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <HoverScale>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                icon={<Sparkles className="h-5 w-5" />}
              >
                Submit Your Idea
              </Button>
            </HoverScale>
            <HoverScale>
              <Button
                href="https://github.com/ComES-Ruhuna"
                external
                variant="outline"
                size="lg"
                className="hover:text-comesBlue border-white text-white hover:bg-white"
                icon={<Github className="h-5 w-5" />}
                iconPosition="left"
              >
                View on GitHub
              </Button>
            </HoverScale>
          </div>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main Projects Page Component
export const ProjectsPage = () => {
  return (
    <PageTransition>
      <FeaturedProjectsSection />
      <AllProjectsSection />
      <CTASection />
    </PageTransition>
  );
};

export default ProjectsPage;
