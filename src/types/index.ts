// ============================================
// ComES Website - TypeScript Types & Interfaces
// ============================================

// Navigation Types
export interface NavLink {
  label: string;
  path: string;
  icon?: string;
  children?: NavLink[];
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: TeamPosition;
  image: string;
  bio: string;
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  batch?: string;
}

export type TeamPosition =
  | 'president'
  | 'president-elect'
  | 'vice-president'
  | 'secretary'
  | 'assistant-secretary'
  | 'treasurer'
  | 'senior-treasurer'
  | 'ex-officio'
  | 'coordinator'
  | 'chairperson'
  | 'board-member'
  | 'member'
  | 'advisor';

// Event Types
export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  registered: number;
  icon: string;
  color: string;
  image?: string;
  isUpcoming: boolean;
  registrationOpen: boolean;
  tags?: string[];
}

export type EventType =
  | 'Workshop'
  | 'Seminar'
  | 'Competition'
  | 'Hackathon'
  | 'Social'
  | 'Conference'
  | 'Webinar'
  | 'Meetup';

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  image: string;
  technologies: string[];
  teamMembers: string[];
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export type ProjectCategory =
  | 'Web Development'
  | 'Mobile App'
  | 'AI/ML'
  | 'IoT'
  | 'Cybersecurity'
  | 'Data Science'
  | 'Game Development'
  | 'Other';

export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'Completed'
  | 'On Hold';

// Competition Team Types
export interface CompetitionTeam {
  _id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  members: CompetitionTeamMember[];
  status: TeamStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionTeamMember {
  id: string;
  name: string;
  email: string;
  registrationNo: string;
  status: TeamMemberStatus;
  joinedAt?: string;
}

export type TeamStatus = 'pending' | 'active' | 'disbanded';
export type TeamMemberStatus = 'pending' | 'approved' | 'rejected';

export interface TeamInvitation {
  _id: string;
  teamId: string;
  teamName: string;
  leaderName: string;
  invitedAt: string;
  status: TeamMemberStatus;
}

// Gallery Types
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: GalleryCategory;
  description?: string;
  eventId?: string;
  date: string;
  featured?: boolean;
}

export type GalleryCategory =
  | 'Events'
  | 'Workshops'
  | 'Team'
  | 'Campus'
  | 'Awards'
  | 'Other';

// Blog/News Types
export interface BlogAuthor {
  name: string;
  avatar: string;
  role?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  category: BlogCategory;
  tags: string[];
  image: string;
  readTime: number;
  featured: boolean;
}

export type BlogCategory =
  | 'News'
  | 'Announcements'
  | 'Tech'
  | 'Events'
  | 'Achievements'
  | 'Tutorials';

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: ContactSubject | '';
  message: string;
}

export type ContactSubject =
  | 'membership'
  | 'events'
  | 'partnership'
  | 'technical'
  | 'feedback'
  | 'other';

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  batch?: string;
  quote: string;
  image: string;
  rating?: number;
}

// Partner/Sponsor Types
export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  type: PartnerType;
}

export type PartnerType =
  | 'Platinum'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Partner';

// Statistics Types
export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Social Link Types
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: string;
}

export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'github'
  | 'youtube'
  | 'discord';

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  category: string;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
