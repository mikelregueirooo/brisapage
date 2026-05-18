"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 120, suffix: "+", label: "Eventos realizados" },
  { value: 8, suffix: " años", label: "Abiertos en la costa" },
  { value: 50000, suffix: "+", label: "Personas en El Brisa" },
];

function AnimatedNumber({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!active || shouldReduce) {
      setDisplay(value);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf: number;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, value, shouldReduce]);

  return (
    <span>
      {display.toLocaleString("es-ES")}
      {suffix}
    </span>
  );
}

export default function InfoSection() {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="el-local"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-surface)" }}
      aria-labelledby="info-heading"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <p
              className="font-mono-accent text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              El Local
            </p>
            <h2
              id="info-heading"
              className="font-display leading-none mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--color-text)" }}
            >
              LA VIBRA
            </h2>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              <p>
                El Brisa nació como un chiringuito de playa y se convirtió en
                referente cultural de la costa atlántica. Música, mar y la mejor
                gastronomía gallega en un espacio único.
              </p>
              <p>
                Terraza con vistas al Atlántico, pista interior con el mejor
                sonido y una programación que mezcla lo local con lo
                internacional. Aquí el verano no termina nunca.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  delay: i * 0.1,
                }}
                className="flex items-center gap-6 p-5 rounded-xl"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  className="font-display leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 2.8rem)",
                    color: "var(--color-accent)",
                    minWidth: "6ch",
                  }}
                >
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    active={inView}
                  />
                </span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
