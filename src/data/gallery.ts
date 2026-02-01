// ============================================
// ComES Website - Gallery Data
// ============================================

import type { GalleryImage } from '@/types';

export const galleryImages: GalleryImage[] = [
  {
    id: 'img-1',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    alt: 'Annual Hackathon 2025',
    title: 'Annual Hackathon 2025',
    category: 'Events',
    eventId: 'past-1',
    date: '2025-03-11',
  },
  {
    id: 'img-2',
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
    alt: 'Team Meeting',
    title: 'Executive Committee Meeting',
    category: 'Team',
    date: '2025-01-20',
  },
  {
    id: 'img-3',
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    alt: 'Workshop Session',
    title: 'AI/ML Workshop',
    category: 'Workshops',
    date: '2025-02-15',
  },
  {
    id: 'img-4',
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop',
    alt: 'Award Ceremony',
    title: 'Best Project Award 2024',
    category: 'Awards',
    date: '2024-12-10',
  },
  {
    id: 'img-5',
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop',
    alt: 'University Campus',
    title: 'Engineering Faculty Building',
    category: 'Campus',
    date: '2025-01-05',
  },
  {
    id: 'img-6',
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
    alt: 'Group Discussion',
    title: 'Tech Talk Session',
    category: 'Events',
    date: '2025-01-25',
  },
  {
    id: 'img-7',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    alt: 'Team Collaboration',
    title: 'Project Planning Session',
    category: 'Team',
    date: '2025-02-01',
  },
  {
    id: 'img-8',
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    alt: 'Coding Session',
    title: 'Python Workshop',
    category: 'Workshops',
    date: '2025-01-15',
  },
  {
    id: 'img-9',
    src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&auto=format&fit=crop',
    alt: 'Networking Event',
    title: 'Industry Meet 2025',
    category: 'Events',
    date: '2025-02-10',
  },
  {
    id: 'img-10',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    alt: 'Campus View',
    title: 'Computer Lab',
    category: 'Campus',
    date: '2025-01-08',
  },
  {
    id: 'img-11',
    src: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop',
    alt: 'Presentation',
    title: 'Project Presentation Day',
    category: 'Events',
    date: '2024-11-20',
  },
  {
    id: 'img-12',
    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop',
    alt: 'Student Group',
    title: 'ComES Family Photo 2025',
    category: 'Team',
    date: '2025-01-30',
  },
];

// Gallery categories
export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'Events', label: 'Events' },
  { id: 'Workshops', label: 'Workshops' },
  { id: 'Team', label: 'Team' },
  { id: 'Campus', label: 'Campus' },
  { id: 'Awards', label: 'Awards' },
  { id: 'Other', label: 'Other' },
];

// Get images by category
export const getImagesByCategory = (category: string): GalleryImage[] => {
  if (category === 'all') return galleryImages;
  return galleryImages.filter((img) => img.category === category);
};

// Get recent images
export const getRecentImages = (count = 6): GalleryImage[] => {
  return [...galleryImages]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};
