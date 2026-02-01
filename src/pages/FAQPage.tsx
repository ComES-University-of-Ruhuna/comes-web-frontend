// ============================================
// ComES Website - FAQ Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  ChevronDown,
  HelpCircle,
  BookOpen,
  Calendar,
  Code2,
  Users,
  Sparkles
} from 'lucide-react';
import { Section, SectionHeader, Card, Button, PageTransition, FadeInView, HoverScale } from '@/components/ui';
import { faqs } from '@/data';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

// FAQ Item Component
const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <FadeInView delay={index * 0.05}>
      <motion.div 
        layout
        className={cn(
          'border rounded-xl overflow-hidden',
          isDark 
            ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        )}
      >
        <button
          onClick={onToggle}
          className={cn(
            'w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors',
            isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              isDark 
                ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' 
                : 'bg-gradient-to-br from-blue-100 to-cyan-100'
            )}>
              <HelpCircle className={cn(
                'w-4 h-4',
                isDark ? 'text-blue-400' : 'text-blue-500'
              )} />
            </div>
            <span className={cn(
              'font-semibold text-lg',
              isDark ? 'text-white' : 'text-gray-800'
            )}>{question}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'flex-shrink-0 p-1 rounded-full',
              isOpen 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                : isDark ? 'text-gray-400' : 'text-gray-500'
            )}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'border-t',
                isDark ? 'border-slate-700' : 'border-gray-200'
              )}
            >
              <div className={cn(
                'px-6 pb-5 pt-4',
                isDark ? 'bg-slate-900/50' : 'bg-gray-50'
              )}>
                <p className={cn(
                  'leading-relaxed pl-11',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </FadeInView>
  );
};

// Hero Section
const FAQHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="gradient" padding="xl" className={isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}>
      <div className="text-center max-w-4xl mx-auto relative">
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2], 
            rotate: [360, 180, 0],
            opacity: [0.4, 0.2, 0.4] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg shadow-blue-500/30"
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn(
            'text-xl leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Find answers to common questions about ComES, membership, events, and
            more. Can't find what you're looking for? Contact us!
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Search Section
const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'} padding="md">
      <FadeInView>
        <div className="max-w-xl mx-auto">
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.02 }}
          >
            <Search
              className={cn(
                'absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )}
            />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-14 pr-6 py-4 rounded-full border text-lg transition-all focus:outline-none focus:ring-2',
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-comesBlue focus:ring-comesBlue/20'
              )}
            />
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
          </motion.div>
        </div>
      </FadeInView>
    </Section>
  );
};

// FAQ List Section
const FAQListSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <div className="max-w-3xl mx-auto space-y-10">
        {Object.entries(faqsByCategory).map(([category, categoryFaqs], catIndex) => (
          <FadeInView key={category} delay={catIndex * 0.1}>
            <motion.div layout>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className={cn(
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-comesBlue'
                )}>{category}</h2>
              </div>
              <div className="space-y-4">
                {categoryFaqs.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === faqs.indexOf(faq)}
                    onToggle={() =>
                      setOpenIndex(openIndex === faqs.indexOf(faq) ? null : faqs.indexOf(faq))
                    }
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// Quick Links Section
const QuickLinksSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const quickLinks = [
    {
      title: 'About ComES',
      description: 'Learn more about our mission, vision, and history.',
      link: '/about',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Upcoming Events',
      description: 'Check out our calendar of events and workshops.',
      link: '/events',
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Our Projects',
      description: 'Explore the innovative projects built by our members.',
      link: '/projects',
      icon: Code2,
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Join Our Team',
      description: 'Become a part of the ComES family.',
      link: '/contact',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <SectionHeader
          title="Quick Links"
          subtitle="Explore more about ComES and our activities."
        />
      </FadeInView>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => (
          <FadeInView key={index} delay={index * 0.1}>
            <HoverScale>
              <Card 
                hoverable 
                padding="lg" 
                className={cn(
                  'text-center h-full',
                  isDark && 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                )}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <link.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className={cn(
                  'text-lg font-bold mb-2',
                  isDark ? 'text-white' : 'text-comesBlue'
                )}>{link.title}</h3>
                <p className={cn(
                  'text-sm mb-4',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>{link.description}</p>
                <Button href={link.link} variant="outline" size="sm">
                  Learn More
                </Button>
              </Card>
            </HoverScale>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <Section background="dark" padding="xl">
      <div className="text-center max-w-3xl mx-auto relative">
        {/* Glowing orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-0 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30"
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Still Have{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className="text-xl text-blue-100 mb-8">
            We're here to help! Reach out to us and we'll get back to you as soon
            as possible.
          </p>
        </FadeInView>

        <FadeInView delay={0.3}>
          <HoverScale>
            <Button 
              href="/contact" 
              variant="secondary" 
              size="lg" 
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Contact Us
            </Button>
          </HoverScale>
        </FadeInView>
      </div>
    </Section>
  );
};

// Main FAQ Page Component
export const FAQPage = () => {
  return (
    <PageTransition>
      <FAQHero />
      <SearchSection />
      <FAQListSection />
      <QuickLinksSection />
      <CTASection />
    </PageTransition>
  );
};

export default FAQPage;
