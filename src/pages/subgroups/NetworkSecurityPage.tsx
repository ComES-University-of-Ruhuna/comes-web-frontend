// ============================================
// ComES Website - Network and Security Subgroup Page
// ============================================

import { motion } from "framer-motion";
import { Shield, Network, Lock, Eye, Server, Bug } from "lucide-react";
import { Section, SectionHeader, Card, PageTransition, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const NetworkSecurityPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const focusAreas = [
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Protecting systems and data from cyber threats and vulnerabilities.",
    },
    {
      icon: Network,
      title: "Network Infrastructure",
      description: "Designing and managing secure network architectures.",
    },
    {
      icon: Bug,
      title: "Penetration Testing",
      description: "Ethical hacking and vulnerability assessment techniques.",
    },
    {
      icon: Lock,
      title: "Cryptography",
      description: "Encryption algorithms and secure communication protocols.",
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section
        background="gradient"
        padding="xl"
        className={cn(isDark && "bg-gradient-to-br from-slate-950 via-red-950 to-slate-950")}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "mb-6 text-4xl font-bold md:text-5xl lg:text-6xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Network and Security
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn("text-xl leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}
          >
            Defending the digital frontier. Our Network and Security subgroup focuses on building
            resilient systems and protecting against cyber threats.
          </motion.p>
        </div>
      </Section>

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Our areas of expertise in network and cybersecurity"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-xl p-3", isDark ? "bg-red-500/20" : "bg-red-100")}>
                    <area.icon
                      className={cn("h-6 w-6", isDark ? "text-red-400" : "text-red-600")}
                    />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "mb-2 text-lg font-semibold",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {area.title}
                    </h3>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                      {area.description}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeInView>
          ))}
        </div>
      </Section>

      {/* Activities Section */}
      <Section padding="lg" background="gray">
        <SectionHeader
          title="Our Activities"
          subtitle="Building cybersecurity skills through practical experience"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Eye
                className={cn(
                  "mx-auto mb-4 h-12 w-12",
                  isDark ? "text-orange-400" : "text-orange-600",
                )}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                CTF Competitions
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Capture The Flag challenges to test and improve security skills.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <Server
                className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-red-400" : "text-red-600")}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Network Labs
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Hands-on experience with network configuration and security tools.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <Shield
                className={cn(
                  "mx-auto mb-4 h-12 w-12",
                  isDark ? "text-yellow-400" : "text-yellow-600",
                )}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Security Workshops
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Learn about latest threats, vulnerabilities, and defense strategies.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default NetworkSecurityPage;
