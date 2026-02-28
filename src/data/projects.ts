// ============================================
// ComES Website - Projects Data
// ============================================

import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "project-1",
    title: "ComES Official Website",
    description:
      "The official website for the Computer Engineering Society, built with modern web technologies. Features include event management, team showcase, project portfolio, and a blog system.",
    shortDescription: "Modern, responsive website for ComES built with React and Tailwind CSS.",
    category: "Web Development",
    status: "In Progress",
    image: "/images/projects/comes-website.jpg",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    teamMembers: ["Tharindu Gamage", "Hiruni Dissanayake"],
    startDate: "2025-09-01",
    githubUrl: "https://github.com/ComES-Ruhuna/website",
    liveUrl: "https://comes.eng.ruh.ac.lk",
    featured: true,
  },
  {
    id: "project-2",
    title: "Smart Campus IoT System",
    description:
      "An IoT-based smart campus monitoring system that tracks environmental conditions, energy usage, and occupancy across university buildings. Includes real-time dashboards and alerts.",
    shortDescription: "IoT system for monitoring campus environment and energy usage.",
    category: "IoT",
    status: "Completed",
    image: "/images/projects/smart-campus.jpg",
    technologies: ["Arduino", "Raspberry Pi", "MQTT", "Node.js", "InfluxDB"],
    teamMembers: ["Ruwan Bandara", "Chamara Wickrama"],
    startDate: "2024-06-01",
    endDate: "2025-03-15",
    githubUrl: "https://github.com/ComES-Ruhuna/smart-campus",
    featured: true,
  },
  {
    id: "project-3",
    title: "Student Assistant Chatbot",
    description:
      "AI-powered chatbot to assist students with common queries about courses, schedules, events, and university resources. Uses natural language processing for intelligent responses.",
    shortDescription: "AI chatbot for student assistance and information.",
    category: "AI/ML",
    status: "In Progress",
    image: "/images/projects/chatbot.jpg",
    technologies: ["Python", "TensorFlow", "FastAPI", "React"],
    teamMembers: ["Nimal Perera", "Samanthi Silva"],
    startDate: "2025-01-15",
    githubUrl: "https://github.com/ComES-Ruhuna/student-assistant",
    featured: true,
  },
  {
    id: "project-4",
    title: "Event Management App",
    description:
      "Mobile application for managing ComES events, including registration, check-in, notifications, and feedback collection. Available for both iOS and Android.",
    shortDescription: "Cross-platform mobile app for event management.",
    category: "Mobile App",
    status: "Completed",
    image: "/images/projects/event-app.jpg",
    technologies: ["React Native", "Firebase", "Node.js"],
    teamMembers: ["Dilini Rajapaksha", "Kasun Fernando"],
    startDate: "2024-09-01",
    endDate: "2025-02-28",
    githubUrl: "https://github.com/ComES-Ruhuna/event-app",
    liveUrl: "https://play.google.com/store/apps/details?id=lk.ac.ruh.comes",
    featured: true,
  },
  {
    id: "project-5",
    title: "Code Review Platform",
    description:
      "Web-based platform for peer code review among students. Features include syntax highlighting, inline comments, and automated code quality checks.",
    shortDescription: "Peer code review platform for students.",
    category: "Web Development",
    status: "In Progress",
    image: "/images/projects/code-review.jpg",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Docker"],
    teamMembers: ["Tharindu Gamage", "Chamara Wickrama"],
    startDate: "2025-02-01",
    githubUrl: "https://github.com/ComES-Ruhuna/code-review",
    featured: false,
  },
  {
    id: "project-6",
    title: "Network Security Monitor",
    description:
      "Real-time network security monitoring tool for detecting suspicious activities and potential threats. Includes visualization dashboards and automated alerts.",
    shortDescription: "Network security monitoring and threat detection.",
    category: "Cybersecurity",
    status: "Planning",
    image: "/images/projects/security-monitor.jpg",
    technologies: ["Python", "Elasticsearch", "Kibana", "Suricata"],
    teamMembers: ["Ishara Jayasuriya", "Ruwan Bandara"],
    startDate: "2025-04-01",
    githubUrl: "https://github.com/ComES-Ruhuna/security-monitor",
    featured: false,
  },
  {
    id: "project-7",
    title: "Data Visualization Dashboard",
    description:
      "Interactive dashboard for visualizing university data including student performance, course analytics, and resource utilization.",
    shortDescription: "Interactive data visualization for university analytics.",
    category: "Data Science",
    status: "Completed",
    image: "/images/projects/data-viz.jpg",
    technologies: ["D3.js", "React", "Python", "Flask"],
    teamMembers: ["Nadeesha Kumari", "Hiruni Dissanayake"],
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    githubUrl: "https://github.com/ComES-Ruhuna/data-viz",
    liveUrl: "https://analytics.comes.eng.ruh.ac.lk",
    featured: false,
  },
  {
    id: "project-8",
    title: "AR Campus Tour",
    description:
      "Augmented reality application for interactive campus tours. Students and visitors can explore the campus virtually with information overlays.",
    shortDescription: "AR app for interactive campus exploration.",
    category: "Mobile App",
    status: "Planning",
    image: "/images/projects/ar-tour.jpg",
    technologies: ["Unity", "AR Foundation", "C#", "Firebase"],
    teamMembers: ["Chamara Wickrama", "Dilini Rajapaksha"],
    startDate: "2025-05-01",
    featured: false,
  },
];

// Get featured projects
export const getFeaturedProjects = (count = 4): Project[] => {
  return projects.filter((project) => project.featured).slice(0, count);
};

// Get projects by category
export const getProjectsByCategory = (category: string): Project[] => {
  if (category === "All") return projects;
  return projects.filter((project) => project.category === category);
};

// Get projects by status
export const getProjectsByStatus = (status: string): Project[] => {
  return projects.filter((project) => project.status === status);
};

// Get recent projects
export const getRecentProjects = (count = 6): Project[] => {
  return [...projects]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, count);
};

// Project status options
export const projectStatusOptions = ["All", "Planning", "In Progress", "Completed", "On Hold"];
