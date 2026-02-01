// ============================================
// ComES Website - Team Data
// ============================================

import type { TeamMember } from '@/types';

// Helper function to generate avatar URL
const getAvatarUrl = (name: string, bg = '003366', color = 'fff') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&size=256&bold=true`;

// Executive Committee Members
export const executiveCommittee: TeamMember[] = [
  {
    id: 'exec-1',
    name: 'Nimal Perera',
    role: 'President',
    position: 'president',
    image: getAvatarUrl('Nimal Perera'),
    bio: 'Leading ComES with vision and passion for technology education. Focused on creating opportunities for students to excel in their careers.',
    email: 'president@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/nimalperera',
    github: 'https://github.com/nimalperera',
    batch: '2021',
  },
  {
    id: 'exec-2',
    name: 'Samanthi Silva',
    role: 'Vice President',
    position: 'vice-president',
    image: getAvatarUrl('Samanthi Silva'),
    bio: 'Driving innovation and supporting student initiatives across all domains. Passionate about community building and mentorship.',
    email: 'vp@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/samanthisilva',
    github: 'https://github.com/samanthisilva',
    batch: '2021',
  },
  {
    id: 'exec-3',
    name: 'Kasun Fernando',
    role: 'Secretary',
    position: 'secretary',
    image: getAvatarUrl('Kasun Fernando'),
    bio: 'Managing communications and ensuring smooth operations of all activities. Expert in organizational management and documentation.',
    email: 'secretary@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/kasunfernando',
    github: 'https://github.com/kasunfernando',
    batch: '2021',
  },
  {
    id: 'exec-4',
    name: 'Ishara Jayasuriya',
    role: 'Treasurer',
    position: 'treasurer',
    image: getAvatarUrl('Ishara Jayasuriya'),
    bio: 'Overseeing financial planning and resource management for sustainable growth. Ensuring transparency in all financial matters.',
    email: 'treasurer@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/isharajayasuriya',
    batch: '2021',
  },
];

// Senior Advisors
export const seniorAdvisors: TeamMember[] = [
  {
    id: 'advisor-1',
    name: 'Dr. A. B. Pathirana',
    role: 'Senior Treasurer',
    position: 'senior-treasurer',
    image: getAvatarUrl('A B Pathirana', '1E40AF'),
    bio: 'Providing academic guidance and mentorship to the executive committee. Faculty advisor with expertise in computer engineering.',
    email: 'pathirana@eng.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/abpathirana',
  },
  {
    id: 'advisor-2',
    name: 'Prof. K. M. Wickramasinghe',
    role: 'Faculty Advisor',
    position: 'advisor',
    image: getAvatarUrl('K M Wickramasinghe', '1E40AF'),
    bio: 'Department Head providing strategic guidance and academic support for ComES initiatives.',
    email: 'kmwickramasinghe@eng.ruh.ac.lk',
  },
];

// Coordinators
export const coordinators: TeamMember[] = [
  {
    id: 'coord-1',
    name: 'Dilini Rajapaksha',
    role: 'Event Coordinator',
    position: 'coordinator',
    image: getAvatarUrl('Dilini Rajapaksha'),
    bio: 'Organizing memorable events and workshops that inspire and educate the student community.',
    email: 'events@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/dilinirajapaksha',
    batch: '2022',
  },
  {
    id: 'coord-2',
    name: 'Tharindu Gamage',
    role: 'Technical Lead',
    position: 'coordinator',
    image: getAvatarUrl('Tharindu Gamage'),
    bio: 'Leading technical projects and workshops. Specializing in web development and cloud technologies.',
    email: 'tech@comes.ruh.ac.lk',
    github: 'https://github.com/tharindugamage',
    batch: '2022',
  },
  {
    id: 'coord-3',
    name: 'Nadeesha Kumari',
    role: 'Media & PR Coordinator',
    position: 'coordinator',
    image: getAvatarUrl('Nadeesha Kumari'),
    bio: 'Managing social media presence and public relations. Creating engaging content for the community.',
    email: 'media@comes.ruh.ac.lk',
    instagram: 'https://instagram.com/nadeeshakumari',
    batch: '2022',
  },
  {
    id: 'coord-4',
    name: 'Ruwan Bandara',
    role: 'Workshop Coordinator',
    position: 'coordinator',
    image: getAvatarUrl('Ruwan Bandara'),
    bio: 'Planning and executing technical workshops on emerging technologies and industry practices.',
    email: 'workshops@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/ruwanbandara',
    batch: '2022',
  },
  {
    id: 'coord-5',
    name: 'Hiruni Dissanayake',
    role: 'Community Manager',
    position: 'coordinator',
    image: getAvatarUrl('Hiruni Dissanayake'),
    bio: 'Building and nurturing the ComES community. Facilitating networking and collaboration among members.',
    email: 'community@comes.ruh.ac.lk',
    linkedin: 'https://linkedin.com/in/hirunidissanayake',
    batch: '2022',
  },
  {
    id: 'coord-6',
    name: 'Chamara Wickrama',
    role: 'Competition Coordinator',
    position: 'coordinator',
    image: getAvatarUrl('Chamara Wickrama'),
    bio: 'Organizing coding competitions, hackathons, and representing ComES in inter-university events.',
    email: 'competitions@comes.ruh.ac.lk',
    github: 'https://github.com/chamarawickrama',
    batch: '2022',
  },
];

// All Team Members Combined
export const allTeamMembers: TeamMember[] = [
  ...executiveCommittee,
  ...seniorAdvisors,
  ...coordinators,
];

// Team Categories for filtering
export const teamCategories = [
  { id: 'all', label: 'All Members' },
  { id: 'executive', label: 'Executive Committee' },
  { id: 'advisors', label: 'Senior Advisors' },
  { id: 'coordinators', label: 'Coordinators' },
];

// Get team members by category
export const getTeamByCategory = (category: string): TeamMember[] => {
  switch (category) {
    case 'executive':
      return executiveCommittee;
    case 'advisors':
      return seniorAdvisors;
    case 'coordinators':
      return coordinators;
    default:
      return allTeamMembers;
  }
};
