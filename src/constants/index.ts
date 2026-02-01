// ============================================
// ComES Website - Constants & Configuration
// ============================================

import type { NavLink } from '@/types';

// Site Information
export const SITE_CONFIG = {
  name: 'ComES',
  fullName: 'Computer Engineering Society',
  tagline: 'Empowering Future Engineers',
  description:
    'The official student society for Computer Engineering at the Faculty of Engineering, University of Ruhuna.',
  url: 'https://comes.eng.ruh.ac.lk',
  email: 'comes@eng.ruh.ac.lk',
  phone: '+94 41 205 001',
  address: {
    line1: 'Faculty of Engineering',
    line2: 'University of Ruhuna',
    city: 'Wellamadama, Matara',
    country: 'Sri Lanka',
    postalCode: '81000',
  },
  contact: {
    email: 'comes@eng.ruh.ac.lk',
    phone: '+94 41 205 001',
    address: 'Faculty of Engineering, University of Ruhuna, Wellamadama, Matara, Sri Lanka',
  },
  foundedYear: 2015,
} as const;

// Navigation Links
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Events', path: '/events' },
  { label: 'Projects', path: '/projects' },
  { label: 'Team', path: '/team' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

// Footer Quick Links
export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Our Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ],
  resources: [
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Join Us', path: '/join' },
  ],
  external: [
    { label: 'University of Ruhuna', url: 'https://www.ruh.ac.lk' },
    { label: 'Faculty of Engineering', url: 'https://eng.ruh.ac.lk' },
    { label: 'IEEE Student Branch', url: '#' },
    { label: 'IESL', url: '#' },
  ],
};

// Social Links
export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    platform: 'facebook',
    url: 'https://facebook.com/ComESRuhuna',
    icon: 'facebook',
    label: 'Facebook',
  },
  {
    id: 'twitter',
    platform: 'twitter',
    url: 'https://twitter.com/ComESRuhuna',
    icon: 'twitter',
    label: 'Twitter',
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    url: 'https://linkedin.com/company/comes-ruhuna',
    icon: 'linkedin',
    label: 'LinkedIn',
  },
  {
    id: 'instagram',
    platform: 'instagram',
    url: 'https://instagram.com/comes_ruhuna',
    icon: 'instagram',
    label: 'Instagram',
  },
  {
    id: 'github',
    platform: 'github',
    url: 'https://github.com/ComES-Ruhuna',
    icon: 'github',
    label: 'GitHub',
  },
  {
    id: 'youtube',
    platform: 'youtube',
    url: 'https://youtube.com/@ComESRuhuna',
    icon: 'youtube',
    label: 'YouTube',
  },
];

// Theme Colors
export const COLORS = {
  primary: '#003366', // ComES Blue
  secondary: '#FFD700', // ComES Gold
  accent: '#1E40AF', // Accent Blue
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

// Statistics
export const STATISTICS = [
  { id: '1', label: 'Members', value: 500, suffix: '+', icon: 'users' },
  { id: '2', label: 'Events', value: 50, suffix: '+', icon: 'calendar' },
  { id: '3', label: 'Projects', value: 25, suffix: '+', icon: 'code' },
  { id: '4', label: 'Years', value: 10, suffix: '+', icon: 'award' },
];

// Contact Subjects
export const CONTACT_SUBJECTS = [
  { value: 'membership', label: 'Membership Inquiry' },
  { value: 'events', label: 'Event Information' },
  { value: 'partnership', label: 'Partnership/Collaboration' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
] as const;

// Event Types Configuration
export const EVENT_TYPES = {
  Workshop: {
    color: 'from-blue-400 to-purple-500',
    icon: '🔧',
    bgColor: 'bg-blue-500',
  },
  Seminar: {
    color: 'from-green-400 to-teal-500',
    icon: '📚',
    bgColor: 'bg-green-500',
  },
  Competition: {
    color: 'from-yellow-400 to-orange-500',
    icon: '🏆',
    bgColor: 'bg-yellow-500',
  },
  Hackathon: {
    color: 'from-purple-400 to-pink-500',
    icon: '💻',
    bgColor: 'bg-purple-500',
  },
  Social: {
    color: 'from-pink-400 to-red-500',
    icon: '🤝',
    bgColor: 'bg-pink-500',
  },
  Conference: {
    color: 'from-indigo-400 to-blue-500',
    icon: '🎤',
    bgColor: 'bg-indigo-500',
  },
  Webinar: {
    color: 'from-cyan-400 to-blue-500',
    icon: '🌐',
    bgColor: 'bg-cyan-500',
  },
  Meetup: {
    color: 'from-orange-400 to-red-500',
    icon: '☕',
    bgColor: 'bg-orange-500',
  },
} as const;

// Project Categories Configuration
export const PROJECT_CATEGORIES = [
  'All',
  'Web Development',
  'Mobile App',
  'AI/ML',
  'IoT',
  'Cybersecurity',
  'Data Science',
  'Game Development',
  'Other',
] as const;

// Animation Variants (for Framer Motion if added later)
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  base: import.meta.env.VITE_API_URL || '/api',
  events: '/events',
  team: '/team',
  projects: '/projects',
  gallery: '/gallery',
  blog: '/blog',
  contact: '/contact',
  newsletter: '/newsletter',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'comes-theme',
  newsletter: 'comes-newsletter-subscribed',
  cookieConsent: 'comes-cookie-consent',
} as const;

// Meta Information for SEO
export const META_INFO = {
  title: 'ComES | Computer Engineering Society - University of Ruhuna',
  description:
    'The official student society for Computer Engineering at the Faculty of Engineering, University of Ruhuna. Empowering students through innovation, collaboration, and excellence.',
  keywords: [
    'ComES',
    'Computer Engineering',
    'University of Ruhuna',
    'Engineering Society',
    'Technology',
    'Sri Lanka',
    'Student Society',
    'Tech Events',
    'Hackathon',
    'Workshops',
  ],
  ogImage: '/og-image.png',
} as const;
