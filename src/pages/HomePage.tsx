// ============================================
// ComES Website - Home Page
// ============================================

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Users,
  Calendar,
  Code2,
  Award,
  Rocket,
  Zap,
  Sparkles,
  TrendingUp,
  Star,
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
import { STATISTICS } from "@/constants";
import { getFeaturedEvents, getFeaturedProjects, testimonials } from "@/data";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

// Hero Section
const HeroSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={cn(
        "relative flex min-h-[90vh] items-center justify-center overflow-hidden",
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
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
                  "mb-6 inline-flex items-center gap-2",
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
                "mb-10 max-w-2xl text-lg leading-relaxed md:text-xl",
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
                <Button href="/about" variant="outline" size="lg">
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
            className="w-full max-w-md flex-1 lg:max-w-lg"
          >
            <ModernRobot isDark={isDark} className="h-auto w-full" />
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {STATISTICS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                "rounded-2xl border p-6 backdrop-blur-sm transition-all",
                isDark
                  ? "border-slate-700/50 bg-slate-800/50 shadow-lg shadow-black/20"
                  : "border-white/50 bg-white/80 shadow-lg",
              )}
            >
              <div
                className={cn(
                  "mb-1 text-3xl font-bold md:text-4xl",
                  isDark ? "text-white" : "text-comesBlue",
                )}
              >
                {stat.value}
                {stat.suffix}
              </div>
              <div className={cn("font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className={cn("h-8 w-8", isDark ? "text-blue-400" : "text-comesBlue")} />
          </motion.div>
        </motion.div>
      </div>
    </section>
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
              "mb-6 text-lg leading-relaxed",
              isDark ? "text-gray-400" : "text-gray-600",
            )}
          >
            ComES is dedicated to creating an environment where students can thrive, innovate, and
            make meaningful contributions to the field of computer engineering. Through workshops,
            hackathons, and industry connections, we prepare students for successful careers in
            technology.
          </p>
          <p
            className={cn(
              "mb-8 text-lg leading-relaxed",
              isDark ? "text-gray-400" : "text-gray-600",
            )}
          >
            Join our community of passionate learners and future tech leaders.
          </p>
          <HoverScale>
            <Button href="/about" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
              Discover Our Story
            </Button>
          </HoverScale>
        </FadeInView>

        <div className="grid grid-cols-2 gap-4">
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
  const featuredEvents = getFeaturedEvents(3);

  return (
    <Section background={isDark ? "white" : "gray"}>
      <FadeInView>
        <SectionHeader
          title="Upcoming Events"
          subtitle="Join us for exciting events that foster learning, innovation, and community building."
        />
      </FadeInView>

      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredEvents.map((event, index) => (
          <FadeInView key={event.id} direction="up" delay={index * 0.1}>
            <motion.div whileHover={{ y: -10 }}>
              <Card
                hoverable
                padding="none"
                className={cn(isDark && "border-slate-700 bg-slate-800")}
              >
                <div
                  className={`bg-gradient-to-r ${event.color} relative overflow-hidden p-6 text-white`}
                >
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-4xl">{event.icon}</span>
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
                        {event.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p
                    className={cn("mb-4 line-clamp-2", isDark ? "text-gray-400" : "text-gray-600")}
                  >
                    {event.description}
                  </p>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
                      {event.registered}/{event.capacity} registered
                    </span>
                    <div
                      className={cn(
                        "h-2 w-24 rounded-full",
                        isDark ? "bg-slate-700" : "bg-gray-200",
                      )}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Register Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          </FadeInView>
        ))}
      </div>

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
  const featuredProjects = getFeaturedProjects(4);

  return (
    <Section background={isDark ? "dark" : "white"}>
      <FadeInView>
        <SectionHeader
          title="Our Projects"
          subtitle="Explore innovative projects built by our talented members."
        />
      </FadeInView>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <FadeInView
            key={project.id}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={index * 0.1}
          >
            <motion.div whileHover={{ y: -5 }}>
              <Card
                hoverable
                padding="none"
                className={cn(
                  "flex flex-col overflow-hidden",
                  isDark && "border-slate-700/50 bg-slate-800/50",
                )}
              >
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge variant={project.status === "Completed" ? "success" : "info"} size="sm">
                      <Zap className="mr-1 h-3 w-3" />
                      {project.status}
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      {project.category}
                    </Badge>
                  </div>
                  <h3
                    className={cn(
                      "mb-2 text-xl font-bold",
                      isDark ? "text-white" : "text-comesBlue",
                    )}
                  >
                    {project.title}
                  </h3>
                  <p className={cn("mb-4", isDark ? "text-gray-400" : "text-gray-600")}>
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className={cn(
                          "rounded-lg px-2 py-1 text-xs",
                          isDark ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600",
                        )}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <FadeInView key={testimonial.id} direction="up" delay={index * 0.15}>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className={cn(
                "rounded-2xl border p-6 backdrop-blur-sm transition-all",
                isDark ? "border-slate-700/50 bg-slate-800/50" : "border-white/10 bg-white/10",
              )}
            >
              <div className="mb-4 flex items-center gap-4">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-200")}>
                    {testimonial.role} at {testimonial.company}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-blue-400" : "text-blue-300")}>
                    Batch of {testimonial.batch}
                  </p>
                </div>
              </div>
              <div className="mb-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className={cn("italic", isDark ? "text-gray-300" : "text-blue-100")}>
                "{testimonial.quote}"
              </p>
            </motion.div>
          </FadeInView>
        ))}
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
          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/4 h-20 w-20 rounded-full border border-dashed border-blue-300/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute right-1/4 bottom-0 h-16 w-16 rounded-full border border-dashed border-amber-300/30"
          />

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
              <Button href="/contact" size="lg" icon={<Rocket className="h-5 w-5" />}>
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
