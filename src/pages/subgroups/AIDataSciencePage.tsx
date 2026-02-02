// ============================================
// ComES Website - AI and Data Science Subgroup Page
// ============================================

import { motion } from 'framer-motion';
import { Brain, BarChart3, Database, Cpu, LineChart, Sparkles } from 'lucide-react';
import { Section, SectionHeader, Card, PageTransition, FadeInView } from '@/components/ui';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

const AIDataSciencePage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const focusAreas = [
    {
      icon: Brain,
      title: 'Machine Learning',
      description: 'Building intelligent systems that learn from data and improve over time.',
    },
    {
      icon: Sparkles,
      title: 'Deep Learning',
      description: 'Neural networks and advanced AI architectures for complex problem-solving.',
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'Extracting insights from large datasets to drive decision-making.',
    },
    {
      icon: Database,
      title: 'Big Data',
      description: 'Processing and analyzing massive datasets with distributed computing.',
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section
        background="gradient"
        padding="xl"
        className={cn(
          isDark && 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        )}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/30"
          >
            <Brain className="w-10 h-10 text-white" />
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
            AI and Data Science
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
            Unlocking the power of data and artificial intelligence. Our AI & Data Science
            subgroup explores cutting-edge technologies shaping the future.
          </motion.p>
        </div>
      </Section>

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Discover our areas of expertise in AI and data science"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'p-3 rounded-xl',
                    isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                  )}>
                    <area.icon className={cn(
                      'w-6 h-6',
                      isDark ? 'text-purple-400' : 'text-purple-600'
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
          subtitle="How we nurture AI and data science skills"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Cpu className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-pink-400' : 'text-pink-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                AI Workshops
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Hands-on sessions on machine learning frameworks like TensorFlow and PyTorch.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <LineChart className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Kaggle Competitions
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Participate in data science competitions to test and improve your skills.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <Brain className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-purple-400' : 'text-purple-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Research Projects
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Collaborate on cutting-edge AI research with faculty and industry partners.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default AIDataSciencePage;
