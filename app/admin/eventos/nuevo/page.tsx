import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/EventForm";

export const metadata: Metadata = { title: "Crear Evento" };

export default function NuevoEventoPage() {
  return (
    <div className="p-6 lg:p-8 max-w-screen-xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>
        <h1
          className="font-display text-3xl lg:text-4xl"
          style={{ color: "var(--color-text)" }}
        >
          CREAR EVENTO
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Rellena los datos del nuevo evento para El Brisa
        </p>
      </div>

      <EventForm />
    </div>
  );
}
