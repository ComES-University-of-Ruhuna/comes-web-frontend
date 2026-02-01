// ============================================
// ComES Website - Testimonials Data
// ============================================

import type { Testimonial, FAQ, Partner, Achievement } from '@/types';

// Testimonials from alumni and members
export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Amara Jayawardena',
    role: 'Software Engineer',
    company: 'Google',
    batch: '2018',
    quote:
      'ComES was instrumental in shaping my career. The workshops, hackathons, and networking opportunities gave me the skills and confidence to pursue my dream job.',
    image:
      'https://ui-avatars.com/api/?name=Amara+Jayawardena&background=003366&color=fff&size=128',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Ranjan Perera',
    role: 'Full Stack Developer',
    company: 'IFS',
    batch: '2019',
    quote:
      "The practical experience I gained through ComES projects prepared me for the industry like nothing else. It's where I learned to work in teams and deliver real solutions.",
    image:
      'https://ui-avatars.com/api/?name=Ranjan+Perera&background=003366&color=fff&size=128',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Kavindi Fernando',
    role: 'Data Scientist',
    company: 'WSO2',
    batch: '2020',
    quote:
      'The AI/ML workshops organized by ComES sparked my interest in data science. The mentorship and guidance I received were invaluable.',
    image:
      'https://ui-avatars.com/api/?name=Kavindi+Fernando&background=003366&color=fff&size=128',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Nuwan Silva',
    role: 'DevOps Engineer',
    company: 'Virtusa',
    batch: '2019',
    quote:
      'ComES introduced me to cloud technologies and DevOps practices early on. The hands-on workshops were exactly what I needed to kickstart my career.',
    image:
      'https://ui-avatars.com/api/?name=Nuwan+Silva&background=003366&color=fff&size=128',
    rating: 5,
  },
  {
    id: 'test-5',
    name: 'Thilini Bandara',
    role: 'UX Designer',
    company: '99x',
    batch: '2020',
    quote:
      'Being part of ComES helped me discover my passion for design. The diverse projects and supportive community encouraged me to explore beyond just coding.',
    image:
      'https://ui-avatars.com/api/?name=Thilini+Bandara&background=003366&color=fff&size=128',
    rating: 5,
  },
];

// FAQ Data
export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How can I become a member of ComES?',
    answer:
      'All Computer Engineering students at the Faculty of Engineering, University of Ruhuna are automatically members of ComES. For active participation, you can join our committees or volunteer for events.',
    category: 'Membership',
  },
  {
    id: 'faq-2',
    question: 'Are the events open to students from other departments?',
    answer:
      'Yes! While ComES is primarily for Computer Engineering students, most of our events are open to all students from the Faculty of Engineering and other faculties who are interested in technology.',
    category: 'Events',
  },
  {
    id: 'faq-3',
    question: 'How can I participate in a hackathon?',
    answer:
      "Register through our event registration system when hackathon registrations open. You can participate individually or as a team. Check our events page and social media for announcements about upcoming hackathons.",
    category: 'Events',
  },
  {
    id: 'faq-4',
    question: 'Can I propose a project idea to ComES?',
    answer:
      "Absolutely! We welcome innovative project ideas from all members. Contact our Technical Lead or submit your proposal through our website. We'll review it and help you find team members and resources.",
    category: 'Projects',
  },
  {
    id: 'faq-5',
    question: 'How can I join the ComES Executive Committee?',
    answer:
      'Executive Committee positions are filled through annual elections. Nominations open in January each year. Keep an eye on our announcements and prepare your campaign!',
    category: 'Membership',
  },
  {
    id: 'faq-6',
    question: 'Are there any membership fees?',
    answer:
      "There's no membership fee to be part of ComES. Some specialized workshops or events might have nominal fees to cover materials and refreshments, but most activities are free.",
    category: 'Membership',
  },
  {
    id: 'faq-7',
    question: 'How can companies partner with ComES?',
    answer:
      'We welcome partnerships with industry! Contact us at partnerships@comes.ruh.ac.lk to discuss sponsorship, workshop collaborations, recruitment drives, or other partnership opportunities.',
    category: 'Partnerships',
  },
  {
    id: 'faq-8',
    question: 'Do you offer certificates for workshops?',
    answer:
      'Yes, participants who complete our workshops receive certificates of participation. Hackathon winners and project contributors also receive recognition certificates.',
    category: 'Events',
  },
];

// Partners and Sponsors
export const partners: Partner[] = [
  {
    id: 'partner-1',
    name: 'TechCorp Sri Lanka',
    logo: '/images/partners/techcorp.png',
    website: 'https://techcorp.lk',
    type: 'Platinum',
  },
  {
    id: 'partner-2',
    name: 'WSO2',
    logo: '/images/partners/wso2.png',
    website: 'https://wso2.com',
    type: 'Gold',
  },
  {
    id: 'partner-3',
    name: 'IFS',
    logo: '/images/partners/ifs.png',
    website: 'https://ifs.com',
    type: 'Gold',
  },
  {
    id: 'partner-4',
    name: 'Virtusa',
    logo: '/images/partners/virtusa.png',
    website: 'https://virtusa.com',
    type: 'Silver',
  },
  {
    id: 'partner-5',
    name: '99x',
    logo: '/images/partners/99x.png',
    website: 'https://99x.io',
    type: 'Silver',
  },
  {
    id: 'partner-6',
    name: 'Microsoft',
    logo: '/images/partners/microsoft.png',
    website: 'https://microsoft.com',
    type: 'Partner',
  },
  {
    id: 'partner-7',
    name: 'Google',
    logo: '/images/partners/google.png',
    website: 'https://google.com',
    type: 'Partner',
  },
];

// Achievements
export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'National Coding Championship Winners',
    description: 'First place at the National Coding Championship 2025',
    date: '2025-12-15',
    icon: '🏆',
    category: 'Competition',
  },
  {
    id: 'ach-2',
    title: 'Best Student Organization Award',
    description: 'Recognized as the best student organization at University of Ruhuna',
    date: '2025-09-20',
    icon: '🌟',
    category: 'Recognition',
  },
  {
    id: 'ach-3',
    title: '500+ Active Members',
    description: 'Reached milestone of 500 active members',
    date: '2025-06-01',
    icon: '👥',
    category: 'Milestone',
  },
  {
    id: 'ach-4',
    title: 'IEEE Student Branch Partnership',
    description: 'Official partnership with IEEE Student Branch',
    date: '2024-11-10',
    icon: '🤝',
    category: 'Partnership',
  },
];

// Get FAQs by category
export const getFAQsByCategory = (category: string): FAQ[] => {
  if (category === 'All') return faqs;
  return faqs.filter((faq) => faq.category === category);
};

// FAQ categories
export const faqCategories = [
  'All',
  'Membership',
  'Events',
  'Projects',
  'Partnerships',
];

// Get partners by type
export const getPartnersByType = (type: string): Partner[] => {
  return partners.filter((partner) => partner.type === type);
};
