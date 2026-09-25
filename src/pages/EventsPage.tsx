// ============================================
// ComES Website - Events Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, Users, Ticket } from "lucide-react";
import {
  Section,
  SectionHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  PageTransition,
  FadeInView,
  HoverScale,
  NewsletterSection,
} from "@/components/ui";
import { events, pastEvents, eventTypeOptions } from "@/data";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import type { Event } from "@/types";

// Event Card Component
const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div>
        <Card
          hoverable
          padding="none"
          className={cn(
            "flex h-full flex-col overflow-hidden",
            isDark && "border-slate-700/50 bg-slate-800/50",
          )}
        >
          <CardHeader gradient={event.color}>
            <div className="mb-4 flex items-center justify-between">
              <motion.span className="text-4xl">{event.icon}</motion.span>
              <Badge variant="secondary" size="sm">
                {event.type}
              </Badge>
            </div>
            <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {event.time}
              </span>
            </div>
          </CardHeader>

          <CardBody className={cn("flex flex-1 flex-col", isDark && "bg-slate-800/50")}>
            <div
              className={cn(
                "mb-3 flex items-center gap-2",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{event.location}</span>
            </div>

            <p
              className={cn("mb-4 line-clamp-3 flex-1", isDark ? "text-gray-400" : "text-gray-600")}
            >
              {event.description}
            </p>

            {event.tags && (
              <div className="mb-4 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded px-2 py-1 text-xs",
                      isDark ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isDark ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  {event.registered}/{event.capacity}
                </span>
                <span
                  className={`text-sm font-medium ${
                    event.registered >= event.capacity
                      ? isDark
                        ? "text-red-400"
                        : "text-red-700"
                      : isDark
                        ? "text-green-400"
                        : "text-green-700"
                  }`}
                >
                  {event.registered >= event.capacity
                    ? "Full"
                    : `${event.capacity - event.registered} spots left`}
                </span>
              </div>

              <div
                className={cn(
                  "mb-4 h-2 w-full rounded-full",
                  isDark ? "bg-slate-700" : "bg-gray-200",
                )}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min((event.registered / event.capacity) * 100, 100)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-2 rounded-full ${
                    event.registered >= event.capacity
                      ? "bg-red-500"
                      : "site-accent-panel from-blue-500 to-cyan-500"
                  }`}
                />
              </div>

              <HoverScale>
                <Button
                  variant={event.registrationOpen ? "primary" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={!event.registrationOpen || event.registered >= event.capacity}
                  icon={<Ticket className="h-4 w-4" />}
                >
                  {event.registrationOpen
                    ? event.registered >= event.capacity
                      ? "Registration Full"
                      : "Register Now"
                    : "Coming Soon"}
                </Button>
              </HoverScale>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Filter Tabs Component
const FilterTabs = ({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <motion.button
          key={option}
          aria-pressed={active === option}
          onClick={() => onChange(option)}
          className={cn(
            "site-filter rounded-lg px-4 py-2 text-sm font-medium transition-all",
            active === option
              ? "site-accent-panel from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              : isDark
                ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
};

// Hero Section

// Upcoming Events Section
const UpcomingEventsSection = () => {
  const [filter, setFilter] = useState("All");
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const filteredEvents = filter === "All" ? events : events.filter((e) => e.type === filter);

  return (
    <Section background={isDark ? "dark" : "white"}>
      <FadeInView>
        <SectionHeader
          title="Upcoming Events"
          subtitle="Don't miss out on these exciting opportunities to learn and connect."
          light={isDark}
        />
      </FadeInView>

      <FilterTabs options={eventTypeOptions} active={filter} onChange={setFilter} />

      <AnimatePresence mode="wait">
        {filteredEvents.length > 0 ? (
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className={cn("text-lg", isDark ? "text-gray-500" : "text-gray-500")}>
              No {filter.toLowerCase()} events scheduled at the moment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

// Past Events Section
const PastEventsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "white" : "gray"} className={isDark ? "bg-slate-950" : ""}>
      <FadeInView>
        <SectionHeader
          title="Past Events"
          subtitle="A look back at our previous events and achievements."
          light={false}
        />
      </FadeInView>

      <div className="grid gap-6 md:grid-cols-2">
        {pastEvents.map((event, index) => (
          <FadeInView key={event.id} direction="left" delay={index * 0.1}>
            <motion.div>
              <Card
                padding="lg"
                className={cn(
                  "flex items-start gap-4",
                  isDark && "border-slate-700/50 bg-slate-800/50",
                )}
              >
                <motion.div className="text-4xl">{event.icon}</motion.div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3
                      className={cn("text-lg font-bold", isDark ? "text-white" : "text-comesBlue")}
                    >
                      {event.title}
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {event.type}
                    </Badge>
                  </div>
                  <p className={cn("mb-2 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    {event.description}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-4 text-sm",
                      isDark ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {event.registered} participants
                    </span>
                  </div>
                </div>
              </Card>
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
    <Section background={isDark ? "dark" : "white"} padding="xl">
      <FadeInView>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="site-accent-panel mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          <h2
            className={cn(
              "mb-6 text-3xl font-bold md:text-4xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Want to Host an Event?
          </h2>
          <p className={cn("mb-8 text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
            Have an idea for a workshop, seminar, or any other event? We'd love to hear from you!
            Let's collaborate and create amazing experiences for our community.
          </p>
          <HoverScale>
            <Button href="/contact" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              Get In Touch
            </Button>
          </HoverScale>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main Events Page Component
export const EventsPage = () => {
  return (
    <PageTransition>
      <UpcomingEventsSection />
      <PastEventsSection />
      <NewsletterSection
        title="Stay Updated"
        description="Subscribe to our newsletter and be the first to know about new events and opportunities."
        compact
      />
      <CTASection />
    </PageTransition>
  );
};

export default EventsPage;
