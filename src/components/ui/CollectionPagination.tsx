import { ChevronLeft, ChevronRight } from "lucide-react";

export const CollectionPagination = ({
  page,
  pages,
  onChange,
  disabled = false,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}) =>
  pages > 1 ? (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4 text-sm">
      <button
        type="button"
        aria-label="Previous page"
        title="Previous page"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-color)] disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button
        type="button"
        aria-label="Next page"
        title="Next page"
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-color)] disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  ) : null;
