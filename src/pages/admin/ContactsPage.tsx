// ============================================
// ComES Website - Admin Contacts Page
// ============================================

import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Trash2,
  MessageSquare,
  Archive,
  X,
  Reply,
  RefreshCw,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";
import { Button, Badge } from "@/components/ui";
import { CollectionPagination } from "@/components/ui/CollectionPagination";
import { contactService, type ContactSubmission } from "@/services/contact.service";

const statusFilters = ["new", "read", "replied", "archived"] as const;
const errorMessage = (error: unknown) =>
  (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) ||
  (error instanceof Error ? error.message : "Unable to update contact messages.");

export const ContactsPage = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ContactSubmission["status"] | "">("");
  const [viewingMessage, setViewingMessage] = useState<ContactSubmission | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewingId = viewingMessage?._id;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    void contactService
      .list({
        page,
        limit: 20,
        search: searchQuery.trim() || undefined,
        status: selectedStatus || undefined,
      })
      .then((response) => {
        if (!active) return;
        if (!response.success || !response.data)
          throw new Error(response.message || "Unable to load messages.");
        const { contacts, pagination: next } = response.data;
        if (page > Math.max(1, next.pages)) {
          setPage(Math.max(1, next.pages));
          return;
        }
        setMessages(contacts);
        setPagination(next);
      })
      .catch((error) => {
        if (active) setLoadError(errorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, searchQuery, selectedStatus, revision]);

  useEffect(() => {
    if (!viewingId || !dialogRef.current) return;
    const opener = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      if (opener?.isConnected) opener.focus();
    };
  }, [viewingId]);

  const handleOpen = async (id: string) => {
    if (busy) return;
    setBusy(true);
    setActionError(null);
    try {
      const response = await contactService.get(id);
      if (!response.success || !response.data)
        throw new Error(response.message || "Unable to open message.");
      setViewingMessage(response.data.contact);
      setRevision((value) => value + 1);
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleStatusChange = async (id: string, status: ContactSubmission["status"]) => {
    if (busy) return;
    setBusy(true);
    setActionError(null);
    try {
      const response = await contactService.updateStatus(id, status);
      if (!response.success || !response.data)
        throw new Error(response.message || "Unable to update message.");
      const updated = response.data.contact;
      setViewingMessage((current) => (current?._id === id ? updated : current));
      setRevision((value) => value + 1);
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (busy || !confirm("Are you sure you want to delete this message?")) return;
    setBusy(true);
    setActionError(null);
    try {
      const response = await contactService.remove(id);
      if (!response.success) throw new Error(response.message || "Unable to delete message.");
      setViewingMessage((current) => (current?._id === id ? null : current));
      setRevision((value) => value + 1);
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "primary";
      case "read":
        return "secondary";
      case "replied":
        return "success";
      case "archived":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Contact Messages
          </h1>
          <p className={cn("mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
            {loading
              ? "Loading..."
              : loadError
                ? "Inbox unavailable"
                : `${pagination.total} ${pagination.total === 1 ? "message" : "messages"}`}
          </p>
        </div>
        <button
          type="button"
          aria-label="Refresh messages"
          title="Refresh messages"
          disabled={loading || busy}
          onClick={() => setRevision((value) => value + 1)}
          className="shrink-0 rounded-lg border p-2 disabled:opacity-50"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {actionError && !viewingMessage && (
        <p role="alert" className="text-sm text-red-500">
          {actionError}
        </p>
      )}

      {/* Filters */}
      <div
        className={cn(
          "rounded-2xl border p-4",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2",
                isDark ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              aria-label="Search messages"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={cn(
                "w-full rounded-xl border py-2.5 pr-4 pl-10 transition-colors",
                isDark
                  ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              )}
            />
          </div>
          <select
            aria-label="Filter by status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as typeof selectedStatus);
              setPage(1);
            }}
            className={cn(
              "rounded-xl border px-4 py-2.5 capitalize transition-colors",
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            )}
          >
            <option value="">All Status</option>
            {statusFilters.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div
        className={cn(
          "overflow-hidden rounded-2xl border",
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white",
        )}
      >
        {loading ? (
          <p role="status" className="p-8 text-center">
            Loading messages...
          </p>
        ) : loadError ? (
          <div role="alert" className="space-y-3 p-8 text-center">
            <p>{loadError}</p>
            <Button
              onClick={() => setRevision((value) => value + 1)}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </Button>
          </div>
        ) : messages.length > 0 ? (
          <div className={cn("divide-y", isDark ? "divide-slate-800" : "divide-gray-100")}>
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex flex-col items-start gap-4 p-4 transition-colors sm:flex-row",
                  message.status === "new" && (isDark ? "bg-blue-500/5" : "bg-blue-50/50"),
                  isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50",
                )}
              >
                {/* Content */}
                <button
                  type="button"
                  disabled={busy}
                  aria-label={`Open message: ${message.subject}`}
                  onClick={() => {
                    void handleOpen(message._id);
                  }}
                  className="w-full min-w-0 flex-1 text-left disabled:opacity-50"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "truncate font-medium",
                        message.status === "new"
                          ? isDark
                            ? "text-white"
                            : "text-gray-900"
                          : isDark
                            ? "text-gray-300"
                            : "text-gray-700",
                      )}
                    >
                      {message.name}
                    </span>
                    <Badge
                      variant={
                        getStatusColor(message.status) as
                          | "primary"
                          | "secondary"
                          | "success"
                          | "warning"
                      }
                      size="sm"
                    >
                      {message.status}
                    </Badge>
                  </div>
                  <p
                    className={cn(
                      "truncate font-medium",
                      message.status === "new"
                        ? isDark
                          ? "text-white"
                          : "text-gray-900"
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-600",
                    )}
                  >
                    {message.subject}
                  </p>
                  <p
                    className={cn(
                      "mt-1 truncate text-sm",
                      isDark ? "text-gray-500" : "text-gray-500",
                    )}
                  >
                    {message.message}
                  </p>
                </button>

                {/* Date & Actions */}
                <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
                  <span
                    className={cn(
                      "text-xs whitespace-nowrap",
                      isDark ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {formatDate(message.createdAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Archive message: ${message.subject}`}
                      title="Archive message"
                      disabled={busy || message.status === "archived"}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleStatusChange(message._id, "archived");
                      }}
                      className={cn(
                        "rounded-lg p-1.5 transition-colors",
                        isDark
                          ? "text-gray-500 hover:bg-slate-700"
                          : "text-gray-400 hover:bg-gray-200",
                      )}
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete message: ${message.subject}`}
                      title="Delete message"
                      disabled={busy}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDelete(message._id);
                      }}
                      className={cn(
                        "rounded-lg p-1.5 text-red-500 transition-colors",
                        isDark ? "hover:bg-red-500/10" : "hover:bg-red-50",
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare
              className={cn("mx-auto mb-4 h-12 w-12", isDark ? "text-gray-600" : "text-gray-400")}
            />
            <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
              No messages found
            </p>
          </div>
        )}
      </div>
      {!loadError && (
        <CollectionPagination
          page={page}
          pages={pagination.pages}
          onChange={setPage}
          disabled={loading || busy}
        />
      )}

      {/* Message Viewer Modal */}
      {viewingMessage && (
        <dialog
          ref={dialogRef}
          aria-labelledby="contact-message-title"
          onCancel={() => setViewingMessage(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setViewingMessage(null);
          }}
          className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg border-0 p-0 backdrop:bg-black/50"
          onClick={(event) => {
            if (event.target === event.currentTarget) setViewingMessage(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl",
              isDark ? "bg-slate-900" : "bg-white",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between border-b p-6",
                isDark ? "border-slate-800" : "border-gray-200",
              )}
            >
              <div className="flex items-center gap-3">
                <h2
                  id="contact-message-title"
                  className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}
                >
                  Message Details
                </h2>
                <Badge
                  variant={
                    getStatusColor(viewingMessage.status) as
                      | "primary"
                      | "secondary"
                      | "success"
                      | "warning"
                  }
                >
                  {viewingMessage.status}
                </Badge>
              </div>
              <button
                type="button"
                aria-label="Close message"
                title="Close message"
                onClick={() => setViewingMessage(null)}
                className={cn(
                  "rounded-lg p-2",
                  isDark ? "hover:bg-slate-800" : "hover:bg-gray-100",
                )}
              >
                <X className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 p-6 break-words">
              {actionError && (
                <p role="alert" className="text-sm text-red-500">
                  {actionError}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p
                    className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}
                  >
                    {viewingMessage.name}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    {viewingMessage.email}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  {formatDate(viewingMessage.createdAt)}
                </div>
              </div>

              <div>
                <p className={cn("mb-2 font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                  Subject: {viewingMessage.subject}
                </p>
                <div className={cn("rounded-xl p-4", isDark ? "bg-slate-800" : "bg-gray-50")}>
                  <p
                    className={cn(
                      "whitespace-pre-wrap",
                      isDark ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {viewingMessage.message}
                  </p>
                </div>
              </div>
              <label
                className={cn(
                  "flex flex-wrap items-center gap-3 text-sm",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Message status
                <select
                  value={viewingMessage.status}
                  disabled={busy}
                  onChange={(event) => {
                    void handleStatusChange(
                      viewingMessage._id,
                      event.target.value as ContactSubmission["status"],
                    );
                  }}
                  className={cn(
                    "rounded border p-2 capitalize",
                    isDark ? "border-slate-700 bg-slate-800" : "border-gray-300 bg-white",
                  )}
                >
                  {statusFilters.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Actions */}
            <div
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 border-t p-6",
                isDark ? "border-slate-800" : "border-gray-200",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy || viewingMessage.status === "archived"}
                  onClick={() => {
                    void handleStatusChange(viewingMessage._id, "archived");
                  }}
                >
                  <Archive className="mr-1 h-4 w-4" /> Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    void handleDelete(viewingMessage._id);
                  }}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                href={`mailto:${encodeURIComponent(viewingMessage.email)}?subject=${encodeURIComponent(`Re: ${viewingMessage.subject}`)}`}
              >
                <Reply className="h-4 w-4" /> Reply by email
              </a>
            </div>
          </motion.div>
        </dialog>
      )}
    </div>
  );
};

export default ContactsPage;
