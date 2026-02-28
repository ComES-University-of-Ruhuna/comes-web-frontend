// ============================================
// ComES Website - FAQ Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Calendar,
  Code2,
  Users,
  Sparkles,
} from "lucide-react";
import {
  Section,
  SectionHeader,
  Card,
  Button,
  PageTransition,
  FadeInView,
  HoverScale,
} from "@/components/ui";
import { faqs } from "@/data";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

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
  const isDark = resolvedTheme === "dark";

  return (
    <FadeInView delay={index * 0.05}>
      <motion.div
        layout
        className={cn(
          "overflow-hidden rounded-xl border",
          isDark
            ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            : "border-gray-200 bg-white hover:border-gray-300",
        )}
      >
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors",
            isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                isDark
                  ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                  : "bg-gradient-to-br from-blue-100 to-cyan-100",
              )}
            >
              <HelpCircle className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-blue-500")} />
            </div>
            <span className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-800")}>
              {question}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex-shrink-0 rounded-full p-1",
              isOpen
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500",
            )}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("border-t", isDark ? "border-slate-700" : "border-gray-200")}
            >
              <div className={cn("px-6 pt-4 pb-5", isDark ? "bg-slate-900/50" : "bg-gray-50")}>
                <p
                  className={cn(
                    "pl-11 leading-relaxed",
                    isDark ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {answer}
                </p>
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
  const isDark = resolvedTheme === "dark";

  return (
    <Section
      background="gradient"
      padding="xl"
      className={isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : ""}
    >
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-500/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
          >
            <HelpCircle className="h-10 w-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1
            className={cn(
              "mb-6 text-4xl font-bold md:text-5xl lg:text-6xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn("text-xl leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}>
            Find answers to common questions about ComES, membership, events, and more. Can't find
            what you're looking for? Contact us!
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Search Section
const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "dark" : "white"} padding="md">
      <FadeInView>
        <div className="mx-auto max-w-xl">
          <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
            <Search
              className={cn(
                "absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2",
                isDark ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full rounded-full border py-4 pr-6 pl-14 text-lg transition-all focus:ring-2 focus:outline-none",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  : "focus:border-comesBlue focus:ring-comesBlue/20 border-gray-300 bg-white text-gray-900 placeholder-gray-400",
              )}
            />
            <motion.div
              className="absolute top-1/2 right-3 -translate-y-1/2"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-amber-400" />
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
  const isDark = resolvedTheme === "dark";

  // Group FAQs by category
  const faqsByCategory = faqs.reduce(
    (acc, faq) => {
      const category = faq.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    },
    {} as Record<string, typeof faqs>,
  );

  return (
    <Section background={isDark ? "white" : "gray"}>
      <div className="mx-auto max-w-3xl space-y-10">
        {Object.entries(faqsByCategory).map(([category, categoryFaqs], catIndex) => (
          <FadeInView key={category} delay={catIndex * 0.1}>
            <motion.div layout>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-comesBlue")}>
                  {category}
                </h2>
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
  const isDark = resolvedTheme === "dark";

  const quickLinks = [
    {
      title: "About ComES",
      description: "Learn more about our mission, vision, and history.",
      link: "/about",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Upcoming Events",
      description: "Check out our calendar of events and workshops.",
      link: "/events",
      icon: Calendar,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Our Projects",
      description: "Explore the innovative projects built by our members.",
      link: "/projects",
      icon: Code2,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Join Our Team",
      description: "Become a part of the ComES family.",
      link: "/contact",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <Section background={isDark ? "dark" : "white"}>
      <FadeInView>
        <SectionHeader
          title="Quick Links"
          subtitle="Explore more about ComES and our activities."
        />
      </FadeInView>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link, index) => (
          <FadeInView key={index} delay={index * 0.1}>
            <HoverScale>
              <Card
                hoverable
                padding="lg"
                className={cn(
                  "h-full text-center",
                  isDark && "border-slate-700/50 bg-slate-800/50 hover:border-slate-600",
                )}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${link.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg`}
                >
                  <link.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3
                  className={cn("mb-2 text-lg font-bold", isDark ? "text-white" : "text-comesBlue")}
                >
                  {link.title}
                </h3>
                <p className={cn("mb-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  {link.description}
                </p>
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
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Glowing orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-0 h-32 w-32 rounded-full bg-blue-500/30 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-cyan-500/30 blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
          >
            <HelpCircle className="h-8 w-8 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Still Have{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className="mb-8 text-xl text-blue-100">
            We're here to help! Reach out to us and we'll get back to you as soon as possible.
          </p>
        </FadeInView>

        <FadeInView delay={0.3}>
          <HoverScale>
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
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
