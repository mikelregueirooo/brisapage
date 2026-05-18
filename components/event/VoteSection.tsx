"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { VoteOption, VoteCount } from "@/types";

interface VoteOptionConfig {
  key: VoteOption;
  emoji: string;
  label: string;
  color: string;
}

const OPTIONS: VoteOptionConfig[] = [
  { key: "yes", emoji: "🔥", label: "SÍ, allí estaré", color: "var(--color-primary)" },
  { key: "maybe", emoji: "🤔", label: "Quizás", color: "var(--color-accent)" },
  { key: "no", emoji: "❌", label: "No puedo", color: "var(--color-text-faint)" },
];

function total(votes: VoteCount) {
  return votes.yes + votes.maybe + votes.no;
}

function pct(count: number, tot: number) {
  if (tot === 0) return 0;
  return Math.round((count / tot) * 100);
}

interface Props {
  slug: string;
}

export default function VoteSection({ slug }: Props) {
  const shouldReduce = useReducedMotion();
  const [votes, setVotes] = useState<VoteCount>({ yes: 0, maybe: 0, no: 0 });
  const [voted, setVoted] = useState<VoteOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Load votes + check localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`vote_${slug}`) as VoteOption | null;
    setVoted(stored);

    fetch(`/api/votes?slug=${slug}`)
      .then((r) => r.json())
      .then((data: VoteCount) => setVotes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleVote = useCallback(
    async (option: VoteOption) => {
      if (voted || posting) return;
      setPosting(true);

      // Optimistic update
      setVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }));
      setVoted(option);
      localStorage.setItem(`vote_${slug}`, option);

      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, option }),
        });
        if (res.ok) {
          const updated: VoteCount = await res.json();
          setVotes(updated);
        }
      } catch {
        // Keep optimistic state on network failure
      } finally {
        setPosting(false);
      }
    },
    [slug, voted, posting]
  );

  const tot = total(votes);

  return (
    <section
      className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-surface)" }}
      aria-labelledby="vote-heading"
    >
      <div className="max-w-screen-xl mx-auto max-w-2xl">
        <div
          className="card-surface p-6 sm:p-8"
          style={{ maxWidth: "640px" }}
        >
          <h2
            id="vote-heading"
            className="font-display text-2xl sm:text-3xl mb-2"
            style={{ color: "var(--color-text)" }}
          >
            ¿VAS A VENIR?
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            Dinos si vas a asistir a este evento
          </p>

          {/* Vote buttons */}
          <div className="flex flex-col gap-3 mb-8" role="group" aria-label="Opciones de voto">
            {OPTIONS.map((opt) => {
              const isChosen = voted === opt.key;
              const isDisabled = voted !== null;
              const percentage = pct(votes[opt.key], tot);

              return (
                <div key={opt.key} className="relative">
                  <button
                    onClick={() => handleVote(opt.key)}
                    disabled={isDisabled || loading}
                    aria-pressed={isChosen}
                    aria-label={`Votar: ${opt.label}`}
                    className="relative w-full text-left rounded-lg px-4 py-3 transition-all duration-200 overflow-hidden"
                    style={{
                      backgroundColor: isChosen
                        ? `${opt.color}18`
                        : "var(--color-surface-2)",
                      border: `1px solid ${isChosen ? opt.color : "var(--color-border)"}`,
                      cursor: isDisabled ? "default" : "pointer",
                      opacity: isDisabled && !isChosen ? 0.65 : 1,
                    }}
                  >
                    {/* Progress bar */}
                    {voted !== null && (
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-lg"
                        style={{ backgroundColor: `${opt.color}12` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={
                          shouldReduce
                            ? { duration: 0 }
                            : { duration: 0.8, ease: "easeOut", delay: 0.2 }
                        }
                        aria-hidden="true"
                      />
                    )}

                    {/* Button content */}
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl" aria-hidden="true">
                          {opt.emoji}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color: isChosen ? opt.color : "var(--color-text)",
                          }}
                        >
                          {opt.label}
                        </span>
                        {isChosen && (
                          <span
                            className="font-mono-accent text-[10px] tracking-wider"
                            style={{ color: opt.color }}
                            aria-label="Tu voto"
                          >
                            Tu voto ✓
                          </span>
                        )}
                      </div>

                      {/* Percentage */}
                      {voted !== null && (
                        <span
                          className="font-mono-accent text-xs shrink-0"
                          style={{ color: isChosen ? opt.color : "var(--color-text-muted)" }}
                          aria-label={`${percentage} por ciento`}
                        >
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total count */}
          <p
            className="font-mono-accent text-xs text-center tracking-widest"
            style={{ color: "var(--color-text-faint)" }}
            role="status"
            aria-live="polite"
          >
            {loading
              ? "Cargando votos..."
              : tot === 0
              ? "Sé el primero en votar"
              : `${tot.toLocaleString("es-ES")} ${tot === 1 ? "voto" : "votos"} en total`}
          </p>
        </div>
      </div>
    </section>
  );
}
