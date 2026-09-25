import { useEffect, useId, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Edit,
  MapPin,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useThemeStore } from "@/store";
import { Button } from "@/components/ui";
import { EventEditor } from "@/pages/admin/EventsManagementPage";
import { cn } from "@/utils";
import {
  eventCommitteeService,
  type CommitteeAssignment,
  type CommitteeMemberProfile,
  type OrganizedEvent,
  type OrganizingMode,
} from "@/services/eventCommittee.service";

const CommitteeRow = ({
  entry,
  admin,
  busy,
  inputClass,
  onAssignment,
  onContributions,
  onRemove,
}: {
  entry: CommitteeAssignment;
  admin: boolean;
  busy: boolean;
  inputClass: string;
  onAssignment: (assignment: Pick<CommitteeAssignment, "role" | "team" | "isChair">) => void;
  onContributions: (notes: string) => void;
  onRemove: () => void;
}) => {
  const fieldId = useId();
  const [role, setRole] = useState(entry.role);
  const [team, setTeam] = useState(entry.team);
  const [isChair, setIsChair] = useState(entry.isChair);
  const [contributions, setContributions] = useState(entry.contributions);
  useEffect(() => setRole(entry.role), [entry.role]);
  useEffect(() => setTeam(entry.team), [entry.team]);
  useEffect(() => setIsChair(entry.isChair), [entry.isChair]);
  useEffect(() => setContributions(entry.contributions), [entry.contributions]);

  return (
    <article className="min-w-0 border-b border-current/15 py-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 font-semibold">
            {entry.member.name}
            {entry.isChair && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                <ShieldCheck className="h-4 w-4" /> Chair
              </span>
            )}
          </h3>
          <p className="mt-1 text-sm opacity-70">{entry.member.registrationNo}</p>
          {!admin && (
            <p className="mt-2 text-sm">
              {entry.role} / {entry.team}
            </p>
          )}
        </div>
        {admin && (
          <button
            type="button"
            title={`Remove ${entry.member.name}`}
            aria-label={`Remove ${entry.member.name}`}
            disabled={busy}
            onClick={onRemove}
            className="shrink-0 rounded-md p-2 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {admin && (
        <form
          className="mb-5"
          onSubmit={(event) => {
            event.preventDefault();
            onAssignment({ role, team, isChair });
          }}
        >
          <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Role
              <input
                aria-label={`Role for ${entry.member.name}`}
                required
                maxLength={100}
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm">
              Team
              <input
                aria-label={`Team for ${entry.member.name}`}
                required
                maxLength={100}
                value={team}
                onChange={(event) => setTeam(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isChair}
                onChange={(event) => setIsChair(event.target.checked)}
                aria-label={`Chair access for ${entry.member.name}`}
              />{" "}
              Chair access
            </label>
            <Button type="submit" variant="outline" size="sm" icon={<Save className="h-4 w-4" />}>
              Save assignment
            </Button>
          </fieldset>
        </form>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onContributions(contributions);
        }}
      >
        <fieldset disabled={busy}>
          <label htmlFor={`${fieldId}-contributions`} className="text-sm font-medium">
            Contributions
          </label>
          <textarea
            id={`${fieldId}-contributions`}
            aria-label={`Contributions for ${entry.member.name}`}
            value={contributions}
            onChange={(event) => setContributions(event.target.value)}
            maxLength={5000}
            rows={4}
            className={inputClass}
          />
          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" icon={<Save className="h-4 w-4" />}>
              Save contributions
            </Button>
          </div>
        </fieldset>
      </form>
    </article>
  );
};

export const OrganizingWorkspace = ({ mode }: { mode: OrganizingMode }) => {
  const { id } = useParams<{ id: string }>();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const admin = mode === "admin";
  const [event, setEvent] = useState<OrganizedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadVersion, setLoadVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<CommitteeMemberProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<CommitteeMemberProfile | null>(null);
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [isChair, setIsChair] = useState(false);
  const inputClass = cn(
    "mt-2 block w-full min-w-0 rounded-md border px-3 py-2 text-sm",
    isDark ? "border-slate-700 bg-slate-900 text-white" : "border-gray-300 bg-white text-gray-900",
  );

  useEffect(() => {
    let current = true;
    setEvent(null);
    setLoading(true);
    setError(null);
    if (id)
      eventCommitteeService
        .getEvent(id, mode)
        .then((result) => {
          if (current) setEvent(result);
        })
        .catch(() => {
          if (current) setError("Event unavailable or you no longer have permission to manage it.");
        })
        .finally(() => {
          if (current) setLoading(false);
        });
    return () => {
      current = false;
    };
  }, [id, mode, loadVersion]);

  useEffect(() => {
    let current = true;
    setMembers([]);
    setSearchError(null);
    if (!admin || search.trim().length < 2) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      eventCommitteeService
        .searchMembers(search.trim())
        .then((results) => {
          if (current) setMembers(results);
        })
        .catch(() => {
          if (current) setSearchError("Member search failed. Please try again.");
        })
        .finally(() => {
          if (current) setSearching(false);
        });
    }, 300);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [search, admin]);

  const mutate = async (
    operation: () => Promise<OrganizedEvent>,
    message: string,
    onSuccess?: () => void,
  ) => {
    setBusy(true);
    setError(null);
    setNotice("");
    try {
      setEvent(await operation());
      setNotice(message);
      onSuccess?.();
    } catch {
      setError("Unable to save. Your changes have been kept; check your access and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <p role="status" className="py-8">
        Loading organizing committee...
      </p>
    );
  if (!event || !id)
    return (
      <div className="space-y-4">
        <p role="alert">{error || "Event not found."}</p>
        <Button onClick={() => setLoadVersion((value) => value + 1)}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <Link
        to={admin ? "/admin/events" : "/student/organizing"}
        className="inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> {admin ? "Events" : "My organizing events"}
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-sm opacity-70">Organizing Committee</p>
          <h1 className="text-2xl font-semibold break-words">{event.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm opacity-70">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(event.date).toLocaleString()}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          </div>
        </div>
        <Button
          disabled={busy}
          onClick={() => setEditing(true)}
          size="sm"
          variant="outline"
          icon={<Edit className="h-4 w-4" />}
        >
          Edit event details
        </Button>
      </header>
      <p className="text-sm break-words whitespace-pre-wrap opacity-80">{event.description}</p>
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-emerald-600">
          {notice}
        </p>
      )}
      {admin && (
        <section className="border-y border-current/15 py-5">
          <h2 className="mb-3 text-lg font-semibold">Add OC member</h2>
          {!selectedMember ? (
            <>
              <label htmlFor="committee-member-search" className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4" /> Search members
              </label>
              <input
                id="committee-member-search"
                type="search"
                maxLength={100}
                value={search}
                onChange={(input) => setSearch(input.target.value)}
                placeholder="Name, registration number, or username"
                className={inputClass}
                disabled={busy}
              />
              {searching && (
                <p role="status" className="mt-3 text-sm">
                  Searching members...
                </p>
              )}
              {searchError && (
                <p role="alert" className="mt-3 text-sm text-red-500">
                  {searchError}
                </p>
              )}
              {!searching && !searchError && search.trim().length >= 2 && members.length === 0 && (
                <p className="mt-3 text-sm">No matching members.</p>
              )}
              <ul className="mt-3 max-h-64 divide-y divide-current/15 overflow-y-auto">
                {members.map((member) => {
                  const assigned = event.organizingCommittee.some(
                    (entry) => entry.member?._id === member._id,
                  );
                  return (
                    <li key={member._id}>
                      <button
                        type="button"
                        disabled={assigned || busy}
                        onClick={() => {
                          setSelectedMember(member);
                          setRole("");
                          setTeam("");
                          setIsChair(false);
                        }}
                        className="flex w-full items-center justify-between gap-3 py-3 text-left disabled:opacity-50"
                      >
                        <span className="min-w-0 break-words">
                          <span className="block font-medium">{member.name}</span>
                          <span className="text-sm opacity-70">{member.registrationNo}</span>
                        </span>
                        {assigned ? (
                          <span className="text-xs">Added</span>
                        ) : (
                          <UserPlus className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <form
              onSubmit={(submit) => {
                submit.preventDefault();
                void mutate(
                  () =>
                    eventCommitteeService.saveAssignment(id, selectedMember._id, {
                      role,
                      team,
                      isChair,
                    }),
                  "OC member added.",
                  () => {
                    setSelectedMember(null);
                    setSearch("");
                  },
                );
              }}
            >
              <fieldset disabled={busy} className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {selectedMember.name}{" "}
                    <span className="text-sm opacity-70">{selectedMember.registrationNo}</span>
                  </p>
                  <button
                    type="button"
                    aria-label="Cancel member selection"
                    title="Cancel member selection"
                    onClick={() => setSelectedMember(null)}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    Role
                    <input
                      required
                      maxLength={100}
                      value={role}
                      onChange={(input) => setRole(input.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm">
                    Team
                    <input
                      required
                      maxLength={100}
                      value={team}
                      onChange={(input) => setTeam(input.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isChair}
                    onChange={(input) => setIsChair(input.target.checked)}
                  />{" "}
                  Chair access
                </label>
                <Button type="submit" size="sm" icon={<UserPlus className="h-4 w-4" />}>
                  {busy ? "Adding..." : "Add member"}
                </Button>
              </fieldset>
            </form>
          )}
        </section>
      )}
      <section>
        <h2 className="text-lg font-semibold">
          Committee members{" "}
          <span className="text-sm font-normal opacity-70">
            ({event.organizingCommittee.length})
          </span>
        </h2>
        {event.organizingCommittee.length === 0 && (
          <p className="py-8 text-sm opacity-70">No organizing committee members assigned.</p>
        )}
        {event.organizingCommittee.map((entry) =>
          entry.member ? (
            <CommitteeRow
              key={entry.member._id}
              entry={entry}
              admin={admin}
              busy={busy}
              inputClass={inputClass}
              onAssignment={(assignment) =>
                void mutate(
                  () => eventCommitteeService.saveAssignment(id, entry.member._id, assignment),
                  "Assignment saved.",
                )
              }
              onContributions={(notes) =>
                void mutate(
                  () => eventCommitteeService.saveContributions(id, entry.member._id, notes, mode),
                  "Contributions saved.",
                )
              }
              onRemove={() => {
                if (
                  window.confirm(
                    `Remove ${entry.member.name} from this committee? Chair access will also be revoked.`,
                  )
                )
                  void mutate(
                    () => eventCommitteeService.removeMember(id, entry.member._id),
                    "OC member removed.",
                  );
              }}
            />
          ) : (
            <p key="deleted-member" className="py-4 text-sm">
              A committee member's account is no longer available.
            </p>
          ),
        )}
      </section>
      {editing && (
        <EventEditor
          event={event}
          imageUploadEndpoint={admin ? "/events/image" : `/students/organized-events/${id}/image`}
          onClose={() => setEditing(false)}
          onSave={async (details) => {
            if (!admin) delete details.isFeatured;
            await eventCommitteeService.saveDetails(id, details, mode);
            setEvent(await eventCommitteeService.getEvent(id, mode));
            setEditing(false);
            setNotice("Event details saved.");
          }}
        />
      )}
    </div>
  );
};
