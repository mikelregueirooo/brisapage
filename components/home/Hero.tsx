"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const shouldReduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const animate = mounted && !shouldReduce;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
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
      <div className="grain-overlay" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(224,29,44,0.12) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 px-4 sm:px-6 max-w-4xl mx-auto"
        variants={animate ? container : undefined}
        initial={animate ? "hidden" : false}
        animate="visible"
      >
        <motion.p
          variants={animate ? item : undefined}
          className="font-mono-accent text-xs sm:text-sm tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Chiringuito · Vigo · Costa Atlántica
        </motion.p>

        <motion.h1
          id="hero-heading"
          variants={animate ? item : undefined}
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

        <motion.p
          variants={animate ? item : undefined}
          className="text-base sm:text-xl md:text-2xl font-light mb-10 max-w-lg mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          Donde el mar se convierte en fiesta
        </motion.p>

        <motion.div variants={animate ? item : undefined}>
          <Link href="#eventos" className="btn btn-primary btn-glow text-base px-8 py-4">
            Ver Eventos
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
