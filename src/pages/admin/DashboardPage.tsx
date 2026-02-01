// ============================================
// ComES Website - Admin Dashboard Page
// ============================================

import { motion } from 'framer-motion';
import {
  Calendar,
  FolderKanban,
  FileText,
  Users,
  Mail,
  Newspaper,
  TrendingUp,
  Eye,
  Heart,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, changeType, icon, color }: StatCardProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-2xl border transition-all',
        isDark 
          ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {title}
          </p>
          <p className={cn('text-3xl font-bold mt-2', isDark ? 'text-white' : 'text-gray-900')}>
            {value}
          </p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              changeType === 'positive' ? 'text-green-500' : 'text-red-500'
            )}>
              <TrendingUp className={cn('w-4 h-4', changeType === 'negative' && 'rotate-180')} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', color)}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
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
  const isDark = resolvedTheme === 'dark';

  return (
    <Link to={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className={cn(
          'p-4 rounded-xl border transition-all cursor-pointer group',
          isDark 
            ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-xl', color)}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              {title}
            </h3>
            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
              {description}
            </p>
          </div>
          <ArrowUpRight className={cn(
            'w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1',
            isDark ? 'text-gray-500' : 'text-gray-400'
          )} />
        </div>
      </motion.div>
    </Link>
  );
};

interface RecentActivityProps {
  type: 'event' | 'blog' | 'contact' | 'newsletter';
  title: string;
  time: string;
}

const RecentActivity = ({ type, title, time }: RecentActivityProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const typeConfig = {
    event: { icon: Calendar, color: 'bg-blue-500/10 text-blue-500' },
    blog: { icon: FileText, color: 'bg-green-500/10 text-green-500' },
    contact: { icon: Mail, color: 'bg-amber-500/10 text-amber-500' },
    newsletter: { icon: Newspaper, color: 'bg-purple-500/10 text-purple-500' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex items-center gap-4 p-3 rounded-xl transition-colors',
      isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
    )}>
      <div className={cn('p-2 rounded-lg', config.color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
          {title}
        </p>
        <p className={cn('text-sm flex items-center gap-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
          <Clock className="w-3 h-3" />
          {time}
        </p>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const stats = [
    {
      title: 'Total Events',
      value: 24,
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500/10',
    },
    {
      title: 'Active Projects',
      value: 8,
      change: '+3 this month',
      changeType: 'positive' as const,
      icon: <FolderKanban className="w-6 h-6 text-green-500" />,
      color: 'bg-green-500/10',
    },
    {
      title: 'Blog Posts',
      value: 42,
      change: '+5 this week',
      changeType: 'positive' as const,
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500/10',
    },
    {
      title: 'Newsletter Subscribers',
      value: '1.2K',
      change: '+8% growth',
      changeType: 'positive' as const,
      icon: <Newspaper className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Add a new event or workshop',
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      href: '/admin/events/new',
      color: 'bg-blue-500/10',
    },
    {
      title: 'Write Blog Post',
      description: 'Publish a new article',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      href: '/admin/blog/new',
      color: 'bg-green-500/10',
    },
    {
      title: 'Add Project',
      description: 'Showcase a new project',
      icon: <FolderKanban className="w-5 h-5 text-purple-500" />,
      href: '/admin/projects/new',
      color: 'bg-purple-500/10',
    },
    {
      title: 'Manage Team',
      description: 'Update team members',
      icon: <Users className="w-5 h-5 text-amber-500" />,
      href: '/admin/team',
      color: 'bg-amber-500/10',
    },
  ];

  const recentActivities = [
    { type: 'event' as const, title: 'New workshop registration: AI Fundamentals', time: '2 hours ago' },
    { type: 'contact' as const, title: 'Contact message from John Doe', time: '4 hours ago' },
    { type: 'newsletter' as const, title: '5 new newsletter subscribers', time: '6 hours ago' },
    { type: 'blog' as const, title: 'Blog post published: Getting Started with React', time: '1 day ago' },
    { type: 'event' as const, title: 'Event updated: Hackathon 2026', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
          Dashboard
        </h1>
        <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className={cn(
          'lg:col-span-2 p-6 rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <h2 className={cn('text-lg font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuickAction {...action} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={cn(
          'p-6 rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <h2 className={cn('text-lg font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
            Recent Activity
          </h2>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecentActivity {...activity} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      <div className={cn(
        'p-6 rounded-2xl border',
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            Website Analytics
          </h2>
          <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
            Last 7 days
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={cn('flex items-center justify-center gap-2 mb-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
              <Eye className="w-5 h-5" />
              <span>Page Views</span>
            </div>
            <p className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>12.5K</p>
            <p className="text-green-500 text-sm">+18% vs last week</p>
          </div>
          <div className="text-center">
            <div className={cn('flex items-center justify-center gap-2 mb-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
              <Users className="w-5 h-5" />
              <span>Unique Visitors</span>
            </div>
            <p className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>3.2K</p>
            <p className="text-green-500 text-sm">+12% vs last week</p>
          </div>
          <div className="text-center">
            <div className={cn('flex items-center justify-center gap-2 mb-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
              <Heart className="w-5 h-5" />
              <span>Engagement Rate</span>
            </div>
            <p className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>4.8%</p>
            <p className="text-green-500 text-sm">+5% vs last week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
