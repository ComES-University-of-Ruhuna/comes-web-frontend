// ============================================
// ComES Website - Admin Contacts Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Trash2,
  MessageSquare,
  Archive,
  Clock,
  X,
  Reply,
  Star,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge } from '@/components/ui';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  starred: boolean;
}

const mockMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    subject: 'Inquiry about membership',
    message: 'Hi, I am a first-year computer science student and I would like to join ComES. Can you please provide more information about how to become a member and what activities you organize?',
    status: 'new',
    createdAt: '2026-01-28T10:30:00',
    starred: false,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    subject: 'Partnership proposal',
    message: 'Hello, I represent TechCorp and we are interested in sponsoring your upcoming hackathon. Please let me know who I should contact to discuss this further.',
    status: 'read',
    createdAt: '2026-01-27T14:15:00',
    starred: true,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    subject: 'Workshop feedback',
    message: 'I attended your AI workshop last week and it was amazing! Thank you for organizing such a great event. Looking forward to more workshops in the future.',
    status: 'replied',
    createdAt: '2026-01-25T09:00:00',
    starred: false,
  },
];

const statusFilters = ['All', 'new', 'read', 'replied', 'archived'];

export const ContactsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || msg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: ContactMessage['status']) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
    if (viewingMessage?.id === id) {
      setViewingMessage({ ...viewingMessage, status });
    }
  };

  const handleToggleStar = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(m => m.id !== id));
      if (viewingMessage?.id === id) {
        setViewingMessage(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary';
      case 'read': return 'secondary';
      case 'replied': return 'success';
      case 'archived': return 'warning';
      default: return 'secondary';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    starred: messages.filter(m => m.starred).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
          Contact Messages
        </h1>
        <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
          Manage inquiries and feedback from visitors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Messages', value: stats.total, icon: MessageSquare, color: 'blue' },
          { label: 'New Messages', value: stats.new, icon: Clock, color: 'green' },
          { label: 'Starred', value: stats.starred, icon: Star, color: 'yellow' },
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
                color === 'yellow' && (isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'),
              )}>
                <Icon className={cn(
                  'w-5 h-5',
                  color === 'blue' && 'text-blue-500',
                  color === 'green' && 'text-green-500',
                  color === 'yellow' && 'text-yellow-500',
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
              placeholder="Search messages..."
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
            {statusFilters.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === 'All' ? 'All Status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className={cn(
        'rounded-2xl border overflow-hidden',
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        {filteredMessages.length > 0 ? (
          <div className={cn('divide-y', isDark ? 'divide-slate-800' : 'divide-gray-100')}>
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'p-4 flex items-start gap-4 transition-colors cursor-pointer',
                  message.status === 'new' && (isDark ? 'bg-blue-500/5' : 'bg-blue-50/50'),
                  isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                )}
                onClick={() => {
                  setViewingMessage(message);
                  if (message.status === 'new') {
                    handleStatusChange(message.id, 'read');
                  }
                }}
              >
                {/* Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStar(message.id);
                  }}
                  className="mt-1"
                >
                  <Star
                    className={cn(
                      'w-5 h-5 transition-colors',
                      message.starred
                        ? 'text-yellow-500 fill-yellow-500'
                        : isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-400'
                    )}
                  />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'font-medium truncate',
                      message.status === 'new' ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-300' : 'text-gray-700')
                    )}>
                      {message.name}
                    </span>
                    <Badge variant={getStatusColor(message.status) as 'primary' | 'secondary' | 'success' | 'warning'} size="sm">
                      {message.status}
                    </Badge>
                  </div>
                  <p className={cn(
                    'font-medium truncate',
                    message.status === 'new' ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-600')
                  )}>
                    {message.subject}
                  </p>
                  <p className={cn('text-sm truncate mt-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
                    {message.message}
                  </p>
                </div>

                {/* Date & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <span className={cn('text-xs whitespace-nowrap', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    {formatDate(message.createdAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(message.id, 'archived');
                      }}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        isDark ? 'hover:bg-slate-700 text-gray-500' : 'hover:bg-gray-200 text-gray-400'
                      )}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors text-red-500',
                        isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
            <p className={cn('text-lg font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
              No messages found
            </p>
          </div>
        )}
      </div>

      {/* Message Viewer Modal */}
      {viewingMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setViewingMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden',
              isDark ? 'bg-slate-900' : 'bg-white'
            )}
          >
            {/* Header */}
            <div className={cn(
              'flex items-center justify-between p-6 border-b',
              isDark ? 'border-slate-800' : 'border-gray-200'
            )}>
              <div className="flex items-center gap-3">
                <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                  Message Details
                </h2>
                <Badge variant={getStatusColor(viewingMessage.status) as 'primary' | 'secondary' | 'success' | 'warning'}>
                  {viewingMessage.status}
                </Badge>
              </div>
              <button onClick={() => setViewingMessage(null)} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                <X className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('font-semibold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
                    {viewingMessage.name}
                  </p>
                  <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    {viewingMessage.email}
                  </p>
                </div>
                <div className={cn('flex items-center gap-1 text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
                  <Calendar className="w-4 h-4" />
                  {formatDate(viewingMessage.createdAt)}
                </div>
              </div>

              <div>
                <p className={cn('font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Subject: {viewingMessage.subject}
                </p>
                <div className={cn(
                  'p-4 rounded-xl',
                  isDark ? 'bg-slate-800' : 'bg-gray-50'
                )}>
                  <p className={cn('whitespace-pre-wrap', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    {viewingMessage.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={cn(
              'flex items-center justify-between p-6 border-t',
              isDark ? 'border-slate-800' : 'border-gray-200'
            )}>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(viewingMessage.id, 'archived')}
                >
                  <Archive className="w-4 h-4 mr-1" /> Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(viewingMessage.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
              <a href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject}`}>
                <Button variant="primary" icon={<Reply className="w-4 h-4" />}>
                  Reply
                </Button>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ContactsPage;
