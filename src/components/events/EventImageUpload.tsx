import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Crop, RotateCcw, RotateCw, Undo2, Upload, X } from "lucide-react";
import { isAxiosError } from "axios";
import api from "@/services/api";
import { cropImage } from "@/utils/cropImage";
import { cn } from "@/utils";

export const EventImageUpload = ({
  endpoint,
  disabled,
  onChange,
  onBusyChange,
  isDark,
}: {
  endpoint: string;
  disabled: boolean;
  onChange: (url: string) => void;
  onBusyChange: (busy: boolean) => void;
  isDark: boolean;
}) => {
  const [source, setSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState("16:9");
  const [originalRatio, setOriginalRatio] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const aspect =
    ratio === "original"
      ? originalRatio
      : { "16:9": 16 / 9, "4:3": 4 / 3, "1:1": 1, "3:4": 3 / 4 }[ratio]!;

  useEffect(() => {
    onBusyChange(Boolean(source) || uploading);
  }, [source, uploading, onBusyChange]);
  useEffect(
    () => () => {
      if (source) URL.revokeObjectURL(source);
    },
    [source],
  );

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };
  const chooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError(null);
    setUploaded(false);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be 3 MB or smaller.");
      return;
    }
    reset();
    setRatio("16:9");
    setArea(null);
    setSource(URL.createObjectURL(file));
  };

  const upload = async () => {
    if (!source || !area || uploading || disabled) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const blob = await cropImage(source, area, rotation);
      const data = new FormData();
      data.append("image", blob, "event.jpg");
      const response = await api.post<{ data: { url: string } }>(endpoint, data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000,
        onUploadProgress: ({ loaded, total }) => {
          if (total) setProgress(Math.round((loaded / total) * 100));
        },
      });
      onChange(response.data.data.url);
      setSource(null);
      setUploaded(true);
    } catch (failure) {
      setError(
        isAxiosError<{ message?: string }>(failure)
          ? failure.response?.data?.message || "Image upload failed. Please try again."
          : failure instanceof Error
            ? failure.message
            : "Unable to crop this image.",
      );
    } finally {
      setUploading(false);
    }
  };

  const controlClass = cn(
    "flex h-9 min-w-9 items-center justify-center rounded border px-2 disabled:opacity-50",
    isDark ? "border-slate-600 bg-slate-800 text-white" : "border-gray-300 bg-white text-gray-900",
  );
  return (
    <section aria-label="Event image upload" className="min-w-0 space-y-3">
      <label className="block text-sm font-medium">
        Upload event image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled || uploading}
          onChange={chooseFile}
          className="mt-2 block w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border file:border-gray-300 file:px-3 file:py-2"
        />
      </label>
      {source && (
        <fieldset disabled={disabled || uploading} className="min-w-0 space-y-3">
          <legend className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Crop className="h-4 w-4" />
            Crop image
          </legend>
          <div
            className="relative aspect-[4/3] max-h-96 w-full overflow-hidden bg-neutral-950"
            style={uploading ? { pointerEvents: "none" } : undefined}
          >
            <Cropper
              image={source}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropAreaChange={(_percent, pixels) => setArea(pixels)}
              zoomWithScroll={false}
              cropperProps={{ "aria-label": "Image crop area" }}
              mediaProps={{
                alt: "Crop source",
                onError: () => {
                  setSource(null);
                  setError("Unable to open this image. Try another file.");
                },
              }}
              onMediaLoaded={({ naturalWidth, naturalHeight }) => {
                if (naturalWidth * naturalHeight > 24000000) {
                  setSource(null);
                  setError("Choose an image smaller than 24 megapixels.");
                } else setOriginalRatio(naturalWidth / naturalHeight);
              }}
            />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-0 flex-1 text-sm">
              Aspect ratio
              <select
                value={ratio}
                onChange={(event) => {
                  setRatio(event.target.value);
                  setCrop({ x: 0, y: 0 });
                }}
                className={cn(controlClass, "mt-1 w-full")}
              >
                <option value="16:9">Landscape (16:9)</option>
                <option value="4:3">Landscape (4:3)</option>
                <option value="1:1">Square (1:1)</option>
                <option value="3:4">Portrait (3:4)</option>
                <option value="original">Original</option>
              </select>
            </label>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                title="Rotate left"
                aria-label="Rotate left"
                onClick={() => setRotation((value) => (value + 270) % 360)}
                className={controlClass}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Rotate right"
                aria-label="Rotate right"
                onClick={() => setRotation((value) => (value + 90) % 360)}
                className={controlClass}
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Reset crop"
                aria-label="Reset crop"
                onClick={() => {
                  reset();
                  setRatio("16:9");
                }}
                className={controlClass}
              >
                <Undo2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <label className="block text-sm">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 block w-full accent-emerald-600"
            />
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setSource(null);
                setError(null);
              }}
              className={cn(controlClass, "gap-2")}
            >
              <X className="h-4 w-4" />
              Cancel crop
            </button>
            <button
              type="button"
              onClick={upload}
              disabled={!area || uploading}
              className="flex min-h-9 items-center justify-center gap-2 rounded bg-emerald-700 px-3 text-sm text-white disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Crop &amp; upload
            </button>
          </div>
        </fieldset>
      )}
      {uploading && (
        <div role="status" className="text-sm">
          <progress
            aria-label="Event image upload progress"
            value={progress}
            max={100}
            className="w-full"
          />
          {progress < 100 ? `Uploading image... ${progress}%` : "Processing image..."}
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
      {uploaded && (
        <p role="status" className="text-sm text-emerald-600">
          Image uploaded
        </p>
      )}
    </section>
  );
};
