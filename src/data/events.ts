// ============================================
// ComES Website - Events Data
// ============================================

import type { Event } from "@/types";

export const events: Event[] = [
  {
    id: "event-1",
    title: "Annual Hackathon 2026",
    type: "Hackathon",
    date: "March 15-16, 2026",
    time: "24 Hours",
    location: "Computer Lab Complex",
    description:
      "A 24-hour coding marathon where teams compete to solve real-world problems and showcase their creativity. Open to all undergraduates. Build innovative solutions, win exciting prizes, and network with industry professionals.",
    capacity: 100,
    registered: 85,
    icon: "🏆",
    color: "from-purple-400 to-pink-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Coding", "Competition", "Innovation"],
  },
  {
    id: "event-2",
    title: "AI & Machine Learning Workshop",
    type: "Workshop",
    date: "February 20, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Auditorium A",
    description:
      "Hands-on workshop covering the fundamentals of AI and ML, including practical implementations using Python and popular frameworks like TensorFlow and PyTorch. Perfect for beginners and intermediate learners.",
    capacity: 80,
    registered: 65,
    icon: "🤖",
    color: "from-blue-400 to-purple-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["AI", "Machine Learning", "Python"],
  },
  {
    id: "event-3",
    title: "Industry Career Panel",
    type: "Seminar",
    date: "March 5, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Conference Room",
    description:
      "Panel discussion with industry professionals sharing insights on career paths, internships, and job opportunities in tech. Learn from software engineers, product managers, and tech entrepreneurs.",
    capacity: 60,
    registered: 45,
    icon: "💼",
    color: "from-green-400 to-teal-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Career", "Networking", "Industry"],
  },
  {
    id: "event-4",
    title: "Tech Networking Mixer",
    type: "Social",
    date: "February 28, 2026",
    time: "6:00 PM - 8:00 PM",
    location: "Student Center",
    description:
      "Casual networking event to connect students with alumni, faculty, and industry professionals in a relaxed setting. Enjoy food, games, and meaningful conversations.",
    capacity: 50,
    registered: 38,
    icon: "🤝",
    color: "from-pink-400 to-red-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Networking", "Social", "Alumni"],
  },
  {
    id: "event-5",
    title: "Cloud Computing Fundamentals",
    type: "Workshop",
    date: "March 10, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Lab 3",
    description:
      "Introduction to cloud computing with AWS and Azure. Learn about cloud architecture, deployment, and best practices. Hands-on labs included.",
    capacity: 40,
    registered: 28,
    icon: "☁️",
    color: "from-cyan-400 to-blue-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Cloud", "AWS", "Azure"],
  },
  {
    id: "event-6",
    title: "Cybersecurity Awareness Session",
    type: "Seminar",
    date: "March 20, 2026",
    time: "2:00 PM - 4:00 PM",
    location: "Main Auditorium",
    description:
      "Learn about common cyber threats, security best practices, and how to protect yourself online. Essential knowledge for every tech professional.",
    capacity: 100,
    registered: 55,
    icon: "🔒",
    color: "from-red-400 to-orange-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Security", "Cybersecurity", "Privacy"],
  },
  {
    id: "event-7",
    title: "Web Development Bootcamp",
    type: "Workshop",
    date: "April 1-2, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Computer Lab 1",
    description:
      "Intensive 2-day bootcamp covering modern web development with React, Node.js, and databases. Build a complete project from scratch.",
    capacity: 50,
    registered: 42,
    icon: "🌐",
    color: "from-indigo-400 to-purple-500",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Web Dev", "React", "Node.js"],
  },
  {
    id: "event-8",
    title: "Git & GitHub Masterclass",
    type: "Workshop",
    date: "February 25, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Lab 2",
    description:
      "Master version control with Git and GitHub. Learn branching strategies, collaboration workflows, and open source contribution.",
    capacity: 60,
    registered: 52,
    icon: "📦",
    color: "from-gray-600 to-gray-800",
    isUpcoming: true,
    registrationOpen: true,
    tags: ["Git", "GitHub", "Version Control"],
  },
];

// Past Events
export const pastEvents: Event[] = [
  {
    id: "past-1",
    title: "Annual Hackathon 2025",
    type: "Hackathon",
    date: "March 10-11, 2025",
    time: "24 Hours",
    location: "Computer Lab Complex",
    description:
      "Our biggest hackathon yet with over 80 participants building innovative solutions.",
    capacity: 80,
    registered: 80,
    icon: "🏆",
    color: "from-purple-400 to-pink-500",
    isUpcoming: false,
    registrationOpen: false,
    tags: ["Coding", "Competition", "Innovation"],
  },
  {
    id: "past-2",
    title: "Python Programming Workshop",
    type: "Workshop",
    date: "January 15, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Lab 1",
    description:
      "Introduction to Python programming for beginners. Covered basics, data structures, and simple projects.",
    capacity: 50,
    registered: 48,
    icon: "🐍",
    color: "from-yellow-400 to-green-500",
    isUpcoming: false,
    registrationOpen: false,
    tags: ["Python", "Programming", "Beginners"],
  },
];

// Get upcoming events
export const getUpcomingEvents = (): Event[] => {
  return events.filter((event) => event.isUpcoming);
};

// Get past events
export const getPastEvents = (): Event[] => {
  return pastEvents;
};

// Get events by type
export const getEventsByType = (type: string): Event[] => {
  if (type === "All") return events;
  return events.filter((event) => event.type === type);
};

// Get featured events (first 4)
export const getFeaturedEvents = (count = 4): Event[] => {
  return events.slice(0, count);
};

// Event type options for filtering
export const eventTypeOptions = [
  "All",
  "Workshop",
  "Seminar",
  "Hackathon",
  "Competition",
  "Social",
  "Conference",
  "Webinar",
  "Meetup",
];
