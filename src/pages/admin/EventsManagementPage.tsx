// ============================================
// ComES Website - Admin Events Management Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Save,
  X,
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge } from '@/components/ui';

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI Workshop 2026',
    type: 'Workshop',
    date: '2026-02-15',
    time: '10:00 AM',
    location: 'Computer Lab 1',
    capacity: 50,
    registered: 42,
    status: 'upcoming',
    description: 'Learn the fundamentals of AI and ML.',
  },
  {
    id: '2',
    title: 'ComES Hackathon',
    type: 'Competition',
    date: '2026-03-20',
    time: '09:00 AM',
    location: 'Main Auditorium',
    capacity: 200,
    registered: 156,
    status: 'upcoming',
    description: '24-hour hackathon with amazing prizes.',
  },
  {
    id: '3',
    title: 'Tech Talk: Cloud Computing',
    type: 'Seminar',
    date: '2026-01-20',
    time: '02:00 PM',
    location: 'Seminar Hall',
    capacity: 100,
    registered: 100,
    status: 'completed',
    description: 'Introduction to cloud computing concepts.',
  },
];

const eventTypes = ['All', 'Workshop', 'Seminar', 'Competition', 'Hackathon', 'Webinar', 'Social'];
const eventStatuses = ['All', 'upcoming', 'ongoing', 'completed', 'cancelled'];

const EventEditor = ({
  event,
  onClose,
  onSave,
}: {
  event?: Event | null;
  onClose: () => void;
  onSave: (data: Partial<Event>) => void;
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const isEditing = !!event;

  const [formData, setFormData] = useState({
    title: event?.title || '',
    type: event?.type || 'Workshop',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    capacity: event?.capacity || 50,
    description: event?.description || '',
    status: event?.status || 'upcoming',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
            <X className={cn('w-5 h-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title..."
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
                Event Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
              >
                {eventTypes.filter(t => t !== 'All').map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
              >
                {eventStatuses.filter(s => s !== 'All').map((status) => (
                  <option key={status} value={status} className="capitalize">{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                required
              />
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Event venue"
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
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                min={1}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                required
              />
            </div>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description..."
              rows={4}
              className={cn(
                'w-full px-4 py-3 rounded-xl border transition-colors resize-none',
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
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const EventsManagementPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || event.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSave = (data: Partial<Event>) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...data } : e));
    } else {
      setEvents([...events, { ...data, id: Date.now().toString(), registered: 0 } as Event]);
    }
    setEditingEvent(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Events
          </h1>
          <p className={cn('mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Manage workshops, seminars, and competitions
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreating(true)}>
          New Event
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
              placeholder="Search events..."
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={cn(
              'px-4 py-2.5 rounded-xl border transition-colors',
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            )}
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={cn(
              'px-4 py-2.5 rounded-xl border transition-colors capitalize',
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            )}
          >
            {eventStatuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === 'All' ? 'All Status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-6 rounded-2xl border transition-all',
              isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:shadow-lg'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <Badge variant={getStatusColor(event.status) as 'primary' | 'success' | 'secondary' | 'danger'}>
                {event.status}
              </Badge>
              <Badge variant="secondary">{event.type}</Badge>
            </div>
            
            <h3 className={cn('text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-gray-900')}>
              {event.title}
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{event.time}</span>
              </div>
              <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                <Users className="w-4 h-4" />
                <span>{event.registered}/{event.capacity} registered</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingEvent(event)} className="flex-1">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <button
                onClick={() => handleDelete(event.id)}
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

      {filteredEvents.length === 0 && (
        <div className={cn(
          'p-12 text-center rounded-2xl border',
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
        )}>
          <Calendar className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
          <p className={cn('text-lg font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
            No events found
          </p>
        </div>
      )}

      <AnimatePresence>
        {(isCreating || editingEvent) && (
          <EventEditor
            event={editingEvent}
            onClose={() => {
              setIsCreating(false);
              setEditingEvent(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsManagementPage;
