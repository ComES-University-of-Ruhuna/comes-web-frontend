// ============================================
// ComES Website - Admin Newsletter Page
// ============================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  Calendar,
  Download,
  Trash2,
  Users,
  TrendingDown,
  Send,
  X,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import api from "@/services/api";

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  isSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ── Compose Newsletter Modal ──────────────────────────────────────
interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  activeCount: number;
  onSend: (subject: string, message: string) => Promise<void>;
}

const ComposeNewsletterModal = ({
  isOpen,
  onClose,
  isDark,
  activeCount,
  onSend,
}: ComposeModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);

  const handleSend = async () => {
    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      await onSend(subject, message);
      setSubject("");
      setMessage("");
      setConfirmStep(false);
      onClose();
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setConfirmStep(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "w-full max-w-2xl rounded-2xl shadow-2xl",
            isDark ? "border border-slate-800 bg-slate-900" : "bg-white",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between border-b p-6",
              isDark ? "border-slate-800" : "border-gray-200",
            )}
          >
            <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              Compose Newsletter
            </h2>
            <button
              onClick={handleClose}
              className={cn(
                "rounded-lg p-2 transition-colors",
                isDark ? "text-gray-400 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 p-6">
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl p-4",
                isDark
                  ? "border border-blue-500/20 bg-blue-500/10"
                  : "border border-blue-200 bg-blue-50",
              )}
            >
              <Users className="h-5 w-5 text-blue-500" />
              <p className={cn("text-sm font-medium", isDark ? "text-blue-300" : "text-blue-700")}>
                This newsletter will be sent to <strong>{activeCount}</strong> active subscribers
                via email.
              </p>
            </div>

            {confirmStep ? (
              <div className="space-y-4">
                <div
                  className={cn(
                    "rounded-lg border p-4",
                    isDark
                      ? "border-yellow-500/20 bg-yellow-500/10"
                      : "border-yellow-200 bg-yellow-50",
                  )}
                >
                  <p
                    className={cn(
                      "mb-2 text-sm font-medium",
                      isDark ? "text-yellow-300" : "text-yellow-800",
                    )}
                  >
                    Are you sure you want to send this newsletter?
                  </p>
                  <p className={cn("text-sm", isDark ? "text-yellow-400" : "text-yellow-700")}>
                    <strong>Subject:</strong> {subject}
                  </p>
                  <p className={cn("mt-1 text-sm", isDark ? "text-yellow-400" : "text-yellow-700")}>
                    <strong>Recipients:</strong> {activeCount} active subscribers
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmStep(false)}
                    disabled={sending}
                    className="flex-1"
                  >
                    Go Back
                  </Button>
                  <Button onClick={handleSend} disabled={sending} className="flex-1">
                    {sending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Confirm & Send</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label
                    className={cn(
                      "mb-2 block text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Monthly Update - January 2025"
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 transition-colors",
                      isDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                        : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                    )}
                  />
                </div>

                <div>
                  <label
                    className={cn(
                      "mb-2 block text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Content
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your newsletter content..."
                    rows={10}
                    className={cn(
                      "w-full resize-none rounded-xl border px-4 py-3 transition-colors",
                      isDark
                        ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                        : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                    )}
                  />
                </div>
              </>
            )}
          </div>

          {!confirmStep && (
            <div
              className={cn(
                "flex items-center justify-end gap-3 border-t p-6",
                isDark ? "border-slate-800" : "border-gray-200",
              )}
            >
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Send className="h-4 w-4" />}
                onClick={handleSend}
                disabled={!subject.trim() || !message.trim()}
              >
                Review & Send
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── Newsletter Page ───────────────────────────────────────────────
export const NewsletterPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0 });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "true" | "false">("all");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSubscribers = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params: Record<string, string | number> = { page, limit: 20 };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedStatus !== "all") params.subscribed = selectedStatus;

        const response = await api.get("/newsletter", { params });
        const data = response.data.data;
        setSubscribers(data.subscribers || []);
        setStats(data.stats || { total: 0, active: 0, inactive: 0 });
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
      } catch (error) {
        showToast("error", "Failed to fetch subscribers");
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, selectedStatus],
  );

  useEffect(() => {
    fetchSubscribers(1);
  }, [fetchSubscribers]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    try {
      setDeleteLoading(id);
      await api.delete(`/newsletter/${id}`);
      setSubscribers(subscribers.filter((s) => s._id !== id));
      setStats((prev) => ({ ...prev, total: prev.total - 1, active: prev.active - 1 }));
      showToast("success", `Removed ${email}`);
    } catch (error) {
      showToast("error", "Failed to remove subscriber");
      console.error("Error deleting subscriber:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/newsletter/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast("success", "Subscribers exported successfully");
    } catch (error) {
      showToast("error", "Failed to export subscribers");
      console.error("Error exporting subscribers:", error);
    }
  };

  const handleSendNewsletter = async (subject: string, message: string) => {
    try {
      const response = await api.post("/newsletter/send", { subject, message });
      const sentCount = response.data.data?.sentCount || stats.active;
      showToast("success", `Newsletter sent to ${sentCount} subscribers`);
    } catch (error) {
      showToast("error", "Failed to send newsletter");
      console.error("Error sending newsletter:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
                "flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg",
                toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white",
              )}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compose Modal */}
      <ComposeNewsletterModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        isDark={isDark}
        activeCount={stats.active}
        onSend={handleSendNewsletter}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Newsletter
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Manage subscribers and send newsletters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />}
            onClick={() => fetchSubscribers(pagination.page)}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={<Send className="h-4 w-4" />}
            onClick={() => setShowComposeModal(true)}
          >
            Compose
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Subscribers", value: stats.total, icon: Users, color: "blue" },
          { label: "Active Subscribers", value: stats.active, icon: CheckCircle, color: "green" },
          { label: "Unsubscribed", value: stats.inactive, icon: TrendingDown, color: "red" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={cn(
              "rounded-2xl border p-4",
              isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-xl p-3",
                  color === "blue" && (isDark ? "bg-blue-500/20" : "bg-blue-100"),
                  color === "green" && (isDark ? "bg-green-500/20" : "bg-green-100"),
                  color === "red" && (isDark ? "bg-red-500/20" : "bg-red-100"),
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    color === "blue" && "text-blue-500",
                    color === "green" && "text-green-500",
                    color === "red" && "text-red-500",
                  )}
                />
              </div>
              <div>
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {loading ? "—" : value}
                </p>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className={cn(
          "rounded-2xl border p-4",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
                isDark ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search by email or name..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as "all" | "true" | "false")}
            className={cn(
              "rounded-xl border px-4 py-2.5 capitalize transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div
        className={cn(
          "overflow-hidden rounded-2xl border",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              Loading subscribers...
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={cn(isDark ? "bg-slate-800" : "bg-gray-50")}>
                  <tr>
                    <th
                      className={cn(
                        "px-6 py-4 text-left text-sm font-semibold",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Subscriber
                    </th>
                    <th
                      className={cn(
                        "px-6 py-4 text-left text-sm font-semibold",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Status
                    </th>
                    <th
                      className={cn(
                        "px-6 py-4 text-left text-sm font-semibold",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Subscribed
                    </th>
                    <th
                      className={cn(
                        "px-6 py-4 text-right text-sm font-semibold",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-slate-800" : "divide-gray-100")}>
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber._id}
                      className={cn(
                        "transition-colors",
                        isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "rounded-lg p-2",
                              isDark ? "bg-slate-800" : "bg-gray-100",
                            )}
                          >
                            <Mail
                              className={cn("h-4 w-4", isDark ? "text-gray-400" : "text-gray-600")}
                            />
                          </div>
                          <div>
                            <span
                              className={cn(
                                "block font-medium",
                                isDark ? "text-white" : "text-gray-900",
                              )}
                            >
                              {subscriber.email}
                            </span>
                            {subscriber.name && (
                              <span
                                className={cn(
                                  "text-sm",
                                  isDark ? "text-gray-500" : "text-gray-500",
                                )}
                              >
                                {subscriber.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={subscriber.isSubscribed ? "success" : "secondary"}>
                          {subscriber.isSubscribed ? "Active" : "Unsubscribed"}
                        </Badge>
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-gray-400" : "text-gray-600")}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(subscriber._id, subscriber.email)}
                            disabled={deleteLoading === subscriber._id}
                            className={cn(
                              "rounded-lg p-2 text-red-500 transition-colors",
                              isDark ? "hover:bg-red-500/10" : "hover:bg-red-50",
                              deleteLoading === subscriber._id && "cursor-not-allowed opacity-50",
                            )}
                          >
                            {deleteLoading === subscriber._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {subscribers.length === 0 && (
              <div className="p-12 text-center">
                <Mail
                  className={cn(
                    "mx-auto mb-4 h-12 w-12",
                    isDark ? "text-gray-600" : "text-gray-400",
                  )}
                />
                <p
                  className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}
                >
                  No subscribers found
                </p>
                <p className={cn("mt-1 text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                  Subscribers will appear here when people subscribe to the newsletter.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div
                className={cn(
                  "flex items-center justify-between border-t px-6 py-4",
                  isDark ? "border-slate-800" : "border-gray-200",
                )}
              >
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchSubscribers(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      isDark
                        ? "text-gray-400 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100",
                      pagination.page <= 1 && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span
                    className={cn(
                      "px-2 text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchSubscribers(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      isDark
                        ? "text-gray-400 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100",
                      pagination.page >= pagination.pages && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterPage;
