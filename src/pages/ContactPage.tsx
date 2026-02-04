// ============================================
// ComES Website - Contact Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Facebook, Instagram, Send, CheckCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { Section, SectionHeader, Card, Button, Input, Textarea, Select, PageTransition, FadeInView, HoverScale } from '@/components/ui';
import { SITE_CONFIG, CONTACT_SUBJECTS, SOCIAL_LINKS } from '@/constants';
import { faqs } from '@/data';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { contactService } from '@/services';
import type { ContactFormData } from '@/types';

// Contact Info Card
const ContactInfoCard = ({
  icon,
  title,
  details,
  link,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  details: string[];
  link?: string;
  index?: number;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const content = (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div whileHover={{ y: -10, scale: 1.02 }}>
        <Card hoverable padding="lg" className={cn(
          'text-center h-full',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <motion.div 
            className="flex items-center justify-center mx-auto mb-4 text-white shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-blue-500/30"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            {icon}
          </motion.div>
          <h3 className={cn(
            'text-lg font-bold mb-2',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>{title}</h3>
          {details.map((detail, idx) => (
            <p key={idx} className={cn(
              'text-sm',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {detail}
            </p>
          ))}
        </Card>
      </motion.div>
    </FadeInView>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};

// Social Links
const SocialLinksSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const socialIcons: Record<string, React.ReactNode> = {
    linkedin: <Linkedin className="w-6 h-6" />,
    github: <Github className="w-6 h-6" />,
    facebook: <Facebook className="w-6 h-6" />,
    instagram: <Instagram className="w-6 h-6" />,
  };

  return (
    <div className="flex justify-center gap-4">
      {SOCIAL_LINKS.map((social, index) => (
        <HoverScale key={social.id} scale={1.2}>
          <motion.a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all',
              isDark 
                ? 'bg-slate-800 text-gray-400 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 hover:text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 hover:text-white'
            )}
            aria-label={social.label}
          >
            {socialIcons[social.id] || <Mail className="w-6 h-6" />}
          </motion.a>
        </HoverScale>
      ))}
    </div>
  );
};

// Contact Form
const ContactForm = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await contactService.submit(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // If backend is not running, show user-friendly message
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message.includes('Network Error') ? 'Unable to connect to server. Please try again later.' : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <FadeInView>
        <Card padding="xl" className={cn(
          'text-center',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className={cn(
            'text-2xl font-bold mb-4',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Message Sent Successfully!
          </h3>
          <p className={cn(
            'mb-6',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Thank you for reaching out. We'll get back to you as soon as possible.
          </p>
          <HoverScale>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Send Another Message
            </Button>
          </HoverScale>
        </Card>
      </FadeInView>
    );
  }

  return (
    <FadeInView direction="left">
      <Card padding="lg" className={cn(
        isDark && 'bg-slate-800/50 border-slate-700/50'
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-blue-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className={cn(
            'text-xl font-bold',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>Send us a Message</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <Select
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            options={CONTACT_SUBJECTS}
            required
          />

          <Textarea
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help..."
            rows={5}
            required
          />

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm text-red-500 border rounded-lg bg-red-500/10 border-red-500/30"
            >
              {error}
            </motion.div>
          )}

          <HoverScale className="w-full">
            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              icon={<Send className="w-4 h-4" />}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </HoverScale>
        </form>
      </Card>
    </FadeInView>
  );
};

// Hero Section
const ContactHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="gradient" padding="xl" className={isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}>
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 w-32 h-32 rounded-full left-1/4 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-0 w-40 h-40 rounded-full right-1/4 bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 shadow-lg rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Get In <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">Touch</span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn(
            'text-xl leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Have questions, ideas, or just want to say hello? We'd love to hear
            from you. Reach out and let's connect!
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Contact Info Section
const ContactInfoSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <div className="grid gap-6 mb-12 md:grid-cols-3">
        <ContactInfoCard
          icon={<Mail className="w-6 h-6" />}
          title="Email"
          details={[SITE_CONFIG.contact.email]}
          link={`mailto:${SITE_CONFIG.contact.email}`}
          index={0}
        />
        <ContactInfoCard
          icon={<Phone className="w-6 h-6" />}
          title="Phone"
          details={[SITE_CONFIG.contact.phone]}
          link={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
          index={1}
        />
        <ContactInfoCard
          icon={<MapPin className="w-6 h-6" />}
          title="Location"
          details={[SITE_CONFIG.contact.address]}
          index={2}
        />
      </div>

      <FadeInView delay={0.3}>
        <div className="text-center">
          <h3 className={cn(
            'text-lg font-semibold mb-4',
            isDark ? 'text-gray-300' : 'text-gray-700'
          )}>
            Follow us on social media
          </h3>
          <SocialLinksSection />
        </div>
      </FadeInView>
    </Section>
  );
};

// Form & Map Section
const FormMapSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <div className="grid gap-8 lg:grid-cols-2">
        <ContactForm />

        <FadeInView direction="right">
          <Card padding="none" className={cn(
            'overflow-hidden h-full',
            isDark && 'bg-slate-800/50 border-slate-700/50'
          )}>
            <div className="h-full min-h-[400px] bg-gray-200">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.3801182574557!2d80.18938967447819!3d6.079373728166143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1714b88f66a7b%3A0x8a7feea89839a01a!2sFaculty%20of%20Engineering%20-%20University%20of%20Ruhuna!5e0!3m2!1sen!2slk!4v1770146247608!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ComES Location"
              />
            </div>
          </Card>
        </FadeInView>
      </div>
    </Section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about ComES."
        />
      </FadeInView>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.slice(0, 6).map((faq, index) => (
          <FadeInView key={faq.id} delay={index * 0.1}>
            <motion.div
              className={cn(
                'border rounded-xl overflow-hidden',
                isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={cn(
                  'w-full px-6 py-4 text-left flex items-center justify-between transition-colors',
                  isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                )}
              >
                <span className={cn(
                  'font-semibold',
                  isDark ? 'text-white' : 'text-gray-800'
                )}>{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  className="text-blue-500"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={cn(
                      'border-t',
                      isDark ? 'border-slate-700' : 'border-gray-200'
                    )}
                  >
                    <div className={cn(
                      'px-6 py-4',
                      isDark ? 'bg-slate-900/50' : 'bg-gray-50'
                    )}>
                      <p className={cn(
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// Main Contact Page Component
export const ContactPage = () => {
  return (
    <PageTransition>
      <ContactHero />
      <ContactInfoSection />
      <FormMapSection />
      <FAQSection />
    </PageTransition>
  );
};

export default ContactPage;
