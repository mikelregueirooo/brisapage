import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getEvents } from "@/lib/events";
import { getVotes } from "@/lib/votes";
import { getRegistrationCount } from "@/lib/registrations";
import StatsCards from "@/components/admin/StatsCards";
import EventsTable from "@/components/admin/EventsTable";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const events = await getEvents();

  const enriched = await Promise.all(
    events.map(async (e) => {
      const v = await getVotes(e.slug);
      return {
        ...e,
        voteTotal: v.yes + v.maybe + v.no,
        registrationCount: e.allowsRegistration
          ? await getRegistrationCount(e.slug)
          : 0,
      };
    })
  );

  const totalVotes = enriched.reduce((acc, e) => acc + e.voteTotal, 0);
  const totalRegistrations = enriched.reduce((acc, e) => acc + e.registrationCount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-screen-xl">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1
            className="font-display text-3xl lg:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            DASHBOARD
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Panel de administración de El Brisa
          </p>
        </div>
        <Link href="/admin/eventos/nuevo" className="btn btn-primary">
          <PlusCircle size={16} aria-hidden="true" />
          Nuevo Evento
        </Link>
      </div>

      <StatsCards
        totalEvents={events.length}
        totalVotes={totalVotes}
        totalRegistrations={totalRegistrations}
      />

      <div className="mb-4">
        <h2 className="font-display text-xl" style={{ color: "var(--color-text)" }}>
          EVENTOS
        </h2>
      </div>
      <EventsTable events={enriched} />

      <p className="mt-6 text-xs" style={{ color: "var(--color-text-faint)" }}>
        Los datos se persisten en SQLite (prisma/dev.db).
        Añade autenticación antes de desplegar en producción.
      </p>
    </div>
  );
}
