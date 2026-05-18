"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Event } from "@/types";
import EventCard from "./EventCard";

interface Props {
  events: Event[];
  voteMap?: Record<string, number>;
}

export default function EventsSection({ events, voteMap = {} }: Props) {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="eventos"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
      aria-labelledby="events-heading"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <p
            className="font-mono-accent text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Agenda
          </p>
          <h2
            id="events-heading"
            className="font-display leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--color-text)" }}
          >
            PRÓXIMOS EVENTOS
          </h2>
          <p className="text-base max-w-md" style={{ color: "var(--color-text-muted)" }}>
            Las mejores noches del verano, cada fin de semana frente al mar.
          </p>
        </motion.div>

        {/* Grid */}
        {events.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-text-faint)" }}>
            No hay eventos programados próximamente.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event.slug}
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  delay: shouldReduce ? 0 : i * 0.08,
                }}
              >
                <EventCard event={event} voteCount={voteMap[event.slug] ?? 0} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
