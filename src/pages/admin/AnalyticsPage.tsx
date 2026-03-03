// ============================================
// ComES Website - Admin Analytics Page
// ============================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { analyticsService, type AnalyticsSummary } from "@/services/analytics.service";

// Format duration in seconds to readable format
const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border p-6 transition-all",
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
          <p className={cn("mt-2 text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            {value}
          </p>
          {change !== undefined && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-sm font-medium",
                change >= 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}% from last week</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3", color)}>{icon}</div>
      </div>
    </motion.div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const ProgressBar = ({ label, value, total, color }: ProgressBarProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const percentage = (value / total) * 100;

  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between">
        <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
          {label}
        </span>
        <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          {value.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div
        className={cn("h-2 overflow-hidden rounded-full", isDark ? "bg-slate-800" : "bg-gray-200")}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
};

// Simple Bar Chart Component
interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
}

const SimpleBarChart = ({ data, maxValue }: BarChartProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-32 items-end gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / max) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="min-h-[4px] w-full rounded-t-sm bg-gradient-to-t from-blue-500 to-cyan-400"
          />
          <span className={cn("text-[10px]", isDark ? "text-gray-500" : "text-gray-400")}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case "24h":
          startDate.setDate(today.getDate() - 1);
          break;
        case "7d":
          startDate.setDate(today.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(today.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(today.getDate() - 90);
          break;
      }

      const data = await analyticsService.getAnalyticsSummary({
        startDate: startDate.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      });
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw
          className={cn("h-8 w-8 animate-spin", isDark ? "text-blue-400" : "text-blue-600")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Visitor Analytics
          </h1>
          <p className={cn("mt-1 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
            Track and analyze your website visitors
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="bg-opacity-50 flex items-center gap-1 rounded-xl p-1">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                  dateRange === range
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : isDark
                      ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className={cn(
              "rounded-xl p-2 transition-all",
              isDark ? "text-gray-400 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={analytics?.totalVisitors.toLocaleString() || "0"}
          change={12}
          icon={<Users className="h-5 w-5 text-blue-500" />}
          color={isDark ? "bg-blue-500/20" : "bg-blue-100"}
        />
        <StatCard
          title="Page Views"
          value={analytics?.totalPageViews.toLocaleString() || "0"}
          change={8}
          icon={<Eye className="h-5 w-5 text-purple-500" />}
          color={isDark ? "bg-purple-500/20" : "bg-purple-100"}
        />
        <StatCard
          title="Avg. Session Duration"
          value={formatDuration(analytics?.averageSessionDuration || 0)}
          change={-3}
          icon={<Clock className="h-5 w-5 text-cyan-500" />}
          color={isDark ? "bg-cyan-500/20" : "bg-cyan-100"}
        />
        <StatCard
          title="Bounce Rate"
          value={`${analytics?.bounceRate.toFixed(1) || 0}%`}
          change={-5}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          color={isDark ? "bg-green-500/20" : "bg-green-100"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visitors Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl border p-6",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-lg p-2", isDark ? "bg-blue-500/20" : "bg-blue-100")}>
                <BarChart3 className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Visitors Over Time
              </h3>
            </div>
          </div>
          <SimpleBarChart
            data={
              analytics?.visitsByDate.map((d) => ({
                label: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
                value: d.visitors,
              })) || []
            }
          />
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "rounded-2xl border p-6",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className={cn("rounded-lg p-2", isDark ? "bg-purple-500/20" : "bg-purple-100")}>
              <PieChart className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")} />
            </div>
            <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
              Device Breakdown
            </h3>
          </div>
          <div className="space-y-4">
            {analytics?.deviceBreakdown.map((device, index) => (
              <div key={device.device} className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-lg p-2",
                    index === 0
                      ? isDark
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                      : index === 1
                        ? isDark
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-purple-100 text-purple-600"
                        : isDark
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-cyan-100 text-cyan-600",
                  )}
                >
                  {getDeviceIcon(device.device)}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      {device.device}
                    </span>
                    <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                      {device.percentage}%
                    </span>
                  </div>
                  <div className={cn("h-2 rounded-full", isDark ? "bg-slate-800" : "bg-gray-200")}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={cn(
                        "h-full rounded-full",
                        index === 0 ? "bg-blue-500" : index === 1 ? "bg-purple-500" : "bg-cyan-500",
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl border p-6",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <h3 className={cn("mb-4 font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Top Pages
          </h3>
          <div className="space-y-3">
            {analytics?.topPages.slice(0, 6).map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isDark ? "bg-slate-800 text-gray-400" : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
                    {page.path}
                  </span>
                </div>
                <span
                  className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}
                >
                  {page.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "rounded-2xl border p-6",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <div className="mb-4 flex items-center gap-2">
            <Globe className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
            <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
              Top Referrers
            </h3>
          </div>
          <div className="space-y-3">
            {analytics?.topReferrers.map((referrer) => (
              <ProgressBar
                key={referrer.source}
                label={referrer.source}
                value={referrer.count}
                total={analytics.totalVisitors}
                color="bg-gradient-to-r from-green-500 to-emerald-400"
              />
            ))}
          </div>
        </motion.div>

        {/* Browser Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-2xl border p-6",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
          )}
        >
          <h3 className={cn("mb-4 font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Browser Usage
          </h3>
          <div className="space-y-3">
            {analytics?.browserBreakdown.map((browser) => (
              <ProgressBar
                key={browser.browser}
                label={browser.browser}
                value={browser.count}
                total={analytics.totalVisitors}
                color="bg-gradient-to-r from-orange-500 to-amber-400"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Visitor Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl border p-6",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        <h3 className={cn("mb-4 font-semibold", isDark ? "text-white" : "text-gray-900")}>
          Visitor Types
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4">
            <div className={cn("rounded-xl p-4", isDark ? "bg-green-500/20" : "bg-green-100")}>
              <Users className={cn("h-8 w-8", isDark ? "text-green-400" : "text-green-600")} />
            </div>
            <div>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                New Visitors
              </p>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                {analytics?.newVisitors.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn("rounded-xl p-4", isDark ? "bg-blue-500/20" : "bg-blue-100")}>
              <TrendingUp className={cn("h-8 w-8", isDark ? "text-blue-400" : "text-blue-600")} />
            </div>
            <div>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                Returning Visitors
              </p>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                {analytics?.returningVisitors.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
