import Image from "next/image";
import type { Event } from "@/types";
import Countdown from "./Countdown";

interface Props {
  event: Event;
}

export default function EventHero({ event }: Props) {
  return (
    <section
      className="relative min-h-[70vh] flex items-end overflow-hidden"
      aria-labelledby="event-hero-heading"
    >
      {/* Full-bleed image */}
      <Image
        src={event.imageUrl}
        alt={`${event.artist} — ${event.title}`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-10 lg:pb-16 max-w-screen-xl mx-auto">
        {/* Genre badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.genre.map((g) => (
            <span key={g} className="badge badge-surface">
              {g}
            </span>
          ))}
        </div>

        {/* Artist name */}
        <h1
          id="event-hero-heading"
          className="font-display leading-none mb-3"
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            color: "var(--color-text)",
          }}
        >
          {event.artist}
        </h1>

        {/* Event title */}
        <p
          className="text-base sm:text-lg mb-8 font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          {event.title}
        </p>

        {/* Countdown */}
        <div>
          <p
            className="font-mono-accent text-[10px] tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--color-text-faint)" }}
          >
            Cuenta atrás
          </p>
          <Countdown targetDate={event.date} />
        </div>
      </div>
    </section>
  );
}
