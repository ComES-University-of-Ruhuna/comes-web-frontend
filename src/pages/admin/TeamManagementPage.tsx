// ============================================
// ComES Website - Admin Team Management
// ============================================

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
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
  RefreshCw,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import api from "@/services/api";
import { executiveCommittee } from "@/data/team";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  batch: string;
  email?: string;
  contactNo?: string;
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
  { value: "executive", label: "Executive Committee" },
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
  onSave: (data: Omit<TeamMember, "_id" | "createdAt">) => Promise<void>;
  saving: boolean;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const isEditing = !!member;
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.role || "",
    department: member?.department || "executive",
    batch: member?.batch || "",
    email: member?.email || "",
    contactNo: member?.contactNo || "",
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
    if (uploading || saving) return;
    await onSave({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      batch: formData.batch,
      email: formData.email,
      contactNo: formData.contactNo,
      bio: formData.bio,
      avatar: formData.avatar,
      linkedin: formData.linkedin,
      github: formData.github,
      twitter: formData.twitter,
      order: formData.order,
      isActive: formData.isActive,
      term: {
        start: formData.termStart,
        end: formData.termEnd || undefined,
      },
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || uploading || saving) return;
    setUploadError(null);
    setPhotoUploaded(false);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("Image must be 3 MB or smaller.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const payload = new FormData();
      payload.append("image", file);
      const response = await api.post<{ data: { url: string } }>("/team/avatar", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000,
        onUploadProgress: ({ loaded, total }) => {
          if (total) setUploadProgress(Math.round((loaded / total) * 100));
        },
      });
      setFormData((current) => ({ ...current, avatar: response.data.data.url }));
      setPhotoUploaded(true);
    } catch (error) {
      setUploadError(
        (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) ||
          "Photo upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const inputCn = cn(
    "w-full px-3 py-2.5 text-sm rounded-md border border-[var(--admin-border,var(--border-color))] bg-[var(--admin-surface,var(--bg-primary))] text-[var(--admin-text,var(--text-primary))] placeholder-gray-500 transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!saving && !uploading) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-editor-title"
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[var(--admin-border,var(--border-color))] bg-[var(--admin-surface,var(--bg-primary))] shadow-2xl",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-between border-b border-[var(--admin-border,var(--border-color))] px-5 py-4",
          )}
        >
          <h2
            id="team-editor-title"
            className="text-base font-semibold text-[var(--admin-text,var(--text-primary))]"
          >
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button
            onClick={onClose}
            disabled={saving || uploading}
            aria-label="Close member editor"
            className={cn("rounded-lg p-2", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}
          >
            <X className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
          </button>
        </div>

        <form
          id="team-member-form"
          onSubmit={handleSubmit}
          className="min-h-0 space-y-5 overflow-y-auto p-5"
        >
          {!isEditing && (
            <div>
              <label
                htmlFor="committee-template"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Existing Executive Roster
              </label>
              <select
                id="committee-template"
                disabled={saving || uploading}
                defaultValue=""
                className={inputCn}
                onChange={(event) => {
                  const entry = executiveCommittee.find(
                    (candidate) => candidate.id === event.target.value,
                  );
                  if (!entry) return;
                  setFormData((current) => ({
                    ...current,
                    name: entry.name,
                    role: entry.role,
                    department: "executive",
                    batch: entry.batch || "",
                    email: entry.email || "",
                    contactNo: entry.contactNo || "",
                    avatar: entry.image,
                    bio: entry.bio || "",
                    linkedin: entry.linkedin || "",
                    github: entry.github || "",
                    twitter: entry.twitter || "",
                    order: executiveCommittee.indexOf(entry),
                  }));
                }}
              >
                <option value="" disabled>
                  Select a member
                </option>
                {executiveCommittee.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name} - {entry.role}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Name & Role */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="team-member-name"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Full Name *
              </label>
              <input
                id="team-member-name"
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
                aria-label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="President, Tech Lead..."
                className={inputCn}
                required
              />
            </div>
          </div>

          {/* Department, Batch, Order */}
          <div className="grid gap-4 sm:grid-cols-3">
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
                aria-label="Department"
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
                aria-label="Batch"
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
                aria-label="Display Order"
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className={inputCn}
              />
            </div>
          </div>

          {/* Email & Avatar */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                aria-label="Email"
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
                aria-label="Avatar URL"
                disabled={saving || uploading}
                onChange={(e) => {
                  setPhotoUploaded(false);
                  setFormData({ ...formData, avatar: e.target.value });
                }}
                placeholder="https://example.com/photo.jpg"
                className={inputCn}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-4">
            {formData.avatar && (
              <div className="relative shrink-0">
                <img
                  src={formData.avatar}
                  alt="Member photo preview"
                  className="h-24 w-24 rounded-lg border border-gray-300 object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  title="Remove photo"
                  disabled={saving || uploading}
                  onClick={() => {
                    setFormData((current) => ({ ...current, avatar: "" }));
                    setPhotoUploaded(false);
                  }}
                  className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded bg-white text-gray-900 shadow disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="min-w-0 flex-1 basis-48">
              <label
                htmlFor="team-avatar-upload"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Upload photo
              </label>
              <input
                id="team-avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={saving || uploading}
                onChange={handlePhotoUpload}
                className="block w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border file:border-gray-300 file:px-3 file:py-2 disabled:opacity-50"
              />
              {uploading && (
                <div role="status" className="mt-2 text-sm">
                  <progress
                    aria-label="Photo upload progress"
                    value={uploadProgress}
                    max={100}
                    className="w-full"
                  />
                  {uploadProgress < 100
                    ? `Uploading photo... ${uploadProgress}%`
                    : "Processing photo..."}
                </div>
              )}
              {uploadError && (
                <p role="alert" className="mt-2 text-sm text-red-500">
                  {uploadError}
                </p>
              )}
              {photoUploaded && (
                <p role="status" className="mt-2 text-sm text-emerald-600">
                  Photo uploaded
                </p>
              )}
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
              aria-label="Bio"
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
          <div className="grid gap-4 sm:grid-cols-2">
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
                aria-label="Term Start"
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
                aria-label="Term End"
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
            <div className="grid gap-4 sm:grid-cols-3">
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
                  aria-label="LinkedIn URL"
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
                  aria-label="GitHub URL"
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
                  aria-label="Twitter URL"
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

          <div>
            <label
              htmlFor="team-member-phone"
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Phone Number
            </label>
            <input
              id="team-member-phone"
              type="tel"
              maxLength={30}
              value={formData.contactNo}
              onChange={(event) => setFormData({ ...formData, contactNo: event.target.value })}
              className={inputCn}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                aria-label="Active Member"
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
        </form>
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--admin-border,var(--border-color))] px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving || uploading}
            className="min-h-10 rounded-md border border-[var(--admin-border,var(--border-color))] px-3 text-sm font-medium text-[var(--admin-text,var(--text-primary))] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="team-member-form"
            type="submit"
            disabled={saving || uploading}
            className="admin-primary-button disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : isEditing ? "Update Member" : "Add Member"}
          </button>
        </div>
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

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/team?includeInactive=true");
      setTeam(response.data.data.members || []);
    } catch (error) {
      showToast("error", "Failed to fetch team members");
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSave = async (data: Omit<TeamMember, "_id" | "createdAt">) => {
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
    } catch (error) {
      const message =
        (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) ||
        "Failed to save team member";
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

  return (
    <div className="committee-workspace space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 left-4 z-[60] sm:left-auto sm:max-w-md"
          >
            <div
              role={toast.type === "error" ? "alert" : "status"}
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
          <h1 className="text-2xl font-semibold text-[var(--admin-text,var(--text-primary))]">
            Committee & Team
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--admin-muted,var(--text-secondary))]">
            <span>
              {team.length} {team.length === 1 ? "member" : "members"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {team.filter((member) => member.isActive).length} published
            </span>
            <span>{team.filter((member) => !member.isActive).length} unpublished</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={fetchTeam}
            disabled={loading}
            aria-label="Refresh members"
            title="Refresh members"
            className="admin-icon-button"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="admin-primary-button"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </div>

      <div
        className="flex gap-6 overflow-x-auto border-b border-[var(--admin-border,var(--border-color))]"
        role="tablist"
        aria-label="Committee departments"
      >
        {departments.map((dept) => (
          <button
            key={dept.value}
            type="button"
            role="tab"
            aria-selected={selectedDepartment === dept.value}
            onClick={() => setSelectedDepartment(dept.value)}
            className={cn(
              "flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-0.5 text-sm font-medium transition-colors",
              selectedDepartment === dept.value
                ? "border-[var(--admin-accent,#2563eb)] text-[var(--admin-text,var(--text-primary))]"
                : "border-transparent text-[var(--admin-muted,var(--text-secondary))] hover:text-[var(--admin-text,var(--text-primary))]",
            )}
          >
            {dept.value === "all" ? "All members" : dept.label}
            <span className="text-xs tabular-nums opacity-65">
              {dept.value === "all"
                ? team.length
                : team.filter((member) => member.department === dept.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className={cn(
              "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          />
          <input
            type="text"
            aria-label="Search members"
            placeholder="Search by name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full rounded-md border py-2.5 pr-4 pl-10 text-sm transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          />
        </div>
        <p className="shrink-0 text-xs text-[var(--admin-muted,var(--text-secondary))]">
          {filteredTeam.length} of {team.length} members
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
        </div>
      ) : (
        <>
          {/* Team Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeam.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative flex min-w-0 flex-col rounded-lg border border-[var(--admin-border,var(--border-color))] bg-[var(--admin-surface,var(--bg-primary))] p-5 pt-14 transition-colors",
                )}
              >
                {/* Active/Inactive Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleToggleActive(member)}
                    role="switch"
                    aria-checked={member.isActive}
                    aria-label={`Publish ${member.name}`}
                    className={cn(
                      "flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
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
                    {member.isActive ? "Published" : "Unpublished"}
                  </button>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      "px-1 py-1 font-mono text-xs tabular-nums",
                      isDark ? "bg-slate-800 text-gray-400" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {String(member.order).padStart(2, "0")}
                  </span>
                </div>

                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="mb-4 h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--admin-tint,#eff6ff)] text-lg font-semibold text-[var(--admin-accent,#2563eb)]">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}

                <h3 className="text-base font-semibold break-words text-[var(--admin-text,var(--text-primary))]">
                  {member.name}
                </h3>
                <p className={cn("text-sm", isDark ? "text-blue-400" : "text-blue-600")}>
                  {member.role}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize",
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
                <div className="mt-auto flex min-h-12 items-center gap-1 pt-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      aria-label={`${member.name} on LinkedIn`}
                      title="LinkedIn"
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
                      aria-label={`${member.name} on GitHub`}
                      title="GitHub"
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
                      aria-label={`${member.name} on Twitter`}
                      title="Twitter"
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
                      aria-label={`Email ${member.name}`}
                      title={member.email}
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
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--admin-border,var(--border-color))] pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingMember(member)}
                    className="flex min-h-9 items-center gap-2 rounded-md px-2 text-sm font-medium text-[var(--admin-text,var(--text-primary))] hover:bg-[var(--admin-hover,var(--bg-secondary))]"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
                    aria-label={`Delete ${member.name}`}
                    title="Delete member"
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
                "border-y border-[var(--admin-border,var(--border-color))] px-4 py-16 text-center",
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
