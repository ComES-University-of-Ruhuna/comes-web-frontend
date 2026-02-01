// ============================================
// ComES Website - About Page
// ============================================

import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Lightbulb, 
  Zap, 
  Target,
  Eye,
  Trophy,
  Calendar,
  Rocket
} from 'lucide-react';
import { Section, SectionHeader, Card, Button, PageTransition, FadeInView, HoverScale } from '@/components/ui';
import { STATISTICS, SITE_CONFIG } from '@/constants';
import { achievements } from '@/data';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

// Hero Section
const AboutHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section 
      background="gradient" 
      padding="xl"
      className={cn(
        isDark && 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
      )}
    >
      <div className="text-center max-w-4xl mx-auto relative">
        {/* Decorative elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-10 -left-10 w-20 h-20 border border-dashed border-blue-300/30 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -right-10 w-16 h-16 border border-dashed border-amber-300/30 rounded-full"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30"
        >
          <Target className="w-10 h-10 text-white" />
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
          About ComES
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
          Empowering the next generation of computer engineers through
          innovation, collaboration, and excellence since {SITE_CONFIG.foundedYear}.
        </motion.p>
      </div>
    </Section>
  );
};

// Mission & Vision Section
const MissionVisionSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const values = [
    { icon: <BookOpen className="w-7 h-7" />, title: 'Education', desc: 'Continuous learning and skill development', gradient: 'from-blue-500 to-cyan-500' },
    { icon: <Users className="w-7 h-7" />, title: 'Community', desc: 'Building connections and networks', gradient: 'from-amber-500 to-orange-500' },
    { icon: <Lightbulb className="w-7 h-7" />, title: 'Innovation', desc: 'Fostering creativity and new ideas', gradient: 'from-purple-500 to-pink-500' },
    { icon: <Zap className="w-7 h-7" />, title: 'Excellence', desc: 'Striving for the highest standards', gradient: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <FadeInView direction="right">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className={cn(
                'text-3xl font-bold',
                isDark ? 'text-white' : 'text-comesBlue'
              )}>Our Mission</h2>
            </div>
            <p className={cn(
              'text-lg leading-relaxed',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              The Computer Engineering Society (ComES) is the official student body
              representing Computer Engineering students at the Faculty of
              Engineering, University of Ruhuna. Our mission is to empower students
              through knowledge sharing, skill development, and community building.
            </p>
          </FadeInView>

          <FadeInView direction="right" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className={cn(
                'text-3xl font-bold',
                isDark ? 'text-white' : 'text-comesBlue'
              )}>Our Vision</h2>
            </div>
            <p className={cn(
              'text-lg leading-relaxed',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              To be the leading student organization that bridges academia and
              industry, fostering innovation and excellence in computer engineering
              education. We envision a community where every member has the
              opportunity to learn, grow, and contribute to technological advancement.
            </p>
          </FadeInView>
        </div>

        <FadeInView direction="left">
          <div className={cn(
            'rounded-2xl p-8 border',
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-xl'
          )}>
            <div className="grid grid-cols-2 gap-6">
              {values.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}
                  >
                    {item.icon}
                  </motion.div>
                  <h4 className={cn(
                    'font-semibold mb-2',
                    isDark ? 'text-white' : 'text-comesBlue'
                  )}>{item.title}</h4>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>
    </Section>
  );
};

// What We Do Section
const WhatWeDoSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const activities = [
    { title: 'Technical Workshops & Seminars', description: 'Regular sessions on trending topics like AI, IoT, cybersecurity, and software development, led by industry experts and alumni.', icon: '📚' },
    { title: 'Coding Competitions & Hackathons', description: 'Organizing 24-hour coding marathons where teams compete to solve real-world problems and showcase their creativity.', icon: '🏆' },
    { title: 'Industry Connections', description: 'Facilitating industry connections and career guidance to help students prepare for internships and job opportunities.', icon: '💼' },
    { title: 'Community Building', description: 'Team-building activities, community service, and networking events to foster a strong sense of belonging.', icon: '🤝' },
    { title: 'Project Development', description: 'Supporting student projects with resources, mentorship, and opportunities to work on real-world applications.', icon: '💻' },
    { title: 'Career Development', description: 'Resume workshops, mock interviews, and career counseling to prepare students for their professional journey.', icon: '🎯' },
  ];

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <SectionHeader
          title="What We Do"
          subtitle="Discover the various activities and initiatives that make ComES a vibrant community."
        />
      </FadeInView>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <FadeInView key={index} direction="up" delay={index * 0.1}>
            <motion.div whileHover={{ y: -10, scale: 1.02 }}>
              <Card hoverable padding="lg" className={cn(
                isDark && 'bg-slate-800/50 border-slate-700/50'
              )}>
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {activity.icon}
                </motion.div>
                <h3 className={cn(
                  'text-xl font-bold mb-3',
                  isDark ? 'text-white' : 'text-comesBlue'
                )}>
                  {activity.title}
                </h3>
                <p className={cn(
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>{activity.description}</p>
              </Card>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// Statistics Section
const StatisticsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="dark" className={isDark ? 'bg-slate-900' : ''}>
      <FadeInView>
        <SectionHeader
          title="Our Impact"
          subtitle="Numbers that reflect our commitment to excellence."
        />
      </FadeInView>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATISTICS.map((stat, index) => (
          <FadeInView key={stat.id} direction="up" delay={index * 0.1}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                'backdrop-blur-sm rounded-2xl p-6 text-center border',
                isDark 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white/10 border-white/10'
              )}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                className="text-4xl md:text-5xl font-bold text-white mb-2"
              >
                {stat.value}{stat.suffix}
              </motion.div>
              <div className={cn(
                'font-medium',
                isDark ? 'text-gray-400' : 'text-blue-200'
              )}>{stat.label}</div>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// Achievements Section
const AchievementsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <SectionHeader
          title="Our Achievements"
          subtitle="Celebrating the milestones and successes of our community."
        />
      </FadeInView>

      <div className="grid md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <FadeInView key={achievement.id} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.1}>
            <motion.div whileHover={{ x: 10 }}>
              <Card hoverable padding="lg" className={cn(
                'flex items-start gap-4',
                isDark && 'bg-slate-800/50 border-slate-700/50'
              )}>
                <motion.div 
                  className="text-4xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {achievement.icon}
                </motion.div>
                <div>
                  <h3 className={cn(
                    'text-lg font-bold mb-1',
                    isDark ? 'text-white' : 'text-comesBlue'
                  )}>
                    {achievement.title}
                  </h3>
                  <p className={cn(
                    'mb-2',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>{achievement.description}</p>
                  <p className={cn(
                    'text-sm flex items-center gap-1',
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    <Calendar className="w-3 h-3" />
                    {achievement.date}
                  </p>
                </div>
              </Card>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// History Section
const HistorySection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const timeline = [
    { year: '2015', title: 'Foundation', description: 'ComES was established as the official student society for Computer Engineering students.' },
    { year: '2017', title: 'First Hackathon', description: 'Organized our first 24-hour hackathon with 50+ participants.' },
    { year: '2019', title: 'Industry Partnerships', description: 'Established partnerships with leading tech companies for internships and mentorship.' },
    { year: '2021', title: 'Virtual Expansion', description: 'Successfully transitioned to virtual events and workshops during the pandemic.' },
    { year: '2023', title: '500+ Members', description: 'Reached a milestone of over 500 active members.' },
    { year: '2025', title: 'National Recognition', description: 'Won the National Coding Championship and Best Student Organization Award.' },
  ];

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <SectionHeader
          title="Our Journey"
          subtitle="A decade of growth, learning, and achievement."
        />
      </FadeInView>

      <div className="relative">
        {/* Timeline line */}
        <div className={cn(
          'absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 transform md:-translate-x-1/2',
          isDark ? 'bg-slate-700' : 'bg-comesBlue/20'
        )} />

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <FadeInView 
              key={item.year} 
              direction={index % 2 === 0 ? 'right' : 'left'}
              delay={index * 0.1}
            >
              <div className={`relative flex items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Timeline dot */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full transform -translate-x-1/2 z-10 shadow-lg shadow-blue-500/30"
                />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-5/12 ${
                  index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'
                }`}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card padding="md" className={cn(
                      isDark && 'bg-slate-800/50 border-slate-700/50'
                    )}>
                      <div className="text-amber-500 font-bold text-lg mb-1 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        {item.year}
                      </div>
                      <h3 className={cn(
                        'text-xl font-bold mb-2',
                        isDark ? 'text-white' : 'text-comesBlue'
                      )}>
                        {item.title}
                      </h3>
                      <p className={cn(
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>{item.description}</p>
                    </Card>
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'} padding="xl">
      <FadeInView>
        <div className="text-center max-w-3xl mx-auto relative">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Be Part of Our Story
          </h2>
          <p className={cn(
            'text-lg mb-8',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            ComES is open to all students interested in technology, programming,
            and engineering. Join us and be part of a community that shapes the
            future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HoverScale>
              <Button href="/team" size="lg" icon={<Users className="w-5 h-5" />}>
                Meet Our Team
              </Button>
            </HoverScale>
            <HoverScale>
              <Button href="/contact" variant="outline" size="lg">
                Get In Touch
              </Button>
            </HoverScale>
          </div>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main About Page Component
export const AboutPage = () => {
  return (
    <PageTransition>
      <AboutHero />
      <MissionVisionSection />
      <WhatWeDoSection />
      <StatisticsSection />
      <HistorySection />
      <AchievementsSection />
      <CTASection />
    </PageTransition>
  );
};

export default AboutPage;
