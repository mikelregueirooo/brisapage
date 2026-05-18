"use client";

import { useState, useId, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Loader2, GripVertical, ArrowLeft } from "lucide-react";
import type { Event, LineupArtist } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LineupRow {
  id: string;
  name: string;
  time: string;
  role: LineupArtist["role"];
}

interface FormValues {
  title: string;
  artist: string;
  date: string;       // datetime-local "2026-06-14T23:00"
  doors: string;
  showTime: string;
  venue: string;
  genres: string;     // comma-separated
  description: string;
  freeEntry: boolean;
  price: string;
  capacity: string;
  isSoldOut: boolean;
  imageUrl: string;
  allowsRegistration: boolean;
  lineup: LineupRow[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function isoToLocal(iso: string): string {
  // "2026-06-14T23:00:00" → "2026-06-14T23:00"
  return iso.slice(0, 16);
}

function localToIso(local: string): string {
  return local.length === 16 ? `${local}:00` : local;
}

function eventToForm(event: Event): FormValues {
  return {
    title: event.title,
    artist: event.artist,
    date: isoToLocal(event.date),
    doors: event.doors,
    showTime: event.showTime,
    venue: event.venue,
    genres: event.genre.join(", "),
    description: event.description,
    freeEntry: event.price === null,
    price: event.price !== null ? String(event.price) : "",
    capacity: String(event.capacity),
    isSoldOut: event.isSoldOut,
    imageUrl: event.imageUrl,
    allowsRegistration: event.allowsRegistration ?? false,
    lineup: event.lineup.map((l) => ({ ...l, id: crypto.randomUUID() })),
  };
}

const blankForm: FormValues = {
  title: "",
  artist: "",
  date: "",
  doors: "22:00",
  showTime: "23:00",
  venue: "El Brisa — Terraza Principal",
  genres: "",
  description: "",
  freeEntry: false,
  price: "",
  capacity: "200",
  isSoldOut: false,
  imageUrl: "",
  allowsRegistration: false,
  lineup: [{ id: crypto.randomUUID(), name: "", time: "22:00", role: "opening" }],
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-mono-accent text-[10px] tracking-widest uppercase"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-primary)" }} aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200";
const inputStyle = {
  backgroundColor: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
};

function useInputHandlers() {
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--color-primary)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-glow)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--color-border)";
    e.currentTarget.style.boxShadow = "none";
  };
  return { onFocus, onBlur };
}

// ─── Main component ────────────────────────────────────────────────────────────
interface Props {
  initialEvent?: Event;   // undefined = create mode
}

export default function EventForm({ initialEvent }: Props) {
  const router = useRouter();
  const isEdit = !!initialEvent;
  const { onFocus, onBlur } = useInputHandlers();

  const [values, setValues] = useState<FormValues>(
    initialEvent ? eventToForm(initialEvent) : blankForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Field updater ──────────────────────────────────────────────────────────
  const set = useCallback(
    <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
      setValues((v) => ({ ...v, [key]: value })),
    []
  );

  const input = (key: keyof FormValues, type = "text") => ({
    type,
    value: values[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      set(key, e.target.value as FormValues[typeof key]),
    className: inputCls,
    style: inputStyle,
    onFocus,
    onBlur,
  });

  // ── Lineup helpers ─────────────────────────────────────────────────────────
  const addLineupRow = () =>
    set("lineup", [
      ...values.lineup,
      { id: crypto.randomUUID(), name: "", time: "22:00", role: "opening" as const },
    ]);

  const removeLineupRow = (id: string) =>
    set("lineup", values.lineup.filter((r) => r.id !== id));

  const updateLineupRow = (id: string, key: keyof LineupRow, value: string) =>
    set(
      "lineup",
      values.lineup.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const body = {
      title: values.title.trim(),
      artist: values.artist.trim(),
      date: localToIso(values.date),
      doors: values.doors,
      showTime: values.showTime,
      venue: values.venue.trim(),
      genre: values.genres.split(",").map((g) => g.trim()).filter(Boolean),
      description: values.description.trim(),
      price: values.freeEntry ? null : Number(values.price) || null,
      capacity: Number(values.capacity) || 0,
      isSoldOut: values.isSoldOut,
      imageUrl: values.imageUrl.trim(),
      allowsRegistration: values.allowsRegistration,
      lineup: values.lineup
        .filter((r) => r.name.trim())
        .map(({ id: _id, ...rest }) => rest),
    };

    try {
      const url = isEdit
        ? `/api/admin/events/${initialEvent!.slug}`
        : "/api/admin/events";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ── Left: main fields (2 cols on xl) ── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Row: artist + title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Artista" required>
              <input {...input("artist")} placeholder="Nombre del artista" required />
            </Field>
            <Field label="Título del evento" required>
              <input {...input("title")} placeholder="Ej: Noche de Verano" required />
            </Field>
          </div>

          {/* Row: date + doors + showTime */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Fecha y hora" required>
              <input {...input("date", "datetime-local")} required />
            </Field>
            <Field label="Apertura puertas">
              <input {...input("doors", "time")} />
            </Field>
            <Field label="Hora de actuación">
              <input {...input("showTime", "time")} />
            </Field>
          </div>

          {/* Venue */}
          <Field label="Lugar">
            <input {...input("venue")} placeholder="Ej: El Brisa — Terraza Principal" />
          </Field>

          {/* Genres */}
          <Field label="Géneros" hint="Separados por coma: Techno, Minimal">
            <input {...input("genres")} placeholder="Indie, Pop" />
          </Field>

          {/* Description */}
          <Field label="Descripción" required>
            <textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe el evento..."
              rows={4}
              className={inputCls}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={onFocus}
              onBlur={onBlur}
              required
            />
          </Field>

          {/* Price row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Entrada libre">
              <label className="flex items-center gap-2 cursor-pointer mt-1.5">
                <input
                  type="checkbox"
                  checked={values.freeEntry}
                  onChange={(e) => set("freeEntry", e.target.checked)}
                  className="w-4 h-4 rounded accent-red-600"
                />
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Sí, gratis
                </span>
              </label>
            </Field>
            <Field label="Precio (€)">
              <input
                {...input("price", "number")}
                placeholder="15"
                min="0"
                step="0.5"
                disabled={values.freeEntry}
                style={{
                  ...inputStyle,
                  opacity: values.freeEntry ? 0.4 : 1,
                }}
              />
            </Field>
            <Field label="Capacidad">
              <input {...input("capacity", "number")} placeholder="200" min="1" />
            </Field>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={values.isSoldOut}
                onChange={(e) => set("isSoldOut", e.target.checked)}
                className="w-4 h-4 rounded accent-red-600"
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Agotado
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={values.allowsRegistration}
                onChange={(e) => set("allowsRegistration", e.target.checked)}
                className="w-4 h-4 rounded accent-red-600"
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Permitir inscripciones
              </span>
            </label>
          </div>
        </div>

        {/* ── Right: image + lineup ── */}
        <div className="space-y-6">
          {/* Image */}
          <div
            className="card-surface p-4 space-y-3"
          >
            <h3
              className="font-display text-lg"
              style={{ color: "var(--color-text)" }}
            >
              IMAGEN
            </h3>
            <Field label="URL de imagen">
              <input
                {...input("imageUrl", "url")}
                placeholder="https://images.unsplash.com/..."
              />
            </Field>
            {values.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-1">
                <Image
                  src={values.imageUrl}
                  alt="Preview"
                  fill
                  sizes="300px"
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
            )}
          </div>

          {/* Lineup editor */}
          <div className="card-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className="font-display text-lg"
                style={{ color: "var(--color-text)" }}
              >
                LINEUP
              </h3>
              <button
                type="button"
                onClick={addLineupRow}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{
                  color: "var(--color-primary)",
                  backgroundColor: "rgba(224,29,44,0.1)",
                  border: "1px solid rgba(224,29,44,0.2)",
                }}
              >
                <Plus size={12} />
                Añadir
              </button>
            </div>

            <div className="space-y-2">
              {values.lineup.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <GripVertical
                    size={14}
                    style={{ color: "var(--color-text-faint)", flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateLineupRow(row.id, "name", e.target.value)}
                    placeholder="Nombre"
                    className="flex-1 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    aria-label="Nombre del artista en el lineup"
                  />
                  <input
                    type="time"
                    value={row.time}
                    onChange={(e) => updateLineupRow(row.id, "time", e.target.value)}
                    className="w-20 rounded-lg px-2 py-1.5 text-xs outline-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    aria-label="Hora"
                  />
                  <select
                    value={row.role}
                    onChange={(e) => updateLineupRow(row.id, "role", e.target.value)}
                    className="rounded-lg px-2 py-1.5 text-xs outline-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    aria-label="Rol en el lineup"
                  >
                    <option value="opening">Opening</option>
                    <option value="support">Support</option>
                    <option value="headliner">Headliner</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLineupRow(row.id)}
                    disabled={values.lineup.length === 1}
                    className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                    style={{
                      color: "var(--color-text-faint)",
                      opacity: values.lineup.length === 1 ? 0.3 : 1,
                    }}
                    aria-label="Eliminar fila"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mt-6 px-4 py-3 rounded-lg text-sm"
          style={{
            backgroundColor: "rgba(224,29,44,0.1)",
            border: "1px solid rgba(224,29,44,0.3)",
            color: "var(--color-primary)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div
        className="mt-8 flex items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}
      >
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="btn btn-outline flex items-center gap-2"
        >
          <ArrowLeft size={15} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary px-8"
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              Guardando…
            </>
          ) : isEdit ? (
            "Guardar cambios"
          ) : (
            "Crear evento"
          )}
        </button>
      </div>
    </form>
  );
}
