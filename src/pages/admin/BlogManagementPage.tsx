// ============================================
// ComES Website - Admin Blog Management Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, Calendar, FileText, Save, X, Image } from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import { CollectionPagination } from "@/components/ui/CollectionPagination";
import { useBlogPosts } from "@/hooks/useApi";
import api from "@/services/api";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "draft" | "published" | "archived";
  author: string;
  publishedAt: string;
  views: number;
  image: string;
  content: string;
  isFeatured: boolean;
}

const categories = ["All", "Tech", "Events", "News", "Tutorials", "Achievements", "Announcements"];
const statuses = ["All", "published", "draft", "archived"];

// Blog Editor Modal
const BlogEditor = ({
  post,
  onClose,
  onSave,
}: {
  post?: BlogPost | null;
  onClose: () => void;
  onSave: (data: Partial<BlogPost>) => Promise<void>;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const isEditing = !!post;

  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "Tech",
    status: post?.status || "draft",
    image: post?.image || "",
    isFeatured: post?.isFeatured || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(formData);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save post");
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
          "max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl shadow-2xl",
          isDark ? "bg-slate-900" : "bg-white",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 flex items-center justify-between border-b p-6",
            isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white",
          )}
        >
          <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          <button
            onClick={isSaving ? undefined : onClose}
            className={cn("rounded-lg p-2", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}
          >
            <X className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Title */}
          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              aria-label="Title"
              minLength={3}
              maxLength={200}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title..."
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

          {/* Category & Status */}
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
                  setFormData({ ...formData, status: e.target.value as BlogPost["status"] })
                }
                className={cn(
                  "w-full rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Featured Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className={cn(
                  "flex-1 rounded-xl border px-4 py-3 transition-colors",
                  isDark
                    ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                )}
              />
              <button
                type="button"
                className={cn(
                  "rounded-xl border px-4 transition-colors",
                  isDark
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-gray-200 hover:bg-gray-50",
                )}
              >
                <Image className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
              </button>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label
              className={cn(
                "mb-2 block text-sm font-medium",
                isDark ? "text-gray-300" : "text-gray-700",
              )}
            >
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary of the post..."
              rows={2}
              className={cn(
                "w-full resize-none rounded-xl border px-4 py-3 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>

          {/* Content Editor */}
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
              aria-label="Content"
              required
              minLength={50}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here... (Markdown supported)"
              rows={12}
              className={cn(
                "w-full resize-none rounded-lg border px-4 py-3 font-mono text-sm transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>

          {/* Actions */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(event) => setFormData({ ...formData, isFeatured: event.target.checked })}
            />
            Featured post
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
              {isEditing ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const BlogManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, isLoading, error, refetch, pagination } = useBlogPosts({
    includeDrafts: true,
    search: searchQuery || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    status: selectedStatus === "All" ? undefined : (selectedStatus as BlogPost["status"]),
    page,
    limit: 12,
    sort: "-createdAt",
  });
  const posts: BlogPost[] = (data ?? []).map((post) => ({
    ...post,
    id: post._id,
    image: post.coverImage || "",
    content: post.content || "",
    author: post.author?.name || "ComES",
    publishedAt: post.publishedAt?.split("T")[0] || "",
  }));

  const filteredPosts = isLoading || error ? [] : posts;

  const handleSave = async (data: Partial<BlogPost>) => {
    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      status: data.status,
      coverImage: data.image,
      isFeatured: data.isFeatured,
    };
    const response = editingPost
      ? await api.patch(`/blog/${editingPost.id}`, payload)
      : await api.post("/blog", payload);
    if (!response.data.success) throw new Error(response.data.message || "Unable to save post");
    setEditingPost(null);
    setIsCreating(false);
    await refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setActionError(null);
      try {
        const response = await api.delete(`/blog/${id}`);
        if (!response.data.success)
          throw new Error(response.data.message || "Unable to delete post");
        if (posts.length === 1 && page > 1) setPage(page - 1);
        else await refetch();
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Unable to delete post");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && <p role="status">Loading posts...</p>}
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Blog Posts
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Manage your blog articles and news
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreating(true)}
        >
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div
        className={cn(
          "rounded-2xl border p-4",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
                isDark ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search posts..."
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

          {/* Category Filter */}
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

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className={cn(
              "rounded-xl border px-4 py-2.5 capitalize transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            {statuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === "All" ? "All Status" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div
        className={cn(
          "overflow-hidden rounded-2xl border",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
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
                  Post
                </th>
                <th
                  className={cn(
                    "px-6 py-4 text-left text-sm font-semibold",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Category
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
                  Views
                </th>
                <th
                  className={cn(
                    "px-6 py-4 text-left text-sm font-semibold",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Date
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
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className={cn(
                    "transition-colors",
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                          {post.title}
                        </p>
                        <p
                          className={cn(
                            "max-w-xs truncate text-sm",
                            isDark ? "text-gray-500" : "text-gray-500",
                          )}
                        >
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={getStatusColor(post.status) as "success" | "warning" | "secondary"}
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className={cn("px-6 py-4", isDark ? "text-gray-400" : "text-gray-600")}>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views.toLocaleString()}
                    </div>
                  </td>
                  <td className={cn("px-6 py-4", isDark ? "text-gray-400" : "text-gray-600")}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt || "Not published"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        aria-label={`Edit ${post.title}`}
                        className={cn(
                          "rounded-lg p-2 transition-colors",
                          isDark
                            ? "text-gray-400 hover:bg-slate-700"
                            : "text-gray-600 hover:bg-gray-100",
                        )}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        aria-label={`Delete ${post.title}`}
                        className={cn(
                          "rounded-lg p-2 text-red-500 transition-colors",
                          isDark ? "hover:bg-red-500/10" : "hover:bg-red-50",
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <FileText
              className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-gray-600" : "text-gray-400")}
            />
            <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
              No posts found
            </p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <CollectionPagination
        page={page}
        pages={pagination?.pages ?? 0}
        onChange={setPage}
        disabled={isLoading}
      />
      <AnimatePresence>
        {(isCreating || editingPost) && (
          <BlogEditor
            post={editingPost}
            onClose={() => {
              setIsCreating(false);
              setEditingPost(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagementPage;
