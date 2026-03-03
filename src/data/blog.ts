// ============================================
// ComES Website - Blog/News Data
// ============================================

import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "ComES Annual Hackathon 2026: Registration Now Open!",
    slug: "hackathon-2026-registration",
    excerpt:
      "Get ready for the biggest coding event of the year! Registration is now open for the ComES Annual Hackathon 2026.",
    content: `
      <p>We are thrilled to announce that registration for the ComES Annual Hackathon 2026 is now officially open! This year's hackathon promises to be bigger and better than ever, with exciting challenges, amazing prizes, and opportunities to network with industry professionals.</p>
      
      <h2>Event Details</h2>
      <ul>
        <li><strong>Date:</strong> March 15-16, 2026</li>
        <li><strong>Duration:</strong> 24 Hours</li>
        <li><strong>Venue:</strong> Computer Lab Complex, Faculty of Engineering</li>
        <li><strong>Team Size:</strong> 3-4 members</li>
      </ul>
      
      <h2>Prizes</h2>
      <p>This year, we have amazing prizes worth over LKR 500,000 including:</p>
      <ul>
        <li>1st Place: LKR 150,000 + Internship opportunities</li>
        <li>2nd Place: LKR 100,000 + Tech gadgets</li>
        <li>3rd Place: LKR 50,000 + Tech gadgets</li>
        <li>Special category prizes for Best UI/UX, Most Innovative Solution, and more!</li>
      </ul>
      
      <p>Don't miss this opportunity to showcase your skills, learn new technologies, and connect with fellow developers. Register now before spots fill up!</p>
    `,
    author: {
      name: "Dilini Rajapaksha",
      avatar: "https://ui-avatars.com/api/?name=Dilini+Rajapaksha&background=003366&color=fff",
    },
    publishedAt: "2026-01-15",
    category: "Announcements",
    tags: ["Hackathon", "Competition", "Registration"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
    readTime: 3,
    featured: true,
  },
  {
    id: "blog-2",
    title: "Introducing Our New AI/ML Workshop Series",
    slug: "ai-ml-workshop-series",
    excerpt:
      "Learn the fundamentals of Artificial Intelligence and Machine Learning in our comprehensive workshop series starting this February.",
    content: `
      <p>ComES is excited to launch a new workshop series focused on Artificial Intelligence and Machine Learning. This comprehensive program is designed for students at all levels, from beginners to advanced learners.</p>
      
      <h2>Workshop Schedule</h2>
      <ol>
        <li><strong>Week 1:</strong> Introduction to AI/ML & Python Basics</li>
        <li><strong>Week 2:</strong> Data Processing with NumPy and Pandas</li>
        <li><strong>Week 3:</strong> Machine Learning Fundamentals with Scikit-learn</li>
        <li><strong>Week 4:</strong> Deep Learning with TensorFlow</li>
        <li><strong>Week 5:</strong> Building Real-world AI Projects</li>
      </ol>
      
      <h2>What You'll Learn</h2>
      <p>By the end of this workshop series, you'll be able to:</p>
      <ul>
        <li>Understand core AI/ML concepts and algorithms</li>
        <li>Process and analyze data using Python libraries</li>
        <li>Build and train machine learning models</li>
        <li>Implement neural networks for various applications</li>
        <li>Deploy AI models in production environments</li>
      </ul>
      
      <p>Registration is free for all ComES members. Limited seats available!</p>
    `,
    author: {
      name: "Tharindu Gamage",
      avatar: "https://ui-avatars.com/api/?name=Tharindu+Gamage&background=003366&color=fff",
    },
    publishedAt: "2026-01-10",
    category: "Events",
    tags: ["AI", "Machine Learning", "Workshop", "Python"],
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200",
    readTime: 4,
    featured: true,
  },
  {
    id: "blog-3",
    title: "ComES Team Wins National Coding Competition",
    slug: "national-coding-competition-win",
    excerpt:
      "Our team secured first place at the National Coding Championship 2025, competing against 50+ universities.",
    content: `
      <p>We are proud to announce that the ComES competitive programming team has won first place at the National Coding Championship 2025! Our team competed against over 50 universities from across Sri Lanka in this prestigious competition.</p>
      
      <h2>The Team</h2>
      <p>Congratulations to our winning team:</p>
      <ul>
        <li>Chamara Wickrama (Team Lead)</li>
        <li>Kasun Fernando</li>
        <li>Hiruni Dissanayake</li>
      </ul>
      
      <h2>The Competition</h2>
      <p>The National Coding Championship featured multiple rounds of challenging algorithmic problems, testing contestants' skills in data structures, algorithms, and problem-solving under pressure.</p>
      
      <p>This victory reflects the dedication and hard work of our members, as well as the supportive environment we've built at ComES. We're committed to continuing our tradition of excellence in competitive programming.</p>
    `,
    author: {
      name: "Nimal Perera",
      avatar: "https://ui-avatars.com/api/?name=Nimal+Perera&background=003366&color=fff",
    },
    publishedAt: "2025-12-20",
    category: "Achievements",
    tags: ["Competition", "Achievement", "Programming"],
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200",
    readTime: 3,
    featured: true,
  },
  {
    id: "blog-4",
    title: "Getting Started with Web Development in 2026",
    slug: "web-development-guide-2026",
    excerpt:
      "A comprehensive guide for beginners looking to start their journey in web development this year.",
    content: `
      <p>Web development continues to evolve rapidly, and 2026 brings exciting new technologies and approaches. Here's your guide to getting started.</p>
      
      <h2>The Fundamentals</h2>
      <p>Before diving into frameworks, master these core technologies:</p>
      <ul>
        <li><strong>HTML5:</strong> The structure of web pages</li>
        <li><strong>CSS3:</strong> Styling and layout</li>
        <li><strong>JavaScript:</strong> Interactivity and logic</li>
      </ul>
      
      <h2>Modern Frameworks</h2>
      <p>Once you're comfortable with the basics, explore these popular frameworks:</p>
      <ul>
        <li><strong>React:</strong> Component-based UI development</li>
        <li><strong>Vue.js:</strong> Progressive JavaScript framework</li>
        <li><strong>Next.js:</strong> Full-stack React framework</li>
      </ul>
      
      <h2>Essential Tools</h2>
      <p>Set up your development environment with:</p>
      <ul>
        <li>VS Code as your code editor</li>
        <li>Git for version control</li>
        <li>Node.js for backend development</li>
        <li>Browser DevTools for debugging</li>
      </ul>
      
      <p>Join our upcoming Web Development Bootcamp to learn these skills hands-on!</p>
    `,
    author: {
      name: "Tharindu Gamage",
      avatar: "https://ui-avatars.com/api/?name=Tharindu+Gamage&background=003366&color=fff",
    },
    publishedAt: "2026-01-05",
    category: "Tutorials",
    tags: ["Web Development", "Tutorial", "Beginners"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
    readTime: 6,
    featured: false,
  },
  {
    id: "blog-5",
    title: "Industry Partnership Announcement: TechCorp Sri Lanka",
    slug: "techcorp-partnership",
    excerpt:
      "ComES partners with TechCorp Sri Lanka to provide internship and mentorship opportunities for students.",
    content: `
      <p>We are excited to announce a new strategic partnership between ComES and TechCorp Sri Lanka, one of the leading technology companies in the country.</p>
      
      <h2>Partnership Benefits</h2>
      <ul>
        <li>Internship opportunities for ComES members</li>
        <li>Mentorship programs with TechCorp engineers</li>
        <li>Technical workshops and knowledge sharing sessions</li>
        <li>Sponsorship for ComES events</li>
        <li>Career guidance and placement support</li>
      </ul>
      
      <p>This partnership opens new doors for our members to gain real-world experience and build connections in the industry. Stay tuned for upcoming opportunities!</p>
    `,
    author: {
      name: "Samanthi Silva",
      avatar: "https://ui-avatars.com/api/?name=Samanthi+Silva&background=003366&color=fff",
    },
    publishedAt: "2025-12-15",
    category: "News",
    tags: ["Partnership", "Industry", "Career"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    readTime: 2,
    featured: false,
  },
  {
    id: "blog-6",
    title: "ComES Executive Committee Elections 2026",
    slug: "elections-2026",
    excerpt:
      "Nominations are open for the ComES Executive Committee 2026. Be a leader and make a difference!",
    content: `
      <p>The time has come to elect the new ComES Executive Committee for 2026! We invite passionate and dedicated students to step forward and lead our community.</p>
      
      <h2>Available Positions</h2>
      <ul>
        <li>President</li>
        <li>Vice President</li>
        <li>Secretary</li>
        <li>Treasurer</li>
        <li>Event Coordinator</li>
        <li>Technical Lead</li>
        <li>Media & PR Coordinator</li>
      </ul>
      
      <h2>How to Apply</h2>
      <p>Submit your nomination through the ComES portal by February 28, 2026. Include:</p>
      <ul>
        <li>Your vision for ComES</li>
        <li>Relevant experience and achievements</li>
        <li>Plans for your proposed position</li>
      </ul>
      
      <p>Elections will be held in the first week of March. Make your voice heard!</p>
    `,
    author: {
      name: "Kasun Fernando",
      avatar: "https://ui-avatars.com/api/?name=Kasun+Fernando&background=003366&color=fff",
    },
    publishedAt: "2026-01-20",
    category: "Announcements",
    tags: ["Elections", "Leadership", "Community"],
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
    readTime: 3,
    featured: false,
  },
];

// Blog categories
export const blogCategories = [
  { id: "all", label: "All" },
  { id: "news", label: "News" },
  { id: "announcements", label: "Announcements" },
  { id: "tech", label: "Tech" },
  { id: "events", label: "Events" },
  { id: "achievements", label: "Achievements" },
  { id: "tutorials", label: "Tutorials" },
];

// Get featured posts
export const getFeaturedPosts = (count = 3): BlogPost[] => {
  return blogPosts.filter((post) => post.featured).slice(0, count);
};

// Get posts by category
export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === "All") return blogPosts;
  return blogPosts.filter((post) => post.category === category);
};

// Get post by slug
export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

// Get recent posts
export const getRecentPosts = (count = 5): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
};

// Get related posts (by tags)
export const getRelatedPosts = (currentSlug: string, count = 3): BlogPost[] => {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  return blogPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, count);
};
