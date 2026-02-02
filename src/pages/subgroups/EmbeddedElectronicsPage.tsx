// ============================================
// ComES Website - Embedded and Electronics Subgroup Page
// ============================================

import { motion } from 'framer-motion';
import { Cpu, Zap, Radio, CircuitBoard, Microchip, Bot } from 'lucide-react';
import { Section, SectionHeader, Card, PageTransition, FadeInView } from '@/components/ui';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

const EmbeddedElectronicsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const focusAreas = [
    {
      icon: Microchip,
      title: 'Microcontrollers',
      description: 'Programming Arduino, ESP32, STM32, and other microcontroller platforms.',
    },
    {
      icon: CircuitBoard,
      title: 'PCB Design',
      description: 'Designing and manufacturing custom printed circuit boards.',
    },
    {
      icon: Bot,
      title: 'Robotics',
      description: 'Building autonomous robots and intelligent automation systems.',
    },
    {
      icon: Radio,
      title: 'IoT Systems',
      description: 'Creating connected devices and smart sensor networks.',
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section
        background="gradient"
        padding="xl"
        className={cn(
          isDark && 'bg-gradient-to-br from-slate-950 via-green-950 to-slate-950'
        )}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/30"
          >
            <Cpu className="w-10 h-10 text-white" />
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
            Embedded and Electronics
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
            Where hardware meets software. Our Embedded Systems subgroup bridges the gap
            between electronics and programming to create innovative solutions.
          </motion.p>
        </div>
      </Section>

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Explore our expertise in embedded systems and electronics"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'p-3 rounded-xl',
                    isDark ? 'bg-green-500/20' : 'bg-green-100'
                  )}>
                    <area.icon className={cn(
                      'w-6 h-6',
                      isDark ? 'text-green-400' : 'text-green-600'
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
          subtitle="Hands-on learning in embedded systems and electronics"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Zap className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Hardware Workshops
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Learn soldering, circuit design, and hardware debugging techniques.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <Bot className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Robotics Competitions
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Build and compete with robots in national and international competitions.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <CircuitBoard className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDark ? 'text-green-400' : 'text-green-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                IoT Projects
              </h3>
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Create smart devices and connected systems for real-world applications.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default EmbeddedElectronicsPage;
