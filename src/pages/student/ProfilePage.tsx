// ============================================
// ComES Website - Student Profile Page
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  Save,
  Camera,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { Link } from 'react-router';
import { useStudentStore } from '@/store/studentStore';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Input, Badge } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import { studentService } from '@/services/student.service';

interface FormData {
  name: string;
  email: string;
  contactNo: string;
  semester: number | '';
  bio: string;
  skills: string;
  github: string;
  linkedin: string;
  website: string;
}

export const ProfilePage = () => {
  const { student, updateStudent } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  const [formData, setFormData] = useState<FormData>({
    name: student?.name || '',
    email: student?.email || '',
    contactNo: student?.contactNo || '',
    semester: student?.semester || '',
    bio: student?.bio || '',
    skills: student?.skills?.join(', ') || '',
    github: student?.github || '',
    linkedin: student?.linkedin || '',
    website: student?.website || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        contactNo: student.contactNo || '',
        semester: student.semester || '',
        bio: student.bio || '',
        skills: student.skills?.join(', ') || '',
        github: student.github || '',
        linkedin: student.linkedin || '',
        website: student.website || '',
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? (value ? parseInt(value, 10) : '') : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await studentService.updateProfile({
        name: formData.name,
        contactNo: formData.contactNo || undefined,
        semester: formData.semester || undefined,
        bio: formData.bio || undefined,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        github: formData.github || undefined,
        linkedin: formData.linkedin || undefined,
        website: formData.website || undefined,
      });

      if (response.status === 'success' && response.data) {
        updateStudent(response.data.student);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      // API call to change password
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/students/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col font-comes transition-colors duration-300',
      isDark ? 'bg-slate-950 text-gray-100' : 'bg-white text-gray-900'
    )}>
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className={cn(
          'min-h-screen py-8',
          isDark ? 'bg-slate-950' : 'bg-gray-50'
        )}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link 
              to="/student/dashboard"
              className={cn(
                'inline-flex items-center gap-2 mb-6 transition-colors',
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-8 rounded-2xl border mb-6',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
              )}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className={cn(
                    'w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold',
                    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  )}>
                    {student?.avatar ? (
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(student?.name || 'S')
                    )}
                  </div>
                  <button 
                    className={cn(
                      'absolute bottom-0 right-0 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100',
                      isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-700 shadow-lg hover:bg-gray-50'
                    )}
                    title="Change avatar (coming soon)"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="text-center sm:text-left flex-1">
                  <h1 className={cn('text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-gray-900')}>
                    {student?.name}
                  </h1>
                  <p className={cn('text-sm mb-3', isDark ? 'text-gray-400' : 'text-gray-600')}>
                    {student?.email}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge variant="primary">{student?.registrationNo}</Badge>
                    <Badge variant="secondary">Batch {student?.batch}</Badge>
                    {student?.semester && (
                      <Badge variant="secondary">Semester {student.semester}</Badge>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex gap-2">
                  {student?.username && (
                    <Link 
                      to={`/portfolio/${student.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        className="shrink-0"
                      >
                        View Portfolio
                      </Button>
                    </Link>
                  )}
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                      className="shrink-0"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Success/Error Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-500">{success}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                'p-6 rounded-2xl border',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
              )}
            >
              <h2 className={cn('text-lg font-semibold mb-6', isDark ? 'text-white' : 'text-gray-900')}>
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    )} />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Email Address
                    <span className={cn('ml-2 text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>(cannot be changed)</span>
                  </label>
                  <div className="relative">
                    <Mail className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    )} />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="pl-10 opacity-60"
                    />
                  </div>
                </div>

                {/* Registration Number (Read-only) */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Registration Number
                    <span className={cn('ml-2 text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>(cannot be changed)</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    )} />
                    <Input
                      type="text"
                      value={student?.registrationNo || ''}
                      disabled
                      className="pl-10 opacity-60"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    )} />
                    <Input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+94 XX XXX XXXX"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Semester */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Current Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-all',
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-gray-200 text-gray-900',
                      !isEditing && 'opacity-60'
                    )}
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Bio
                    <span className={cn('ml-2 text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>(shown on portfolio)</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange as any}
                    disabled={!isEditing}
                    rows={3}
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-all resize-none',
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
                      !isEditing && 'opacity-60'
                    )}
                  />
                  <p className={cn('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Skills
                    <span className={cn('ml-2 text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>(comma separated)</span>
                  </label>
                  <Input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="React, Node.js, Python, etc."
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    GitHub Profile
                  </label>
                  <Input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    LinkedIn Profile
                  </label>
                  <Input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Personal Website
                  </label>
                  <Input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: student?.name || '',
                          email: student?.email || '',
                          contactNo: student?.contactNo || '',
                          semester: student?.semester || '',
                          bio: student?.bio || '',
                          skills: student?.skills?.join(', ') || '',
                          github: student?.github || '',
                          linkedin: student?.linkedin || '',
                          website: student?.website || '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </motion.div>

            {/* Change Password Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'p-6 rounded-2xl border mt-6',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                  Password & Security
                </h2>
                {!showPasswordForm && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPasswordForm(true)}
                    className="gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                )}
              </div>

              {passwordSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-500">{passwordSuccess}</p>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-500">{passwordError}</p>
                </div>
              )}

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setPasswordError(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              )}

              {!showPasswordForm && (
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Keep your account secure by using a strong password that you don't use elsewhere.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
