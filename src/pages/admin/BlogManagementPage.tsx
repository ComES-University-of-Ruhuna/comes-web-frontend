// ============================================
// ComES Website - Admin Blog Management Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Save,
  X,
  Image,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";

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
}

// Mock data
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React 19",
    excerpt: "Learn the new features and improvements in React 19...",
    category: "Tech",
    status: "published",
    author: "John Doe",
    publishedAt: "2026-01-28",
    views: 1234,
    image: "https://picsum.photos/seed/1/400/300",
  },
  {
    id: "2",
    title: "ComES Hackathon 2026 Announcement",
    excerpt: "Join us for the biggest hackathon of the year...",
    category: "Events",
    status: "published",
    author: "Jane Smith",
    publishedAt: "2026-01-25",
    views: 856,
    image: "https://picsum.photos/seed/2/400/300",
  },
  {
    id: "3",
    title: "Introduction to Machine Learning",
    excerpt: "A beginner-friendly guide to ML concepts...",
    category: "Tech",
    status: "draft",
    author: "John Doe",
    publishedAt: "",
    views: 0,
    image: "https://picsum.photos/seed/3/400/300",
  },
];

const categories = ["All", "Tech", "Events", "News", "Tutorials", "Achievements"];
const statuses = ["All", "published", "draft", "archived"];

// Blog Editor Modal
const BlogEditor = ({
  post,
  onClose,
  onSave,
}: {
  post?: BlogPost | null;
  onClose: () => void;
  onSave: (data: Partial<BlogPost>) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const isEditing = !!post;

  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: "",
    category: post?.category || "Tech",
    status: post?.status || "draft",
    image: post?.image || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            onClick={onClose}
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
            {/* Toolbar */}
            <div
              className={cn(
                "flex items-center gap-1 rounded-t-xl border border-b-0 p-2",
                isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50",
              )}
            >
              {[Bold, Italic, List, LinkIcon, Image].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    isDark ? "text-gray-400 hover:bg-slate-700" : "text-gray-600 hover:bg-gray-200",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here... (Markdown supported)"
              rows={12}
              className={cn(
                "w-full resize-none rounded-b-xl border border-t-0 px-4 py-3 font-mono text-sm transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
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

  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || post.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSave = (data: Partial<BlogPost>) => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? { ...p, ...data } : p)));
    } else {
      setPosts([
        ...posts,
        {
          ...data,
          id: Date.now().toString(),
          views: 0,
          author: "Admin",
          publishedAt: new Date().toISOString().split("T")[0],
        } as BlogPost,
      ]);
    }
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((p) => p.id !== id));
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            onChange={(e) => setSelectedStatus(e.target.value)}
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
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
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

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <FileText
              className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-gray-600" : "text-gray-400")}
            />
            <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
              No posts found
            </p>
            <p className={cn("mt-1 text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
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
