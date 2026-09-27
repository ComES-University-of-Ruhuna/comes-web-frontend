import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router";
import { ExternalLink, ImagePlus, RefreshCw, Save, Trash2, Upload, X } from "lucide-react";
import { homeSlidesService, type HomeSlide } from "@/services/homeSlides.service";

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
const sortSlides = (slides: HomeSlide[]) =>
  [...slides].sort(
    (first, second) => first.order - second.order || first._id.localeCompare(second._id),
  );

function SlideEditor({
  slide,
  onSaved,
  onRemoved,
}: {
  slide: HomeSlide;
  onSaved: (slide: HomeSlide) => void;
  onRemoved: (id: string) => void;
}) {
  const [altText, setAltText] = useState(slide.altText);
  const [order, setOrder] = useState(slide.order);
  const [published, setPublished] = useState(Boolean(slide.isPublished));
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <form
      aria-label={`Edit ${slide.altText}`}
      className="min-w-0 border-b border-[var(--border-color)] py-6"
      onChange={() => setSaved(false)}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        setSaved(false);
        try {
          onSaved(
            await homeSlidesService.update(slide._id, {
              altText: altText.trim(),
              order,
              isPublished: published,
            }),
          );
          setSaved(true);
        } catch (failure) {
          setError(errorMessage(failure));
        } finally {
          setBusy(false);
        }
      }}
    >
      <fieldset
        disabled={busy}
        className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
      >
        <img
          src={slide.image}
          alt={slide.altText}
          className="aspect-video w-full rounded-md bg-black/5 object-contain"
        />
        <div className="min-w-0 space-y-4">
          <label className="block text-sm">
            Image description
            <input
              required
              maxLength={160}
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex flex-wrap items-end gap-5">
            <label className="block w-32 text-sm">
              Display order
              <input
                required
                type="number"
                min={0}
                max={9999}
                step={1}
                value={order}
                onChange={(event) => setOrder(event.target.valueAsNumber)}
                className={inputClass}
              />
            </label>
            <label className="flex min-h-10 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
              />
              Published
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className={commandClass}>
              <Save className="h-4 w-4" />
              {busy ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              aria-label={`Remove ${slide.altText}`}
              title="Remove slide"
              className={commandClass}
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {saved && (
              <span role="status" className="text-sm">
                Saved
              </span>
            )}
          </div>
          {confirming && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <p>Remove this slide?</p>
              <button
                type="button"
                className={commandClass}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await homeSlidesService.remove(slide._id);
                    onRemoved(slide._id);
                  } catch (failure) {
                    setError(errorMessage(failure));
                    setBusy(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Remove slide
              </button>
              <button type="button" className={commandClass} onClick={() => setConfirming(false)}>
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </fieldset>
    </form>
  );
}

export default function HomeSlidesManagementPage() {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [revision, setRevision] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [order, setOrder] = useState(0);
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setListError("");
    homeSlidesService
      .list(true)
      .then((items) => {
        if (active) setSlides(sortSlides(items));
      })
      .catch((failure: unknown) => {
        if (active) setListError(errorMessage(failure));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [revision]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Homepage Slides</h1>
        <Link to="/" target="_blank" rel="noopener noreferrer" className={commandClass}>
          <ExternalLink className="h-4 w-4" />
          View homepage
        </Link>
      </header>
      <section
        className="border-y border-[var(--border-color)] py-6"
        aria-labelledby="new-slide-title"
      >
        <h2 id="new-slide-title" className="mb-5 flex items-center gap-2 text-lg font-semibold">
          <ImagePlus className="h-5 w-5" />
          New slide
        </h2>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!file || busy) return;
            setBusy(true);
            setError("");
            setStatus("");
            try {
              const image = uploadedUrl || (await homeSlidesService.upload(file, setProgress));
              setUploadedUrl(image);
              const slide = await homeSlidesService.create({
                image,
                altText: altText.trim(),
                order,
                isPublished: published,
              });
              setSlides((previous) => sortSlides([...previous, slide]));
              setFile(null);
              setUploadedUrl("");
              setAltText("");
              setOrder(Math.min(order + 1, 9999));
              setProgress(0);
              if (fileInput.current) fileInput.current.value = "";
              setStatus(published ? "Slide published." : "Slide saved as draft.");
            } catch (failure) {
              setError(errorMessage(failure));
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset
            disabled={busy || loading || Boolean(listError)}
            className="grid min-w-0 gap-6 lg:grid-cols-2"
          >
            <div className="min-w-0 space-y-4">
              <label className="block text-sm">
                Image (JPEG, PNG or WebP, up to 3 MB)
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className={`${inputClass} file:mr-3 file:cursor-pointer`}
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    setError("");
                    setStatus("");
                    setFile(null);
                    setUploadedUrl("");
                    setProgress(0);
                    if (!selected) return;
                    if (
                      !["image/jpeg", "image/png", "image/webp"].includes(selected.type) ||
                      selected.size > 3 * 1024 * 1024
                    ) {
                      setError("Choose a JPEG, PNG, or WebP image no larger than 3 MB.");
                      event.target.value = "";
                      return;
                    }
                    setFile(selected);
                  }}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="New slide preview"
                  className="aspect-video w-full rounded-md bg-black/5 object-contain"
                />
              )}
            </div>
            <div className="min-w-0 space-y-4">
              <label className="block text-sm">
                Image description
                <input
                  required
                  maxLength={160}
                  value={altText}
                  onChange={(event) => setAltText(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block max-w-40 text-sm">
                Display order
                <input
                  required
                  type="number"
                  min={0}
                  max={9999}
                  step={1}
                  value={order}
                  onChange={(event) => setOrder(event.target.valueAsNumber)}
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
              <button type="submit" disabled={!file} className={commandClass}>
                <Upload className="h-4 w-4" />
                {busy ? `Uploading / saving ${progress}%` : "Add slide"}
              </button>
              {busy && (
                <progress
                  aria-label="Image upload progress"
                  max={100}
                  value={progress}
                  className="block w-full"
                />
              )}
            </div>
          </fieldset>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
          {status && (
            <p role="status" className="mt-4 text-sm">
              {status}
            </p>
          )}
        </form>
      </section>
      <section aria-labelledby="saved-slides-title">
        <h2 id="saved-slides-title" className="text-lg font-semibold">
          Slides ({slides.length})
        </h2>
        {loading && (
          <p role="status" className="py-6 text-sm">
            Loading slides...
          </p>
        )}
        {listError && (
          <div role="alert" className="space-y-3 py-6 text-sm">
            <p>{listError}</p>
            <button
              type="button"
              className={commandClass}
              onClick={() => setRevision((previous) => previous + 1)}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}
        {!loading && !listError && slides.length === 0 && (
          <p className="py-6 text-sm opacity-70">No homepage slides yet.</p>
        )}
        {!loading &&
          !listError &&
          slides.map((slide) => (
            <SlideEditor
              key={slide._id}
              slide={slide}
              onSaved={(saved) =>
                setSlides((previous) =>
                  sortSlides(previous.map((item) => (item._id === saved._id ? saved : item))),
                )
              }
              onRemoved={(id) =>
                setSlides((previous) => previous.filter((item) => item._id !== id))
              }
            />
          ))}
      </section>
    </div>
  );
}
