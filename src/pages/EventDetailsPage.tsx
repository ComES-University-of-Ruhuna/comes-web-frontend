import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { isAxiosError } from "axios";
import { ArrowLeft, Calendar, Clock, MapPin, RotateCw, Ticket, Users } from "lucide-react";
import { Badge, Button, Section } from "@/components/ui";
import { EventCommitteeTable } from "@/components/events/EventCommitteeTable";
import { EventDescription } from "@/components/events/EventDescription";
import { eventsService, getEventRegistrationLink, type ApiEvent } from "@/services/events.service";
import { useThemeStore } from "@/store";

export const EventDetailsPage = () => {
  const { slug } = useParams();
  const { resolvedTheme } = useThemeStore();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setEvent(null);
    setError(null);
    setNotFound(false);
    eventsService
      .getBySlug(slug || "")
      .then((response) => {
        if (!active) return;
        if (!response.success || !response.data?.event) throw new Error("Event unavailable");
        setEvent(response.data.event);
      })
      .catch((failure: unknown) => {
        if (!active) return;
        const missing = isAxiosError(failure) && failure.response?.status === 404;
        setNotFound(missing);
        setError(missing ? "Event not found" : "Unable to load this event. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  const full = Boolean(event?.maxParticipants && event.registeredCount >= event.maxParticipants);
  const registrationLink = event ? getEventRegistrationLink(event) : undefined;
  const registrationOpen = Boolean(
    event &&
      event.status === "upcoming" &&
      event.isRegistrationOpen &&
      new Date(event.date) > new Date() &&
      !full &&
      registrationLink,
  );

  return (
    <Section background={resolvedTheme === "dark" ? "dark" : "white"}>
      <div className="mx-auto max-w-5xl [overflow-wrap:anywhere]">
        <Link to="/events" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" />
          All events
        </Link>
        {loading ? (
          <p role="status">Loading event...</p>
        ) : error ? (
          <div role="alert">
            <h1 className="mb-4 text-2xl font-bold">{error}</h1>
            {!notFound && (
              <Button
                variant="outline"
                onClick={() => setAttempt(attempt + 1)}
                icon={<RotateCw className="h-4 w-4" />}
              >
                Retry
              </Button>
            )}
          </div>
        ) : (
          event && (
            <article>
              <header className="mb-8">
                <div className="mb-4 flex flex-wrap gap-2 capitalize">
                  <Badge variant="secondary">{event.type}</Badge>
                  <Badge variant="secondary">{event.status}</Badge>
                </div>
                <h1 className="text-3xl leading-tight font-bold md:text-4xl">{event.title}</h1>
              </header>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="mb-8 max-h-[36rem] w-full rounded-lg object-contain"
                />
              )}
              <dl className="mb-8 grid gap-6 border-y border-current/15 py-6 sm:grid-cols-2">
                <div>
                  <dt className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="h-4 w-4" />
                    Starts
                  </dt>
                  <dd>
                    <time dateTime={event.date}>{new Date(event.date).toLocaleString()}</time>
                  </dd>
                </div>
                {event.endDate && (
                  <div>
                    <dt className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-4 w-4" />
                      Ends
                    </dt>
                    <dd>
                      <time dateTime={event.endDate}>
                        {new Date(event.endDate).toLocaleString()}
                      </time>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4" />
                    Location
                  </dt>
                  <dd>{event.location}</dd>
                </div>
                <div>
                  <dt className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Users className="h-4 w-4" />
                    Registrations
                  </dt>
                  <dd>
                    {event.registeredCount}
                    {event.maxParticipants ? ` / ${event.maxParticipants}` : ""} registered
                  </dd>
                </div>
              </dl>
              <section aria-labelledby="event-description">
                <h2 id="event-description" className="mb-4 text-xl font-bold">
                  About the Event
                </h2>
                <EventDescription>{event.description}</EventDescription>
                {!!event.tags?.length && (
                  <ul className="mt-5 flex flex-wrap gap-3 text-sm" aria-label="Event tags">
                    {event.tags.map((tag) => (
                      <li key={tag}>#{tag}</li>
                    ))}
                  </ul>
                )}
              </section>
              <div className="my-8">
                {registrationOpen ? (
                  <Button
                    href={registrationLink}
                    external={event.registrationMode === "custom"}
                    icon={<Ticket className="h-4 w-4" />}
                  >
                    View Registration
                  </Button>
                ) : (
                  <p className="font-semibold">
                    {event.status === "cancelled"
                      ? "Event Cancelled"
                      : full && event.status === "upcoming"
                        ? "Registration Full"
                        : "Registration Closed"}
                  </p>
                )}
              </div>
              <EventCommitteeTable
                key={event._id}
                eventId={event._id}
                title={event.title}
                defaultOpen
              />
            </article>
          )
        )}
      </div>
    </Section>
  );
};
