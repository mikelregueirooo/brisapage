import Link from "next/link";
import { Instagram, Music2 } from "lucide-react";

const socialLinks = [
  { href: "https://instagram.com/elbrisa", label: "Instagram", icon: Instagram },
  { href: "https://tiktok.com/@elbrisa", label: "TikTok", icon: Music2 },
];

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#eventos", label: "Próximos Eventos" },
  { href: "/#el-local", label: "El Local" },
];

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      aria-label="Pie de página"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block font-display text-2xl tracking-wider mb-3"
              style={{ color: "var(--color-text)" }}
              aria-label="El Brisa — inicio"
            >
              EL BRISA
            </Link>
            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Donde el mar se convierte en fiesta. Chiringuito de playa con los
              mejores eventos en directo de la costa.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-btn w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="font-mono-accent text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--color-text-faint)" }}
            >
              Navegación
            </h3>
            <ul className="space-y-2" role="list">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--color-primary)]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-faint)" }}
        >
          <p>© {new Date().getFullYear()} El Brisa. Todos los derechos reservados.</p>
          <p>
            Hecho con{" "}
            <span style={{ color: "var(--color-primary)" }} aria-label="amor">♥</span>{" "}
            en la costa
          </p>
        </div>
      </div>
    </footer>
  );
}
