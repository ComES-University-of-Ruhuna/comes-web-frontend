// ============================================
// ComES Website - Events Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Calendar, MapPin, ArrowRight, Search, CalendarCheck } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { getFeaturedEvents } from "@/data";

const ease = [0.25, 0.46, 0.45, 0.94];

const tabs = ["All", "Upcoming", "Past", "Workshops", "Competitions", "Webinars"];

export const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const allEvents = getFeaturedEvents(9);

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "All") return matchesSearch;
    return matchesSearch && event.type.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
        <div className="circuit-grid absolute inset-0 opacity-30" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="font-body text-text-muted mb-6 flex items-center justify-center gap-2 text-sm">
              <Link to="/" className="hover:text-accent-blue transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent-blue">Events</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Events
            </h1>
            <p className="font-body text-text-secondary mx-auto mb-10 max-w-2xl text-lg">
              Discover workshops, hackathons, competitions, and more from ComES.
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-md">
              <div className="bg-bg-card flex items-center gap-3 rounded-full border border-border-h px-5 py-3">
                <Search className="text-text-muted h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-body text-text-primary placeholder:text-text-muted w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs + Grid */}
      <section className="bg-bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <FadeInView>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-bg-card text-text-secondary hover:border-accent-blue/40 hover:text-text-primary border border-border-d"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </FadeInView>

          {/* Event Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, i) => (
                  <FadeInView key={event.id} direction="up" delay={i * 0.05}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="group bg-bg-card flex h-full flex-col overflow-hidden rounded-2xl border border-border-d transition-all hover:border-border-h hover:shadow-glow-sm"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={`https://placehold.co/600x300/0D1E35/0EA5E9?text=${encodeURIComponent(event.title)}`}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className="bg-accent-blue/90 rounded-full px-3 py-1 font-mono text-xs font-medium text-white">
                            {event.type}
                          </span>
                          {event.isUpcoming && (
                            <span className="animate-pulse-glow rounded-full bg-emerald-500/90 px-3 py-1 font-mono text-xs font-medium text-white">
                              UPCOMING
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-text-primary mb-2 text-lg font-semibold">
                          {event.title}
                        </h3>
                        <div className="text-text-muted mb-3 flex flex-wrap gap-3">
                          <span className="font-body flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" /> {event.date}
                          </span>
                          {event.location && (
                            <span className="font-body flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </span>
                          )}
                        </div>
                        <p className="font-body text-text-secondary mb-4 line-clamp-2 flex-1 text-sm">
                          {event.description}
                        </p>
                        <Link
                          to="/events"
                          className="font-body text-accent-blue inline-flex items-center gap-1 text-sm font-medium"
                        >
                          Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  </FadeInView>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <CalendarCheck className="text-text-muted mx-auto mb-4 h-16 w-16" />
                  <h3 className="font-display text-text-primary mb-2 text-xl font-semibold">
                    No Events Found
                  </h3>
                  <p className="font-body text-text-secondary">
                    Try adjusting your search or filter.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
};

export default EventsPage;
