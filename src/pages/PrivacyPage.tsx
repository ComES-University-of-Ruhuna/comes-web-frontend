// ============================================
// ComES Website - Privacy Policy Page
// ============================================

import { Shield } from "lucide-react";
import { Section, Card, PageTransition, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { SITE_CONFIG } from "@/constants";

export const PrivacyPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <PageTransition>
      {/* Header Section */}
      <Section background={isDark ? "dark" : "gray"} padding="lg">
        <FadeInView>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className={cn("text-4xl font-bold tracking-tight sm:text-5xl", isDark ? "text-white" : "text-gray-900")}>
              Privacy Policy
            </h1>
            <p className={cn("mt-4 text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
              Last updated: October 2026. How the Computer Engineering Society (ComES) collects, uses, and safeguards your information.
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
                1. Information We Collect
              </h2>
              <p className={cn("leading-relaxed mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
                When you create an account, register for events, or participate in society activities, we collect relevant academic and contact details, including:
              </p>
              <ul className={cn("space-y-2 list-disc list-inside", isDark ? "text-gray-300" : "text-gray-600")}>
                <li>Personal identification details: Name, email address, registration number, and batch.</li>
                <li>Society participation data: Registered events, quiz completions, team memberships, and committee affiliations.</li>
                <li>Profile details you optionally share: Bio, profile photos, GitHub and LinkedIn links, and skills.</li>
              </ul>
            </Card>
          </FadeInView>

          <FadeInView delay={0.1}>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                2. How We Use Your Information
              </h2>
              <p className={cn("leading-relaxed mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
                The information collected is used exclusively to facilitate university and society operations, such as:
              </p>
              <ul className={cn("space-y-2 list-disc list-inside", isDark ? "text-gray-300" : "text-gray-600")}>
                <li>Facilitating event sign-ups, hackathons, workshops, and team registrations.</li>
                <li>Maintaining authenticated access to the student dashboard and internal member tools.</li>
                <li>Issuing announcements, certificates, and event updates.</li>
                <li>Ensuring security and adherence to faculty code-of-conduct guidelines.</li>
              </ul>
            </Card>
          </FadeInView>

          <FadeInView delay={0.2}>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                3. Privacy & Portfolio Controls
              </h2>
              <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                Member portfolios and sensitive profile data are protected and require authenticated student or administrative society credentials to view. We do not sell, rent, or trade your personal information with any third-party commercial organizations.
              </p>
            </Card>
          </FadeInView>

          <FadeInView delay={0.3}>
            <Card className="p-8">
              <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
                4. Contact Information
              </h2>
              <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                If you have questions or concerns about your data privacy or wish to update your records, please contact us at{" "}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="font-medium text-blue-500 hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>{" "}
                or visit the Computer Engineering Department, Faculty of Engineering, University of Ruhuna.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default PrivacyPage;
