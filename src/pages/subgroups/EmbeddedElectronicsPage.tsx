// ============================================
// ComES Website - Embedded and Electronics Subgroup Page
// ============================================

import { motion } from "framer-motion";
import { Cpu, Zap, Radio, CircuitBoard, Microchip, Bot } from "lucide-react";
import { Section, SectionHeader, Card, PageTransition, FadeInView } from "@/components/ui";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const EmbeddedElectronicsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const focusAreas = [
    {
      icon: Microchip,
      title: "Microcontrollers",
      description: "Programming Arduino, ESP32, STM32, and other microcontroller platforms.",
    },
    {
      icon: CircuitBoard,
      title: "PCB Design",
      description: "Designing and manufacturing custom printed circuit boards.",
    },
    {
      icon: Bot,
      title: "Robotics",
      description: "Building autonomous robots and intelligent automation systems.",
    },
    {
      icon: Radio,
      title: "IoT Systems",
      description: "Creating connected devices and smart sensor networks.",
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section
        background="gradient"
        padding="xl"
        className={cn(isDark && "bg-gradient-to-br from-slate-950 via-green-950 to-slate-950")}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
          >
            <Cpu className="h-10 w-10 text-white" />
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
            Embedded and Electronics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn("text-xl leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}
          >
            Where hardware meets software. Our Embedded Systems subgroup bridges the gap between
            electronics and programming to create innovative solutions.
          </motion.p>
        </div>
      </Section>

      {/* Focus Areas */}
      <Section padding="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Explore our expertise in embedded systems and electronics"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {focusAreas.map((area, index) => (
            <FadeInView key={area.title} delay={index * 0.1}>
              <Card hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  <div
                    className={cn("rounded-xl p-3", isDark ? "bg-green-500/20" : "bg-green-100")}
                  >
                    <area.icon
                      className={cn("h-6 w-6", isDark ? "text-green-400" : "text-green-600")}
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
          subtitle="Hands-on learning in embedded systems and electronics"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <FadeInView>
            <Card hoverable padding="lg" className="text-center">
              <Zap
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
                Hardware Workshops
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Learn soldering, circuit design, and hardware debugging techniques.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Card hoverable padding="lg" className="text-center">
              <Bot
                className={cn(
                  "mx-auto mb-4 h-12 w-12",
                  isDark ? "text-emerald-400" : "text-emerald-600",
                )}
              />
              <h3
                className={cn(
                  "mb-2 text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Robotics Competitions
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Build and compete with robots in national and international competitions.
              </p>
            </Card>
          </FadeInView>
          <FadeInView delay={0.2}>
            <Card hoverable padding="lg" className="text-center">
              <CircuitBoard
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
                IoT Projects
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Create smart devices and connected systems for real-world applications.
              </p>
            </Card>
          </FadeInView>
        </div>
      </Section>
    </PageTransition>
  );
};

export default EmbeddedElectronicsPage;
