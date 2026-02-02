// ============================================
// ComES Website - Software Engineering Subgroup Page
// ============================================

import { motion } from 'framer-motion';
import { Code, GitBranch, Globe, Laptop, Server, Smartphone } from 'lucide-react';
import { Section, SectionHeader, Card, PageTransition, FadeInView } from '@/components/ui';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

const SoftwareEngineeringPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const focusAreas = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Building modern web applications using React, Next.js, Node.js, and more.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Creating cross-platform mobile apps with React Native and Flutter.',
    },
    {
      icon: Server,
      title: 'Backend Development',
      description: 'Designing scalable APIs and microservices architectures.',
    },
    {
      icon: GitBranch,
      title: 'DevOps & CI/CD',
      description: 'Implementing automated pipelines, containerization, and cloud deployments.',
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section
        background="gradient"
        padding="xl"
        className={cn(
          isDark && 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        )}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30"
          >
            <Code className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
              isDark ? 'text-white' : 'text-comesBlue'
            )}
          >
            Software Engineering
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              'text-xl leading-relaxed',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            Building the future through code. Our Software Engineering subgroup focuses on
            developing robust, scalable, and innovative software solutions.
          </motion.p>
        </div>
      </Section>

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Explore our key areas of expertise in software development"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'p-3 rounded-xl',
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  )}>
                    <area.icon className={cn(
                      'w-6 h-6',
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      'text-lg font-semibold mb-2',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}>
                      {area.title}
                    </h3>
                    <p className={cn(
                      'text-sm',
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {area.description}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeInView>
          ))}
        </div>
      </Section>

      {/* Activities Section */}
      <Section padding="lg" background="gray">
        <SectionHeader
          title="Our Activities"
          subtitle="What we do to foster software engineering excellence"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Laptop className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Coding Bootcamps
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Intensive workshops to learn new programming languages and frameworks.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <GitBranch className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-purple-400' : 'text-purple-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Open Source Projects
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Contribute to real-world open source projects and build your portfolio.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <Code className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-green-400' : 'text-green-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Code Reviews
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Learn best practices through peer code reviews and mentorship.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default SoftwareEngineeringPage;
