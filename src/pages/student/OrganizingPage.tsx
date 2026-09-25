import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { OrganizingWorkspace } from "@/components/events/OrganizingWorkspace";
import { eventCommitteeService } from "@/services/eventCommittee.service";
import { useThemeStore } from "@/store";
import { Button } from "@/components/ui";

export const OrganizingPage = () => {
  const { id } = useParams();
  const { resolvedTheme } = useThemeStore();
  const [events, setEvents] = useState<Awaited<ReturnType<typeof eventCommitteeService.getMine>>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (id) return;
    let current = true;
    setLoading(true);
    setError(false);
    eventCommitteeService
      .getMine()
      .then((result) => {
        if (current) setEvents(result);
      })
      .catch(() => {
        if (current) setError(true);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [id, version]);
  return (
    <div
      className="admin-workspace flex min-h-screen flex-col bg-[var(--admin-bg)] text-[var(--admin-text)]"
      data-theme={resolvedTheme}
    >
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-12 sm:px-6">
        {id ? (
          <OrganizingWorkspace key={id} mode="chair" />
        ) : (
          <>
            <Link to="/student/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <h1 className="mb-6 text-2xl font-semibold">My organizing events</h1>
            {loading ? (
              <p role="status">Loading assigned events...</p>
            ) : error ? (
              <div role="alert">
                <p>Unable to load assigned events.</p>
                <Button className="mt-4" onClick={() => setVersion((value) => value + 1)}>
                  Retry
                </Button>
              </div>
            ) : events.length === 0 ? (
              <p>No events assigned to you as chair.</p>
            ) : (
              <ul className="divide-y divide-current/15">
                {events.map((event) => (
                  <li key={event._id}>
                    <Link
                      to={`/student/organizing/${event._id}`}
                      className="flex items-center justify-between gap-4 py-5"
                    >
                      <div className="min-w-0">
                        <h2 className="font-semibold break-words">{event.title}</h2>
                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm opacity-70">
                          <Calendar className="h-4 w-4" />{" "}
                          {new Date(event.date).toLocaleDateString()} / {event.location}
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};
