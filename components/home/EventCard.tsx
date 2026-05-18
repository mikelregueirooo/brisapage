"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Flame } from "lucide-react";
import type { Event } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  "Indie": "MÚSICA EN VIVO",
  "Pop": "MÚSICA EN VIVO",
  "Techno": "DJ SET",
  "Minimal": "DJ SET",
  "Flamenco": "ESPECIAL",
  "Fusión": "ESPECIAL",
  "Reggaeton": "FIESTA",
  "Comercial": "FIESTA",
};

function getCategoryLabel(genres: string[]): string {
  for (const g of genres) {
    if (CATEGORY_LABELS[g]) return CATEGORY_LABELS[g];
  }
  return "EVENTO";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  event: Event;
  voteCount?: number;
}

export default function EventCard({ event, voteCount = 0 }: Props) {
  const shouldReduce = useReducedMotion();
  const lowCapacity = event.capacity < 50 && !event.isSoldOut;
  const category = getCategoryLabel(event.genre);

  return (
    <motion.article
      whileHover={
        shouldReduce ? undefined : { y: -8, rotateX: 2, rotateY: -2 }
      }
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      style={{ transformPerspective: 1000 }}
      className="event-card group relative rounded-xl overflow-hidden cursor-pointer flex flex-col"
      tabIndex={0}
      aria-label={`Evento: ${event.title} — ${event.artist}`}
    >
      {/* Image */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={`${event.artist} — ${event.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.95) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="badge badge-primary">{category}</span>
          {lowCapacity && (
            <span className="badge badge-accent">POCAS ENTRADAS</span>
          )}
          {event.isSoldOut && (
            <span
              className="badge"
              style={{ backgroundColor: "var(--color-surface-offset)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
            >
              AGOTADO
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="event-card-body flex flex-col flex-1 p-4 gap-3">
        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Calendar size={12} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
          <span
            className="font-mono-accent text-[11px] tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatDate(event.date)} · {event.showTime}h
          </span>
        </div>

        {/* Artist */}
        <h3
          className="font-display leading-none"
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2rem)",
            color: "var(--color-text)",
          }}
        >
          {event.artist}
        </h3>

        {/* Subtitle */}
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          {event.title}
        </p>

        {/* Venue */}
        <div className="flex items-center gap-1.5">
          <MapPin size={12} style={{ color: "var(--color-text-faint)" }} aria-hidden="true" />
          <span className="text-xs" style={{ color: "var(--color-text-faint)" }}>
            {event.venue}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--color-border)" }}>
          {/* Votes */}
          <div className="flex items-center gap-1.5">
            <Flame size={13} style={{ color: "var(--color-accent)" }} aria-hidden="true" />
            <span
              className="font-mono-accent text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {voteCount} personas van
            </span>
          </div>

          {/* Price */}
          <span
            className="font-mono-accent text-xs font-bold"
            style={{ color: event.price === null ? "var(--color-accent)" : "var(--color-text)" }}
          >
            {event.price === null ? "ENTRADA LIBRE" : `${event.price}€`}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/eventos/${event.slug}`}
          className="btn btn-outline w-full justify-center text-sm mt-1"
          tabIndex={-1}
          aria-label={`Más información sobre ${event.title}`}
        >
          Más Info
        </Link>
      </div>

    </motion.article>
  );
}
