// ============================================
// ComES Website - Footer Component
// ============================================

import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS, SOCIAL_LINKS } from "@/constants";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { FadeInView } from "@/components/ui";

const getSocialIcon = (platform: string) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: <Facebook size={18} />,
    twitter: <Twitter size={18} />,
    linkedin: <Linkedin size={18} />,
    instagram: <Instagram size={18} />,
    github: <Github size={18} />,
    youtube: <Youtube size={18} />,
  };
  return icons[platform] || null;
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <footer
      className={cn(
        "relative overflow-hidden transition-colors duration-300",
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white"
          : "from-comesBlue bg-gradient-to-br via-blue-800 to-blue-900 text-white",
      )}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl",
            isDark ? "bg-blue-500/5" : "bg-blue-400/10",
          )}
        />
        <div
          className={cn(
            "absolute right-1/4 bottom-0 h-80 w-80 rounded-full blur-3xl",
            isDark ? "bg-cyan-500/5" : "bg-cyan-400/10",
          )}
        />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <FadeInView direction="up" className="lg:col-span-1">
            <Link to="/" className="group mb-6 flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-all",
                  isDark
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                    : "text-comesBlue bg-white",
                )}
              >
                CE
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">{SITE_CONFIG.name}</h3>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-blue-200")}>
                  {SITE_CONFIG.fullName}
                </p>
              </div>
            </Link>
            <p className={cn("mb-6 leading-relaxed", isDark ? "text-gray-400" : "text-blue-100")}>
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
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                    isDark
                      ? "bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white"
                      : "bg-white/10 hover:bg-white/20",
                  )}
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </motion.a>
              ))}
            </div>
          </FadeInView>

          {/* Quick Links */}
          <FadeInView direction="up" delay={0.1}>
            <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "group flex items-center gap-1 transition-colors",
                      isDark ? "text-gray-400 hover:text-white" : "text-blue-100 hover:text-white",
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 translate-x-1 -translate-y-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </FadeInView>

          {/* Resources */}
          <FadeInView direction="up" delay={0.2}>
            <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Resources
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "group flex items-center gap-1 transition-colors",
                      isDark ? "text-gray-400 hover:text-white" : "text-blue-100 hover:text-white",
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 translate-x-1 -translate-y-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </FadeInView>

          {/* Contact Info */}
          <FadeInView direction="up" delay={0.3}>
            <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className={cn(
                    "group flex items-start gap-3 transition-colors",
                    isDark ? "text-gray-400 hover:text-white" : "text-blue-100 hover:text-white",
                  )}
                >
                  <div className={cn("rounded-lg p-2", isDark ? "bg-slate-800" : "bg-white/10")}>
                    <Mail size={16} />
                  </div>
                  <span className="pt-1.5">{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className={cn(
                    "group flex items-start gap-3 transition-colors",
                    isDark ? "text-gray-400 hover:text-white" : "text-blue-100 hover:text-white",
                  )}
                >
                  <div className={cn("rounded-lg p-2", isDark ? "bg-slate-800" : "bg-white/10")}>
                    <Phone size={16} />
                  </div>
                  <span className="pt-1.5">{SITE_CONFIG.phone}</span>
                </a>
              </li>
              <li
                className={cn("flex items-start gap-3", isDark ? "text-gray-400" : "text-blue-100")}
              >
                <div className={cn("rounded-lg p-2", isDark ? "bg-slate-800" : "bg-white/10")}>
                  <MapPin size={16} />
                </div>
                <div className="pt-1.5">
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
      <div className={cn("relative border-t", isDark ? "border-slate-800" : "border-white/20")}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p
              className={cn(
                "flex items-center gap-1 text-center text-sm md:text-left",
                isDark ? "text-gray-500" : "text-blue-100",
              )}
            >
              &copy; {currentYear} {SITE_CONFIG.name}. Made with{" "}
              <Heart className="inline h-4 w-4 animate-pulse text-red-400" /> by ComES Team
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className={cn(
                  "transition-colors",
                  isDark ? "text-gray-500 hover:text-white" : "text-blue-100 hover:text-white",
                )}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className={cn(
                  "transition-colors",
                  isDark ? "text-gray-500 hover:text-white" : "text-blue-100 hover:text-white",
                )}
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
