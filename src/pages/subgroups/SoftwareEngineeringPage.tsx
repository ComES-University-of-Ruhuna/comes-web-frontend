// ============================================
// ComES Website - Software Engineering Subgroup Page
// ============================================

import { Code, GitBranch, Globe, Laptop, Server, Smartphone } from "lucide-react";
import { Section, SectionHeader, Card, PageTransition, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const SoftwareEngineeringPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const focusAreas = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Building modern web applications using React, Next.js, Node.js, and more.",
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Creating cross-platform mobile apps with React Native and Flutter.",
    },
    {
      icon: Server,
      title: "Backend Development",
      description: "Designing scalable APIs and microservices architectures.",
    },
    {
      icon: GitBranch,
      title: "DevOps & CI/CD",
      description: "Implementing automated pipelines, containerization, and cloud deployments.",
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Explore our key areas of expertise in software development"
          light={false}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-3", isDark ? "bg-blue-500/20" : "bg-blue-100")}>
                    <area.icon
                      className={cn("h-6 w-6", isDark ? "text-blue-400" : "text-blue-600")}
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
          subtitle="What we do to foster software engineering excellence"
          light={false}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Laptop
                className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-cyan-400" : "text-cyan-600")}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Coding Bootcamps
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Intensive workshops to learn new programming languages and frameworks.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <GitBranch
                className={cn(
                  "mx-auto mb-4 h-12 w-12",
                  isDark ? "text-purple-400" : "text-purple-600",
                )}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Open Source Projects
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Contribute to real-world open source projects and build your portfolio.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <Code
                className={cn(
                  "mx-auto mb-4 h-12 w-12",
                  isDark ? "text-green-400" : "text-green-600",
                )}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Code Reviews
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Learn best practices through peer code reviews and mentorship.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default SoftwareEngineeringPage;
