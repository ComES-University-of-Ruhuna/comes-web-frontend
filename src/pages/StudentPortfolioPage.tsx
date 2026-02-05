// ============================================
// ComES Website - Student Portfolio Page
// ============================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { ThemeToggle } from '@/components/ui';
import api from '@/services/api';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  thumbnail?: string;
}

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  username: string;
  registrationNo: string;
  batch: string;
  semester?: number;
  contactNo?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  registeredEvents?: Event[];
  createdAt: string;
}

export const StudentPortfolioPage = () => {
  const { username } = useParams<{ username: string }>();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentPortfolio = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/students/portfolio/${username}`);
        setStudent(response.data.data.student);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load student portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchStudentPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-slate-950' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <Loader2 className={cn(
            'w-12 h-12 animate-spin mx-auto mb-4',
            isDark ? 'text-blue-500' : 'text-blue-600'
          )} />
          <p className={cn('text-lg', isDark ? 'text-gray-300' : 'text-gray-700')}>
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        isDark ? 'bg-slate-950' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <h2 className={cn('text-2xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>
            Portfolio Not Found
          </h2>
          <p className={cn('mb-6', isDark ? 'text-gray-400' : 'text-gray-600')}>
            {error || 'The requested student portfolio could not be found.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-slate-950' : 'bg-gray-50'
    )}>
      {/* Header with Theme Toggle */}
      <header className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-lg',
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className={cn(
        'py-16 border-b',
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      )}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="shrink-0"
              >
                <div className={cn(
                  'w-32 h-32 rounded-2xl overflow-hidden border-4',
                  isDark ? 'border-slate-800' : 'border-gray-200'
                )}>
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={cn(
                      'w-full h-full flex items-center justify-center text-4xl font-bold',
                      isDark ? 'bg-slate-800 text-blue-400' : 'bg-gray-100 text-blue-600'
                    )}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <h1 className={cn('text-3xl md:text-4xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                  {student.name}
                </h1>
                <p className={cn('text-lg mb-4', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  @{student.username}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className={cn('flex items-center gap-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{student.registrationNo}</span>
                  </div>
                  <div className={cn('flex items-center gap-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Batch {student.batch}</span>
                  </div>
                  {student.semester && (
                    <div className={cn('flex items-center gap-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">Semester {student.semester}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {student.bio && (
                  <p className={cn('text-base mb-6', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    {student.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </a>
                  )}
                  {student.contactNo && (
                    <a
                      href={`tel:${student.contactNo}`}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Call</span>
                    </a>
                  )}
                  {student.github && (
                    <a
                      href={student.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {student.linkedin && (
                    <a
                      href={student.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {student.website && (
                    <a
                      href={student.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      {student.skills && student.skills.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className={cn('text-2xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900')}>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {student.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium',
                      isDark
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    )}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {student.registeredEvents && student.registeredEvents.length > 0 && (
        <section className={cn('py-12 border-t', isDark ? 'border-slate-800' : 'border-gray-200')}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className={cn('text-2xl font-bold mb-6 flex items-center gap-3', isDark ? 'text-white' : 'text-gray-900')}>
                <Award className="w-6 h-6" />
                Registered Events
              </h2>
              <div className="grid gap-4">
                {student.registeredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'p-6 rounded-xl border',
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <h3 className={cn('text-lg font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                      {event.title}
                    </h3>
                    <p className={cn('text-sm mb-4', isDark ? 'text-gray-400' : 'text-gray-600')}>
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className={cn('flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div className={cn('flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={cn('py-8 border-t mt-12', isDark ? 'border-slate-800' : 'border-gray-200')}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-600')}>
              Member since {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentPortfolioPage;
