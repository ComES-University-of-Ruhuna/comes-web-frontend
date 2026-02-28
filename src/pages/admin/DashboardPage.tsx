// ============================================
// ComES Website - Admin Dashboard Page
// ============================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  FolderKanban,
  FileText,
  Users,
  Mail,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
  Clock,
  UserCircle,
  Plus,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";
import { useThemeStore, useAuthStore } from "@/store";
import { cn } from "@/utils";
import api from "@/services/api";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  href?: string;
}

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  loading,
  href,
}: StatCardProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border p-6 transition-all",
        href && "cursor-pointer",
        isDark
          ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
            {title}
          </p>
          {loading ? (
            <div
              className={cn(
                "mt-2 h-9 w-16 animate-pulse rounded-lg",
                isDark ? "bg-slate-800" : "bg-gray-200",
              )}
            />
          ) : (
            <p className={cn("mt-2 text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              {value}
            </p>
          )}
          {change && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-sm font-medium",
                changeType === "positive"
                  ? "text-green-500"
                  : changeType === "negative"
                    ? "text-red-500"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500",
              )}
            >
              {changeType !== "neutral" && (
                <TrendingUp className={cn("h-4 w-4", changeType === "negative" && "rotate-180")} />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3", color)}>{icon}</div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const QuickAction = ({ title, description, icon, href, color }: QuickActionProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Link to={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -3 }}
        className={cn(
          "group cursor-pointer rounded-xl border p-4 transition-all",
          isDark
            ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md",
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn("rounded-xl p-3", color)}>{icon}</div>
          <div className="flex-1">
            <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
              {title}
            </h3>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              {description}
            </p>
          </div>
          <ArrowUpRight
            className={cn(
              "h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          />
        </div>
      </motion.div>
    </Link>
  );
};

interface RecentActivityItem {
  type: "event" | "blog" | "contact" | "newsletter" | "member" | "team";
  title: string;
  time: string;
}

const RecentActivity = ({ type, title, time }: RecentActivityItem) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const typeConfig: Record<string, { icon: any; color: string }> = {
    event: { icon: Calendar, color: "bg-blue-500/10 text-blue-500" },
    blog: { icon: FileText, color: "bg-green-500/10 text-green-500" },
    contact: { icon: Mail, color: "bg-amber-500/10 text-amber-500" },
    newsletter: { icon: Newspaper, color: "bg-purple-500/10 text-purple-500" },
    member: { icon: UserCircle, color: "bg-cyan-500/10 text-cyan-500" },
    team: { icon: Users, color: "bg-pink-500/10 text-pink-500" },
  };

  const config = typeConfig[type] || typeConfig.event;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl p-3 transition-colors",
        isDark ? "hover:bg-slate-800" : "hover:bg-gray-50",
      )}
    >
      <div className={cn("rounded-lg p-2", config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-medium", isDark ? "text-white" : "text-gray-900")}>
          {title}
        </p>
        <p
          className={cn(
            "flex items-center gap-1 text-sm",
            isDark ? "text-gray-500" : "text-gray-500",
          )}
        >
          <Clock className="h-3 w-3" />
          {time}
        </p>
      </div>
    </div>
  );
};

interface DashboardStats {
  events: number;
  projects: number;
  blogPosts: number;
  subscribers: number;
  members: number;
  teamMembers: number;
  contacts: number;
}

export const DashboardPage = () => {
  const { resolvedTheme } = useThemeStore();
  const { user } = useAuthStore();
  const isDark = resolvedTheme === "dark";
  const [stats, setStats] = useState<DashboardStats>({
    events: 0,
    projects: 0,
    blogPosts: 0,
    subscribers: 0,
    members: 0,
    teamMembers: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateStr: string): string => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, projectsRes, blogRes, newsletterRes, membersRes, teamRes, contactsRes] =
        await Promise.allSettled([
          api.get("/events"),
          api.get("/projects"),
          api.get("/blog"),
          api.get("/newsletter/subscribers"),
          api.get("/students"),
          api.get("/team"),
          api.get("/contact"),
        ]);

      const getCount = (res: PromiseSettledResult<any>, ...paths: string[]) => {
        if (res.status !== "fulfilled") return 0;
        const data = res.value?.data?.data;
        if (!data) return 0;
        for (const path of paths) {
          if (data[path] !== undefined) {
            return Array.isArray(data[path]) ? data[path].length : data[path];
          }
        }
        if (data.total !== undefined) return data.total;
        return 0;
      };

      setStats({
        events: getCount(eventsRes, "events"),
        projects: getCount(projectsRes, "projects"),
        blogPosts: getCount(blogRes, "posts", "blogs"),
        subscribers: getCount(newsletterRes, "subscribers", "total"),
        members: getCount(membersRes, "students", "total"),
        teamMembers: getCount(teamRes, "members", "total"),
        contacts: getCount(contactsRes, "contacts", "messages"),
      });

      // Build recent activities from real data
      const activities: RecentActivityItem[] = [];

      if (eventsRes.status === "fulfilled") {
        const events = eventsRes.value?.data?.data?.events;
        if (Array.isArray(events)) {
          events.slice(0, 2).forEach((e: any) => {
            activities.push({
              type: "event",
              title: e.title || "New event",
              time: formatTimeAgo(e.createdAt || e.date),
            });
          });
        }
      }

      if (contactsRes.status === "fulfilled") {
        const contacts =
          contactsRes.value?.data?.data?.contacts || contactsRes.value?.data?.data?.messages;
        if (Array.isArray(contacts)) {
          contacts.slice(0, 2).forEach((c: any) => {
            activities.push({
              type: "contact",
              title: `Message from ${c.name || "Anonymous"}${c.subject ? ": " + c.subject : ""}`,
              time: formatTimeAgo(c.createdAt),
            });
          });
        }
      }

      if (membersRes.status === "fulfilled") {
        const students = membersRes.value?.data?.data?.students;
        if (Array.isArray(students)) {
          students.slice(0, 2).forEach((s: any) => {
            activities.push({
              type: "member",
              title: `New member: ${s.name}`,
              time: formatTimeAgo(s.createdAt),
            });
          });
        }
      }

      if (teamRes.status === "fulfilled") {
        const members = teamRes.value?.data?.data?.members;
        if (Array.isArray(members)) {
          members.slice(0, 1).forEach((m: any) => {
            activities.push({
              type: "team",
              title: `Team: ${m.name} - ${m.role}`,
              time: formatTimeAgo(m.createdAt),
            });
          });
        }
      }

      setRecentActivities(activities.slice(0, 6));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Events",
      value: stats.events,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-500/10",
      href: "/admin/events",
    },
    {
      title: "Active Projects",
      value: stats.projects,
      icon: <FolderKanban className="h-6 w-6 text-green-500" />,
      color: "bg-green-500/10",
      href: "/admin/projects",
    },
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-500/10",
      href: "/admin/blog",
    },
    {
      title: "Registered Members",
      value: stats.members,
      icon: <UserCircle className="h-6 w-6 text-cyan-500" />,
      color: "bg-cyan-500/10",
      href: "/admin/members",
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: <Users className="h-6 w-6 text-pink-500" />,
      color: "bg-pink-500/10",
      href: "/admin/team",
    },
    {
      title: "Newsletter Subscribers",
      value: stats.subscribers,
      icon: <Newspaper className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-500/10",
      href: "/admin/newsletter",
    },
    {
      title: "Contact Messages",
      value: stats.contacts,
      icon: <Mail className="h-6 w-6 text-red-500" />,
      color: "bg-red-500/10",
      href: "/admin/contacts",
    },
    {
      title: "Analytics",
      value: "\u2014",
      change: "View reports",
      changeType: "neutral" as const,
      icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
      color: "bg-indigo-500/10",
      href: "/admin/analytics",
    },
  ];

  const quickActions = [
    {
      title: "Create Event",
      description: "Add a new event or workshop",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      href: "/admin/events",
      color: "bg-blue-500/10",
    },
    {
      title: "Write Blog Post",
      description: "Publish a new article",
      icon: <FileText className="h-5 w-5 text-green-500" />,
      href: "/admin/blog",
      color: "bg-green-500/10",
    },
    {
      title: "Add Project",
      description: "Showcase a new project",
      icon: <FolderKanban className="h-5 w-5 text-purple-500" />,
      href: "/admin/projects",
      color: "bg-purple-500/10",
    },
    {
      title: "Manage Team",
      description: "Add or edit team members",
      icon: <Users className="h-5 w-5 text-pink-500" />,
      href: "/admin/team",
      color: "bg-pink-500/10",
    },
    {
      title: "View Members",
      description: "Search & manage registered students",
      icon: <UserCircle className="h-5 w-5 text-cyan-500" />,
      href: "/admin/members",
      color: "bg-cyan-500/10",
    },
    {
      title: "Newsletter",
      description: "Manage subscribers & campaigns",
      icon: <Newspaper className="h-5 w-5 text-amber-500" />,
      href: "/admin/newsletter",
      color: "bg-amber-500/10",
    },
    {
      title: "Contact Messages",
      description: "View & reply to messages",
      icon: <Mail className="h-5 w-5 text-red-500" />,
      href: "/admin/contacts",
      color: "bg-red-500/10",
    },
    {
      title: "Settings",
      description: "Configure site settings",
      icon: <Plus className="h-5 w-5 text-gray-500" />,
      href: "/admin/settings",
      color: "bg-gray-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Dashboard
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Welcome back{user?.name ? `, ${user.name}` : ""}! Here's what's happening with your
            site.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className={cn(
            "rounded-xl border p-2 transition-colors",
            isDark
              ? "border-slate-800 text-gray-400 hover:bg-slate-800"
              : "border-gray-200 text-gray-600 hover:bg-gray-50",
            loading && "animate-spin",
          )}
          title="Refresh data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard {...stat} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div
          className={cn(
            "rounded-2xl border p-6 lg:col-span-2",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <h2 className={cn("mb-4 text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <QuickAction {...action} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={cn(
            "rounded-2xl border p-6",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <h2 className={cn("mb-4 text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Recent Activity
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <div
                    className={cn(
                      "h-8 w-8 animate-pulse rounded-lg",
                      isDark ? "bg-slate-800" : "bg-gray-200",
                    )}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className={cn(
                        "h-4 w-3/4 animate-pulse rounded",
                        isDark ? "bg-slate-800" : "bg-gray-200",
                      )}
                    />
                    <div
                      className={cn(
                        "h-3 w-1/3 animate-pulse rounded",
                        isDark ? "bg-slate-800" : "bg-gray-200",
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <RecentActivity {...activity} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Clock
                className={cn("mx-auto mb-2 h-8 w-8", isDark ? "text-gray-600" : "text-gray-400")}
              />
              <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                No recent activity
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
