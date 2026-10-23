// ============================================
// ComES Website - Terms of Use Page
// ============================================

import { Scale } from "lucide-react";
import { Section, Card, PageTransition, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { SITE_CONFIG } from "@/constants";

export const TermsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <PageTransition>
      {/* Header Section */}
      <Section background={isDark ? "dark" : "gray"} padding="lg">
        <FadeInView>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/20">
              <Scale className="h-7 w-7" />
            </div>
            <h1 className={cn("text-4xl font-bold tracking-tight sm:text-5xl", isDark ? "text-white" : "text-gray-900")}>
              Terms of Use
            </h1>
            <p className={cn("mt-4 text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
              Last updated: October 2026. Terms and conditions governing your use of the ComES web platform and student services.
            </p>
          </div>
        </FadeInView>
      </Section>

      {/* Content Section */}
      <Section background={isDark ? "white" : "white"} padding="lg">
        <div className="mx-auto max-w-4xl space-y-10">
          <FadeInView>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                1. Acceptance of Terms
              </h2>
              <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                By accessing or registering with the Computer Engineering Society website ({SITE_CONFIG.url}), you agree to be bound by these Terms of Use and all applicable university policies and codes of conduct instituted by the Faculty of Engineering, University of Ruhuna.
              </p>
            </Card>
          </FadeInView>

          <FadeInView delay={0.1}>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                2. User Accounts & Responsibilities
              </h2>
              <p className={cn("leading-relaxed mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
                Student and member accounts are individual and personal. As an account holder, you agree:
              </p>
              <ul className={cn("space-y-2 list-disc list-inside", isDark ? "text-gray-300" : "text-gray-600")}>
                <li>To provide accurate student registration and contact details during enrollment.</li>
                <li>To safeguard your login credentials and immediately report any unauthorized access.</li>
                <li>To refrain from submitting offensive, infringing, or malicious content on competition team forums or event feedback forms.</li>
              </ul>
            </Card>
          </FadeInView>

          <FadeInView delay={0.2}>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                3. Society Events & Competition Guidelines
              </h2>
              <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                Participation in ComES hackathons, workshops, and competitions is subject to individual event rulebooks. The organizing committee reserves the right to modify event agendas, registration deadlines, or disqualify participants found violating fair competition standards.
              </p>
            </Card>
          </FadeInView>

          <FadeInView delay={0.3}>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                4. Inquiries & Disciplinary Matters
              </h2>
              <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                For queries regarding society bylaws or the terms of this website, reach out to{" "}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="font-medium text-blue-500 hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default TermsPage;
