"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface FlipDigitProps {
  value: string;
  shouldReduce: boolean;
}

function FlipDigit({ value, shouldReduce }: FlipDigitProps) {
  return (
    <span
      className="inline-block w-[1ch] overflow-hidden relative"
      style={{ height: "1.2em" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center justify-center"
          initial={shouldReduce ? false : { y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={shouldReduce ? undefined : { y: 20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface TimeBlockProps {
  value: number;
  label: string;
  shouldReduce: boolean;
}

function TimeBlock({ value, label, shouldReduce }: TimeBlockProps) {
  const padded = pad(value);
  const [d1, d2] = padded.split("");

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-mono-accent tabular-nums inline-flex"
        style={{
          fontSize: "clamp(2rem, 8vw, 3.5rem)",
          color: "var(--color-accent)",
          lineHeight: 1.2,
        }}
        aria-label={`${value} ${label}`}
      >
        <FlipDigit value={d1} shouldReduce={shouldReduce} />
        <FlipDigit value={d2} shouldReduce={shouldReduce} />
      </span>
      <span
        className="font-mono-accent text-[10px] tracking-widest uppercase"
        style={{ color: "var(--color-text-faint)" }}
        aria-hidden="true"
      >
        {label}
      </span>
    </div>
  );
}

interface Props {
  targetDate: string;
}

export default function Countdown({ targetDate }: Props) {
  const shouldReduce = useReducedMotion() ?? false;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(targetDate)
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const isPast =
    mounted &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isPast) {
    return (
      <p
        className="font-mono-accent text-sm tracking-widest uppercase"
        style={{ color: "var(--color-text-muted)" }}
        role="status"
      >
        Este evento ya ha comenzado
      </p>
    );
  }

  if (!mounted) {
    // SSR placeholder prevents layout shift
    return (
      <div className="flex items-center gap-4 sm:gap-6" aria-hidden="true">
        {["días", "horas", "min", "seg"].map((l) => (
          <div key={l} className="flex flex-col items-center gap-1">
            <span
              className="font-mono-accent tabular-nums"
              style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", color: "var(--color-accent)" }}
            >
              00
            </span>
            <span
              className="font-mono-accent text-[10px] tracking-widest uppercase"
              style={{ color: "var(--color-text-faint)" }}
            >
              {l}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 sm:gap-5"
      role="timer"
      aria-live="off"
      aria-label="Cuenta atrás para el evento"
    >
      <TimeBlock value={timeLeft.days} label="días" shouldReduce={shouldReduce} />
      <Separator />
      <TimeBlock value={timeLeft.hours} label="horas" shouldReduce={shouldReduce} />
      <Separator />
      <TimeBlock value={timeLeft.minutes} label="min" shouldReduce={shouldReduce} />
      <Separator />
      <TimeBlock value={timeLeft.seconds} label="seg" shouldReduce={shouldReduce} />
    </div>
  );
}

function Separator() {
  return (
    <span
      className="font-mono-accent self-start mt-1"
      style={{
        fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
        color: "var(--color-text-faint)",
        lineHeight: 1.2,
      }}
      aria-hidden="true"
    >
      ·
    </span>
  );
}
