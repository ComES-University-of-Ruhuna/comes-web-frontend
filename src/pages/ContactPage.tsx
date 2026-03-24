// ============================================
// ComES Website - Contact Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram, Facebook } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/constants";

const ease = [0.25, 0.46, 0.45, 0.94];

const getSocialIcon = (platform: string) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: <Facebook className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    github: <Github className="h-5 w-5" />,
  };
  return icons[platform] || null;
};

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

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
              <span className="text-accent-blue">Contact</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Contact Us
            </h1>
            <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
              Have a question or want to collaborate? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="bg-[#0A1628] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form — 3 cols */}
            <FadeInView direction="right" className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-8"
              >
                <h2 className="font-display text-text-primary mb-6 text-xl font-bold">
                  Send a Message
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="font-body text-text-secondary mb-2 block text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-bg-primary font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue w-full rounded-xl border border-[rgba(14,165,233,0.15)] px-4 py-3 text-sm transition-colors outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-text-secondary mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-bg-primary font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue w-full rounded-xl border border-[rgba(14,165,233,0.15)] px-4 py-3 text-sm transition-colors outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="font-body text-text-secondary mb-2 block text-sm font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-bg-primary font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue w-full rounded-xl border border-[rgba(14,165,233,0.15)] px-4 py-3 text-sm transition-colors outline-none"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="mt-5">
                  <label className="font-body text-text-secondary mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="bg-bg-primary font-body text-text-primary placeholder:text-text-muted focus:border-accent-blue w-full resize-none rounded-xl border border-[rgba(14,165,233,0.15)] px-4 py-3 text-sm transition-colors outline-none"
                    placeholder="Your message..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="font-body mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-sky-500/20"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </motion.button>
              </form>
            </FadeInView>

            {/* Info Cards — 2 cols */}
            <div className="space-y-6 lg:col-span-2">
              <FadeInView direction="left" delay={0.1}>
                <div className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-6">
                  <div className="bg-accent-blue/10 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                    <Mail className="text-accent-blue h-5 w-5" />
                  </div>
                  <h3 className="font-display text-text-primary mb-1 text-base font-semibold">
                    Email
                  </h3>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="font-body text-text-secondary hover:text-accent-blue text-sm"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </FadeInView>

              <FadeInView direction="left" delay={0.2}>
                <div className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-6">
                  <div className="bg-accent-blue/10 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                    <Phone className="text-accent-blue h-5 w-5" />
                  </div>
                  <h3 className="font-display text-text-primary mb-1 text-base font-semibold">
                    Phone
                  </h3>
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                    className="font-body text-text-secondary hover:text-accent-blue text-sm"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </FadeInView>

              <FadeInView direction="left" delay={0.3}>
                <div className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-6">
                  <div className="bg-accent-blue/10 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                    <MapPin className="text-accent-blue h-5 w-5" />
                  </div>
                  <h3 className="font-display text-text-primary mb-1 text-base font-semibold">
                    Location
                  </h3>
                  <p className="font-body text-text-secondary text-sm">
                    {SITE_CONFIG.address.line1}
                    <br />
                    {SITE_CONFIG.address.line2}
                    <br />
                    {SITE_CONFIG.address.city}
                  </p>
                </div>
              </FadeInView>

              {/* Social Links */}
              <FadeInView direction="left" delay={0.4}>
                <div className="bg-bg-card rounded-2xl border border-[rgba(14,165,233,0.15)] p-6">
                  <h3 className="font-display text-text-primary mb-4 text-base font-semibold">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {SOCIAL_LINKS.map((social) => (
                      <motion.a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="text-text-muted hover:border-accent-blue/40 hover:text-accent-blue flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(14,165,233,0.15)] bg-white/5 transition-all"
                      >
                        {getSocialIcon(social.platform)}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;
