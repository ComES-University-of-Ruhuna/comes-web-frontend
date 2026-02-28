// ============================================
// ComES Website - Gallery Page
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image, Camera, Send, Sparkles } from "lucide-react";
import { Section, Badge, PageTransition, FadeInView, HoverScale } from "@/components/ui";
import { galleryCategories, getImagesByCategory } from "@/data";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import type { GalleryImage } from "@/types";

// Lightbox Component
const Lightbox = ({
  image,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </motion.button>

      {/* Navigation Buttons */}
      {hasPrev && (
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 left-4 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft className="h-8 w-8" />
        </motion.button>
      )}
      {hasNext && (
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 right-4 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight className="h-8 w-8" />
        </motion.button>
      )}

      {/* Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="max-h-[80vh] max-w-5xl px-4"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain"
        />
        <div className="mt-4 text-center">
          <h3 className="mb-2 text-xl font-bold text-white">{image.title}</h3>
          {image.description && <p className="mb-2 text-gray-300">{image.description}</p>}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>{image.category}</span>
            {image.date && <span>{image.date}</span>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Gallery Image Card
const GalleryCard = ({
  image,
  onClick,
  index,
}: {
  image: GalleryImage;
  onClick: () => void;
  index: number;
}) => {
  return (
    <FadeInView direction="up" delay={index * 0.05}>
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-lg"
      >
        <motion.img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Content */}
        <motion.div
          className="absolute right-0 bottom-0 left-0 p-4"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          <h3 className="font-semibold text-white">{image.title}</h3>
          <p className="text-sm text-gray-300">{image.category}</p>
        </motion.div>

        {/* Featured Badge */}
        {image.featured && (
          <motion.div
            className="absolute top-3 right-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="warning" size="sm">
              ⭐ Featured
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </FadeInView>
  );
};

// Hero Section
const GalleryHero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section
      background="gradient"
      padding="xl"
      className={isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : ""}
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl"
        />

        <FadeInView>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
          >
            <Camera className="h-10 w-10 text-white" />
          </motion.div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <h1
            className={cn(
              "mb-6 text-4xl font-bold md:text-5xl lg:text-6xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Our{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
        </FadeInView>

        <FadeInView delay={0.2}>
          <p className={cn("text-xl leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}>
            Capturing moments of learning, celebration, and achievement. Browse through our
            collection of memories from events, workshops, and more.
          </p>
        </FadeInView>
      </div>
    </Section>
  );
};

// Main Gallery Section
const MainGallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const filteredImages = getImagesByCategory(activeCategory);

  const handlePrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <Section background={isDark ? "dark" : "white"}>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {galleryCategories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === category.id
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                : isDark
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {filteredImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              onClick={() => setLightboxIndex(index)}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredImages.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
          <Image
            className={cn("mx-auto mb-4 h-16 w-16", isDark ? "text-gray-600" : "text-gray-400")}
          />
          <p className={cn("text-lg", isDark ? "text-gray-500" : "text-gray-500")}>
            No images in this category yet.
          </p>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <Lightbox
            image={filteredImages[lightboxIndex]}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < filteredImages.length - 1}
          />
        )}
      </AnimatePresence>
    </Section>
  );
};

// Stats Section
const StatsSection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const stats = [
    { value: "500+", label: "Photos" },
    { value: "50+", label: "Events Covered" },
    { value: "1000+", label: "Memories" },
    { value: "5+", label: "Years of History" },
  ];

  return (
    <Section background="dark" className={isDark ? "bg-slate-900" : ""}>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <FadeInView key={index} direction="up" delay={index * 0.1}>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="mb-2 text-4xl font-bold text-white md:text-5xl"
              >
                {stat.value}
              </motion.div>
              <div className={cn(isDark ? "text-gray-400" : "text-blue-200")}>{stat.label}</div>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <Section background={isDark ? "white" : "gray"} padding="xl">
      <FadeInView>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          <h2
            className={cn(
              "mb-6 text-3xl font-bold md:text-4xl",
              isDark ? "text-white" : "text-comesBlue",
            )}
          >
            Share Your Moments
          </h2>
          <p className={cn("mb-8 text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
            Have photos from ComES events? We'd love to add them to our gallery. Reach out to us and
            help build our memory bank!
          </p>
          <HoverScale>
            <a
              href="mailto:media@comes.ruh.ac.lk"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-pink-500/30 transition-opacity hover:opacity-90"
            >
              <Send className="h-5 w-5" />
              Submit Your Photos
            </a>
          </HoverScale>
        </div>
      </FadeInView>
    </Section>
  );
};

// Main Gallery Page Component
export const GalleryPage = () => {
  return (
    <PageTransition>
      <GalleryHero />
      <MainGallerySection />
      <StatsSection />
      <CTASection />
    </PageTransition>
  );
};

export default GalleryPage;
