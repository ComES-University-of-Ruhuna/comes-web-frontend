// ============================================
// ComES Website - Blog Page
// ============================================

import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, Newspaper, PenLine } from 'lucide-react';
import { Section, SectionHeader, Card, Button, Badge, PageTransition, FadeInView, HoverScale, NewsletterSection } from '@/components/ui';
import { blogPosts, getFeaturedPosts, blogCategories } from '@/data';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import type { BlogPost } from '@/types';

// Blog Post Card
const BlogPostCard = ({ post, index = 0 }: { post: BlogPost; index?: number }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <FadeInView direction="up" delay={index * 0.1}>
      <motion.div whileHover={{ y: -10 }}>
        <Card hoverable padding="none" className={cn(
          'flex flex-col h-full overflow-hidden',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <div className="relative overflow-hidden">
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" size="sm">
                {post.category}
              </Badge>
            </div>
          </div>

          <div className={cn(
            'p-6 flex-1 flex flex-col',
            isDark && 'bg-slate-800/50'
          )}>
            <div className={cn(
              'flex items-center gap-4 mb-3 text-sm',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} min read
              </span>
            </div>

            <h3 className={cn(
              'text-xl font-bold mb-3 line-clamp-2',
              isDark ? 'text-white' : 'text-comesBlue'
            )}>
              <Link to={`/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
                {post.title}
              </Link>
            </h3>

            <p className={cn(
              'mb-4 flex-1 line-clamp-3',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>{post.excerpt}</p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                />
                <span className={cn(
                  'text-sm',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>{post.author.name}</span>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="text-blue-500 font-medium text-sm hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Read More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Featured Post Card (larger)
const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <FadeInView direction="left">
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card hoverable padding="none" className={cn(
          'lg:flex overflow-hidden',
          isDark && 'bg-slate-800/50 border-slate-700/50'
        )}>
          <div className="lg:w-1/2 overflow-hidden">
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-64 lg:h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className={cn(
            'lg:w-1/2 p-8 flex flex-col justify-center',
            isDark && 'bg-slate-800/50'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="warning" size="sm">
                ⭐ Featured
              </Badge>
              <Badge variant="secondary" size="sm">
                {post.category}
              </Badge>
            </div>

            <h2 className={cn(
              'text-2xl lg:text-3xl font-bold mb-4',
              isDark ? 'text-white' : 'text-comesBlue'
            )}>
              <Link to={`/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
                {post.title}
              </Link>
            </h2>

            <p className={cn(
              'mb-6',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <div className={cn(
                    'font-medium',
                    isDark ? 'text-white' : 'text-gray-800'
                  )}>{post.author.name}</div>
                  <div className={cn(
                    'text-sm',
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  )}>
                    {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime} min read
                  </div>
                </div>
              </div>
            </div>

            <HoverScale className="mt-6 self-start">
              <Button
                href={`/blog/${post.slug}`}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Read Article
              </Button>
            </HoverScale>
          </div>
        </Card>
      </motion.div>
    </FadeInView>
  );
};

// Hero Section
const BlogHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background="gradient" padding="xl" className={isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}>
      <div className="text-center max-w-4xl mx-auto relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-lg shadow-green-500/30"
          >
            <Newspaper className="w-10 h-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Blog & <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">News</span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn(
            'text-xl leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Stay updated with the latest news, tutorials, and insights from our
            community. Learn, share, and grow together.
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Featured Posts Section
const FeaturedSection = () => {
  const featuredPosts = getFeaturedPosts(1);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  if (featuredPosts.length === 0) return null;

  return (
    <Section background={isDark ? 'dark' : 'white'}>
      <FadeInView>
        <SectionHeader
          title="Featured Article"
          subtitle="Our top pick for you this week."
        />
      </FadeInView>
      <FeaturedPostCard post={featuredPosts[0]} />
    </Section>
  );
};

// All Posts Section
const AllPostsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category.toLowerCase() === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Section background={isDark ? 'white' : 'gray'}>
      <FadeInView>
        <SectionHeader
          title="All Articles"
          subtitle="Browse through our collection of articles and tutorials."
        />
      </FadeInView>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5',
            isDark ? 'text-gray-500' : 'text-gray-400'
          )} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-12 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              isDark 
                ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900'
            )}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : isDark 
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
              )}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={activeCategory + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={cn(
              'text-lg',
              isDark ? 'text-gray-500' : 'text-gray-500'
            )}>No articles found.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Section background={isDark ? 'dark' : 'white'} padding="xl">
      <FadeInView>
        <div className="text-center max-w-3xl mx-auto relative">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-lg shadow-amber-500/30"
          >
            <PenLine className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-6',
            isDark ? 'text-white' : 'text-comesBlue'
          )}>
            Want to Contribute?
          </h2>
          <p className={cn(
            'text-lg mb-8',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            Share your knowledge with our community! We welcome articles on
            technology, tutorials, project showcases, and more.
          </p>
          <HoverScale>
            <Button href="/contact" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Submit an Article
            </Button>
          </HoverScale>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main Blog Page Component
export const BlogPage = () => {
  return (
    <PageTransition>
      <BlogHero />
      <FeaturedSection />
      <AllPostsSection />
      <NewsletterSection 
        title="Subscribe to Our Newsletter"
        description="Get the latest articles, tutorials, and updates delivered straight to your inbox."
      />
      <CTASection />
    </PageTransition>
  );
};

export default BlogPage;
