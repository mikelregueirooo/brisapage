"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Waves } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#eventos", label: "Eventos" },
  { href: "/#el-local", label: "El Local" },
  { href: "/#contacto", label: "Contacto" },
];

const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 28, stiffness: 280 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(10,10,10,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        }}
      >
        <nav
          className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="El Brisa — inicio">
            <BrisaLogo />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium transition-colors duration-200 hover:text-[var(--color-primary)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>


          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--color-text)" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              id="mobile-menu"
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col pt-20 pb-8 px-6"
              style={{
                backgroundColor: "var(--color-surface)",
                borderLeft: "1px solid var(--color-border)",
              }}
              variants={shouldReduceMotion ? undefined : drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "var(--color-text-muted)" }}
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>

              {/* Links */}
              <ul className="flex flex-col gap-2 flex-1" role="list">
                {navLinks.map(({ href, label }, i) => (
                  <motion.li
                    key={href}
                    custom={i}
                    variants={shouldReduceMotion ? undefined : linkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={href}
                      className="block py-3 px-4 rounded-lg text-base font-medium transition-colors hover:bg-white/5 hover:text-[var(--color-primary)]"
                      style={{ color: "var(--color-text-muted)" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function BrisaLogo() {
  return (
    <span className="flex items-center gap-2 select-none">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Wave shape */}
        <path
          d="M2 20 C6 14, 10 26, 16 20 C22 14, 26 26, 30 20"
          stroke="#e01d2c"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M2 24 C6 18, 10 30, 16 24 C22 18, 26 30, 30 24"
          stroke="#f5c400"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        {/* Sun dot */}
        <circle cx="16" cy="10" r="4" fill="#f5c400" opacity="0.9" />
        <circle cx="16" cy="10" r="2" fill="#f5c400" />
      </svg>
      <span
        className="font-display text-xl tracking-wider"
        style={{ color: "var(--color-text)" }}
      >
        EL BRISA
      </span>
    </span>
  );
}
