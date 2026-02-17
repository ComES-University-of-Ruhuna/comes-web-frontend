// ============================================
// ComES Website - Student Events Page
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useStudentStore } from '@/store/studentStore';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge, Input } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import { eventsService, type ApiEvent } from '@/services/events.service';

// Event Card Component
const EventCard = ({ 
  event, 
  isRegistered, 
  onRegister, 
  onUnregister,
  isLoading,
  isDark 
}: { 
  event: ApiEvent;
  isRegistered: boolean;
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  isLoading: boolean;
  isDark: boolean;
}) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isFull = event.registeredUsers.length >= event.capacity;
  const registrationDeadlinePassed = event.registrationDeadline 
    ? new Date(event.registrationDeadline) < new Date() 
    : false;

  const canRegister = isUpcoming && !isFull && !registrationDeadlinePassed && event.status === 'published';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-2xl border transition-all',
        isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:shadow-lg'
      )}
    >
      {/* Image */}
      {event.image && (
        <div className="relative h-40 mb-4 rounded-xl overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="primary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <Badge 
            variant={event.status === 'published' ? 'success' : 'secondary'}
            className="mb-2"
          >
            {event.type}
          </Badge>
          <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            {event.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className={cn('text-sm mb-4 line-clamp-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
        {event.description}
      </p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          <Calendar className="w-4 h-4" />
          <span>{eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
        </div>
        <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>
        <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          <Users className="w-4 h-4" />
          <span>{event.registeredUsers.length} / {event.capacity} registered</span>
          {isFull && <Badge variant="error" className="ml-2">Full</Badge>}
        </div>
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className={cn(
                'px-2 py-1 text-xs rounded-lg',
                isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-600'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="pt-4 border-t" style={{ borderColor: isDark ? '#334155' : '#e5e7eb' }}>
        {isRegistered ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Registered</span>
            </div>
            {canRegister && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUnregister(event._id)}
                disabled={isLoading}
                className="text-red-500 hover:bg-red-500/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel'}
              </Button>
            )}
          </div>
        ) : canRegister ? (
          <Button
            onClick={() => onRegister(event._id)}
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Register Now
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <XCircle className="w-5 h-5" />
            <span className="text-sm">
              {!isUpcoming ? 'Event ended' : isFull ? 'Event is full' : registrationDeadlinePassed ? 'Registration closed' : 'Registration unavailable'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const EventsPage = () => {
  const { student } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'registered' | 'upcoming'>('all');
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventsService.getAll({ status: 'published', limit: 50 });
        if (response.success && response.data) {
          setEvents(response.data.items);
        }
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Check if student is registered for an event
  const isRegistered = (event: ApiEvent) => {
    return student ? event.registeredUsers.includes(student._id) : false;
  };

  // Register for event
  const handleRegister = async (eventId: string) => {
    setActionLoading(eventId);
    setError(null);
    setSuccess(null);

    try {
      const response = await eventsService.register(eventId);
      if (response.success && response.data) {
        setEvents(prev => prev.map(e => 
          e._id === eventId ? response.data!.event : e
        ));
        setSuccess('Successfully registered for the event!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to register');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setActionLoading(null);
    }
  };

  // Unregister from event
  const handleUnregister = async (eventId: string) => {
    setActionLoading(eventId);
    setError(null);
    setSuccess(null);

    try {
      const response = await eventsService.unregister(eventId);
      if (response.success && response.data) {
        setEvents(prev => prev.map(e => 
          e._id === eventId ? response.data!.event : e
        ));
        setSuccess('Registration cancelled');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to cancel registration');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel registration');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    switch (filter) {
      case 'registered':
        return isRegistered(event);
      case 'upcoming':
        return new Date(event.date) > new Date();
      default:
        return true;
    }
  });

  // Stats
  const registeredCount = events.filter(e => isRegistered(e)).length;
  const upcomingCount = events.filter(e => new Date(e.date) > new Date()).length;

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                Events
              </h1>
              <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Browse and register for upcoming events
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className={cn(
                'p-4 rounded-xl border text-center',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
              )}>
                <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                  {events.length}
                </p>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Total Events</p>
              </div>
              <div className={cn(
                'p-4 rounded-xl border text-center',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
              )}>
                <p className={cn('text-2xl font-bold text-blue-500')}>
                  {upcomingCount}
                </p>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Upcoming</p>
              </div>
              <div className={cn(
                'p-4 rounded-xl border text-center',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
              )}>
                <p className={cn('text-2xl font-bold text-green-500')}>
                  {registeredCount}
                </p>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Registered</p>
              </div>
            </motion.div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-500">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                  isDark ? 'text-gray-500' : 'text-gray-400'
                )} />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'upcoming' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming
                </Button>
                <Button
                  variant={filter === 'registered' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter('registered')}
                  className="gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  My Events
                </Button>
              </div>
            </motion.div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className={cn('w-8 h-8 animate-spin', isDark ? 'text-blue-400' : 'text-blue-600')} />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className={cn(
                'text-center py-20 rounded-2xl border',
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
              )}>
                <Calendar className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
                <h3 className={cn('text-lg font-medium mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                  No events found
                </h3>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  {searchQuery ? 'Try a different search term' : filter === 'registered' ? 'You haven\'t registered for any events yet' : 'Check back later for new events'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    isRegistered={isRegistered(event)}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    isLoading={actionLoading === event._id}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
