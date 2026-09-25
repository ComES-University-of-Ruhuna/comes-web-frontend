import { Link, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";

const pageDetails: Record<string, { title: string; description: string; category: string }> = {
  "/about": {
    title: "About ComES",
    description:
      "The Computer Engineering Society at the University of Ruhuna. A community shaped by curiosity, collaboration, and practical engineering.",
    category: "Our Society",
  },
  "/events": {
    title: "Events",
    description:
      "Workshops, competitions, and conversations that bring our engineering community together.",
    category: "Get Involved",
  },
  "/projects": {
    title: "Projects",
    description: "Explore the ideas, research, and working solutions developed by our members.",
    category: "Built by Our Community",
  },
  "/team": {
    title: "Our Team",
    description: "Meet the students, faculty advisors, and coordinators behind ComES.",
    category: "People & Leadership",
  },
  "/gallery": {
    title: "Gallery",
    description: "Moments from our events, workshops, and life in the engineering community.",
    category: "Life at ComES",
  },
  "/blog": {
    title: "Blog & News",
    description: "Community updates, technical insights, and stories from our members.",
    category: "From the Society",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Connect with our team about membership, events, partnerships, or an idea worth sharing.",
    category: "Start a Conversation",
  },
  "/faq": {
    title: "Frequently Asked Questions",
    description: "Answers about joining ComES, taking part in events, and getting involved.",
    category: "Help & Information",
  },
  "/subgroups/software-engineering": {
    title: "Software Engineering",
    description:
      "Building reliable software, from web and mobile applications to the systems that power them.",
    category: "Our Subgroups",
  },
  "/subgroups/ai-data-science": {
    title: "AI & Data Science",
    description:
      "Exploring machine learning, intelligent systems, and the possibilities within data.",
    category: "Our Subgroups",
  },
  "/subgroups/embedded-electronics": {
    title: "Electronics & Embedded Systems",
    description:
      "Connecting hardware and software through electronics, embedded systems, and hands-on experimentation.",
    category: "Our Subgroups",
  },
  "/subgroups/network-security": {
    title: "Network & Cyber Security",
    description: "Understanding connected systems and developing the skills to keep them secure.",
    category: "Our Subgroups",
  },
};

export const PublicPageHeader = () => {
  const { pathname } = useLocation();
  const page = pageDetails[pathname.replace(/\/$/, "")];
  if (!page) return null;
  return (
    <header className="site-page-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs">
          <Link to="/">Home</Link>
          <ChevronRight aria-hidden="true" className="h-3 w-3 shrink-0" />
          <span aria-current="page">{page.title}</span>
        </nav>
        <p className="site-eyebrow">{page.category}</p>
        <h1>{page.title}</h1>
        <p className="site-page-description">{page.description}</p>
      </div>
    </header>
  );
};
