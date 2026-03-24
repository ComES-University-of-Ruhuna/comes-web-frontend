// ============================================
// ComES Website - Blog Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { blogPosts, blogCategories } from "@/data";

const ease = [0.25, 0.46, 0.45, 0.94];
const POSTS_PER_PAGE = 6;

export const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = (blogPosts || []).filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const featuredPost = filtered[0];

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
        <div className="circuit-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="font-body text-text-muted mb-6 flex items-center justify-center gap-2 text-sm">
              <Link to="/" className="hover:text-accent-blue transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent-blue">Blog</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Blog
            </h1>
            <p className="font-body text-text-secondary mx-auto mb-10 max-w-2xl text-lg">
              Insights, tutorials, and articles from the ComES community.
            </p>
            <div className="mx-auto max-w-md">
              <div className="bg-bg-card flex items-center gap-3 rounded-full border border-border-h px-5 py-3">
                <Search className="text-text-muted h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="font-body text-text-primary placeholder:text-text-muted w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <FadeInView>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {(blogCategories || [{ id: "all", label: "All" }]).map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`font-body rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-bg-card text-text-secondary hover:border-accent-blue/40 border border-border-d"
                  }`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </FadeInView>

          {/* Featured Post */}
          {featuredPost && currentPage === 1 && (
            <FadeInView className="mb-12">
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                className="group bg-bg-card grid overflow-hidden rounded-2xl border border-border-d transition-all hover:border-border-h md:grid-cols-2"
              >
                <div className="h-64 overflow-hidden md:h-auto">
                  <img
                    src={
                      featuredPost.image ||
                      `https://placehold.co/800x400/0D1E35/0EA5E9?text=${encodeURIComponent(featuredPost.title)}`
                    }
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="bg-accent-blue/15 text-accent-blue rounded-full px-3 py-1 font-mono text-xs">
                      {featuredPost.category}
                    </span>
                    <span className="font-body text-text-muted text-xs">
                      {featuredPost.publishedAt}
                    </span>
                  </div>
                  <h2 className="font-display text-text-primary mb-3 text-2xl font-bold">
                    {featuredPost.title}
                  </h2>
                  <p className="font-body text-text-secondary mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    to="/blog"
                    className="font-body text-accent-blue inline-flex items-center gap-1 font-medium"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </FadeInView>
          )}

          {/* Post Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery + currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {paged.length > 0 ? (
                paged.map((post, i) => (
                  <FadeInView key={post.id} direction="up" delay={i * 0.05}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="group bg-bg-card flex h-full flex-col overflow-hidden rounded-2xl border border-border-d transition-all hover:border-border-h hover:shadow-glow-sm"
                    >
                      <div className="h-44 overflow-hidden">
                        <img
                          src={
                            post.image ||
                            `https://placehold.co/600x300/0D1E35/0EA5E9?text=${encodeURIComponent(post.title)}`
                          }
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="bg-accent-blue/15 text-accent-blue rounded-full px-3 py-1 font-mono text-xs">
                            {post.category}
                          </span>
                          <span className="font-body text-text-muted text-xs">
                            {post.publishedAt}
                          </span>
                        </div>
                        <h3 className="font-display text-text-primary mb-2 text-base font-semibold">
                          {post.title}
                        </h3>
                        <p className="font-body text-text-secondary mb-4 line-clamp-2 flex-1 text-sm">
                          {post.excerpt}
                        </p>
                        <Link
                          to="/blog"
                          className="font-body text-accent-blue inline-flex items-center gap-1 text-sm font-medium"
                        >
                          Read More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  </FadeInView>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <BookOpen className="text-text-muted mx-auto mb-4 h-16 w-16" />
                  <h3 className="font-display text-text-primary mb-2 text-xl font-semibold">
                    No Posts Found
                  </h3>
                  <p className="font-body text-text-secondary">
                    Try adjusting your search or filter.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-bg-card text-text-secondary hover:border-accent-blue/40 flex h-10 w-10 items-center justify-center rounded-full border border-border-d transition-all disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`font-body flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                      : "bg-bg-card text-text-secondary hover:border-accent-blue/40 border border-border-d"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-bg-card text-text-secondary hover:border-accent-blue/40 flex h-10 w-10 items-center justify-center rounded-full border border-border-d transition-all disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default BlogPage;
