// ============================================
// ComES Website - Admin Members Management Page
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  Bell,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  X,
  Download,
  User,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import axios from 'axios';

interface Student {
  _id: string;
  name: string;
  email: string;
  registrationNo: string;
  username: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  isEmailVerified: boolean;
  registeredEvents?: any[];
  createdAt: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  isDark: boolean;
  onSend: (subject: string, message: string) => Promise<void>;
}

const NotificationModal = ({ isOpen, onClose, student, isDark, onSend }: NotificationModalProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    
    setSending(true);
    try {
      await onSend(subject, message);
      setSubject('');
      setMessage('');
      onClose();
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            'w-full max-w-lg rounded-2xl p-6',
            isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-2xl'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
              Send Notification
            </h3>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {student && (
            <div className={cn(
              'flex items-center gap-3 p-3 mb-4 rounded-lg',
              isDark ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                  {student.name}
                </p>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  {student.email}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={cn('block mb-2 text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                )}
                placeholder="Enter notification subject"
              />
            </div>

            <div>
              <label className={cn('block mb-2 text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border transition-colors resize-none',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                )}
                placeholder="Enter notification message"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={sending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !message.trim()}
              className="flex-1"
            >
              {sending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Send Notification</span>
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const MembersManagementPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [notificationModal, setNotificationModal] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null,
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudentsData();
  }, [searchQuery, students, filterVerified]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setStudents(response.data.data.students || []);
    } catch (error) {
      showToast('error', 'Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudentsData = () => {
    let filtered = students;

    // Filter by verification status
    if (filterVerified === 'verified') {
      filtered = filtered.filter((s) => s.isEmailVerified);
    } else if (filterVerified === 'unverified') {
      filtered = filtered.filter((s) => !s.isEmailVerified);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.registrationNo.toLowerCase().includes(query) ||
          s.username.toLowerCase().includes(query)
      );
    }

    setFilteredStudents(filtered);
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(studentId);
      await axios.delete(`/api/v1/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setStudents(students.filter((s) => s._id !== studentId));
      showToast('success', `Successfully deleted ${studentName}`);
    } catch (error) {
      showToast('error', 'Failed to delete student');
      console.error('Error deleting student:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSendNotification = async (subject: string, message: string) => {
    if (!notificationModal.student) return;

    try {
      await axios.post(
        '/api/v1/students/notify',
        {
          studentId: notificationModal.student._id,
          subject,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      showToast('success', `Notification sent to ${notificationModal.student.name}`);
    } catch (error) {
      showToast('error', 'Failed to send notification');
      console.error('Error sending notification:', error);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Registration No', 'Username', 'Email Verified', 'Events Count', 'Created At'];
    const rows = filteredStudents.map((s) => [
      s.name,
      s.email,
      s.registrationNo,
      s.username,
      s.isEmailVerified ? 'Yes' : 'No',
      s.registeredEvents?.length || 0,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
                toast.type === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              )}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal({ isOpen: false, student: null })}
        student={notificationModal.student}
        isDark={isDark}
        onSend={handleSendNotification}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Members Management
          </h1>
          <p className={cn('mt-1 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Manage student accounts, send notifications, and view member details
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-6 rounded-xl',
            isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Total Members
              </p>
              <p className={cn('mt-2 text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {students.length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10">
              <User className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'p-6 rounded-xl',
            isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Verified Accounts
              </p>
              <p className={cn('mt-2 text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {students.filter((s) => s.isEmailVerified).length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'p-6 rounded-xl',
            isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Pending Verification
              </p>
              <p className={cn('mt-2 text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {students.filter((s) => !s.isEmailVerified).length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/10">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className={cn(
        'p-4 rounded-xl',
        isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm'
      )}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className={cn(
              'absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, registration no, or username..."
              className={cn(
                'w-full py-2 pl-10 pr-4 border rounded-lg transition-colors',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              )}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value as any)}
              className={cn(
                'px-4 py-2 border rounded-lg transition-colors',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              )}
            >
              <option value="all">All Members</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>

            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className={cn(
        'overflow-hidden rounded-xl',
        isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm'
      )}>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 rounded-full border-blue-500/30 border-t-blue-500 animate-spin" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <User className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
            <p className={cn('text-lg font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
              No members found
            </p>
            <p className={cn('mt-1 text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>
              {searchQuery ? 'Try adjusting your search query' : 'No students have registered yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={cn(
                'border-b',
                isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
              )}>
                <tr>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-left uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Member
                  </th>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-left uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Registration No
                  </th>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-left uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Username
                  </th>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-left uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Status
                  </th>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-left uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Events
                  </th>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-left uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Joined
                  </th>
                  <th className={cn('px-6 py-3 text-xs font-medium tracking-wider text-right uppercase', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn('divide-y', isDark ? 'divide-slate-800' : 'divide-gray-200')}>
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      'transition-colors',
                      isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                            {student.name}
                          </p>
                          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={cn('text-sm font-mono', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        {student.registrationNo}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/portfolio/${student.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-1 text-sm font-medium hover:underline',
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        )}
                      >
                        {student.username}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 rounded-full bg-green-100">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-700 rounded-full bg-yellow-100">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        {student.registeredEvents?.length || 0} events
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setNotificationModal({ isOpen: true, student })}
                          className={cn(
                            'p-2 transition-colors rounded-lg',
                            isDark
                              ? 'hover:bg-slate-800 text-blue-400'
                              : 'hover:bg-blue-50 text-blue-600'
                          )}
                          title="Send Notification"
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student._id, student.name)}
                          disabled={deleteLoading === student._id}
                          className={cn(
                            'p-2 transition-colors rounded-lg',
                            isDark
                              ? 'hover:bg-slate-800 text-red-400'
                              : 'hover:bg-red-50 text-red-600',
                            deleteLoading === student._id && 'opacity-50 cursor-not-allowed'
                          )}
                          title="Delete Member"
                        >
                          {deleteLoading === student._id ? (
                            <div className="w-4 h-4 border-2 rounded-full border-red-500/30 border-t-red-500 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersManagementPage;
