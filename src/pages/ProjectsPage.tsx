// ============================================
// ComES Website - Projects Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Github, ExternalLink, FolderGit2 } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { getFeaturedProjects } from "@/data";

const ease = [0.25, 0.46, 0.45, 0.94];
const filterTabs = [
  "All",
  "Software Engineering",
  "AI & Data Science",
  "Embedded Electronics",
  "Network Security",
];

export const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const projects = getFeaturedProjects(12);

  const filtered = projects.filter((p) => {
    if (activeFilter === "All") return true;
    return p.category.toLowerCase().includes(activeFilter.toLowerCase().slice(0, 4));
  });

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#050A14] py-20 lg:py-28">
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
              <span className="text-accent-blue">Projects</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Projects
            </h1>
            <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
              Explore innovative projects built by our talented members.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs + Grid */}
      <section className="bg-[#0A1628] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {filterTabs.map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(tab)}
                  className={`font-body rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeFilter === tab
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-bg-card text-text-secondary hover:border-accent-blue/40 border border-[rgba(14,165,233,0.15)]"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </FadeInView>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.length > 0 ? (
                filtered.map((project, i) => (
                  <FadeInView key={project.id} direction="up" delay={i * 0.05}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="group bg-bg-card flex h-full flex-col rounded-2xl border border-[rgba(14,165,233,0.15)] p-6 transition-all hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className={`rounded-full px-3 py-1 font-mono text-xs ${
                            project.status === "Completed"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-accent-blue/15 text-accent-blue"
                          }`}
                        >
                          {project.status}
                        </span>
                        {project.featured && (
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 font-mono text-xs text-amber-400">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                        {project.title}
                      </h3>
                      <p className="font-body text-text-secondary mb-4 flex-1 text-sm">
                        {project.shortDescription}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="text-text-secondary rounded-lg border border-[rgba(14,165,233,0.15)] bg-white/5 px-2 py-0.5 font-mono text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-text-muted hover:text-accent-blue inline-flex items-center gap-1 text-xs transition-colors"
                          >
                            <Github className="h-3.5 w-3.5" /> GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-text-muted hover:text-accent-blue inline-flex items-center gap-1 text-xs transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </FadeInView>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <FolderGit2 className="text-text-muted mx-auto mb-4 h-16 w-16" />
                  <h3 className="font-display text-text-primary mb-2 text-xl font-semibold">
                    No Projects Found
                  </h3>
                  <p className="font-body text-text-secondary">Try adjusting the filter.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
};

export default ProjectsPage;
