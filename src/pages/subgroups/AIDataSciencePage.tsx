// ============================================
// ComES Website - AI and Data Science Subgroup Page
// ============================================

import { motion } from "framer-motion";
import { Brain, BarChart3, Database, Cpu, LineChart, Sparkles } from "lucide-react";
import { Section, SectionHeader, Card, PageTransition, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const AIDataSciencePage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const focusAreas = [
    {
      icon: Brain,
      title: "Machine Learning",
      description: "Building intelligent systems that learn from data and improve over time.",
    },
    {
      icon: Sparkles,
      title: "Deep Learning",
      description: "Neural networks and advanced AI architectures for complex problem-solving.",
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description: "Extracting insights from large datasets to drive decision-making.",
    },
    {
      icon: Database,
      title: "Big Data",
      description: "Processing and analyzing massive datasets with distributed computing.",
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section
        background="gradient"
        padding="xl"
        className={cn(isDark && "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950")}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"
          >
            <Brain className="h-10 w-10 text-white" />
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
            AI and Data Science
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn("text-xl leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}
          >
            Unlocking the power of data and artificial intelligence. Our AI & Data Science subgroup
            explores cutting-edge technologies shaping the future.
          </motion.p>
        </div>
      </Section>

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Discover our areas of expertise in AI and data science"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div
                    className={cn("rounded-xl p-3", isDark ? "bg-purple-500/20" : "bg-purple-100")}
                  >
                    <area.icon
                      className={cn("h-6 w-6", isDark ? "text-purple-400" : "text-purple-600")}
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
          subtitle="How we nurture AI and data science skills"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Cpu
                className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-pink-400" : "text-pink-600")}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                AI Workshops
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Hands-on sessions on machine learning frameworks like TensorFlow and PyTorch.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <LineChart
                className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-cyan-400" : "text-cyan-600")}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Kaggle Competitions
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Participate in data science competitions to test and improve your skills.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <Brain
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
                Research Projects
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Collaborate on cutting-edge AI research with faculty and industry partners.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default AIDataSciencePage;
