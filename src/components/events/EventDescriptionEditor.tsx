import { useLayoutEffect, useRef, useState } from "react";
import { Bold, Italic, Heading2, List, ListOrdered, Quote, Link, Code, Eye } from "lucide-react";
import { EventDescription } from "./EventDescription";
import { cn } from "@/utils";

const formats = [
  { name: "Bold", icon: Bold, before: "**", after: "**", sample: "Bold text" },
  { name: "Italic", icon: Italic, before: "*", after: "*", sample: "Italic text" },
  { name: "Heading", icon: Heading2, before: "## ", after: "", sample: "Heading", block: true },
  { name: "Bullet list", icon: List, before: "- ", after: "", sample: "List item", block: true },
  {
    name: "Numbered list",
    icon: ListOrdered,
    before: "1. ",
    after: "",
    sample: "List item",
    block: true,
  },
  { name: "Quote", icon: Quote, before: "> ", after: "", sample: "Quote", block: true },
  { name: "Link", icon: Link, before: "[", after: "](https://example.com)", sample: "Link text" },
  { name: "Code", icon: Code, before: "`", after: "`", sample: "code" },
];

export const EventDescriptionEditor = ({
  value,
  onChange,
  isDark,
}: {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}) => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selection = useRef<[number, number] | null>(null);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (selection.current && textarea.current) {
      textarea.current.focus();
      textarea.current.setSelectionRange(...selection.current);
      selection.current = null;
    }
  }, [value]);

  const format = (option: (typeof formats)[number]) => {
    if (!textarea.current) return;
    let start = textarea.current.selectionStart;
    let end = textarea.current.selectionEnd;
    if (option.block) {
      start = value.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = value.indexOf("\n", end);
      end = lineEnd === -1 ? value.length : lineEnd;
    }
    const selected = value.slice(start, end) || option.sample;
    const replacement = option.block
      ? selected
          .split("\n")
          .map(
            (line, index) =>
              `${option.name === "Numbered list" ? `${index + 1}. ` : option.before}${line}`,
          )
          .join("\n")
      : `${option.before}${selected}${option.after}`;
    const next = value.slice(0, start) + replacement + value.slice(end);
    if (next.length > 5000) {
      setError("Description cannot exceed 5,000 characters.");
      return;
    }
    setError(null);
    selection.current =
      option.name === "Link"
        ? [start + option.before.length + selected.length + 2, start + replacement.length - 1]
        : [start + option.before.length, start + replacement.length - option.after.length];
    onChange(next);
  };

  return (
    <div>
      <div role="group" aria-label="Description formatting" className="mb-2 flex flex-wrap gap-1">
        {formats.map((option) => (
          <button
            key={option.name}
            type="button"
            title={option.name}
            aria-label={option.name}
            onClick={() => format(option)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded border focus-visible:outline-2",
              isDark ? "border-slate-600 hover:bg-slate-700" : "border-gray-300 hover:bg-gray-100",
            )}
          >
            <option.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          title="Preview description"
          aria-label="Preview description"
          aria-pressed={preview}
          onClick={() => setPreview(!preview)}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded border focus-visible:outline-2",
            preview
              ? "border-emerald-600 bg-emerald-600 text-white"
              : isDark
                ? "border-slate-600"
                : "border-gray-300",
          )}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
      <textarea
        ref={textarea}
        aria-label="Description"
        required
        minLength={10}
        maxLength={5000}
        value={value}
        onChange={(event) => {
          setError(null);
          onChange(event.target.value);
        }}
        rows={8}
        className={cn(
          "w-full resize-y rounded-lg border px-4 py-3 focus:outline-2",
          isDark
            ? "border-slate-700 bg-slate-800 text-white"
            : "border-gray-200 bg-gray-50 text-gray-900",
        )}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
      {preview && (
        <section aria-label="Description preview" className="mt-4 border-t border-current/20 pt-4">
          <EventDescription>{value}</EventDescription>
        </section>
      )}
    </div>
  );
};
