// ============================================
// ComES Website - Gallery Page (Redesigned)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { X, ZoomIn } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/ui";
import { galleryCategories, getImagesByCategory } from "@/data";

const ease = [0.25, 0.46, 0.45, 0.94];

export const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const images = getImagesByCategory(activeCategory);

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
              <span className="text-accent-blue">Gallery</span>
            </div>
            <h1 className="font-display text-text-primary mb-6 text-4xl font-bold lg:text-6xl">
              Gallery
            </h1>
            <p className="font-body text-text-secondary mx-auto max-w-2xl text-lg">
              Memories from our events, workshops, and community activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {galleryCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
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

          {/* Masonry-style Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="columns-1 gap-4 sm:columns-2 lg:columns-3"
            >
              {images.map((image, i) => (
                <FadeInView key={image.id} direction="up" delay={i * 0.05}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="group relative mb-4 cursor-pointer overflow-hidden rounded-2xl border border-border-d transition-all hover:border-border-h"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="font-body text-sm font-medium text-white">{image.title}</p>
                      <p className="font-body text-xs text-white/70">{image.category}</p>
                    </div>
                  </motion.div>
                </FadeInView>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </motion.button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease }}
              src={selectedImage}
              alt="Gallery"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default GalleryPage;
