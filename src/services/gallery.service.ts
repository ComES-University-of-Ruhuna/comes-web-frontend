import api from "./api";

export interface GalleryPhoto {
  _id: string;
  event: { _id: string; title: string; slug: string; date: string; type?: string } | null;
  title: string;
  description: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}
export interface GalleryAlbum {
  _id: string;
  title: string;
  slug: string;
  date: string;
  count: number;
}
export interface GalleryData {
  images: GalleryPhoto[];
  pagination: { page: number; pages: number; total: number; limit: number };
}
export interface GalleryInput {
  event: string;
  title: string;
  description?: string;
  image: string;
  isPublished: boolean;
}

export const galleryService = {
  list: async (filters: { event?: string; page?: number; includeUnpublished?: boolean } = {}) => {
    const params = new URLSearchParams({ limit: "24" });
    for (const [key, value] of Object.entries(filters))
      if (value !== undefined && value !== "") params.set(key, String(value));
    return (await api.get<{ data: GalleryData }>(`/gallery?${params}`)).data.data;
  },
  albums: async () =>
    (await api.get<{ data: { albums: GalleryAlbum[] } }>("/gallery/albums")).data.data.albums,
  upload: async (file: File, onProgress: (percent: number) => void) => {
    const data = new FormData();
    data.append("image", file);
    const response = await api.post<{ data: { url: string } }>("/gallery/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 90000,
      onUploadProgress: ({ loaded, total }) => {
        if (total) onProgress(Math.round((loaded / total) * 100));
      },
    });
    return response.data.data.url;
  },
  create: async (data: GalleryInput) =>
    (await api.post<{ data: { image: GalleryPhoto } }>("/gallery", data)).data.data.image,
  update: async (
    id: string,
    data: Partial<Pick<GalleryInput, "title" | "description" | "event" | "isPublished">>,
  ) => (await api.patch<{ data: { image: GalleryPhoto } }>(`/gallery/${id}`, data)).data.data.image,
  remove: async (id: string) => {
    await api.delete(`/gallery/${id}`);
  },
};
