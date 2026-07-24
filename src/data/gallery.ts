import type { GalleryCategory, GalleryImage } from "@/types";

export const galleryImages: GalleryImage[] = [];

export const galleryCategories: Array<{ id: "all" | GalleryCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "Events", label: "Events" },
  { id: "Workshops", label: "Workshops" },
  { id: "Team", label: "Team" },
  { id: "Campus", label: "Campus" },
  { id: "Awards", label: "Awards" },
  { id: "Other", label: "Other" },
];

export const getImagesByCategory = (category: string): GalleryImage[] =>
  category === "all" ? galleryImages : galleryImages.filter((image) => image.category === category);