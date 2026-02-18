// ============================================
// ComES Website - Team Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, Mail, Phone, Users, UserPlus, Sparkles, Crown, GraduationCap, Shield } from 'lucide-react';
import { Section, SectionHeader, Card, Button, PageTransition, FadeInView, HoverScale } from '@/components/ui';
import {
  executiveCommittee,
  seniorAdvisors,
  coordinators,
  teamCategories,
  getTeamByCategory,
} from '@/data';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import type { TeamMember } from '@/types';

// Team Member Card Component
const TeamMemberCard = ({ member, index = 0 }: { member: TeamMember; index?: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div whileHover={{ y: -10 }}>
        <Card hoverable padding="none" className={cn(
          'group overflow-hidden',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <div className="relative overflow-hidden">
            <motion.img
              src={member.image}
              alt={member.name}
              className="w-full h-48 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Social Links Overlay */}
            <motion.div 
              className="absolute bottom-4 left-4 right-4 flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {member.linkedin && (
                <HoverScale scale={1.2}>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500/50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </HoverScale>
              )}
              {member.github && (
                <HoverScale scale={1.2}>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-gray-500/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </HoverScale>
              )}
              {member.email && (
                <HoverScale scale={1.2}>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-cyan-500/50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </HoverScale>
              )}
            </motion.div>
          </div>

          <div className="p-6">
            <h3 className={cn(
              'text-xl font-bold mb-1',
              isDark ? 'text-white' : 'text-comesBlue'
            )}>{member.name}</h3>
            <p className="text-amber-500 font-semibold mb-3">{member.role}</p>
            {member.email && (
              <p className={cn(
                'text-sm flex items-center gap-2',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                <a href={`mailto:${member.email}`} className="hover:text-cyan-500 transition-colors truncate">{member.email}</a>
              </p>
            )}
            {member.contactNo && (
              <p className={cn(
                'text-sm flex items-center gap-2 mt-1',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                <Phone className="w-4 h-4 text-cyan-500 shrink-0" />
                <a href={`tel:${member.contactNo}`} className="hover:text-cyan-500 transition-colors">{member.contactNo}</a>
              </p>
            )}
            {member.batch && (
              <p className={cn(
                'text-sm mt-2',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )}>Batch of {member.batch}</p>
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
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="gradient" padding="xl" className={isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}>
      <div className="text-center max-w-4xl mx-auto relative">
        {/* Animated background elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Meet Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Team</span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn(
            'text-xl leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Dedicated professionals and students working together to build a vibrant
            tech community. Meet the people behind ComES.
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Executive Committee Section
const ExecutiveSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-amber-500" />
          <h2 className={cn(
            'text-3xl font-bold',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>Executive Committee</h2>
        </div>
        <p className={cn(
          'text-center mb-12',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>The leadership team driving ComES forward.</p>
      </FadeInView>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="w-8 h-8 text-blue-500" />
          <h2 className={cn(
            'text-3xl font-bold',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>Senior Advisors</h2>
        </div>
        <p className={cn(
          'text-center mb-12',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>Faculty members guiding our initiatives with their expertise.</p>
      </FadeInView>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-cyan-500" />
          <h2 className={cn(
            'text-3xl font-bold',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>Coordinators</h2>
        </div>
        <p className={cn(
          'text-center mb-12',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>The driving force behind our events and initiatives.</p>
      </FadeInView>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Team</h2>
          <p className={cn(
            'text-xl mb-8',
            isDark ? 'text-gray-400' : 'text-blue-100'
          )}>
            We're always looking for passionate individuals who want to contribute
            to our mission of fostering technological excellence. Be a part of
            something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HoverScale>
              <Button href="/contact" variant="secondary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
                Apply Now
              </Button>
            </HoverScale>
            <HoverScale>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-comesBlue"
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
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredMembers = getTeamByCategory(activeCategory);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <SectionHeader
          title="All Team Members"
          subtitle="Browse through all our amazing team members."
        />
      </FadeInView>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {teamCategories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                : isDark 
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
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
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
