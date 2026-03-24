// ============================================
// ComES Website - Footer Component (Redesigned)
// ============================================

import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Facebook,
  Linkedin,
  Instagram,
  Github,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS, SOCIAL_LINKS } from "@/constants";
import { FadeInView } from "@/components/ui";

const getSocialIcon = (platform: string) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: <Facebook size={18} />,
    linkedin: <Linkedin size={18} />,
    instagram: <Instagram size={18} />,
    github: <Github size={18} />,
  };
  return icons[platform] || null;
};

// Circuit board SVG pattern background
const CircuitPattern = () => (
  <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2" fill="#0EA5E9" />
        <circle cx="50" cy="50" r="2" fill="#0EA5E9" />
        <circle cx="90" cy="90" r="2" fill="#0EA5E9" />
        <circle cx="90" cy="10" r="1.5" fill="#06B6D4" />
        <circle cx="10" cy="90" r="1.5" fill="#06B6D4" />
        <line x1="10" y1="10" x2="50" y2="10" stroke="#0EA5E9" strokeWidth="0.5" />
        <line x1="50" y1="10" x2="50" y2="50" stroke="#0EA5E9" strokeWidth="0.5" />
        <line x1="50" y1="50" x2="90" y2="50" stroke="#0EA5E9" strokeWidth="0.5" />
        <line x1="90" y1="50" x2="90" y2="90" stroke="#0EA5E9" strokeWidth="0.5" />
        <line x1="10" y1="90" x2="10" y2="50" stroke="#06B6D4" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="50" y2="50" stroke="#06B6D4" strokeWidth="0.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circuit)" />
  </svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const subgroupLinks = [
    { label: "Software Engineering", path: "/subgroups/software-engineering" },
    { label: "AI & Data Science", path: "/subgroups/ai-data-science" },
    { label: "Embedded Electronics", path: "/subgroups/embedded-electronics" },
    { label: "Network Security", path: "/subgroups/network-security" },
  ];

  return (
    <footer className="relative overflow-hidden bg-bg-secondary">
      {/* Circuit board pattern */}
      <CircuitPattern />

      {/* Subtle glow decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* About ComES */}
          <FadeInView direction="up" className="lg:col-span-1">
            <Link to="/" className="group mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500">
                <span className="font-display text-sm font-bold text-white">CE</span>
              </div>
              <div>
                <h3 className="font-display text-text-primary text-lg font-bold tracking-wider">
                  {SITE_CONFIG.name}
                </h3>
                <p className="text-text-muted text-xs">{SITE_CONFIG.fullName}</p>
              </div>
            </Link>
            <p className="font-body text-text-secondary mb-6 text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-text-secondary hover:border-accent-blue/40 hover:text-accent-blue flex h-9 w-9 items-center justify-center rounded-lg border border-border-d bg-white/5 transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </motion.a>
              ))}
            </div>
          </FadeInView>

          {/* Quick Links */}
          <FadeInView direction="up" delay={0.1}>
            <h4 className="font-display text-text-primary mb-5 text-sm font-semibold tracking-widest uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group font-body text-text-secondary hover:text-accent-blue flex items-center gap-1 text-sm transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 translate-x-1 -translate-y-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </FadeInView>

          {/* Subgroups */}
          <FadeInView direction="up" delay={0.2}>
            <h4 className="font-display text-text-primary mb-5 text-sm font-semibold tracking-widest uppercase">
              Subgroups
            </h4>
            <ul className="space-y-3">
              {subgroupLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group font-body text-text-secondary hover:text-accent-blue flex items-center gap-1 text-sm transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 translate-x-1 -translate-y-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </FadeInView>

          {/* Connect */}
          <FadeInView direction="up" delay={0.3}>
            <h4 className="font-display text-text-primary mb-5 text-sm font-semibold tracking-widest uppercase">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="group font-body text-text-secondary hover:text-accent-blue flex items-start gap-3 text-sm transition-colors"
                >
                  <div className="rounded-lg border border-border-d bg-white/5 p-2">
                    <Mail size={14} />
                  </div>
                  <span className="pt-1.5">{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="group font-body text-text-secondary hover:text-accent-blue flex items-start gap-3 text-sm transition-colors"
                >
                  <div className="rounded-lg border border-border-d bg-white/5 p-2">
                    <Phone size={14} />
                  </div>
                  <span className="pt-1.5">{SITE_CONFIG.phone}</span>
                </a>
              </li>
              <li className="text-text-secondary flex items-start gap-3">
                <div className="rounded-lg border border-border-d bg-white/5 p-2">
                  <MapPin size={14} />
                </div>
                <div className="font-body pt-1.5 text-sm">
                  <p>{SITE_CONFIG.address.line1}</p>
                  <p>{SITE_CONFIG.address.line2}</p>
                  <p>{SITE_CONFIG.address.city}</p>
                </div>
              </li>
            </ul>
          </FadeInView>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-border-d">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-body text-text-muted flex items-center gap-1 text-center text-sm md:text-left">
              &copy; {currentYear} {SITE_CONFIG.name}. Made with{" "}
              <Heart className="inline h-3.5 w-3.5 animate-pulse text-red-400" /> by ComES Team
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.slice(0, 4).map((social) => (
                <motion.a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="text-text-muted hover:text-accent-blue transition-colors"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
