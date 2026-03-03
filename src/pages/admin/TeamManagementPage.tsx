// ============================================
// ComES Website - Admin Team Management
// ============================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Mail,
  Linkedin,
  Github,
  Twitter,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import api from "@/services/api";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  batch: string;
  email?: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  order: number;
  isActive: boolean;
  term: {
    start: string;
    end?: string;
  };
  createdAt: string;
}

const departments = [
  { value: "all", label: "All Departments" },
  { value: "executive", label: "Executive" },
  { value: "technical", label: "Technical" },
  { value: "creative", label: "Creative" },
  { value: "marketing", label: "Marketing" },
  { value: "events", label: "Events" },
  { value: "finance", label: "Finance" },
  { value: "advisory", label: "Advisory" },
];

const departmentColors: Record<string, string> = {
  executive: "bg-blue-500/10 text-blue-500",
  technical: "bg-green-500/10 text-green-500",
  creative: "bg-purple-500/10 text-purple-500",
  marketing: "bg-amber-500/10 text-amber-500",
  events: "bg-pink-500/10 text-pink-500",
  finance: "bg-cyan-500/10 text-cyan-500",
  advisory: "bg-indigo-500/10 text-indigo-500",
};

const TeamEditor = ({
  member,
  onClose,
  onSave,
  saving,
}: {
  member?: TeamMember | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const isEditing = !!member;

  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.role || "",
    department: member?.department || "technical",
    batch: member?.batch || "",
    email: member?.email || "",
    bio: member?.bio || "",
    avatar: member?.avatar || "",
    linkedin: member?.linkedin || "",
    github: member?.github || "",
    twitter: member?.twitter || "",
    order: member?.order ?? 0,
    isActive: member?.isActive ?? true,
    termStart: member?.term?.start
      ? new Date(member.term.start).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    termEnd: member?.term?.end ? new Date(member.term.end).toISOString().split("T")[0] : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      batch: formData.batch,
      email: formData.email || undefined,
      bio: formData.bio || undefined,
      avatar: formData.avatar || undefined,
      linkedin: formData.linkedin || undefined,
      github: formData.github || undefined,
      twitter: formData.twitter || undefined,
      order: formData.order,
      isActive: formData.isActive,
      term: {
        start: formData.termStart,
        end: formData.termEnd || undefined,
      },
    });
  };

  const inputCn = cn(
    "w-full px-4 py-3 rounded-xl border transition-colors",
    isDark
      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
  );

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
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button
            onClick={onClose}
            className={cn("rounded-lg p-2", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}
          >
            <X className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Name & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={inputCn}
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
                Role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="President, Tech Lead..."
                className={inputCn}
                required
              />
            </div>
          </div>

          {/* Department, Batch, Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={inputCn}
                required
              >
                {departments
                  .filter((d) => d.value !== "all")
                  .map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
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
                Batch *
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                placeholder="2022/2023"
                className={inputCn}
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
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className={inputCn}
              />
            </div>
          </div>

          {/* Email & Avatar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className={inputCn}
              />
            </div>
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className={inputCn}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short bio about the team member..."
              rows={3}
              className={cn(inputCn, "resize-none")}
              maxLength={500}
            />
            <p className={cn("mt-1 text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Term */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Term Start *
              </label>
              <input
                type="date"
                value={formData.termStart}
                onChange={(e) => setFormData({ ...formData, termStart: e.target.value })}
                className={inputCn}
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
                Term End
              </label>
              <input
                type="date"
                value={formData.termEnd}
                onChange={(e) => setFormData({ ...formData, termEnd: e.target.value })}
                className={inputCn}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <label
              className={cn(
                "block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Social Links
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <Linkedin
                  className={cn(
                    "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                  className={cn(
                    "w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm transition-colors",
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                  )}
                />
              </div>
              <div className="relative">
                <Github
                  className={cn(
                    "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="GitHub URL"
                  className={cn(
                    "w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm transition-colors",
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                  )}
                />
              </div>
              <div className="relative">
                <Twitter
                  className={cn(
                    "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="Twitter URL"
                  className={cn(
                    "w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm transition-colors",
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                  )}
                />
              </div>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
            <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
              Active Member
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save className="h-4 w-4" />}
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Update Member" : "Add Member"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const TeamManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await api.get("/team");
      setTeam(response.data.data.members || []);
    } catch (error) {
      showToast("error", "Failed to fetch team members");
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (editingMember) {
        const response = await api.patch(`/team/${editingMember._id}`, data);
        setTeam(team.map((m) => (m._id === editingMember._id ? response.data.data.member : m)));
        showToast("success", "Team member updated successfully");
      } else {
        const response = await api.post("/team", data);
        setTeam([...team, response.data.data.member]);
        showToast("success", "Team member added successfully");
      }
      setEditingMember(null);
      setIsCreating(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to save team member";
      showToast("error", message);
      console.error("Error saving team member:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;
    try {
      await api.delete(`/team/${id}`);
      setTeam(team.filter((m) => m._id !== id));
      showToast("success", `${name} removed from the team`);
    } catch (error) {
      showToast("error", "Failed to delete team member");
      console.error("Error deleting team member:", error);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const response = await api.patch(`/team/${member._id}`, { isActive: !member.isActive });
      setTeam(team.map((m) => (m._id === member._id ? response.data.data.member : m)));
      showToast("success", `${member.name} ${!member.isActive ? "activated" : "deactivated"}`);
    } catch {
      showToast("error", "Failed to update member status");
    }
  };

  // Department stats
  const deptStats = departments
    .filter((d) => d.value !== "all")
    .map((dept) => ({
      ...dept,
      count: team.filter((m) => m.department === dept.value).length,
      active: team.filter((m) => m.department === dept.value && m.isActive).length,
    }));

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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Team Members
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Manage your club's team and leadership ({team.length} members)
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreating(true)}
        >
          Add Member
        </Button>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {deptStats.map((dept) => (
          <button
            key={dept.value}
            onClick={() =>
              setSelectedDepartment(selectedDepartment === dept.value ? "all" : dept.value)
            }
            className={cn(
              "rounded-xl border p-3 text-center transition-all",
              selectedDepartment === dept.value
                ? "border-blue-500 bg-blue-500/10"
                : isDark
                  ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                  : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              {dept.count}
            </p>
            <p
              className={cn(
                "truncate text-xs capitalize",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              {dept.label}
            </p>
          </button>
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
              placeholder="Search by name, role, or email..."
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
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={cn(
              "rounded-xl border px-4 py-2.5 transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
        </div>
      ) : (
        <>
          {/* Team Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeam.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative rounded-2xl border p-6 text-center transition-all",
                  !member.isActive && "opacity-60",
                  isDark
                    ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    : "border-gray-200 bg-white hover:shadow-lg",
                )}
              >
                {/* Active/Inactive Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleToggleActive(member)}
                    className={cn(
                      "rounded-lg p-1.5 transition-colors",
                      member.isActive
                        ? isDark
                          ? "text-green-400 hover:bg-green-500/10"
                          : "text-green-600 hover:bg-green-50"
                        : isDark
                          ? "text-gray-500 hover:bg-slate-800"
                          : "text-gray-400 hover:bg-gray-100",
                    )}
                    title={
                      member.isActive
                        ? "Active - Click to deactivate"
                        : "Inactive - Click to activate"
                    }
                  >
                    {member.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-xs",
                      isDark ? "bg-slate-800 text-gray-400" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    #{member.order}
                  </span>
                </div>

                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-blue-500/20"
                  />
                ) : (
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white ring-4 ring-blue-500/20">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}

                <h3
                  className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}
                >
                  {member.name}
                </h3>
                <p className={cn("text-sm", isDark ? "text-blue-400" : "text-blue-600")}>
                  {member.role}
                </p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      departmentColors[member.department] || "bg-gray-500/10 text-gray-500",
                    )}
                  >
                    {member.department}
                  </span>
                  <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                    Batch {member.batch}
                  </span>
                </div>

                {member.bio && (
                  <p
                    className={cn(
                      "mt-3 line-clamp-2 text-sm",
                      isDark ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "rounded-lg p-2",
                        isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
                      )}
                    >
                      <Linkedin
                        className={cn("h-4 w-4", isDark ? "text-gray-400" : "text-gray-600")}
                      />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "rounded-lg p-2",
                        isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
                      )}
                    >
                      <Github
                        className={cn("h-4 w-4", isDark ? "text-gray-400" : "text-gray-600")}
                      />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "rounded-lg p-2",
                        isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
                      )}
                    >
                      <Twitter
                        className={cn("h-4 w-4", isDark ? "text-gray-400" : "text-gray-600")}
                      />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className={cn(
                        "rounded-lg p-2",
                        isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
                      )}
                    >
                      <Mail className={cn("h-4 w-4", isDark ? "text-gray-400" : "text-gray-600")} />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div
                  className="mt-4 flex items-center gap-2 border-t border-dashed pt-4"
                  style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMember(member)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
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

          {filteredTeam.length === 0 && (
            <div
              className={cn(
                "rounded-2xl border p-12 text-center",
                isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
              )}
            >
              <Users
                className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-gray-600" : "text-gray-400")}
              />
              <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                {searchQuery || selectedDepartment !== "all"
                  ? "No team members match your filters"
                  : "No team members yet"}
              </p>
              {!searchQuery && selectedDepartment === "all" && (
                <Button
                  variant="primary"
                  className="mt-4"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsCreating(true)}
                >
                  Add Your First Member
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {(isCreating || editingMember) && (
          <TeamEditor
            member={editingMember}
            onClose={() => {
              setIsCreating(false);
              setEditingMember(null);
            }}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagementPage;
