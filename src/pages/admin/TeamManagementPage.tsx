// ============================================
// ComES Website - Admin Team Management
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Mail,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge } from '@/components/ui';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'President',
    department: 'Leadership',
    email: 'john@comes.edu',
    bio: 'Leading ComES to new heights.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    social: { linkedin: '#', github: '#', twitter: '#' },
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Vice President',
    department: 'Leadership',
    email: 'jane@comes.edu',
    bio: 'Passionate about technology and education.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    social: { linkedin: '#', github: '#' },
  },
  {
    id: '3',
    name: 'Alex Johnson',
    role: 'Tech Lead',
    department: 'Technical',
    email: 'alex@comes.edu',
    bio: 'Full-stack developer and AI enthusiast.',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    social: { github: '#' },
  },
];

const departments = ['All', 'Leadership', 'Technical', 'Events', 'Marketing', 'Finance', 'Design'];

const TeamEditor = ({
  member,
  onClose,
  onSave,
}: {
  member?: TeamMember | null;
  onClose: () => void;
  onSave: (data: Partial<TeamMember>) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const isEditing = !!member;

  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    department: member?.department || 'Technical',
    email: member?.email || '',
    bio: member?.bio || '',
    image: member?.image || '',
    linkedin: member?.social.linkedin || '',
    github: member?.social.github || '',
    twitter: member?.social.twitter || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      email: formData.email,
      bio: formData.bio,
      image: formData.image,
      social: {
        linkedin: formData.linkedin || undefined,
        github: formData.github || undefined,
        twitter: formData.twitter || undefined,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl',
          isDark ? 'bg-slate-900' : 'bg-white'
        )}
      >
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between p-6 border-b',
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            {isEditing ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button onClick={onClose} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
            <X className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                required
              />
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="President, Tech Lead, etc."
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
              >
                {departments.filter(d => d !== 'All').map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                required
              />
            </div>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Profile Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
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
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short bio about the team member..."
              rows={3}
              className={cn(
                'w-full px-4 py-3 rounded-xl border transition-colors resize-none',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              )}
            />
          </div>

          <div className="space-y-3">
            <label className={cn('block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Social Links
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <Linkedin className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4', isDark ? 'text-gray-500' : 'text-gray-400')} />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors text-sm',
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
              </div>
              <div className="relative">
                <Github className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4', isDark ? 'text-gray-500' : 'text-gray-400')} />
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="GitHub URL"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors text-sm',
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
              </div>
              <div className="relative">
                <Twitter className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4', isDark ? 'text-gray-500' : 'text-gray-400')} />
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="Twitter URL"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors text-sm',
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const TeamManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTeam = team.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSave = (data: Partial<TeamMember>) => {
    if (editingMember) {
      setTeam(team.map(m => m.id === editingMember.id ? { ...m, ...data } : m));
    } else {
      setTeam([...team, { ...data, id: Date.now().toString() } as TeamMember]);
    }
    setEditingMember(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Team Members
          </h1>
          <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Manage your club's team and leadership
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreating(true)}>
          Add Member
        </Button>
      </div>

      <div className={cn(
        'p-4 rounded-2xl border',
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5', isDark ? 'text-gray-500' : 'text-gray-400')} />
            <input
              type="text"
              placeholder="Search team members..."
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
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={cn(
              'px-4 py-2.5 rounded-xl border transition-colors',
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            )}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-6 rounded-2xl border text-center transition-all',
              isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:shadow-lg'
            )}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-500/20"
            />
            
            <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              {member.name}
            </h3>
            <p className={cn('text-sm', isDark ? 'text-blue-400' : 'text-blue-600')}>
              {member.role}
            </p>
            <Badge variant="secondary" className="mt-2">{member.department}</Badge>

            <p className={cn('text-sm mt-3 line-clamp-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
              {member.bio}
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {member.social.linkedin && (
                <a href={member.social.linkedin} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                  <Linkedin className={cn('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-600')} />
                </a>
              )}
              {member.social.github && (
                <a href={member.social.github} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                  <Github className={cn('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-600')} />
                </a>
              )}
              {member.social.twitter && (
                <a href={member.social.twitter} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                  <Twitter className={cn('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-600')} />
                </a>
              )}
              <a href={`mailto:${member.email}`} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                <Mail className={cn('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-600')} />
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed" style={{ borderColor: isDark ? '#334155' : '#e5e7eb' }}>
              <Button variant="outline" size="sm" onClick={() => setEditingMember(member)} className="flex-1">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <button
                onClick={() => handleDelete(member.id)}
                className={cn(
                  'p-2 rounded-lg transition-colors text-red-500',
                  isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <div className={cn(
          'p-12 text-center rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <Users className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
          <p className={cn('text-lg font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
            No team members found
          </p>
        </div>
      )}

      <AnimatePresence>
        {(isCreating || editingMember) && (
          <TeamEditor
            member={editingMember}
            onClose={() => {
              setIsCreating(false);
              setEditingMember(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagementPage;
