import { useEffect, useState } from "react";
import { RotateCw, Users } from "lucide-react";
import { eventsService, type PublicCommitteeMember } from "@/services/events.service";

export const EventCommitteeTable = ({
  eventId,
  title,
  defaultOpen = false,
}: {
  eventId: string;
  title: string;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [members, setMembers] = useState<PublicCommitteeMember[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setMembers(null);
    setError(false);
    eventsService
      .getOrganizers(eventId)
      .then((result) => {
        if (active) setMembers(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [eventId, open, attempt]);

  return (
    <details
      open={open}
      className="mt-4 min-w-0 border-t border-current/15 pt-3"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">
        <Users className="mr-2 inline-block h-4 w-4" aria-hidden="true" />
        Organizing Committee
      </summary>
      {open && (
        <div className="mt-3">
          {error ? (
            <div role="alert" className="text-sm">
              <p>Unable to load organizing committee.</p>
              <button
                type="button"
                onClick={() => setAttempt(attempt + 1)}
                className="mt-2 inline-flex items-center gap-2 underline"
              >
                <RotateCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          ) : members === null ? (
            <p role="status" className="text-sm">
              Loading organizing committee...
            </p>
          ) : members.length === 0 ? (
            <p className="text-sm">Organizing committee will be announced soon.</p>
          ) : (
            <table
              className="w-full table-fixed border-collapse text-left text-sm"
              aria-label={`${title} organizing committee`}
            >
              <thead>
                <tr>
                  {["Name", "Role", "Team"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="border-b border-current/15 px-2 py-2 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={`${member.name}-${index}`}>
                    {[member.name, member.role, member.team].map((value, column) => (
                      <td
                        key={column}
                        className="border-b border-current/10 px-2 py-3 align-top [overflow-wrap:anywhere] break-words"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </details>
  );
};
