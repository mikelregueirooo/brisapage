"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic2, CheckCircle2, Loader2, Users } from "lucide-react";

interface FormState {
  name: string;
  email: string;
}

interface Props {
  slug: string;
}

export default function SignupSection({ slug }: Props) {
  const shouldReduce = useReducedMotion();
  const nameId = useId();
  const emailId = useId();

  const [form, setForm] = useState<FormState>({ name: "", email: "" });
  const [registered, setRegistered] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage + fetch count on mount
  useEffect(() => {
    const stored = localStorage.getItem(`signup_${slug}`);
    if (stored) setRegistered(true);

    fetch(`/api/registrations?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: form.name, email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al inscribirse. Inténtalo de nuevo.");
        return;
      }

      localStorage.setItem(`signup_${slug}`, form.email);
      setRegistered(true);
      setCount((c) => (c ?? 0) + 1);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-surface-2)" }}
      aria-labelledby="signup-heading"
    >
      <div className="max-w-screen-xl mx-auto">
        <div
          className="card-surface p-6 sm:p-8 mx-auto"
          style={{ maxWidth: "640px" }}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
              aria-hidden="true"
            >
              <Mic2 size={20} />
            </div>
            <div>
              <h2
                id="signup-heading"
                className="font-display text-2xl sm:text-3xl"
                style={{ color: "var(--color-text)" }}
              >
                INSCRÍBETE AL KARAOKE
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Reserva tu turno en el escenario. ¡Plazas limitadas!
              </p>
            </div>
          </div>

          {/* Participant count */}
          {count !== null && (
            <div
              className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--color-surface-offset)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Users size={14} style={{ color: "var(--color-accent)" }} aria-hidden="true" />
              <span style={{ color: "var(--color-text-muted)" }}>
                <span
                  className="font-mono-accent font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {count}
                </span>{" "}
                {count === 1 ? "persona inscrita" : "personas inscritas"}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {registered ? (
              /* ── Confirmation state ── */
              <motion.div
                key="confirmed"
                initial={shouldReduce ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                className="flex flex-col items-center text-center gap-4 py-6"
                role="status"
                aria-live="polite"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
                >
                  <CheckCircle2
                    size={32}
                    style={{ color: "#22c55e" }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p
                    className="font-display text-2xl"
                    style={{ color: "var(--color-text)" }}
                  >
                    ¡ESTÁS DENTRO!
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Te hemos apuntado al karaoke. ¡Prepara tu canción!
                  </p>
                </div>
                <p
                  className="font-mono-accent text-xs tracking-wider"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  Recibirás confirmación en tu email
                </p>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={shouldReduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                noValidate
                aria-label="Formulario de inscripción al karaoke"
              >
                <div className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={nameId}
                      className="text-xs font-mono-accent tracking-widest uppercase"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Nombre *
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      autoComplete="given-name"
                      required
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--color-surface-2)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-glow)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={emailId}
                      className="text-xs font-mono-accent tracking-widest uppercase"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Email *
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--color-surface-2)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-glow)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        key="error"
                        initial={shouldReduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor: "rgba(224,29,44,0.1)",
                          border: "1px solid rgba(224,29,44,0.3)",
                          color: "var(--color-primary)",
                        }}
                        role="alert"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !form.name.trim() || !form.email.trim()}
                    className="btn btn-primary w-full justify-center mt-1"
                    style={{
                      opacity: loading || !form.name.trim() || !form.email.trim() ? 0.6 : 1,
                      cursor: loading ? "wait" : undefined,
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Inscribiendo…
                      </>
                    ) : (
                      <>
                        <Mic2 size={16} aria-hidden="true" />
                        Inscribirme al Karaoke
                      </>
                    )}
                  </button>

                  <p
                    className="text-xs text-center"
                    style={{ color: "var(--color-text-faint)" }}
                  >
                    Solo usamos tu email para confirmar tu inscripción.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
