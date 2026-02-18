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
    email: 'president@comesuor.lk',
    contactNo: '+9470 111 7791',
    linkedin: 'https://www.linkedin.com/in/kavishkakalhara',
  },
  {
    id: 'exec-2',
    name: 'Pasindu Isiwara',
    role: 'President Elect - Pasindu Isiwara',
    position: 'president-elect',
    image: getAvatarUrl('Pasindu Isiwara'),
    email: '',
    contactNo: '',
  },
  {
    id: 'exec-3',
    name: 'Sandaru Heshan',
    role: 'Vice President - Sandaru Heshan',
    position: 'vice-president',
    image: getAvatarUrl('Sandaru Heshan'),
    email: 'vp@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'exec-4',
    name: 'Sanuvi Gamage',
    role: 'Secretary - Sanuvi Gamage',
    position: 'secretary',
    image: getAvatarUrl('Sanuvi Gamage'),
    email: 'secretary@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'exec-5',
    name: 'Dilmi Prasadi',
    role: 'Assistant Secretary - Dilmi Prasadi',
    position: 'assistant-secretary',
    image: getAvatarUrl('Dilmi Prasadi'),
    //email: 'asstsecretary@comesuor.lk',
    contactNo: '',
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
    //email: 'chatura@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'advisor-2',
    name: 'Dr. Kushan Sudheera',
    role: 'Senior Treasurer - Dr. Kushan Sudheera',
    position: 'senior-treasurer',
    image: getAvatarUrl('Kushan Sudheera', '1E40AF'),
    //email: 'kushan@comesuor.lk',
    contactNo: '',
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
    email: 'marketing@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'coord-2',
    name: 'Sachinthana',
    role: 'Head of Public Relations - Sachinthana',
    position: 'coordinator',
    image: getAvatarUrl('Sachinthana'),
    //email: 'pr@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'coord-3',
    name: 'Malitha Jeewaka',
    role: 'Head of Web and Creative Design - Malitha Jeewaka',
    position: 'coordinator',
    image: getAvatarUrl('Malitha Jeewaka'),
    //email: 'web@comesuor.lk',
    contactNo: '',
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
    //email: 'se@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'chair-2',
    name: 'Hirushan',
    role: 'Subgroup Chairperson - Electronic and Embedded Systems - Hirushan',
    position: 'chairperson',
    image: getAvatarUrl('Hirushan'),
    //email: 'embedded@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'chair-3',
    name: 'Viranga Weerabandara',
    role: 'Subgroup Chairperson - AI and Data Science - Viranga Weerabandara',
    position: 'chairperson',
    image: getAvatarUrl('Viranga Weerabandara'),
    //email: 'ai@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'chair-4',
    name: 'Tharindu Nadun',
    role: 'Subgroup Chairperson - Network and Security - Tharindu Nadun',
    position: 'chairperson',
    image: getAvatarUrl('Tharindu Nadun'),
    //email: 'security@comesuor.lk',
    contactNo: '',
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
    //email: 'board1@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'board-2',
    name: 'Praveen Dilshan',
    role: 'Board Member 2 - Praveen Dilshan',
    position: 'board-member',
    image: getAvatarUrl('Praveen Dilshan'),
    //email: 'board2@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'board-3',
    name: 'Iman Sharinda',
    role: 'Board Member 3 - Iman Sharinda',
    position: 'board-member',
    image: getAvatarUrl('Iman Sharinda'),
    //email: 'board3@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'board-4',
    name: 'Ms. Sithara Madhubhashini',
    role: 'Board Member 4 - Ms. Sithara Madhubhashini',
    position: 'board-member',
    image: getAvatarUrl('Sithara Madhubhashini'),
    //email: 'board4@comesuor.lk',
    contactNo: '',
  },
  {
    id: 'board-5',
    name: 'Tishan Shamika',
    role: 'Board Member 5 - Tishan Shamika',
    position: 'board-member',
    image: getAvatarUrl('Tishan Shamika'),
    //email: 'board5@comesuor.lk',
    contactNo: '',
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
