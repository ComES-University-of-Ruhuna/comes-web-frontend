// ============================================
// ComES Website - Newsletter Subscription Component
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Section, Button, HoverScale, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { newsletterService } from "@/services";

interface NewsletterSectionProps {
  title?: string;
  description?: string;
}

export const NewsletterSection = ({
  title = "Stay Updated",
  description = "Subscribe to our newsletter and be the first to know about new events and opportunities.",
}: NewsletterSectionProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await newsletterService.subscribe({ email: email.trim() });
      setIsSubscribed(true);
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to subscribe";
      setError(
        message.includes("Network Error") ? "Unable to connect. Please try again later." : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section background="dark" className={isDark ? "bg-slate-900" : ""}>
      <FadeInView>
        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
          >
            <Bell className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{title}</h2>
          <p className={cn("mb-8 text-xl", isDark ? "text-gray-400" : "text-blue-100")}>
            {description}
          </p>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center gap-3 text-green-400"
              >
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Thanks for subscribing!</span>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    "flex-1 rounded-full border-0 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none",
                    isDark
                      ? "bg-slate-800 text-white placeholder-gray-500"
                      : "bg-white text-gray-900",
                  )}
                  required
                  disabled={isSubmitting}
                />
                <HoverScale>
                  <Button
                    type="submit"
                    variant="secondary"
                    icon={<Send className="h-4 w-4" />}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Subscribe
                  </Button>
                </HoverScale>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-center justify-center gap-2 text-red-400"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeInView>
    </Section>
  );
};

export default NewsletterSection;
