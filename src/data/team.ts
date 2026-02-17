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
    name: 'Kavishka Kalhara',
    role: 'President - Kavishka Kalhara',
    position: 'president',
    image: getAvatarUrl('Kavishka Kalhara'),
    bio: 'Leading ComES with vision and passion for technology education. Focused on creating opportunities for students to excel in their careers.',
    email: 'president@comes.ruh.ac.lk',
  },
  {
    id: 'exec-2',
    name: 'Pasindu Isiwara',
    role: 'President Elect - Pasindu Isiwara',
    position: 'president-elect',
    image: getAvatarUrl('Pasindu Isiwara'),
    bio: 'Supporting the president and preparing to lead ComES into the future. Passionate about innovation and student development.',
    email: 'presidentelect@comes.ruh.ac.lk',
  },
  {
    id: 'exec-3',
    name: 'Sandaru Heshan',
    role: 'Vice President - Sandaru Heshan',
    position: 'vice-president',
    image: getAvatarUrl('Sandaru Heshan'),
    bio: 'Driving innovation and supporting student initiatives across all domains. Passionate about community building and mentorship.',
    email: 'vp@comes.ruh.ac.lk',
  },
  {
    id: 'exec-4',
    name: 'Sanuvi Gamage',
    role: 'Secretary - Sanuvi Gamage',
    position: 'secretary',
    image: getAvatarUrl('Sanuvi Gamage'),
    bio: 'Managing communications and ensuring smooth operations of all activities. Expert in organizational management and documentation.',
    email: 'secretary@comes.ruh.ac.lk',
  },
  {
    id: 'exec-5',
    name: 'Dilmi Prasadi',
    role: 'Assistant Secretary - Dilmi Prasadi',
    position: 'assistant-secretary',
    image: getAvatarUrl('Dilmi Prasadi'),
    bio: 'Assisting in communications and administrative tasks. Ensuring seamless coordination across all ComES activities.',
    email: 'asstsecretary@comes.ruh.ac.lk',
  },
];

// Senior Advisors
export const seniorAdvisors: TeamMember[] = [
  {
    id: 'advisor-1',
    name: 'Dr. Chatura Senevirathne',
    role: 'Ex-Officio Member - Dr. Chatura Senevirathne',
    position: 'ex-officio',
    image: getAvatarUrl('Chatura Senevirathne', '1E40AF'),
    bio: 'Providing strategic guidance and institutional support to the ComES executive committee.',
    email: 'chatura@eng.ruh.ac.lk',
  },
  {
    id: 'advisor-2',
    name: 'Dr. Kushan Sudheera',
    role: 'Senior Treasurer - Dr. Kushan Sudheera',
    position: 'senior-treasurer',
    image: getAvatarUrl('Kushan Sudheera', '1E40AF'),
    bio: 'Providing financial oversight and guidance to ensure sustainable growth and transparency in all financial matters.',
    email: 'kushan@eng.ruh.ac.lk',
  },
];

// Coordinators
export const coordinators: TeamMember[] = [
  {
    id: 'coord-1',
    name: 'janith Chamikara',
    role: 'Head of Marketing and Finance - janith Chamikara',
    position: 'coordinator',
    image: getAvatarUrl('janith Chamikara'),
    bio: 'Leading marketing initiatives and financial operations to drive ComES growth and sustainability.',
    email: 'marketing@comes.ruh.ac.lk',
  },
  {
    id: 'coord-2',
    name: 'Sachinthana',
    role: 'Head of Public Relations - Sachinthana',
    position: 'coordinator',
    image: getAvatarUrl('Sachinthana'),
    bio: 'Managing public relations and external communications to enhance ComES visibility and partnerships.',
    email: 'pr@comes.ruh.ac.lk',
  },
  {
    id: 'coord-3',
    name: 'Malitha Jeewaka',
    role: 'Head of Web and Creative Design - Malitha Jeewaka',
    position: 'coordinator',
    image: getAvatarUrl('Malitha Jeewaka'),
    bio: 'Leading web development and creative design initiatives to build an engaging digital presence for ComES.',
    email: 'web@comes.ruh.ac.lk',
  },
];

// Subgroup Chairpersons
export const subgroupChairpersons: TeamMember[] = [
  {
    id: 'chair-1',
    name: 'Chamara Vishwajith',
    role: 'Subgroup Chairperson - Software Engineering - Chamara Vishwajith',
    position: 'chairperson',
    image: getAvatarUrl('Chamara Vishwajith'),
    bio: 'Leading the Software Engineering subgroup to foster excellence in software development practices and innovation.',
    email: 'se@comes.ruh.ac.lk',
  },
  {
    id: 'chair-2',
    name: 'Hirushan',
    role: 'Subgroup Chairperson - Electronic and Embedded Systems - Hirushan',
    position: 'chairperson',
    image: getAvatarUrl('Hirushan'),
    bio: 'Leading the Electronic and Embedded Systems subgroup to advance knowledge in hardware and embedded technologies.',
    email: 'embedded@comes.ruh.ac.lk',
  },
  {
    id: 'chair-3',
    name: 'Viranga Weerabandara',
    role: 'Subgroup Chairperson - AI and Data Science - Viranga Weerabandara',
    position: 'chairperson',
    image: getAvatarUrl('Viranga Weerabandara'),
    bio: 'Leading the AI and Data Science subgroup to explore cutting-edge developments in artificial intelligence and data analytics.',
    email: 'ai@comes.ruh.ac.lk',
  },
  {
    id: 'chair-4',
    name: 'Tharindu Nadun',
    role: 'Subgroup Chairperson - Network and Security - Tharindu Nadun',
    position: 'chairperson',
    image: getAvatarUrl('Tharindu Nadun'),
    bio: 'Leading the Network and Security subgroup to promote cybersecurity awareness and networking expertise.',
    email: 'security@comes.ruh.ac.lk',
  },
];

// Board Members
export const boardMembers: TeamMember[] = [
  {
    id: 'board-1',
    name: 'Senura Koshala',
    role: 'Board Member 1 - Senura Koshala',
    position: 'board-member',
    image: getAvatarUrl('Senura Koshala'),
    bio: 'Contributing to ComES strategic decisions and supporting organizational initiatives.',
    email: 'board1@comes.ruh.ac.lk',
  },
  {
    id: 'board-2',
    name: 'Praveen Dilshan',
    role: 'Board Member 2 - Praveen Dilshan',
    position: 'board-member',
    image: getAvatarUrl('Praveen Dilshan'),
    bio: 'Contributing to ComES strategic decisions and supporting organizational initiatives.',
    email: 'board2@comes.ruh.ac.lk',
  },
  {
    id: 'board-3',
    name: 'Iman Sharinda',
    role: 'Board Member 3 - Iman Sharinda',
    position: 'board-member',
    image: getAvatarUrl('Iman Sharinda'),
    bio: 'Contributing to ComES strategic decisions and supporting organizational initiatives.',
    email: 'board3@comes.ruh.ac.lk',
  },
  {
    id: 'board-4',
    name: 'Ms. Sithara Madhubhashini',
    role: 'Board Member 4 - Ms. Sithara Madhubhashini',
    position: 'board-member',
    image: getAvatarUrl('Sithara Madhubhashini'),
    bio: 'Contributing to ComES strategic decisions and supporting organizational initiatives.',
    email: 'board4@comes.ruh.ac.lk',
  },
  {
    id: 'board-5',
    name: 'Tishan Shamika',
    role: 'Board Member 5 - Tishan Shamika',
    position: 'board-member',
    image: getAvatarUrl('Tishan Shamika'),
    bio: 'Contributing to ComES strategic decisions and supporting organizational initiatives.',
    email: 'board5@comes.ruh.ac.lk',
  },
];

// All Team Members Combined
export const allTeamMembers: TeamMember[] = [
  ...executiveCommittee,
  ...seniorAdvisors,
  ...coordinators,
  ...subgroupChairpersons,
  ...boardMembers,
];

// Team Categories for filtering
export const teamCategories = [
  { id: 'all', label: 'All Members' },
  { id: 'executive', label: 'Executive Committee' },
  { id: 'advisors', label: 'Senior Advisors' },
  { id: 'coordinators', label: 'Coordinators' },
  { id: 'chairpersons', label: 'Subgroup Chairpersons' },
  { id: 'board', label: 'Board Members' },
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
    case 'chairpersons':
      return subgroupChairpersons;
    case 'board':
      return boardMembers;
    default:
      return allTeamMembers;
  }
};
