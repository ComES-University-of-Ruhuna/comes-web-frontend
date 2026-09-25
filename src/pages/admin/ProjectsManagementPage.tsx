// ============================================
// ComES Website - Admin Projects Management
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Github,
  ExternalLink,
  Users,
  Save,
  X,
  Folder,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import { CollectionPagination } from "@/components/ui/CollectionPagination";
import { useProjects } from "@/hooks/useApi";
import api from "@/services/api";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "in-progress" | "completed" | "archived";
  team: string[];
  technologies: string[];
  github?: string;
  demo?: string;
  image: string;
  isFeatured: boolean;
}

const categories = ["All", "Web", "Mobile", "AI/ML", "IoT", "Blockchain", "Game Dev"];
const projectStatuses = ["All", "in-progress", "completed", "archived"];

const ProjectEditor = ({
  project,
  onClose,
  onSave,
}: {
  project?: Project | null;
  onClose: () => void;
  onSave: (data: Partial<Project>) => Promise<void>;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category: project?.category || "Web",
    status: project?.status || "in-progress",
    technologies: project?.technologies.join(", ") || "",
    team: project?.team.join(", ") || "",
    github: project?.github || "",
    demo: project?.demo || "",
    image: project?.image || "",
    isFeatured: project?.isFeatured || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave({
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        team: formData.team
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={isSaving ? undefined : onClose}
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
            {isEditing ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={isSaving ? undefined : onClose}
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
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              aria-label="Title"
              minLength={3}
              maxLength={200}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title..."
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
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                aria-label="Status"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Project["status"] })
                }
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              >
                {projectStatuses
                  .filter((s) => s !== "All")
                  .map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status.replace("-", " ")}
                    </option>
                  ))}
              </select>
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
              aria-label="Description"
              minLength={10}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project..."
              rows={3}
              className={cn(
                "w-full resize-none rounded-xl border px-4 py-3 transition-colors",
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
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB..."
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
              Team Members (comma separated)
            </label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              placeholder="Alice, Bob, Charlie..."
              className={cn(
                "w-full rounded-xl border px-4 py-3 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
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
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
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
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demo}
                onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                placeholder="https://demo.example.com"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
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
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className={cn(
                "w-full rounded-xl border px-4 py-3 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(event) => setFormData({ ...formData, isFeatured: event.target.checked })}
            />
            Featured project
          </label>
          {saveError && (
            <p role="alert" className="text-sm text-red-500">
              {saveError}
            </p>
          )}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              icon={<Save className="h-4 w-4" />}
            >
              {isEditing ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const ProjectsManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, isLoading, error, refetch, pagination } = useProjects({
    includeArchived: true,
    search: searchQuery || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    status: selectedStatus === "All" ? undefined : (selectedStatus as Project["status"]),
    page,
    limit: 12,
  });
  const projects: Project[] = (data ?? []).map((project) => ({
    ...project,
    id: project._id,
    image: project.image || "",
    team: project.teamMembers ?? project.team.map((member) => member.name),
    github: project.githubUrl,
    demo: project.demoUrl,
  }));

  const filteredProjects = isLoading || error ? [] : projects;

  const handleSave = async (data: Partial<Project>) => {
    const payload = {
      title: data.title,
      description: data.description,
      shortDescription: data.description?.slice(0, 300),
      category: data.category,
      status: data.status,
      technologies: data.technologies,
      teamMembers: data.team,
      githubUrl: data.github,
      demoUrl: data.demo,
      image: data.image,
      isFeatured: data.isFeatured,
    };
    const response = editingProject
      ? await api.patch(`/projects/${editingProject.id}`, payload)
      : await api.post("/projects", payload);
    if (!response.data.success) throw new Error(response.data.message || "Unable to save project");
    setEditingProject(null);
    setIsCreating(false);
    await refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setActionError(null);
      try {
        const response = await api.delete(`/projects/${id}`);
        if (!response.data.success)
          throw new Error(response.data.message || "Unable to delete project");
        if (projects.length === 1 && page > 1) setPage(page - 1);
        else await refetch();
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Unable to delete project");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      case "archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && <p role="status">Loading projects...</p>}
      {(error || actionError) && (
        <div role="alert" className="text-red-500">
          {error || actionError}{" "}
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              refetch();
            }}
            className="underline"
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Projects
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Manage student and club projects
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreating(true)}
        >
          Add Project
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
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
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-xl border px-4 py-2.5 transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-xl border px-4 py-2.5 transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            {projectStatuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === "All" ? "All Status" : status.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "overflow-hidden rounded-2xl border transition-all",
              isDark
                ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                : "border-gray-200 bg-white hover:shadow-lg",
            )}
          >
            {project.image && (
              <img src={project.image} alt={project.title} className="h-48 w-full object-cover" />
            )}
            <div className="p-6">
              <div className="mb-3 flex items-start justify-between">
                <Badge
                  variant={getStatusColor(project.status) as "warning" | "success" | "secondary"}
                >
                  {project.status.replace("-", " ")}
                </Badge>
                <Badge variant="secondary">{project.category}</Badge>
              </div>

              <h3
                className={cn(
                  "mb-2 text-xl font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {project.title}
              </h3>
              <p
                className={cn(
                  "mb-4 line-clamp-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs",
                      isDark ? "bg-slate-800 text-gray-300" : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs",
                      isDark ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              <div
                className={cn(
                  "mb-4 flex items-center gap-2 text-sm",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                <Users className="h-4 w-4" />
                <span>
                  {project.team.length} team member{project.team.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      isDark
                        ? "text-gray-400 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      isDark
                        ? "text-gray-400 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
                <div className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
                <button
                  onClick={() => handleDelete(project.id)}
                  aria-label={`Delete ${project.title}`}
                  className={cn(
                    "rounded-lg p-2 text-red-500 transition-colors",
                    isDark ? "hover:bg-red-500/10" : "hover:bg-red-50",
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!isLoading && !error && filteredProjects.length === 0 && (
        <div
          className={cn(
            "rounded-2xl border p-12 text-center",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <Folder
            className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-gray-600" : "text-gray-400")}
          />
          <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
            No projects found
          </p>
        </div>
      )}

      <CollectionPagination
        page={page}
        pages={pagination?.pages ?? 0}
        onChange={setPage}
        disabled={isLoading}
      />
      <AnimatePresence>
        {(isCreating || editingProject) && (
          <ProjectEditor
            project={editingProject}
            onClose={() => {
              setIsCreating(false);
              setEditingProject(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManagementPage;
