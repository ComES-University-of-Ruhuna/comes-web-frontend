// ============================================
// ComES Website - Admin Events Management Page
// ============================================

import { useState, useEffect } from "react";
import api from "@/services/api";
import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Users, Clock, Save, X } from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";

interface Event {
  _id: string;
  title: string;
  slug: string;
  type: 'workshop' | 'hackathon' | 'seminar' | 'competition' | 'social' | 'other';
  date: string; // ISO datetime string
  location: string;
  maxParticipants?: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  shortDescription?: string;
  isFeatured: boolean;
}

const eventTypes = ["All", "workshop", "seminar", "competition", "hackathon", "social", "other"];
const eventStatuses = ["All", "upcoming", "ongoing", "completed", "cancelled"];

const EventEditor = ({
  event,
  onClose,
  onSave,
}: {
  event?: Event | null;
  onClose: () => void;
  onSave: (data: Partial<Event>) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const isEditing = !!event;

  const eventDate = event?.date ? new Date(event.date) : null;
  const [formData, setFormData] = useState<{
    title: string;
    type: Event["type"];
    date: string;
    time: string;
    location: string;
    maxParticipants: number;
    description: string;
    status: Event["status"];
    isFeatured: boolean;
  }>({
    title: event?.title || "",
    type: event?.type || "workshop",
    date: eventDate ? eventDate.toISOString().split("T")[0] : "",
    time: eventDate ? eventDate.toTimeString().slice(0, 5) : "",
    location: event?.location || "",
    maxParticipants: event?.maxParticipants || 50,
    description: event?.description || "",
    status: event?.status || "upcoming",
    isFeatured: event?.isFeatured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { date, time, ...rest } = formData;
    const combinedDate = new Date(`${date}T${time || "00:00"}`).toISOString();
    onSave({ ...rest, date: combinedDate });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-2xl",
          isDark ? "bg-slate-900" : "bg-white",
        )}
      >
        <div
          className={cn(
            "sticky top-0 z-10 flex items-center justify-between border-b p-6",
            isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white",
          )}
        >
          <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            {isEditing ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className={cn("rounded-lg p-2", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}
          >
            <X className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title..."
              className={cn(
                "w-full rounded-xl border px-4 py-3 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Event Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Event["type"] })}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              >
                {eventTypes
                  .filter((t) => t !== "All")
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Event["status"] })
                }
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              >
                {eventStatuses
                  .filter((s) => s !== "All")
                  .map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
                required
              />
            </div>
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Event venue"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
                required
              />
            </div>
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Max Participants
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                min={1}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
                required
              />
            </div>
          </div>

          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description..."
              rows={4}
              className={cn(
                "w-full resize-none rounded-xl border px-4 py-3 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
              {isEditing ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const EventsManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events?limit=100&sort=-date");
      setEvents(response.data.data.events || []);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status !== 401) {
        showToast("error", "Failed to fetch events");
      }
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || event.type === selectedType;
    const matchesStatus = selectedStatus === "All" || event.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSave = async (data: Partial<Event>) => {
    try {
      if (editingEvent) {
        const response = await api.patch(`/events/${editingEvent._id}`, data);
        const updated = response.data.data.event;
        setEvents(events.map((e) => (e._id === editingEvent._id ? updated : e)));
        showToast("success", "Event updated successfully");
      } else {
        const response = await api.post("/events", data);
        const created = response.data.data.event;
        setEvents([created, ...events]);
        showToast("success", "Event created successfully");
      }
    } catch (error) {
      showToast("error", editingEvent ? "Failed to update event" : "Failed to create event");
      console.error("Error saving event:", error);
    } finally {
      setEditingEvent(null);
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
      showToast("success", "Event deleted successfully");
    } catch (error) {
      showToast("error", "Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "primary";
      case "ongoing":
        return "success";
      case "completed":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg",
                toast.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white",
              )}
            >
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Events
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Manage workshops, seminars, and competitions
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreating(true)}
        >
          New Event
        </Button>
      </div>

      <div
        className={cn(
          "rounded-2xl border p-4",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
                isDark ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full rounded-xl border py-2.5 pr-4 pl-10 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={cn(
              "rounded-xl border px-4 py-2.5 transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={cn(
              "rounded-xl border px-4 py-2.5 capitalize transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            {eventStatuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === "All" ? "All Status" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "rounded-2xl border p-6 transition-all",
              isDark
                ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                : "border-gray-200 bg-white hover:shadow-lg",
            )}
          >
            <div className="mb-4 flex items-start justify-between">
              <Badge
                variant={
                  getStatusColor(event.status) as "primary" | "success" | "secondary" | "error"
                }
              >
                {event.status}
              </Badge>
              <Badge variant="secondary">{event.type}</Badge>
            </div>

            <h3
              className={cn("mb-3 text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}
            >
              {event.title}
            </h3>

            <div className="mb-4 space-y-2">
              <div
                className={cn(
                  "flex items-center gap-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <Clock className="ml-2 h-4 w-4" />
                <span>{new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                <Users className="h-4 w-4" />
                <span>
                  {event.registeredCount}/{event.maxParticipants ?? "∞"} registered
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingEvent(event)}
                className="flex-1"
              >
                <Edit className="mr-1 h-4 w-4" /> Edit
              </Button>
              <button
                onClick={() => handleDelete(event._id)}
                className={cn(
                  "rounded-lg p-2 text-red-500 transition-colors",
                  isDark ? "hover:bg-red-500/10" : "hover:bg-red-50",
                )}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div
          className={cn(
            "rounded-2xl border p-12 text-center",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <Calendar
            className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-gray-600" : "text-gray-400")}
          />
          <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
            No events found
          </p>
        </div>
      )}

      <AnimatePresence>
        {(isCreating || editingEvent) && (
          <EventEditor
            event={editingEvent}
            onClose={() => {
              setIsCreating(false);
              setEditingEvent(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsManagementPage;
