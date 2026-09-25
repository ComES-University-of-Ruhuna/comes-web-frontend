// ============================================
// ComES Website - Network and Security Subgroup Page
// ============================================

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

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Our areas of expertise in network and cybersecurity"
          light={false}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-3", isDark ? "bg-red-500/20" : "bg-red-100")}>
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
          light={false}
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
