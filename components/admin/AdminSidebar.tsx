"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  BarChart2,
  Users,
  ExternalLink,
  Menu,
  X,
  Waves,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/eventos/nuevo", label: "Crear Evento", icon: PlusCircle },
];

const secondaryItems = [
  { href: "/", label: "Ver sitio", icon: ExternalLink },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
      style={{
        backgroundColor: active ? "rgba(224,29,44,0.12)" : "transparent",
        color: active ? "var(--color-primary)" : "var(--color-text-muted)",
        borderLeft: active ? "2px solid var(--color-primary)" : "2px solid transparent",
      }}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <div className="flex flex-col h-full py-5 px-3">
      {/* Brand */}
      <Link
        href="/admin"
        onClick={onLinkClick}
        className="flex items-center gap-2.5 px-3 mb-7"
        aria-label="El Brisa Admin"
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary)" }}
          aria-hidden="true"
        >
          <Waves size={14} color="#fff" />
        </div>
        <div>
          <p
            className="font-display text-base leading-none"
            style={{ color: "var(--color-text)" }}
          >
            EL BRISA
          </p>
          <p
            className="font-mono-accent text-[9px] tracking-widest uppercase"
            style={{ color: "var(--color-text-faint)" }}
          >
            Admin
          </p>
        </div>
      </Link>

      {/* Primary nav */}
      <p
        className="px-3 mb-2 font-mono-accent text-[9px] tracking-widest uppercase"
        style={{ color: "var(--color-text-faint)" }}
      >
        Gestión
      </p>
      <nav className="flex flex-col gap-0.5 mb-6" aria-label="Navegación admin">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={onLinkClick} />
        ))}
      </nav>

      <div className="flex-1" />

      {/* Secondary */}
      <div
        className="pt-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {secondaryItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={onLinkClick} />
        ))}
      </div>
    </div>
  );
}

const SIDEBAR_W = 240;

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col shrink-0"
        style={{
          width: SIDEBAR_W,
          borderRight: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
        }}
        aria-label="Barra lateral de administración"
      >
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/admin"
          className="font-display text-base tracking-wider"
          style={{ color: "var(--color-text)" }}
        >
          EL BRISA ADMIN
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="bd"
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
              style={{
                width: SIDEBAR_W,
                backgroundColor: "var(--color-surface)",
                borderRight: "1px solid var(--color-border)",
              }}
              initial={{ x: -SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_W }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              aria-label="Menú lateral"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
