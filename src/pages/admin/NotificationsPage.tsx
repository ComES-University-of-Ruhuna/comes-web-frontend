// ============================================
// ComES Website - Admin Notifications Page
// ============================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Users,
  Newspaper,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Megaphone,
  UserCircle,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import api from "@/services/api";

interface Student {
  _id: string;
  name: string;
  email: string;
  registrationNo: string;
  username: string;
  isEmailVerified: boolean;
}

type NotificationTab = "individual" | "broadcast-students" | "broadcast-newsletter";

// ── Toast Component ──────────────────────────────────────────────
const Toast = ({
  toast,
  onClose,
}: {
  toast: { type: "success" | "error"; message: string } | null;
  onClose: () => void;
}) => {
  if (!toast) return null;
  return (
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
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ── Notifications Page ───────────────────────────────────────────
export const NotificationsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [activeTab, setActiveTab] = useState<NotificationTab>("individual");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Individual notification state
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);

  // Stats
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeSubscribers, setActiveSubscribers] = useState(0);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "individual") {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [studentsRes, newsletterRes] = await Promise.all([
        api.get("/students"),
        api.get("/newsletter", { params: { limit: 1 } }),
      ]);
      setTotalStudents(studentsRes.data.data.students?.length || 0);
      setActiveSubscribers(newsletterRes.data.data.stats?.active || 0);
    } catch {
      // Stats are non-critical, silently fail
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await api.get("/students");
      setStudents(response.data.data.students || []);
    } catch {
      showToast("error", "Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.registrationNo.toLowerCase().includes(q)
    );
  });

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setConfirmStep(false);
    setSelectedStudent(null);
  };

  const handleSend = async () => {
    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      if (activeTab === "individual") {
        if (!selectedStudent) return;
        await api.post("/students/notify", {
          studentId: selectedStudent._id,
          subject,
          message,
        });
        showToast("success", `Notification sent to ${selectedStudent.name}`);
      } else if (activeTab === "broadcast-students") {
        const response = await api.post("/students/notify-all", { subject, message });
        const sentCount = response.data.data?.sentCount || totalStudents;
        showToast("success", `Notification sent to ${sentCount} students`);
      } else if (activeTab === "broadcast-newsletter") {
        const response = await api.post("/newsletter/send", { subject, message });
        const sentCount = response.data.data?.sentCount || activeSubscribers;
        showToast("success", `Newsletter sent to ${sentCount} subscribers`);
      }
      resetForm();
    } catch {
      showToast("error", "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const getRecipientLabel = () => {
    if (activeTab === "individual") return selectedStudent?.name || "Select a student";
    if (activeTab === "broadcast-students") return `${totalStudents} registered students`;
    return `${activeSubscribers} newsletter subscribers`;
  };

  const canSend =
    subject.trim() && message.trim() && (activeTab !== "individual" || selectedStudent);

  const tabs = [
    {
      id: "individual" as NotificationTab,
      label: "Individual Student",
      icon: UserCircle,
      description: "Send to a specific student",
    },
    {
      id: "broadcast-students" as NotificationTab,
      label: "All Students",
      icon: Users,
      description: "Broadcast to all registered students",
    },
    {
      id: "broadcast-newsletter" as NotificationTab,
      label: "Newsletter",
      icon: Newspaper,
      description: "Send to newsletter subscribers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
          Notifications
        </h1>
        <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
          Send notifications to students and newsletter subscribers
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Registered Students", value: totalStudents, icon: Users, color: "blue" },
          {
            label: "Newsletter Subscribers",
            value: activeSubscribers,
            icon: Newspaper,
            color: "green",
          },
          { label: "Channels", value: 3, icon: Megaphone, color: "purple" },
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
                  color === "purple" && (isDark ? "bg-purple-500/20" : "bg-purple-100"),
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    color === "blue" && "text-blue-500",
                    color === "green" && "text-green-500",
                    color === "purple" && "text-purple-500",
                  )}
                />
              </div>
              <div>
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {value}
                </p>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Channel Selector */}
        <div
          className={cn(
            "space-y-3 rounded-2xl border p-4 lg:col-span-1",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <h2 className={cn("mb-4 text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Select Channel
          </h2>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setConfirmStep(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all",
                activeTab === tab.id
                  ? isDark
                    ? "border border-blue-500/30 bg-blue-500/20 text-blue-300"
                    : "border border-blue-200 bg-blue-50 text-blue-700"
                  : isDark
                    ? "border border-slate-800 text-gray-300 hover:bg-slate-800/50"
                    : "border border-gray-100 text-gray-700 hover:bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2.5",
                  activeTab === tab.id ? "bg-blue-500/20" : isDark ? "bg-slate-800" : "bg-gray-100",
                )}
              >
                <tab.icon
                  className={cn(
                    "h-5 w-5",
                    activeTab === tab.id
                      ? "text-blue-500"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500",
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{tab.label}</p>
                <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                  {tab.description}
                </p>
              </div>
            </button>
          ))}

          {/* Student Selector for Individual Tab */}
          {activeTab === "individual" && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border py-2 pr-4 pl-9 text-sm transition-colors",
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                  )}
                />
              </div>

              <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
                {loadingStudents ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <p
                    className={cn(
                      "py-4 text-center text-sm",
                      isDark ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    No students found
                  </p>
                ) : (
                  filteredStudents.map((student) => (
                    <button
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm transition-colors",
                        selectedStudent?._id === student._id
                          ? isDark
                            ? "border border-blue-500/30 bg-blue-500/20"
                            : "border border-blue-200 bg-blue-50"
                          : isDark
                            ? "hover:bg-slate-800"
                            : "hover:bg-gray-50",
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate font-medium",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {student.name}
                        </p>
                        <p
                          className={cn(
                            "truncate text-xs",
                            isDark ? "text-gray-500" : "text-gray-400",
                          )}
                        >
                          {student.email}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Compose Form */}
        <div
          className={cn(
            "rounded-2xl border p-6 lg:col-span-2",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
              Compose Notification
            </h2>
            <Badge variant={activeTab === "individual" ? "info" : "success"}>
              {activeTab === "individual" ? "Individual" : "Broadcast"}
            </Badge>
          </div>

          {/* Recipient Info */}
          <div
            className={cn(
              "mb-6 flex items-center gap-3 rounded-xl p-4",
              activeTab === "individual" && !selectedStudent
                ? isDark
                  ? "border border-yellow-500/20 bg-yellow-500/10"
                  : "border border-yellow-200 bg-yellow-50"
                : isDark
                  ? "border border-blue-500/20 bg-blue-500/10"
                  : "border border-blue-200 bg-blue-50",
            )}
          >
            {activeTab === "individual" ? (
              selectedStudent ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isDark ? "text-blue-300" : "text-blue-700",
                      )}
                    >
                      {selectedStudent.name}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-blue-400" : "text-blue-600")}>
                      {selectedStudent.email}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <UserCircle
                    className={cn("h-5 w-5", isDark ? "text-yellow-400" : "text-yellow-600")}
                  />
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isDark ? "text-yellow-300" : "text-yellow-700",
                    )}
                  >
                    Select a student from the list to send a notification
                  </p>
                </>
              )
            ) : (
              <>
                {activeTab === "broadcast-students" ? (
                  <Users className="h-5 w-5 text-blue-500" />
                ) : (
                  <Mail className="h-5 w-5 text-blue-500" />
                )}
                <p
                  className={cn("text-sm font-medium", isDark ? "text-blue-300" : "text-blue-700")}
                >
                  This notification will be sent to <strong>{getRecipientLabel()}</strong> via
                  email.
                </p>
              </>
            )}
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
                    "mb-3 text-sm font-medium",
                    isDark ? "text-yellow-300" : "text-yellow-800",
                  )}
                >
                  Review & Confirm
                </p>
                <div className="space-y-2">
                  <p className={cn("text-sm", isDark ? "text-yellow-400" : "text-yellow-700")}>
                    <strong>Channel:</strong> {tabs.find((t) => t.id === activeTab)?.label}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-yellow-400" : "text-yellow-700")}>
                    <strong>Recipients:</strong> {getRecipientLabel()}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-yellow-400" : "text-yellow-700")}>
                    <strong>Subject:</strong> {subject}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "rounded-lg border p-4",
                  isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50",
                )}
              >
                <p
                  className={cn(
                    "mb-2 text-xs font-medium tracking-wider uppercase",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                >
                  Message Preview
                </p>
                <p
                  className={cn(
                    "text-sm whitespace-pre-wrap",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {message}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
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
            <div className="space-y-4">
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
                  placeholder={
                    activeTab === "broadcast-newsletter"
                      ? "e.g., Monthly Update - January 2025"
                      : "e.g., Upcoming Event Announcement"
                  }
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
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message..."
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

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Clear
                </Button>
                <Button
                  variant="primary"
                  icon={<Send className="h-4 w-4" />}
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex-1"
                >
                  Review & Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
