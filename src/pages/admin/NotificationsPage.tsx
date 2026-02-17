// ============================================
// ComES Website - Admin Notifications Page
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Users,
  Newspaper,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Megaphone,
  UserCircle,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge } from '@/components/ui';
import api from '@/services/api';

interface Student {
  _id: string;
  name: string;
  email: string;
  registrationNo: string;
  username: string;
  isEmailVerified: boolean;
}

type NotificationTab = 'individual' | 'broadcast-students' | 'broadcast-newsletter';

// ── Toast Component ──────────────────────────────────────────────
const Toast = ({ toast, onClose }: { toast: { type: 'success' | 'error'; message: string } | null; onClose: () => void }) => {
  if (!toast) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        )}
      >
        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="font-medium">{toast.message}</p>
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ── Notifications Page ───────────────────────────────────────────
export const NotificationsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [activeTab, setActiveTab] = useState<NotificationTab>('individual');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Individual notification state
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);

  // Stats
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeSubscribers, setActiveSubscribers] = useState(0);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'individual') {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [studentsRes, newsletterRes] = await Promise.all([
        api.get('/students'),
        api.get('/newsletter', { params: { limit: 1 } }),
      ]);
      setTotalStudents(studentsRes.data.data.students?.length || 0);
      setActiveSubscribers(newsletterRes.data.data.stats?.active || 0);
    } catch {
      // Stats are non-critical, silently fail
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await api.get('/students');
      setStudents(response.data.data.students || []);
    } catch {
      showToast('error', 'Failed to fetch students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.registrationNo.toLowerCase().includes(q)
    );
  });

  const resetForm = () => {
    setSubject('');
    setMessage('');
    setConfirmStep(false);
    setSelectedStudent(null);
  };

  const handleSend = async () => {
    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      if (activeTab === 'individual') {
        if (!selectedStudent) return;
        await api.post('/students/notify', {
          studentId: selectedStudent._id,
          subject,
          message,
        });
        showToast('success', `Notification sent to ${selectedStudent.name}`);
      } else if (activeTab === 'broadcast-students') {
        const response = await api.post('/students/notify-all', { subject, message });
        const sentCount = response.data.data?.sentCount || totalStudents;
        showToast('success', `Notification sent to ${sentCount} students`);
      } else if (activeTab === 'broadcast-newsletter') {
        const response = await api.post('/newsletter/send', { subject, message });
        const sentCount = response.data.data?.sentCount || activeSubscribers;
        showToast('success', `Newsletter sent to ${sentCount} subscribers`);
      }
      resetForm();
    } catch {
      showToast('error', 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getRecipientLabel = () => {
    if (activeTab === 'individual') return selectedStudent?.name || 'Select a student';
    if (activeTab === 'broadcast-students') return `${totalStudents} registered students`;
    return `${activeSubscribers} newsletter subscribers`;
  };

  const canSend = subject.trim() && message.trim() && (activeTab !== 'individual' || selectedStudent);

  const tabs = [
    { id: 'individual' as NotificationTab, label: 'Individual Student', icon: UserCircle, description: 'Send to a specific student' },
    { id: 'broadcast-students' as NotificationTab, label: 'All Students', icon: Users, description: 'Broadcast to all registered students' },
    { id: 'broadcast-newsletter' as NotificationTab, label: 'Newsletter', icon: Newspaper, description: 'Send to newsletter subscribers' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
          Notifications
        </h1>
        <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
          Send notifications to students and newsletter subscribers
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Registered Students', value: totalStudents, icon: Users, color: 'blue' },
          { label: 'Newsletter Subscribers', value: activeSubscribers, icon: Newspaper, color: 'green' },
          { label: 'Channels', value: 3, icon: Megaphone, color: 'purple' },
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
                <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{value}</p>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Channel Selector */}
        <div className={cn(
          'lg:col-span-1 rounded-2xl border p-4 space-y-3',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <h2 className={cn('text-lg font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
            Select Channel
          </h2>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setConfirmStep(false); }}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all',
                activeTab === tab.id
                  ? isDark
                    ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                  : isDark
                    ? 'border border-slate-800 hover:bg-slate-800/50 text-gray-300'
                    : 'border border-gray-100 hover:bg-gray-50 text-gray-700'
              )}
            >
              <div className={cn(
                'p-2.5 rounded-lg',
                activeTab === tab.id
                  ? 'bg-blue-500/20'
                  : isDark ? 'bg-slate-800' : 'bg-gray-100'
              )}>
                <tab.icon className={cn('w-5 h-5', activeTab === tab.id ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-500')} />
              </div>
              <div>
                <p className="font-medium text-sm">{tab.label}</p>
                <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>{tab.description}</p>
              </div>
            </button>
          ))}

          {/* Student Selector for Individual Tab */}
          {activeTab === 'individual' && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4', isDark ? 'text-gray-500' : 'text-gray-400')} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-4 py-2 rounded-lg border text-sm transition-colors',
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {loadingStudents ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-5 h-5 border-2 rounded-full border-blue-500/30 border-t-blue-500 animate-spin" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <p className={cn('text-sm text-center py-4', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    No students found
                  </p>
                ) : (
                  filteredStudents.map((student) => (
                    <button
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors text-sm',
                        selectedStudent?._id === student._id
                          ? isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                          : isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn('font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
                          {student.name}
                        </p>
                        <p className={cn('truncate text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
                          {student.email}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Compose Form */}
        <div className={cn(
          'lg:col-span-2 rounded-2xl border p-6',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Compose Notification
            </h2>
            <Badge variant={activeTab === 'individual' ? 'info' : 'success'}>
              {activeTab === 'individual' ? 'Individual' : 'Broadcast'}
            </Badge>
          </div>

          {/* Recipient Info */}
          <div className={cn(
            'flex items-center gap-3 p-4 mb-6 rounded-xl',
            activeTab === 'individual' && !selectedStudent
              ? isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
              : isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          )}>
            {activeTab === 'individual' ? (
              selectedStudent ? (
                <>
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <p className={cn('font-medium text-sm', isDark ? 'text-blue-300' : 'text-blue-700')}>
                      {selectedStudent.name}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-blue-400' : 'text-blue-600')}>
                      {selectedStudent.email}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <UserCircle className={cn('w-5 h-5', isDark ? 'text-yellow-400' : 'text-yellow-600')} />
                  <p className={cn('text-sm font-medium', isDark ? 'text-yellow-300' : 'text-yellow-700')}>
                    Select a student from the list to send a notification
                  </p>
                </>
              )
            ) : (
              <>
                {activeTab === 'broadcast-students' ? <Users className="w-5 h-5 text-blue-500" /> : <Mail className="w-5 h-5 text-blue-500" />}
                <p className={cn('text-sm font-medium', isDark ? 'text-blue-300' : 'text-blue-700')}>
                  This notification will be sent to <strong>{getRecipientLabel()}</strong> via email.
                </p>
              </>
            )}
          </div>

          {confirmStep ? (
            <div className="space-y-4">
              <div className={cn(
                'p-4 rounded-lg border',
                isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'
              )}>
                <p className={cn('text-sm font-medium mb-3', isDark ? 'text-yellow-300' : 'text-yellow-800')}>
                  Review & Confirm
                </p>
                <div className="space-y-2">
                  <p className={cn('text-sm', isDark ? 'text-yellow-400' : 'text-yellow-700')}>
                    <strong>Channel:</strong> {tabs.find(t => t.id === activeTab)?.label}
                  </p>
                  <p className={cn('text-sm', isDark ? 'text-yellow-400' : 'text-yellow-700')}>
                    <strong>Recipients:</strong> {getRecipientLabel()}
                  </p>
                  <p className={cn('text-sm', isDark ? 'text-yellow-400' : 'text-yellow-700')}>
                    <strong>Subject:</strong> {subject}
                  </p>
                </div>
              </div>

              <div className={cn(
                'p-4 rounded-lg border',
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
              )}>
                <p className={cn('text-xs font-medium mb-2 uppercase tracking-wider', isDark ? 'text-gray-500' : 'text-gray-400')}>
                  Message Preview
                </p>
                <p className={cn('text-sm whitespace-pre-wrap', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  {message}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setConfirmStep(false)} disabled={sending} className="flex-1">
                  Go Back
                </Button>
                <Button onClick={handleSend} disabled={sending} className="flex-1">
                  {sending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    activeTab === 'broadcast-newsletter'
                      ? 'e.g., Monthly Update - January 2025'
                      : 'e.g., Upcoming Event Announcement'
                  }
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
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message..."
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

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Clear
                </Button>
                <Button
                  variant="primary"
                  icon={<Send className="w-4 h-4" />}
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex-1"
                >
                  Review & Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
