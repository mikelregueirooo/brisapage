import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { getEventBySlug } from "@/lib/events";
import { getRegistrations } from "@/lib/registrations";
import { getVotes } from "@/lib/votes";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

interface Props { params: { slug: string } }

export function generateMetadata({ params }: Props): Metadata {
  const event = getEventBySlug(params.slug);
  return { title: event ? `Editar — ${event.artist}` : "No encontrado" };
}

export default function EditEventPage({ params }: Props) {
  const event = getEventBySlug(params.slug);
  if (!event) notFound();

  const votes = getVotes(event.slug);
  const totalVotes = votes.yes + votes.maybe + votes.no;
  const registrations = event.allowsRegistration ? getRegistrations(event.slug) : [];

  return (
    <div className="p-6 lg:p-8 max-w-screen-xl">
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={14} /> Volver al dashboard
        </Link>
        <h1 className="font-display text-3xl lg:text-4xl" style={{ color: "var(--color-text)" }}>
          EDITAR EVENTO
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          {event.artist} — {event.title}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
          <span style={{ color: "var(--color-accent)" }}>🔥</span>
          <span><strong style={{ color: "var(--color-text)" }}>{totalVotes}</strong> votos</span>
        </div>
        {event.allowsRegistration && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
            <Users size={12} style={{ color: "#60a5fa" }} />
            <span><strong style={{ color: "var(--color-text)" }}>{registrations.length}</strong> inscritos</span>
          </div>
        )}
      </div>

      <EventForm initialEvent={event} />

      {event.allowsRegistration && registrations.length > 0 && (
        <section className="mt-10">
          <div className="card-surface overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <Users size={15} style={{ color: "#60a5fa" }} />
              <h2 className="font-display text-lg" style={{ color: "var(--color-text)" }}>
                INSCRITOS ({registrations.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Nombre", "Email", "Fecha"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-mono-accent text-[10px] tracking-widest uppercase"
                        style={{ color: "var(--color-text-faint)" }} scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r, i) => (
                    <tr key={`${r.email}-${i}`} style={{ borderBottom: "1px solid var(--color-border)" }}
                      className="hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 font-medium" style={{ color: "var(--color-text)" }}>{r.name}</td>
                      <td className="px-4 py-2.5 font-mono-accent text-xs" style={{ color: "var(--color-text-muted)" }}>{r.email}</td>
                      <td className="px-4 py-2.5 font-mono-accent text-xs" style={{ color: "var(--color-text-faint)" }}>
                        {new Date(r.registeredAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
