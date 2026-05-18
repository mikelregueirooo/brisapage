import { Calendar, Clock, MapPin, CalendarPlus, ExternalLink } from "lucide-react";
import type { Event, LineupArtist } from "@/types";

interface Props {
  event: Event;
}

function buildGoogleCalendarUrl(event: Event): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // assume 3h

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.artist} — ${event.title} | El Brisa`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: event.description,
    location: event.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const ROLE_LABEL: Record<LineupArtist["role"], string> = {
  headliner: "HEADLINER",
  support: "SUPPORT",
  opening: "OPENING",
};

const ROLE_COLOR: Record<LineupArtist["role"], string> = {
  headliner: "var(--color-primary)",
  support: "var(--color-accent)",
  opening: "var(--color-text-faint)",
};

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetails({ event }: Props) {
  const calendarUrl = buildGoogleCalendarUrl(event);

  return (
    <section
      className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Detalles del evento"
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: description + lineup */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div>
            <h2
              className="font-display text-2xl sm:text-3xl mb-4"
              style={{ color: "var(--color-text)" }}
            >
              SOBRE EL EVENTO
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {event.description}
            </p>
          </div>

          {/* Lineup timeline */}
          <div>
            <h2
              className="font-display text-2xl sm:text-3xl mb-6"
              style={{ color: "var(--color-text)" }}
            >
              LINEUP
            </h2>
            <ol className="relative" aria-label="Lineup del evento">
              {/* Vertical line */}
              <div
                className="absolute left-[5px] top-2 bottom-2 w-px"
                style={{ backgroundColor: "var(--color-border)" }}
                aria-hidden="true"
              />

              {event.lineup.map((artist, i) => (
                <li
                  key={`${artist.name}-${i}`}
                  className="relative flex items-start gap-4 pb-7 last:pb-0"
                >
                  {/* Dot */}
                  <div
                    className="timeline-dot mt-1.5 shrink-0 relative z-10"
                    style={{ backgroundColor: ROLE_COLOR[artist.role] }}
                    aria-hidden="true"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span
                        className="font-mono-accent text-xs tracking-widest"
                        style={{ color: "var(--color-text-faint)" }}
                      >
                        {artist.time}h
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "transparent",
                          border: `1px solid ${ROLE_COLOR[artist.role]}`,
                          color: ROLE_COLOR[artist.role],
                          padding: "1px 7px",
                          fontSize: "0.65rem",
                        }}
                      >
                        {ROLE_LABEL[artist.role]}
                      </span>
                    </div>
                    <p
                      className="font-display mt-1"
                      style={{
                        fontSize:
                          artist.role === "headliner" ? "1.6rem" : "1.2rem",
                        color: "var(--color-text)",
                      }}
                    >
                      {artist.name}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: info card + CTAs */}
        <aside className="space-y-4">
          {/* Info card */}
          <div
            className="card-surface p-6 space-y-4"
            aria-label="Información del evento"
          >
            <h2
              className="font-display text-xl"
              style={{ color: "var(--color-text)" }}
            >
              INFO
            </h2>

            <InfoRow
              icon={<Calendar size={15} style={{ color: "var(--color-primary)" }} />}
              label="Fecha"
              value={formatFullDate(event.date)}
            />
            <InfoRow
              icon={<Clock size={15} style={{ color: "var(--color-primary)" }} />}
              label="Puertas"
              value={`${event.doors}h`}
            />
            <InfoRow
              icon={<Clock size={15} style={{ color: "var(--color-primary)" }} />}
              label="Actuación"
              value={`${event.showTime}h`}
            />
            <InfoRow
              icon={<MapPin size={15} style={{ color: "var(--color-primary)" }} />}
              label="Lugar"
              value={event.venue}
            />
            <InfoRow
              icon={<MapPin size={15} style={{ color: "var(--color-primary)" }} />}
              label="Entrada"
              value={
                event.isSoldOut
                  ? "Agotado"
                  : event.price === null
                  ? "Entrada libre"
                  : `${event.price}€`
              }
              valueStyle={{
                color:
                  event.isSoldOut
                    ? "var(--color-text-muted)"
                    : event.price === null
                    ? "var(--color-accent)"
                    : "var(--color-text)",
              }}
            />
          </div>

          {/* CTA */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full justify-center text-sm"
            aria-label="Añadir este evento a Google Calendar"
          >
            <CalendarPlus size={15} aria-hidden="true" />
            Añadir a Google Calendar
            <ExternalLink size={12} className="opacity-50" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}

function InfoRow({ icon, label, value, valueStyle }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p
          className="text-[11px] font-mono-accent tracking-widest uppercase"
          style={{ color: "var(--color-text-faint)" }}
        >
          {label}
        </p>
        <p
          className="text-sm mt-0.5 capitalize"
          style={{ color: "var(--color-text)", ...valueStyle }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
