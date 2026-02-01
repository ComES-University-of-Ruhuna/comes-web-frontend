// ============================================
// ComES Website - Admin Projects Management
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Github,
  ExternalLink,
  Users,
  Save,
  X,
  Folder,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge } from '@/components/ui';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'in-progress' | 'completed' | 'archived';
  team: string[];
  technologies: string[];
  github?: string;
  demo?: string;
  image: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Smart Campus App',
    description: 'A mobile app for campus navigation and services.',
    category: 'Mobile',
    status: 'in-progress',
    team: ['Alice', 'Bob', 'Charlie'],
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    github: 'https://github.com/comes/smart-campus',
    image: 'https://picsum.photos/seed/p1/400/300',
  },
  {
    id: '2',
    title: 'AI Study Assistant',
    description: 'AI-powered study assistant for students.',
    category: 'AI/ML',
    status: 'completed',
    team: ['David', 'Eve'],
    technologies: ['Python', 'TensorFlow', 'Flask'],
    github: 'https://github.com/comes/ai-study',
    demo: 'https://ai-study.comes.edu',
    image: 'https://picsum.photos/seed/p2/400/300',
  },
];

const categories = ['All', 'Web', 'Mobile', 'AI/ML', 'IoT', 'Blockchain', 'Game Dev'];
const projectStatuses = ['All', 'in-progress', 'completed', 'archived'];

const ProjectEditor = ({
  project,
  onClose,
  onSave,
}: {
  project?: Project | null;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'Web',
    status: project?.status || 'in-progress',
    technologies: project?.technologies.join(', ') || '',
    team: project?.team.join(', ') || '',
    github: project?.github || '',
    demo: project?.demo || '',
    image: project?.image || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      team: formData.team.split(',').map(t => t.trim()).filter(Boolean),
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
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
            <X className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title..."
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
              >
                {categories.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
              >
                {projectStatuses.filter(s => s !== 'All').map((status) => (
                  <option key={status} value={status} className="capitalize">{status.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project..."
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

          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB..."
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
              Team Members (comma separated)
            </label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              placeholder="Alice, Bob, Charlie..."
              className={cn(
                'w-full px-4 py-3 rounded-xl border transition-colors',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
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
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demo}
                onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                placeholder="https://demo.example.com"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
              />
            </div>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className={cn(
                'w-full px-4 py-3 rounded-xl border transition-colors',
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const ProjectsManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSave = (data: Partial<Project>) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...data } : p));
    } else {
      setProjects([...projects, { ...data, id: Date.now().toString() } as Project]);
    }
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Projects
          </h1>
          <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Manage student and club projects
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreating(true)}>
          Add Project
        </Button>
      </div>

      <div className={cn(
        'p-4 rounded-2xl border',
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5', isDark ? 'text-gray-500' : 'text-gray-400')} />
            <input
              type="text"
              placeholder="Search projects..."
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={cn(
              'px-4 py-2.5 rounded-xl border transition-colors',
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            )}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={cn(
              'px-4 py-2.5 rounded-xl border transition-colors',
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            )}
          >
            {projectStatuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === 'All' ? 'All Status' : status.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'rounded-2xl border overflow-hidden transition-all',
              isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:shadow-lg'
            )}
          >
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <Badge variant={getStatusColor(project.status) as 'warning' | 'success' | 'secondary'}>
                  {project.status.replace('-', ' ')}
                </Badge>
                <Badge variant="secondary">{project.category}</Badge>
              </div>

              <h3 className={cn('text-xl font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                {project.title}
              </h3>
              <p className={cn('text-sm mb-4 line-clamp-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      'px-2 py-1 text-xs rounded-lg',
                      isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className={cn('px-2 py-1 text-xs rounded-lg', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              <div className={cn('flex items-center gap-2 text-sm mb-4', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Users className="w-4 h-4" />
                <span>{project.team.length} team member{project.team.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    )}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    )}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                <div className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors text-red-500',
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

      {filteredProjects.length === 0 && (
        <div className={cn(
          'p-12 text-center rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <Folder className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
          <p className={cn('text-lg font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
            No projects found
          </p>
        </div>
      )}

      <AnimatePresence>
        {(isCreating || editingProject) && (
          <ProjectEditor
            project={editingProject}
            onClose={() => {
              setIsCreating(false);
              setEditingProject(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManagementPage;
