import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  RefreshCw,
  X,
} from "lucide-react";
import {
  galleryService,
  type GalleryPhoto,
  type GalleryAlbum,
  type GalleryData,
} from "@/services/gallery.service";
import { cn } from "@/utils";

const Photo = ({
  photo,
  className,
  eager = false,
}: {
  photo: GalleryPhoto;
  className: string;
  eager?: boolean;
}) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return failedSource === photo.image ? (
    <div
      role="img"
      aria-label={`${photo.title}: image unavailable`}
      className={cn(className, "flex items-center justify-center bg-neutral-200 text-neutral-600")}
    >
      <Images className="h-10 w-10" />
    </div>
  ) : (
    <img
      src={photo.image}
      alt={photo.title}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSource(photo.image)}
      className={className}
    />
  );
};

const Lightbox = ({
  photos,
  index,
  onChange,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [previous] = useState(() => document.activeElement);
  const photo = photos[index];
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [previous]);
  return (
    <dialog
      ref={dialog}
      aria-label="Photo viewer"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
        if (event.key === "ArrowLeft" && index > 0) {
          event.preventDefault();
          onChange(index - 1);
        }
        if (event.key === "ArrowRight" && index < photos.length - 1) {
          event.preventDefault();
          onChange(index + 1);
        }
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-neutral-950 p-0 text-white backdrop:bg-black/80"
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/15 px-4 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-xs text-neutral-400">
              {index + 1} / {photos.length}
            </p>
            <h2 className="mt-1 text-lg font-semibold break-words">{photo.title}</h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Close photo viewer"
            title="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/30"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:px-20 sm:py-6">
          <Photo photo={photo} eager className="h-full max-h-full w-full object-contain" />
        </div>
        <footer className="shrink-0 space-y-3 border-t border-white/15 px-4 py-4 sm:px-8">
          {photo.description && (
            <p className="max-h-24 overflow-y-auto text-sm whitespace-pre-wrap text-neutral-300">
              {photo.description}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 text-sm">
              {photo.event ? (
                <Link
                  to={`/events/${photo.event.slug}`}
                  className="inline-flex items-center gap-2 break-words text-emerald-300"
                >
                  {photo.event.title}
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
              ) : (
                <span>Community archive</span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={photo.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open original image"
                title="Open original"
                className="flex h-10 w-10 items-center justify-center rounded border border-white/30"
              >
                <Expand className="h-4 w-4" />
              </a>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onChange(index - 1)}
                aria-label="Previous photo"
                title="Previous photo"
                className="flex h-10 w-10 items-center justify-center rounded border border-white/30 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled={index === photos.length - 1}
                onClick={() => onChange(index + 1)}
                aria-label="Next photo"
                title="Next photo"
                className="flex h-10 w-10 items-center justify-center rounded border border-white/30 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </dialog>
  );
};

export const GalleryPage = () => {
  const [event, setEvent] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<
    (GalleryData & { batches: { photos: GalleryPhoto[]; offset: number }[] }) | null
  >(null);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [index, setIndex] = useState<number | null>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  const requested = useRef(false);
  const hasMore = !!data && data.pagination.page < data.pagination.pages;
  useEffect(() => {
    let active = true;
    requested.current = true;
    setLoading(true);
    setError(false);
    Promise.all([
      galleryService.list({ event, page }),
      page === 1 ? galleryService.albums() : Promise.resolve(null),
    ])
      .then(([images, events]) => {
        if (active) {
          setData((current) => {
            if (page === 1 || !current)
              return { ...images, batches: [{ photos: images.images, offset: 0 }] };
            const existing = new Set(current.images.map((photo) => photo._id));
            const added = images.images.filter((photo) => !existing.has(photo._id));
            return {
              ...images,
              images: [...current.images, ...added],
              batches: [...current.batches, { photos: added, offset: current.images.length }],
            };
          });
          if (events) setAlbums(events);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
        }
      })
      .finally(() => {
        if (active) {
          requested.current = false;
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [event, page, retry]);
  useEffect(() => {
    const button = moreButton.current;
    if (
      !button ||
      loading ||
      error ||
      !hasMore ||
      index !== null ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (active && entries.some((entry) => entry.isIntersecting)) button.click();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(button);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [loading, error, hasMore, index, page]);
  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      aria-label="Event photographs"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-y border-current/15 py-5">
        <div>
          <p className="text-xs font-semibold text-emerald-600">THE PHOTO ARCHIVE</p>
          <p className="mt-2 text-sm opacity-70" aria-live="polite">
            {loading && !data
              ? "Loading photographs..."
              : `${data?.pagination.total ?? 0} photographs${event ? "" : ` / ${albums.length} events`}`}
          </p>
        </div>
        <label className="w-full text-sm sm:w-80">
          Event
          <select
            value={event}
            onChange={(change) => {
              setEvent(change.target.value);
              setPage(1);
              setIndex(null);
              setData(null);
              setLoading(true);
              setError(false);
            }}
            className="mt-2 block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)]"
          >
            <option value="">All events</option>
            {albums.map((album) => (
              <option key={album._id} value={album._id}>
                {album.title} ({album.count})
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading && !data ? (
        <div
          role="status"
          aria-label="Loading gallery"
          className="grid grid-cols-2 gap-5 md:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, position) => (
            <div key={position} className="aspect-[4/3] animate-pulse bg-current/5" />
          ))}
        </div>
      ) : error && !data ? (
        <div role="alert" className="py-16 text-center">
          <p>Unable to load the gallery.</p>
          <button
            type="button"
            onClick={() => setRetry(retry + 1)}
            className="mx-auto mt-4 flex items-center gap-2 rounded border border-current/20 px-4 py-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      ) : !data?.images.length ? (
        <div className="py-20 text-center">
          <Images className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
          <h2 className="text-xl font-semibold">
            {event ? "No photographs for this event yet." : "The next chapter is coming."}
          </h2>
          <p className="mt-2 text-sm opacity-60">
            {event
              ? "No published photographs."
              : "Event photographs will appear here once published."}
          </p>
        </div>
      ) : (
        <>
          {data.batches.map((batch, batchIndex) => (
            <div key={batchIndex} className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {batch.photos.map((photo, batchPosition) => {
                const position = batch.offset + batchPosition;
                return (
                  <figure key={photo._id} className="mb-8 break-inside-avoid">
                    <button
                      type="button"
                      onClick={() => setIndex(position)}
                      aria-label={`View photo: ${photo.title}`}
                      className={cn(
                        "group relative block w-full overflow-hidden bg-neutral-100 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600",
                        position % 5 === 1
                          ? "aspect-[3/4]"
                          : position % 5 === 3
                            ? "aspect-square"
                            : "aspect-[4/3]",
                      )}
                    >
                      <Photo
                        photo={photo}
                        eager={position < 3}
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                      <span className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded bg-white/95 text-neutral-900 shadow">
                        <Expand className="h-4 w-4" />
                      </span>
                    </button>
                    <figcaption className="flex items-start gap-3 pt-3">
                      <span className="pt-0.5 font-mono text-xs text-emerald-600">
                        {String(position + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold break-words">{photo.title}</h2>
                        <p className="mt-1 text-xs opacity-65">
                          {photo.event?.title || "Community archive"}
                          {photo.event?.date
                            ? ` / ${new Date(photo.event.date).getFullYear()}`
                            : ""}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ))}
          <div className="flex min-h-24 flex-col items-center justify-center gap-3 py-6">
            {error ? (
              <div role="alert" className="text-center">
                <p>Unable to load more photographs.</p>
                <button
                  type="button"
                  onClick={() => setRetry((value) => value + 1)}
                  className="mx-auto mt-3 flex items-center gap-2 rounded border border-current/20 px-4 py-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry loading
                </button>
              </div>
            ) : hasMore ? (
              <>
                {loading && (
                  <p role="status" className="text-sm opacity-70">
                    Loading more photographs...
                  </p>
                )}
                <button
                  ref={moreButton}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (requested.current || loading) return;
                    requested.current = true;
                    setPage(data.pagination.page + 1);
                  }}
                  className="flex items-center gap-2 rounded border border-current/20 px-4 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronDown className="h-4 w-4" />
                  Load more photos
                </button>
              </>
            ) : (
              <p className="text-sm opacity-60">All photographs loaded.</p>
            )}
          </div>
        </>
      )}
      {index !== null && data?.images[index] && (
        <Lightbox
          photos={data.images}
          index={index}
          onChange={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </section>
  );
};
export default GalleryPage;
