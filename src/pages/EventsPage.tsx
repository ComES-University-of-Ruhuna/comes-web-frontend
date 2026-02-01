// ============================================
// ComES Website - Events Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, Users, PartyPopper, Ticket } from 'lucide-react';
import { Section, SectionHeader, Card, CardHeader, CardBody, Button, Badge, PageTransition, FadeInView, HoverScale, NewsletterSection } from '@/components/ui';
import { events, pastEvents, eventTypeOptions } from '@/data';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import type { Event } from '@/types';

// Event Card Component
const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div whileHover={{ y: -10 }}>
        <Card hoverable padding="none" className={cn(
          'flex flex-col h-full overflow-hidden',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <CardHeader gradient={event.color}>
            <div className="flex items-center justify-between mb-4">
              <motion.span 
                className="text-4xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {event.icon}
              </motion.span>
              <Badge variant="secondary" size="sm">
                {event.type}
              </Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {event.time}
              </span>
            </div>
          </CardHeader>

          <CardBody className={cn(
            'flex-1 flex flex-col',
            isDark && 'bg-slate-800/50'
          )}>
            <div className={cn(
              'flex items-center gap-2 mb-3',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{event.location}</span>
            </div>

            <p className={cn(
              'mb-4 flex-1',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>{event.description}</p>

            {event.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'px-2 py-1 text-xs rounded',
                      isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  'text-sm flex items-center gap-1',
                  isDark ? 'text-gray-500' : 'text-gray-500'
                )}>
                  <Users className="w-3.5 h-3.5" />
                  {event.registered}/{event.capacity}
                </span>
                <span
                  className={`text-sm font-medium ${
                    event.registered >= event.capacity
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {event.registered >= event.capacity
                    ? 'Full'
                    : `${event.capacity - event.registered} spots left`}
                </span>
              </div>

              <div className={cn(
                'w-full h-2 rounded-full mb-4',
                isDark ? 'bg-slate-700' : 'bg-gray-200'
              )}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-2 rounded-full ${
                    event.registered >= event.capacity
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}
                />
              </div>

              <HoverScale>
                <Button
                  variant={event.registrationOpen ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                  disabled={!event.registrationOpen || event.registered >= event.capacity}
                  icon={<Ticket className="w-4 h-4" />}
                >
                  {event.registrationOpen
                    ? event.registered >= event.capacity
                      ? 'Registration Full'
                      : 'Register Now'
                    : 'Coming Soon'}
                </Button>
              </HoverScale>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Filter Tabs Component
const FilterTabs = ({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {options.map((option) => (
        <motion.button
          key={option}
          onClick={() => onChange(option)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            active === option
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
              : isDark 
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
};

// Hero Section
const EventsHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="gradient" padding="xl" className={isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}>
      <div className="text-center max-w-4xl mx-auto relative">
        {/* Animated background elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-lg shadow-amber-500/30"
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Events & <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Workshops</span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn(
            'text-xl leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Join us for exciting events that foster learning, innovation, and
            community building. From hackathons to workshops, there's something for
            everyone.
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Upcoming Events Section
const UpcomingEventsSection = () => {
  const [filter, setFilter] = useState('All');
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const filteredEvents =
    filter === 'All' ? events : events.filter((e) => e.type === filter);

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <SectionHeader
          title="Upcoming Events"
          subtitle="Don't miss out on these exciting opportunities to learn and connect."
        />
      </FadeInView>

      <FilterTabs
        options={eventTypeOptions}
        active={filter}
        onChange={setFilter}
      />

      <AnimatePresence mode="wait">
        {filteredEvents.length > 0 ? (
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
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
              No {filter.toLowerCase()} events scheduled at the moment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

// Past Events Section
const PastEventsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <SectionHeader
          title="Past Events"
          subtitle="A look back at our previous events and achievements."
        />
      </FadeInView>

      <div className="grid md:grid-cols-2 gap-6">
        {pastEvents.map((event, index) => (
          <FadeInView key={event.id} direction="left" delay={index * 0.1}>
            <motion.div whileHover={{ x: 10 }}>
              <Card padding="lg" className={cn(
                'flex items-start gap-4',
                isDark && 'bg-slate-800/50 border-slate-700/50'
              )}>
                <motion.div 
                  className="text-4xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {event.icon}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={cn(
                      'text-lg font-bold',
                      isDark ? 'text-white' : 'text-comesBlue'
                    )}>
                      {event.title}
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {event.type}
                    </Badge>
                  </div>
                  <p className={cn(
                    'text-sm mb-2',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>{event.description}</p>
                  <div className={cn(
                    'flex items-center gap-4 text-sm',
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  )}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.registered} participants
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </FadeInView>
        ))}
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-lg shadow-amber-500/30"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Want to Host an Event?
          </h2>
          <p className={cn(
            'text-lg mb-8',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Have an idea for a workshop, seminar, or any other event? We'd love to
            hear from you! Let's collaborate and create amazing experiences for our
            community.
          </p>
          <HoverScale>
            <Button href="/contact" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Get In Touch
            </Button>
          </HoverScale>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main Events Page Component
export const EventsPage = () => {
  return (
    <PageTransition>
      <EventsHero />
      <UpcomingEventsSection />
      <PastEventsSection />
      <NewsletterSection 
        title="Stay Updated"
        description="Subscribe to our newsletter and be the first to know about new events and opportunities."
      />
      <CTASection />
    </PageTransition>
  );
};

export default EventsPage;
