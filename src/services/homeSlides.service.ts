import api from "./api";

export interface HomeSlide {
  _id: string;
  image: string;
  altText: string;
  order: number;
  isPublished?: boolean;
}

export type HomeSlideInput = Omit<HomeSlide, "_id">;

export const homeSlidesService = {
  list: async (admin = false) => {
    const response = await api.get<{ data: { slides: HomeSlide[] } }>(
      `/homepage-slides${admin ? "/admin" : ""}`,
    );
    const slides = response.data?.data?.slides;
    if (!Array.isArray(slides)) throw new Error("Unable to load homepage slides.");
    return slides;
  },
  upload: async (file: File, onProgress: (percent: number) => void) => {
    const data = new FormData();
    data.append("image", file);
    const response = await api.post<{ data: { url: string } }>("/homepage-slides/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 90000,
      onUploadProgress: ({ loaded, total }) => {
        if (total) onProgress(Math.round((loaded / total) * 100));
      },
    });
    return response.data.data.url;
  },
  create: async (data: HomeSlideInput) =>
    (await api.post<{ data: { slide: HomeSlide } }>("/homepage-slides", data)).data.data.slide,
  update: async (id: string, data: Partial<Omit<HomeSlideInput, "image">>) =>
    (await api.patch<{ data: { slide: HomeSlide } }>(`/homepage-slides/${id}`, data)).data.data
      .slide,
  remove: async (id: string) => {
    await api.delete(`/homepage-slides/${id}`);
  },
};
