// ============================================
// ComES Website - Admin Newsletter Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Mail,
  Calendar,
  Download,
  Trash2,
  Users,
  TrendingUp,
  Send,
  X,
  CheckCircle,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge } from '@/components/ui';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

const mockSubscribers: Subscriber[] = [
  { id: '1', email: 'john.doe@example.com', subscribedAt: '2026-01-28', status: 'active' },
  { id: '2', email: 'jane.smith@example.com', subscribedAt: '2026-01-27', status: 'active' },
  { id: '3', email: 'bob.wilson@example.com', subscribedAt: '2026-01-25', status: 'active' },
  { id: '4', email: 'alice.johnson@example.com', subscribedAt: '2026-01-20', status: 'unsubscribed' },
  { id: '5', email: 'charlie.brown@example.com', subscribedAt: '2026-01-15', status: 'active' },
];

export const NewsletterPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({ subject: '', content: '' });

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter(s => s.status === 'active').length;

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  const handleExport = () => {
    const activeEmails = subscribers
      .filter(s => s.status === 'active')
      .map(s => s.email)
      .join('\n');
    
    const blob = new Blob([activeEmails], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendNewsletter = () => {
    alert(`Newsletter "${composeData.subject}" would be sent to ${activeCount} subscribers.`);
    setShowComposeModal(false);
    setComposeData({ subject: '', content: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Newsletter
          </h1>
          <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Manage subscribers and send newsletters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="primary" icon={<Send className="w-4 h-4" />} onClick={() => setShowComposeModal(true)}>
            Compose
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Subscribers', value: subscribers.length, icon: Users, color: 'blue' },
          { label: 'Active Subscribers', value: activeCount, icon: CheckCircle, color: 'green' },
          { label: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'purple' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={cn(
              'p-4 rounded-2xl border',
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-3 rounded-xl',
                color === 'blue' && (isDark ? 'bg-blue-500/20' : 'bg-blue-100'),
                color === 'green' && (isDark ? 'bg-green-500/20' : 'bg-green-100'),
                color === 'purple' && (isDark ? 'bg-purple-500/20' : 'bg-purple-100'),
              )}>
                <Icon className={cn(
                  'w-5 h-5',
                  color === 'blue' && 'text-blue-500',
                  color === 'green' && 'text-green-500',
                  color === 'purple' && 'text-purple-500',
                )} />
              </div>
              <div>
                <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                  {value}
                </p>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  {label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={cn(
        'p-4 rounded-2xl border',
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5', isDark ? 'text-gray-500' : 'text-gray-400')} />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              )}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={cn(
              'px-4 py-2.5 rounded-xl border transition-colors capitalize',
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            )}
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className={cn(
        'rounded-2xl border overflow-hidden',
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={cn(isDark ? 'bg-slate-800' : 'bg-gray-50')}>
              <tr>
                <th className={cn('px-6 py-4 text-left text-sm font-semibold', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Email
                </th>
                <th className={cn('px-6 py-4 text-left text-sm font-semibold', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Status
                </th>
                <th className={cn('px-6 py-4 text-left text-sm font-semibold', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Subscribed
                </th>
                <th className={cn('px-6 py-4 text-right text-sm font-semibold', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={cn('divide-y', isDark ? 'divide-slate-800' : 'divide-gray-100')}>
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className={cn('transition-colors', isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        isDark ? 'bg-slate-800' : 'bg-gray-100'
                      )}>
                        <Mail className={cn('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-600')} />
                      </div>
                      <span className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        {subscriber.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={subscriber.status === 'active' ? 'success' : 'secondary'}>
                      {subscriber.status}
                    </Badge>
                  </td>
                  <td className={cn('px-6 py-4', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {subscriber.subscribedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className={cn(
                          'p-2 rounded-lg transition-colors text-red-500',
                          isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="p-12 text-center">
            <Mail className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
            <p className={cn('text-lg font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
              No subscribers found
            </p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowComposeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-2xl rounded-2xl shadow-2xl',
              isDark ? 'bg-slate-900' : 'bg-white'
            )}
          >
            <div className={cn(
              'flex items-center justify-between p-6 border-b',
              isDark ? 'border-slate-800' : 'border-gray-200'
            )}>
              <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                Compose Newsletter
              </h2>
              <button onClick={() => setShowComposeModal(false)} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                <X className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className={cn(
                'p-4 rounded-xl flex items-center gap-3',
                isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
              )}>
                <Users className="w-5 h-5 text-blue-500" />
                <p className={cn('text-sm', isDark ? 'text-blue-300' : 'text-blue-700')}>
                  This newsletter will be sent to <strong>{activeCount}</strong> active subscribers.
                </p>
              </div>

              <div>
                <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Subject
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Newsletter subject..."
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border transition-colors',
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
              </div>

              <div>
                <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Content
                </label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                  placeholder="Write your newsletter content..."
                  rows={10}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border transition-colors resize-none',
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
              </div>
            </div>

            <div className={cn(
              'flex items-center justify-end gap-3 p-6 border-t',
              isDark ? 'border-slate-800' : 'border-gray-200'
            )}>
              <Button variant="outline" onClick={() => setShowComposeModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<Send className="w-4 h-4" />} onClick={handleSendNewsletter}>
                Send Newsletter
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NewsletterPage;
