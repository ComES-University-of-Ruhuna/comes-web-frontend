import { HomeIntro } from "@/components/layout/HomeIntro";
// ============================================
// ComES Website - Home Page
// ============================================

import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Calendar,
  Code2,
  Award,
  Rocket,
  Zap,
  TrendingUp,
  Clock3,
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
} from "@/components/ui";
import { useFeaturedEvents, useFeaturedProjects } from "@/hooks/useApi";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

const PendingContent = () => (
  <div
    className="mx-auto flex max-w-xl items-center justify-center gap-3 border-y border-current/15 py-8 text-center"
    role="status"
  >
    <Clock3 className="h-5 w-5 shrink-0 text-[var(--site-muted)]" />
    <p className="text-sm">No updates published yet.</p>
  </div>
);

// Hero Section
const HeroSection = HomeIntro;

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
                className={cn(
                  "rounded-lg border p-6 text-center transition-all",
                  isDark
                    ? "border-slate-700/50 bg-slate-800/50"
                    : "border-gray-100 bg-white shadow-lg",
                )}
              >
                <motion.div
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
              <motion.div>
                <Card
                  hoverable
                  padding="none"
                  className={cn("flex h-full flex-col", isDark && "border-slate-700 bg-slate-800")}
                >
                  <div className="site-accent-panel relative overflow-hidden from-blue-500 to-cyan-500 p-6 text-white">
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
                        {event.registeredCount}
                        {event.maxParticipants ? `/${event.maxParticipants}` : ""} registered
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
                            width: `${event.maxParticipants ? Math.min((event.registeredCount / event.maxParticipants) * 100, 100) : 0}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="site-accent-panel h-2 rounded-full from-blue-500 to-cyan-500"
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
              <motion.div>
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
      className={cn(isDark && "site-accent-panel from-slate-900 via-blue-950 to-slate-900")}
    >
      <FadeInView direction="up">
        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="site-accent-panel mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
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
