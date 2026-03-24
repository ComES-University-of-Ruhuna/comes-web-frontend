// ============================================
// ComES Website - FAQ Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ChevronDown, HelpCircle } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { faqs, faqCategories } from "@/data";

const ease = [0.25, 0.46, 0.45, 0.94];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ question, answer, isOpen, onToggle }: AccordionItemProps) => (
  <motion.div className="bg-bg-card overflow-hidden rounded-2xl border border-border-d transition-all hover:border-[rgba(14,165,233,0.25)]">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-6 py-5 text-left"
    >
      <h3 className="font-display text-text-primary pr-4 text-base font-semibold">{question}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="shrink-0"
      >
        <ChevronDown className="text-accent-blue h-5 w-5" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <div className="border-t border-border-d px-6 py-5">
            <p className="font-body text-text-secondary leading-relaxed">{answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cats = faqCategories || ["All"];
  const allFaqs = faqs || [];

  const filtered =
    activeCategory === "All" ? allFaqs : allFaqs.filter((f) => f.category === activeCategory);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
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
              <span className="text-accent-blue">FAQ</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
              Find answers to common questions about ComES.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs + Accordion */}
      <section className="bg-bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {cats.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(null);
                  }}
                  className={`font-body rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-bg-card text-text-secondary hover:border-accent-blue/40 border border-border-d"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </FadeInView>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {filtered.length > 0 ? (
                filtered.map((faq, i) => (
                  <FadeInView key={faq.id || i} direction="up" delay={i * 0.05}>
                    <AccordionItem
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openIndex === i}
                      onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                    />
                  </FadeInView>
                ))
              ) : (
                <div className="py-16 text-center">
                  <HelpCircle className="text-text-muted mx-auto mb-4 h-16 w-16" />
                  <h3 className="font-display text-text-primary mb-2 text-xl font-semibold">
                    No FAQs Found
                  </h3>
                  <p className="font-body text-text-secondary">
                    Try selecting a different category.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
};

export default FAQPage;
