"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const shouldReduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: shouldReduce
        ? {}
        : { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      className="relative min-h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden py-24"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-labelledby="hero-heading"
    >
      {/* Grain texture */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(224,29,44,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 px-4 sm:px-6 max-w-4xl mx-auto"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="font-mono-accent text-xs sm:text-sm tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Chiringuito · Vigo · Costa Atlántica
        </motion.p>

        {/* Main heading */}
        <motion.h1
          id="hero-heading"
          variants={item}
          className="font-display leading-none mb-2"
          style={{
            fontSize: "clamp(4rem, 14vw, 9rem)",
            backgroundImage: "linear-gradient(135deg, #e01d2c 0%, #f5c400 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          EL BRISA
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-base sm:text-xl md:text-2xl font-light mb-10 max-w-lg mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          Donde el mar se convierte en fiesta
        </motion.p>

        {/* CTA */}
        <motion.div variants={item}>
          <Link
            href="#eventos"
            className="btn btn-primary btn-glow text-base px-8 py-4"
          >
            Ver Eventos
          </Link>
        </motion.div>
      </motion.div>

    </section>
  );
}
