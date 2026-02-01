// ============================================
// ComES Website - Projects Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Rocket, Code2, Sparkles, Lightbulb, Users } from 'lucide-react';
import { Section, SectionHeader, Card, Button, Badge, PageTransition, FadeInView, HoverScale } from '@/components/ui';
import { projects, getFeaturedProjects } from '@/data';
import { PROJECT_CATEGORIES } from '@/constants';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import type { Project } from '@/types';

// Project Card Component
const ProjectCard = ({ project, index = 0 }: { project: Project; index?: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Planning':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div whileHover={{ y: -10 }}>
        <Card hoverable padding="none" className={cn(
          'flex flex-col h-full overflow-hidden',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <div className="p-6 flex-1">
            {/* Badges */}
            <div className="flex items-center justify-between mb-4">
              <Badge variant={getStatusColor(project.status) as 'success' | 'info' | 'warning' | 'secondary'} size="sm">
                {project.status}
              </Badge>
              <Badge variant="secondary" size="sm">
                {project.category}
              </Badge>
            </div>

            {/* Title & Description */}
            <h3 className={cn(
              'text-xl font-bold mb-3',
              isDark ? 'text-white' : 'text-comesBlue'
            )}>{project.title}</h3>
            <p className={cn(
              'mb-4',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>{project.shortDescription}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    'px-2 py-1 text-xs rounded font-medium',
                    isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className={cn(
                  'px-2 py-1 text-xs rounded',
                  isDark ? 'bg-slate-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                )}>
                  +{project.technologies.length - 5} more
                </span>
              )}
            </div>

            {/* Team Members */}
            <div className={cn(
              'text-sm mb-4 flex items-center gap-1',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>
              <Users className="w-4 h-4" />
              <span className="font-medium">Team: </span>
              {project.teamMembers.join(', ')}
            </div>
          </div>

          {/* Links */}
          <div className="px-6 pb-6 flex gap-3">
            {project.githubUrl && (
              <HoverScale>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors',
                    isDark 
                      ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-medium">Source</span>
                </a>
              </HoverScale>
            )}
            {project.liveUrl && (
              <HoverScale>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
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
  const isDark = resolvedTheme === 'dark';

  return (
    <FadeInView direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.2}>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card hoverable padding="none" className={cn(
          'lg:flex overflow-hidden',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 p-8 text-white flex flex-col justify-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
            />
            <Badge variant="secondary" size="sm" className="self-start mb-4">
              ⭐ Featured Project
            </Badge>
            <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
            <p className="text-blue-100 mb-6">{project.description}</p>
            <div className="flex gap-3">
              {project.githubUrl && (
                <HoverScale>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm font-medium">View Source</span>
                  </a>
                </HoverScale>
              )}
              {project.liveUrl && (
                <HoverScale>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-blue-900 rounded-lg hover:bg-amber-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Live Demo</span>
                  </a>
                </HoverScale>
              )}
            </div>
          </div>
          <div className={cn(
            'lg:w-3/5 p-8',
            isDark && 'bg-slate-800/50'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant={project.status === 'Completed' ? 'success' : 'info'}
                size="sm"
              >
                {project.status}
              </Badge>
              <span className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-500'
              )}>{project.category}</span>
            </div>

            <h4 className={cn(
              'font-semibold mb-3 flex items-center gap-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              <Code2 className="w-4 h-4 text-blue-500" />
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full',
                    isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>

            <h4 className={cn(
              'font-semibold mb-3 flex items-center gap-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              <Users className="w-4 h-4 text-blue-500" />
              Team Members
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.teamMembers.map((member) => (
                <span
                  key={member}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full',
                    isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-comesBlue/10 text-comesBlue'
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
const ProjectsHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="gradient" padding="xl" className={isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}>
      <div className="text-center max-w-4xl mx-auto relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn(
            'text-xl leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Explore innovative projects built by our talented members. From web
            applications to AI solutions, we're building the future.
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Featured Projects Section
const FeaturedProjectsSection = () => {
  const featuredProjects = getFeaturedProjects(2);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <SectionHeader
          title="Featured Projects"
          subtitle="Highlighted projects showcasing our community's best work."
        />
      </FadeInView>

      <div className="space-y-8">
        {featuredProjects.map((project, index) => (
          <FeaturedProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
};

// All Projects Section
const AllProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <SectionHeader
          title="All Projects"
          subtitle="Browse through all our community projects."
        />
      </FadeInView>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {PROJECT_CATEGORIES.map((category) => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                : isDark 
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={cn(
              'text-lg',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>
              No projects in this category yet.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="dark" className={isDark ? 'bg-slate-900' : ''}>
      <FadeInView>
        <div className="text-center max-w-3xl mx-auto relative">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-lg shadow-amber-500/30"
          >
            <Lightbulb className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Have a Project Idea?
          </h2>
          <p className={cn(
            'text-xl mb-8',
            isDark ? 'text-gray-400' : 'text-blue-100'
          )}>
            We're always looking for innovative project ideas. Share your vision
            with us and let's build something amazing together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HoverScale>
              <Button href="/contact" variant="secondary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
                Submit Your Idea
              </Button>
            </HoverScale>
            <HoverScale>
              <Button
                href="https://github.com/ComES-Ruhuna"
                external
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-comesBlue"
                icon={<Github className="w-5 h-5" />}
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
      <ProjectsHero />
      <FeaturedProjectsSection />
      <AllProjectsSection />
      <CTASection />
    </PageTransition>
  );
};

export default ProjectsPage;
