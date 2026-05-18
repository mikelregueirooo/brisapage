"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, Users, Loader2 } from "lucide-react";
import type { Event } from "@/types";

interface EnrichedEvent extends Event {
  voteTotal: number;
  registrationCount: number;
}

interface Props {
  events: EnrichedEvent[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventsTable({ events }: Props) {
  const router = useRouter();
  const [isPending, startDelete] = useTransition();
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  const handleDelete = (slug: string) => {
    startDelete(async () => {
      await fetch(`/api/admin/events/${slug}`, { method: "DELETE" });
      setConfirmSlug(null);
      router.refresh();
    });
  };

  if (events.length === 0) {
    return (
      <div
        className="card-surface p-12 text-center"
        style={{ color: "var(--color-text-muted)" }}
      >
        <p className="text-sm">No hay eventos. Crea el primero.</p>
        <Link href="/admin/eventos/nuevo" className="btn btn-primary mt-4 inline-flex">
          Crear Evento
        </Link>
      </div>
    );
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Lista de eventos">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {["Evento", "Fecha", "Precio", "Cap.", "Votos", "Inscritos", "Acciones"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-mono-accent text-[10px] tracking-widest uppercase"
                    style={{ color: "var(--color-text-faint)" }}
                    scope="col"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.slug}
                style={{ borderBottom: "1px solid var(--color-border)" }}
                className="transition-colors hover:bg-white/[0.02]"
              >
                {/* Evento */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {event.imageUrl && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={event.imageUrl}
                          alt={event.artist}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className="font-medium truncate max-w-[160px]"
                        style={{ color: "var(--color-text)" }}
                      >
                        {event.artist}
                      </p>
                      <p
                        className="text-xs truncate max-w-[160px]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {event.title}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Fecha */}
                <td
                  className="px-4 py-3 font-mono-accent text-xs whitespace-nowrap"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatDate(event.date)}
                </td>

                {/* Precio */}
                <td
                  className="px-4 py-3 font-mono-accent text-xs"
                  style={{
                    color:
                      event.price === null
                        ? "var(--color-accent)"
                        : "var(--color-text)",
                  }}
                >
                  {event.price === null ? "Libre" : `${event.price}€`}
                </td>

                {/* Capacidad */}
                <td
                  className="px-4 py-3 font-mono-accent text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {event.capacity}
                </td>

                {/* Votos */}
                <td
                  className="px-4 py-3 font-mono-accent text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {event.voteTotal}
                </td>

                {/* Inscritos */}
                <td
                  className="px-4 py-3 font-mono-accent text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {event.allowsRegistration ? (
                    <span className="flex items-center gap-1">
                      <Users size={11} style={{ color: "#60a5fa" }} />
                      {event.registrationCount}
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-text-faint)" }}>—</span>
                  )}
                </td>

                {/* Acciones */}
                <td className="px-4 py-3">
                  {confirmSlug === event.slug ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        ¿Eliminar?
                      </span>
                      <button
                        onClick={() => handleDelete(event.slug)}
                        disabled={isPending}
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{ color: "var(--color-primary)", backgroundColor: "rgba(224,29,44,0.1)" }}
                        aria-label="Confirmar eliminación"
                      >
                        {isPending ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          "Sí"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmSlug(null)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ color: "var(--color-text-muted)" }}
                        aria-label="Cancelar eliminación"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/eventos/${event.slug}`}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: "var(--color-text-faint)" }}
                        aria-label={`Ver evento ${event.title}`}
                        target="_blank"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/eventos/${event.slug}`}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: "var(--color-text-muted)" }}
                        aria-label={`Editar evento ${event.title}`}
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setConfirmSlug(event.slug)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: "var(--color-text-muted)" }}
                        aria-label={`Eliminar evento ${event.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
