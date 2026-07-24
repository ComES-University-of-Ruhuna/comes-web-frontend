// ============================================
// ComES Website - Home Page
// ============================================

import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  ArrowRight,
  Users,
  Calendar,
  Code2,
  Award,
  Rocket,
  Zap,
  Sparkles,
  TrendingUp,
  Clock3,
  Cpu,
  Shield,
  Brain,
  GitBranch,
} from "lucide-react";
import {
  Button,
  Section,
  SectionHeader,
  Card,
  Badge,
  PageTransition,
  FadeInView,
  HoverScale,
  ModernRobot,
} from "@/components/ui";
import { useFeaturedEvents, useFeaturedProjects } from "@/hooks/useApi";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const PendingContent = () => (
  <div
    className="mx-auto flex max-w-xl flex-col items-center border-y border-current/15 py-12 text-center"
    role="status"
  >
    <Clock3 className="mb-4 h-8 w-8 text-blue-500" />
    <h3 className="text-xl font-semibold">Pending</h3>
  </div>
);

// Hero Section
const HeroSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <section
        className={cn(
          "relative flex min-h-[calc(88svh-4rem)] items-center justify-center overflow-hidden md:min-h-[calc(88svh-5rem)]",
          isDark
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950"
            : "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
        )}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className={cn(
              "absolute inset-0 [background-size:24px_24px]",
              isDark
                ? "bg-[radial-gradient(#3b82f6_1px,transparent_1px)]"
                : "bg-[radial-gradient(#003366_1px,transparent_1px)]",
            )}
          />
        </div>

        {/* Animated Decorative Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className={cn(
            "absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl",
            isDark ? "bg-blue-500/20" : "bg-comesBlue/10",
          )}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className={cn(
            "absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl",
            isDark ? "bg-cyan-500/20" : "bg-comesGold/10",
          )}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  size="lg"
                  className={cn(
                    "mb-6 inline-flex max-w-full items-center justify-center gap-2 text-center leading-snug",
                    isDark && "border-blue-500/30 bg-blue-500/20 text-blue-300",
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Registration Open for Membership
                </Badge>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 text-5xl font-extrabold md:text-7xl lg:text-8xl"
              >
                <span
                  className={cn(
                    "bg-clip-text text-transparent",
                    isDark
                      ? "bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"
                      : "from-comesBlue to-comesBlue bg-gradient-to-r via-blue-600",
                  )}
                >
                  ComES
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={cn(
                  "mb-8 text-xl font-medium md:text-3xl",
                  isDark ? "text-gray-300" : "text-comesBlue opacity-90",
                )}
              >
                Computer Engineering Society
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={cn(
                  "mb-8 max-w-2xl text-left text-base leading-relaxed sm:text-lg md:mb-10 md:text-xl",
                  isDark ? "text-gray-400" : "text-gray-600",
                  "mx-auto lg:mx-0",
                )}
              >
                The official student society for Computer Engineering at the Faculty of Engineering,
                University of Ruhuna. Empowering students, fostering innovation, and building a
                vibrant tech community.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              >
                <HoverScale>
                  <Button
                    href="/register"
                    size="lg"
                    icon={<Rocket className="h-5 w-5" />}
                    className="shadow-comesBlue/25 shadow-lg"
                  >
                    Join ComES
                  </Button>
                </HoverScale>
                <HoverScale>
                  <Button
                    href="/about"
                    variant="outline"
                    size="lg"
                    className={cn(
                      isDark && "hover:text-comesBlue border-white text-white hover:bg-white",
                    )}
                  >
                    Learn More
                  </Button>
                </HoverScale>
              </motion.div>
            </div>

            {/* Right Side - Robot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-64 flex-1 sm:max-w-sm lg:max-w-lg"
            >
              <ModernRobot isDark={isDark} className="h-auto w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className={cn(
          "border-y py-12 sm:py-16",
          isDark ? "border-slate-800 bg-slate-950" : "border-blue-100 bg-white",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Domains */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6"
          >
            {[
              {
                icon: <Cpu className="h-6 w-6" />,
                label: "Electronics & Embedded Systems",
                gradient: "from-emerald-500 to-teal-500",
                glow: "shadow-emerald-500/30",
                href: "/subgroups/embedded-electronics",
              },
              {
                icon: <GitBranch className="h-6 w-6" />,
                label: "Software Engineering",
                gradient: "from-blue-500 to-cyan-500",
                glow: "shadow-blue-500/30",
                href: "/subgroups/software-engineering",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                label: "Network & Cyber Security",
                gradient: "from-purple-500 to-indigo-500",
                glow: "shadow-purple-500/30",
                href: "/subgroups/network-security",
              },
              {
                icon: <Brain className="h-6 w-6" />,
                label: "AI & Data Science",
                gradient: "from-amber-500 to-orange-500",
                glow: "shadow-amber-500/30",
                href: "/subgroups/ai-data-science",
              },
            ].map((domain, index) => (
              <motion.div
                key={domain.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Link
                  to={domain.href}
                  className={cn(
                    "group relative flex h-full cursor-pointer flex-col items-center gap-3 overflow-hidden rounded-2xl border p-4 text-center backdrop-blur-sm transition-all sm:gap-4 sm:p-6",
                    isDark
                      ? "border-slate-700/50 bg-slate-800/50 shadow-lg shadow-black/20 hover:border-slate-600/70"
                      : "border-white/70 bg-white/80 shadow-lg hover:border-white",
                  )}
                >
                  {/* Animated background glow on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10",
                      domain.gradient,
                    )}
                  />
                  {/* Floating icon */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                      domain.gradient,
                      domain.glow,
                    )}
                  >
                    {domain.icon}
                  </motion.div>
                  <span
                    className={cn(
                      "relative z-10 text-sm leading-tight font-semibold",
                      isDark ? "text-gray-200" : "text-comesBlue",
                    )}
                  >
                    {domain.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

// About Preview Section
const AboutPreviewSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const features = [
    {
      icon: <Users className="h-7 w-7" />,
      title: "Community",
      description: "Building connections and networks among students and professionals.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      title: "Events",
      description: "Workshops, hackathons, and seminars on trending technologies.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <Code2 className="h-7 w-7" />,
      title: "Projects",
      description: "Hands-on projects solving real-world problems.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="h-7 w-7" />,
      title: "Excellence",
      description: "Striving for the highest standards in everything we do.",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <Section background={isDark ? "dark" : "white"}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <FadeInView direction="right">
          <h2
            className={cn(
              "mb-6 text-3xl font-bold md:text-4xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Empowering Future Engineers
          </h2>
          <p
            className={cn(
              "mb-6 text-left text-base leading-relaxed font-medium sm:text-lg",
              isDark ? "text-gray-300" : "text-gray-600",
            )}
          >
            ComES is dedicated to creating an environment where students can thrive, innovate, and
            make meaningful contributions to the field of computer engineering. Through workshops,
            hackathons, and industry connections, we prepare students for successful careers in
            technology.
          </p>
          <p
            className={cn(
              "mb-8 text-lg leading-relaxed font-medium",
              isDark ? "text-gray-300" : "text-gray-600",
            )}
          >
            Join our community of passionate learners and future tech leaders.
          </p>
          <HoverScale>
            <Button
              href="/about"
              variant="outline"
              icon={<ArrowRight className="h-4 w-4" />}
              className={cn(
                isDark && "hover:text-comesBlue border-white text-white hover:bg-white",
              )}
            >
              Discover Our Story
            </Button>
          </HoverScale>
        </FadeInView>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature, index) => (
            <FadeInView key={index} direction="up" delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={cn(
                  "rounded-2xl border p-6 text-center transition-all",
                  isDark
                    ? "border-slate-700/50 bg-slate-800/50"
                    : "border-gray-100 bg-white shadow-lg",
                )}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className={cn("mb-2 font-semibold", isDark ? "text-white" : "text-comesBlue")}>
                  {feature.title}
                </h3>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  {feature.description}
                </p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </Section>
  );
};

// Events Preview Section
const EventsPreviewSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const { data } = useFeaturedEvents();
  const featuredEvents = (data ?? []).slice(0, 3);

  return (
    <Section
      background={isDark ? "dark" : "white"}
      className={isDark ? "bg-slate-950" : "text-comesBlue"}
    >
      <FadeInView>
        <SectionHeader
          title="Upcoming Events"
          subtitle="Join us for exciting events that foster learning, innovation, and community building."
          light={isDark}
        />
      </FadeInView>

      {featuredEvents.length ? (
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event, index) => (
            <FadeInView key={event._id} direction="up" delay={index * 0.1}>
              <motion.div whileHover={{ y: -10 }}>
                <Card
                  hoverable
                  padding="none"
                  className={cn("flex h-full flex-col", isDark && "border-slate-700 bg-slate-800")}
                >
                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                    <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-4xl">{event.icon || ""}</span>
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="border-white/30 bg-white/20 text-white"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p
                      className={cn(
                        "mb-4 line-clamp-2",
                        isDark ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {event.description}
                    </p>
                    <div className="mb-4 flex items-center justify-between">
                      <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                        {event.registeredUsers.length}/{event.capacity} registered
                      </span>
                      <div
                        className={cn(
                          "h-2 w-24 rounded-full",
                          isDark ? "bg-slate-700" : "bg-gray-200",
                        )}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${event.capacity ? Math.min((event.registeredUsers.length / event.capacity) * 100, 100) : 0}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" href="/events">
                      Register Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      ) : (
        <div className="mb-12">
          <PendingContent />
        </div>
      )}

      <FadeInView className="text-center">
        <HoverScale>
          <Button href="/events" icon={<ArrowRight className="h-4 w-4" />}>
            View All Events
          </Button>
        </HoverScale>
      </FadeInView>
    </Section>
  );
};

// Projects Preview Section
const ProjectsPreviewSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const { data } = useFeaturedProjects();
  const featuredProjects = (data ?? []).slice(0, 4);

  return (
    <Section background="dark" className={isDark ? "bg-slate-900" : ""}>
      <FadeInView>
        <SectionHeader
          title="Our Projects"
          subtitle="Explore innovative projects built by our talented members."
          light
        />
      </FadeInView>

      {featuredProjects.length ? (
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <FadeInView
              key={project._id}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={index * 0.1}
            >
              <motion.div whileHover={{ y: -5 }}>
                <Card
                  hoverable
                  padding="none"
                  className="flex flex-col overflow-hidden border-slate-700/50 bg-slate-800/50"
                >
                  <div className="flex-1 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <Badge
                        variant={project.status === "completed" ? "success" : "info"}
                        size="sm"
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        {project.status.replace("-", " ")}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">{project.title}</h3>
                    <p className="mb-4 text-gray-300">{project.shortDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-slate-700 px-2 py-1 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      ) : (
        <div className="mb-12 text-white">
          <PendingContent />
        </div>
      )}

      <FadeInView className="text-center">
        <HoverScale>
          <Button href="/projects" icon={<ArrowRight className="h-4 w-4" />}>
            View All Projects
          </Button>
        </HoverScale>
      </FadeInView>
    </Section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background="dark" className={isDark ? "bg-slate-900" : ""}>
      <FadeInView>
        <SectionHeader
          title="What Our Alumni Say"
          subtitle="Hear from our past members about their ComES experience."
        />
      </FadeInView>

      <div className="text-white">
        <PendingContent />
      </div>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section
      background="gradient"
      padding="xl"
      className={cn(isDark && "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900")}
    >
      <FadeInView direction="up">
        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
          >
            <TrendingUp className="h-8 w-8 text-white" />
          </motion.div>

          <h2
            className={cn(
              "mb-6 text-3xl font-bold md:text-4xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Ready to Join Our Community?
          </h2>
          <p
            className={cn(
              "mx-auto mb-8 max-w-2xl text-lg",
              isDark ? "text-gray-400" : "text-gray-600",
            )}
          >
            Be part of a vibrant community of future engineers. Learn, grow, and make lasting
            connections.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <HoverScale>
              <Button href="/register" size="lg" icon={<Rocket className="h-5 w-5" />}>
                Get Started
              </Button>
            </HoverScale>
            <HoverScale>
              <Button href="/events" variant="outline" size="lg">
                Explore Events
              </Button>
            </HoverScale>
          </div>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main Home Page Component
export const HomePage = () => {
  return (
    <PageTransition>
      <HeroSection />
      <AboutPreviewSection />
      <EventsPreviewSection />
      <ProjectsPreviewSection />
      <TestimonialsSection />
      <CTASection />
    </PageTransition>
  );
};

export default HomePage;
