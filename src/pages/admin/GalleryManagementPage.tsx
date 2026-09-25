import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router";
import {
  Check,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Images,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { CollectionPagination } from "@/components/ui/CollectionPagination";
import { eventsService } from "@/services/events.service";
import { galleryService, type GalleryPhoto, type GalleryData } from "@/services/gallery.service";

const inputClass =
  "mt-1 block w-full min-w-0 rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm";
const commandClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--border-color)] px-3 py-2 text-sm disabled:opacity-40";
const errorMessage = (error: unknown) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || error.message
    : error instanceof Error
      ? error.message
      : "Unable to save changes.";
type EventOption = { _id: string; title: string };
type QueuedPhoto = {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  url?: string;
  saved?: boolean;
  error?: string;
  progress?: number;
};

const EventPicker = ({
  value,
  onChange,
}: {
  value: EventOption | null;
  onChange: (value: EventOption | null) => void;
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      eventsService
        .getAll({ search, page, limit: 30 })
        .then((response) => {
          if (!response.success || !response.data) throw new Error("Unable to load events.");
          if (active) {
            setEvents(response.data.items);
            setPages(response.data.pagination.pages);
          }
        })
        .catch(() => {
          if (active) setError(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, page, retry]);
  return (
    <div className="max-w-xl space-y-3">
      <label className="block text-sm">
        Search events
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        Event
        <select
          value={value?._id || ""}
          onChange={(event) =>
            onChange(
              events.find((item) => item._id === event.target.value) ||
                (event.target.value === value?._id ? value : null),
            )
          }
          className={inputClass}
        >
          <option value="">All events</option>
          {value && !events.some((event) => event._id === value._id) && (
            <option value={value._id}>{value.title}</option>
          )}
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
      </label>
      {loading && (
        <p role="status" className="text-xs opacity-60">
          Loading events...
        </p>
      )}
      {error && (
        <div role="alert" className="text-sm text-red-600">
          Unable to load events.{" "}
          <button type="button" onClick={() => setRetry(retry + 1)} className={commandClass}>
            <RefreshCw className="h-4 w-4" />
            Retry events
          </button>
        </div>
      )}
      <CollectionPagination page={page} pages={pages} onChange={setPage} disabled={loading} />
    </div>
  );
};

const PhotoEditor = ({
  photo,
  onClose,
  onSaved,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [previous] = useState(() => document.activeElement);
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [published, setPublished] = useState(photo.isPublished);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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
      aria-labelledby="gallery-editor-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          if (!saving) onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 text-[var(--text-primary)] backdrop:bg-black/60"
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError("");
          try {
            await galleryService.update(photo._id, {
              title: title.trim(),
              description,
              isPublished: published,
            });
            onSaved();
          } catch (failure) {
            setError(errorMessage(failure));
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="gallery-editor-title" className="text-xl font-semibold">
            Edit photograph
          </h2>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close editor"
            title="Close"
            className={commandClass}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <fieldset disabled={saving} className="min-w-0 space-y-4">
          <img src={photo.image} alt={photo.title} className="h-48 w-full object-contain" />
          <p className="text-sm opacity-60">{photo.event?.title || "Community archive"}</p>
          <label className="block text-sm">
            Title
            <input
              autoFocus
              required
              minLength={2}
              maxLength={160}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm">
            Caption
            <textarea
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            Published
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button type="submit" className={commandClass}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </fieldset>
      </form>
    </dialog>
  );
};

export default function GalleryManagementPage() {
  const [event, setEvent] = useState<EventOption | null>(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [queue, setQueue] = useState<QueuedPhoto[]>([]);
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<GalleryPhoto | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const previews = useRef(new Set<string>());
  useEffect(() => {
    const urls = previews.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setListError(false);
    galleryService
      .list({ event: event?._id, page, includeUnpublished: true })
      .then((result) => {
        if (!active) return;
        if (page > Math.max(1, result.pagination.pages))
          setPage(Math.max(1, result.pagination.pages));
        else setData(result);
      })
      .catch(() => {
        if (active) setListError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [event?._id, page, revision]);
  useEffect(() => {
    if (!busy) return;
    const preventLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventLeave);
    return () => window.removeEventListener("beforeunload", preventLeave);
  }, [busy]);
  const updateQueued = (id: string, changes: Partial<QueuedPhoto>) =>
    setQueue((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  const upload = async () => {
    if (!event || busy) return;
    const pending = queue.filter((item) => !item.saved);
    if (pending.some((item) => item.title.trim().length < 2)) {
      setError("Each photo needs a title of at least 2 characters.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    let saved = 0;
    for (const item of pending) {
      updateQueued(item.id, { error: undefined, progress: 0 });
      try {
        const url =
          item.url ||
          (await galleryService.upload(item.file, (progress) =>
            updateQueued(item.id, { progress }),
          ));
        updateQueued(item.id, { url, progress: 100 });
        await galleryService.create({
          event: event._id,
          title: item.title.trim(),
          description: item.description,
          image: url,
          isPublished: published,
        });
        updateQueued(item.id, { saved: true });
        saved++;
      } catch (failure) {
        updateQueued(item.id, { error: errorMessage(failure) });
      }
    }
    setBusy(false);
    setRevision((value) => value + 1);
    setNotice(`${saved} of ${pending.length} photographs saved.`);
  };
  const removeQueued = (item: QueuedPhoto) => {
    URL.revokeObjectURL(item.preview);
    previews.current.delete(item.preview);
    setQueue((current) => current.filter((photo) => photo.id !== item.id));
  };
  const changeVisibility = async (photo: GalleryPhoto) => {
    setBusy(true);
    setError("");
    try {
      await galleryService.update(photo._id, { isPublished: !photo.isPublished });
      setRevision((value) => value + 1);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="text-[var(--text-primary)]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Link to="/gallery" className={commandClass}>
          <ExternalLink className="h-4 w-4" />
          View gallery
        </Link>
      </header>
      <fieldset disabled={busy} className="min-w-0 border-y border-[var(--border-color)] py-5">
        <EventPicker
          value={event}
          onChange={(value) => {
            setEvent(value);
            setPage(1);
          }}
        />
      </fieldset>
      <section
        aria-label="Upload photographs"
        className="border-b border-[var(--border-color)] py-6"
      >
        <h2 className="mb-4 text-lg font-semibold">Add photographs</h2>
        <fieldset disabled={busy} className="min-w-0">
          <label className="block text-sm">
            Photos
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              disabled={!event || busy}
              className="mt-2 block w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white disabled:opacity-40"
              onChange={(change) => {
                const files = Array.from(change.target.files || []);
                change.target.value = "";
                setError("");
                setNotice("");
                if (files.length + queue.length > 20) {
                  setError("Add up to 20 photos at a time.");
                  return;
                }
                const valid: QueuedPhoto[] = [];
                const invalid: string[] = [];
                for (const file of files) {
                  if (
                    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
                    file.size > 3 * 1024 * 1024 ||
                    !file.size
                  ) {
                    invalid.push(file.name);
                    continue;
                  }
                  const preview = URL.createObjectURL(file);
                  previews.current.add(preview);
                  valid.push({
                    id: crypto.randomUUID(),
                    file,
                    preview,
                    title: file.name
                      .replace(/\.[^.]+$/, "")
                      .replace(/[-_]/g, " ")
                      .slice(0, 160),
                    description: "",
                  });
                }
                setQueue((current) => [...current, ...valid]);
                if (invalid.length)
                  setError(
                    `Not added: ${invalid.join(", ")}. Use JPEG, PNG or WebP files up to 3 MB.`,
                  );
              }}
            />
          </label>
          {queue.length > 0 && (
            <>
              <div className="mt-5 divide-y divide-[var(--border-color)]">
                {queue.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-start gap-4 py-4">
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="h-24 w-24 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1 basis-48 space-y-2">
                      <label className="block text-xs">
                        Title
                        <input
                          value={item.title}
                          disabled={item.saved}
                          maxLength={160}
                          onChange={(change) =>
                            updateQueued(item.id, { title: change.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className="block text-xs">
                        Caption
                        <textarea
                          rows={2}
                          disabled={item.saved}
                          maxLength={1000}
                          value={item.description}
                          onChange={(change) =>
                            updateQueued(item.id, { description: change.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                      <p role="status" className="text-xs text-emerald-600">
                        {item.saved
                          ? "Saved"
                          : item.url
                            ? "Uploaded"
                            : item.progress !== undefined
                              ? `Uploading ${item.progress}%`
                              : ""}
                      </p>
                      {item.error && (
                        <p role="alert" className="text-sm text-red-600">
                          {item.error}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQueued(item)}
                      aria-label={`Remove ${item.file.name} from queue`}
                      title="Remove from queue"
                      className={commandClass}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(change) => setPublished(change.target.checked)}
                  />
                  Publish photos
                </label>
                <button
                  type="button"
                  disabled={!event || queue.every((item) => item.saved)}
                  onClick={upload}
                  className={commandClass}
                >
                  <Upload className="h-4 w-4" />
                  {busy
                    ? "Saving photos..."
                    : queue.some((item) => item.error)
                      ? "Retry unsaved photos"
                      : "Save photos"}
                </button>
              </div>
            </>
          )}
        </fieldset>
      </section>
      {error && (
        <p role="alert" className="my-4 text-sm break-words text-red-600">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="my-4 text-sm text-emerald-600">
          {notice}
        </p>
      )}
      <section aria-label="Saved photographs" className="py-6">
        <h2 className="mb-5 text-lg font-semibold">
          Photographs{data ? ` (${data.pagination.total})` : ""}
        </h2>
        {loading ? (
          <p role="status">Loading photographs...</p>
        ) : listError ? (
          <div role="alert">
            <p>Unable to load photographs.</p>
            <button
              type="button"
              onClick={() => setRevision(revision + 1)}
              className={`${commandClass} mt-3`}
            >
              <RefreshCw className="h-4 w-4" />
              Retry gallery
            </button>
          </div>
        ) : !data?.images.length ? (
          <div className="py-12 text-center">
            <Images className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No photographs yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.images.map((photo) => (
                <article
                  key={photo._id}
                  className="min-w-0 overflow-hidden rounded-lg border border-[var(--border-color)]"
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-neutral-100 object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <h3 className="text-base font-semibold break-words">{photo.title}</h3>
                    <p className="text-xs opacity-60">
                      {photo.event?.title || "Community archive"}
                    </p>
                    <p className="text-xs font-medium">
                      {photo.isPublished ? "Published" : "Draft"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setEditing(photo)}
                        aria-label={`Edit ${photo.title}`}
                        title="Edit photograph"
                        className={commandClass}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => changeVisibility(photo)}
                        aria-label={`${photo.isPublished ? "Unpublish" : "Publish"} ${photo.title}`}
                        title={photo.isPublished ? "Unpublish" : "Publish"}
                        className={commandClass}
                      >
                        {photo.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setDeleting(photo._id)}
                        aria-label={`Delete ${photo.title}`}
                        title="Delete photograph"
                        className={commandClass}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {deleting === photo._id && (
                      <div className="space-y-2">
                        <p className="text-sm">Remove this photograph from the gallery?</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            className={commandClass}
                            onClick={async () => {
                              setBusy(true);
                              setError("");
                              try {
                                await galleryService.remove(photo._id);
                                setDeleting(null);
                                setRevision((value) => value + 1);
                              } catch (failure) {
                                setError(errorMessage(failure));
                              } finally {
                                setBusy(false);
                              }
                            }}
                          >
                            <Check className="h-4 w-4" />
                            Confirm delete
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setDeleting(null)}
                            aria-label="Cancel deletion"
                            title="Cancel"
                            className={commandClass}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <CollectionPagination
              page={page}
              pages={data.pagination.pages}
              onChange={setPage}
              disabled={busy}
            />
          </>
        )}
      </section>
      {editing && (
        <PhotoEditor
          photo={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            setRevision((value) => value + 1);
          }}
        />
      )}
    </div>
  );
}
