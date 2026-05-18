El Brisa — Landing Page
Descripción del Proyecto
Landing page moderna para El Brisa, un chiringuito de playa/bar de ambiente. El foco principal es la sección de eventos próximos, con páginas de detalle por evento, sistema de votaciones y animaciones de alto impacto. El proyecto debe correr con npm run dev usando Next.js 14+ (App Router).

Stack Técnico
Framework: Next.js 14+ con App Router

Estilos: Tailwind CSS v3 + CSS variables custom

Animaciones: Framer Motion

Tipografía: Google Fonts (vía next/font/google)

Iconos: Lucide React

Lenguaje: TypeScript

Identidad Visual — El Brisa
Paleta de Colores
css
:root {
  --color-bg:              #0a0a0a;
  --color-surface:         #111111;
  --color-surface-2:       #1a1a1a;
  --color-surface-offset:  #222222;
  --color-border:          rgba(255,255,255,0.08);
  --color-primary:         #e01d2c;
  --color-primary-hover:   #c4111f;
  --color-primary-glow:    rgba(224, 29, 44, 0.25);
  --color-accent:          #f5c400;
  --color-accent-hover:    #d4a800;
  --color-accent-glow:     rgba(245, 196, 0, 0.2);
  --color-text:            #f0f0f0;
  --color-text-muted:      #888888;
  --color-text-faint:      #444444;
}
Tipografía
Display (headings): Bebas Neue — condensed, impacto, energía de festival

Body: Inter — limpio, legible, moderno

Acento (fechas, etiquetas, countdown): Space Mono — técnico, festival

Estética
Fondo negro dominante y atmosférico (noche de playa)

Rojo vibrante para CTAs, bordes activos, highlights

Amarillo solo para acento especial: countdown, precios, badges VIP

Grain texture sutil en el hero (SVG feTurbulence, opacity: 0.04)

Efectos de glow en botones y elementos activos

Estructura del Proyecto
text
el-brisa/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # Homepage
│   ├── globals.css
│   ├── eventos/
│   │   └── [slug]/
│   │       └── page.tsx             # Detalle de evento
│   └── api/
│       └── votes/
│           └── route.ts             # API de votaciones (in-memory)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── EventsSection.tsx
│   │   ├── EventCard.tsx
│   │   └── InfoSection.tsx
│   └── event/
│       ├── EventHero.tsx
│       ├── EventDetails.tsx
│       ├── VoteSection.tsx
│       └── Countdown.tsx
├── lib/
│   ├── events.ts                    # Mock data
│   └── votes.ts                     # In-memory store
└── types/index.ts
Secciones de la Homepage
1. Hero (Full Viewport)
Fondo negro con grain texture (SVG filter)

Logo "EL BRISA" en Bebas Neue gigante con gradiente rojo→amarillo

Tagline: "Donde el mar se convierte en fiesta"

Entrada escalonada con Framer Motion (staggerChildren)

Botón CTA rojo "Ver Eventos" con efecto glow pulsante (CSS @keyframes)

Scroll indicator con flecha animada (rebote continuo)

2. Próximos Eventos
Grid responsivo de EventCard: 1 col mobile / 2 tablet / 3 desktop

Cada EventCard contiene:

Imagen del evento con overlay gradiente negro

Badge de categoría (MÚSICA EN VIVO / DJ SET / FIESTA / ESPECIAL)

Badge "POCAS ENTRADAS" en amarillo si capacity < 50

Fecha y hora en Space Mono

Nombre del artista en Bebas Neue (grande)

Contador de votos ("🔥 X personas van")

Precio o "Entrada Libre"

Botón "Más Info" → /eventos/[slug]

Hover: eleva la tarjeta (y: -8), sombra roja glow, leve rotación 3D con transformPerspective

3. La Vibra
Descripción del chiringuito

Estadísticas animadas al entrar en viewport: eventos realizados, años abiertos, personas

4. Footer
Logo, redes sociales, horarios, dirección

Página de Detalle /eventos/[slug]
Types
typescript
interface Event {
  slug: string;
  title: string;
  artist: string;
  date: string;           // ISO 8601
  doors: string;          // "22:00"
  showTime: string;       // "23:30"
  venue: string;
  genre: string[];
  description: string;
  price: number | null;   // null = libre
  capacity: number;
  isSoldOut: boolean;
  imageUrl: string;
  lineup: LineupArtist[];
}

interface LineupArtist {
  name: string;
  time: string;
  role: "headliner" | "support" | "opening";
}
Secciones del Detalle
EventHero
Imagen full-bleed con overlay oscuro

Nombre del artista superpuesto en Bebas Neue enorme

Badge de géneros musicales

Countdown
Tiempo real hasta el evento con useEffect + setInterval

Formato: DD días · HH : MM : SS en Space Mono amarillo

Cada dígito usa AnimatePresence de Framer Motion para animar el cambio (efecto flip/slot)

EventDetails
Tarjeta de info: fecha, hora de puertas, lugar, precio

Lineup con timeline visual (línea vertical con puntos)

Botón "Comprar Entrada" (rojo, enlace externo)

Botón "Añadir a Google Calendar" (genera URL de Google Calendar)

VoteSection (Sistema de Votación)
Pregunta: "¿Vas a venir a este evento?"

3 opciones con emoji:

🔥 SÍ, allí estaré → yes

🤔 Quizás → maybe

❌ No puedo → no

Barra de progreso animada por opción (Framer Motion width)

Muestra porcentaje y total de votos

El voto se guarda en localStorage (clave: vote_${slug})

Una vez votado: se deshabilitan los botones y se muestra "Tu voto: ✓"

POST a /api/votes al votar

API de Votaciones
/api/votes/route.ts
typescript
// In-memory store (se reinicia con el servidor — está bien para este caso)
const store: Record<string, { yes: number; maybe: number; no: number }> = {};

// GET /api/votes?slug=xxx → devuelve conteo
// POST /api/votes → body: { slug: string, option: "yes"|"maybe"|"no" }
Lógica cliente (VoteSection)
Al montar: GET votos del evento

Comprobar localStorage para ver si ya votó

Al hacer click: POST voto → actualizar estado local → guardar en localStorage

Animar barras de progreso con el nuevo conteo

Animaciones Framer Motion
Hero — Entrada escalonada
tsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
};
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
EventCard — Hover 3D
tsx
<motion.div
  whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
  transition={{ type: "spring", damping: 20, stiffness: 300 }}
  style={{ transformPerspective: 1000 }}
>
Reveal en scroll
tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
Barras de votación
tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${percentage}%` }}
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
  className="h-full bg-red-600 rounded-full"
/>
Countdown — AnimatePresence flip por dígito
tsx
<AnimatePresence mode="popLayout">
  <motion.span
    key={digit}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 20, opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {digit}
  </motion.span>
</AnimatePresence>
Navbar
Sticky top, fondo transparente → rgba(10,10,10,0.85) + backdrop-blur al scrollear

Detectar scroll con useEffect + window.addEventListener('scroll', ...)

Logo SVG custom "El Brisa" a la izquierda (diseñar como ola + texto)

Links: Inicio · Eventos · El Local · Contacto

Botón "Entradas" rojo a la derecha

Mobile: botón hamburger → menú lateral con AnimatePresence (slide desde la derecha)

Logo SVG — Concepto
Diseñar un logo SVG inline con:

Una ola estilizada geométrica en rojo o amarillo

Texto "EL BRISA" en Bebas Neue o path SVG

Funciona a 32px y 200px

currentColor para adaptarse al contexto

Mock Data de Eventos
typescript
// lib/events.ts — mínimo 4 eventos variados
export const events: Event[] = [
  {
    slug: "pablo-ferreiro-verano",
    title: "Noche de Verano",
    artist: "Pablo Ferreiro",
    date: "2026-06-14T23:00:00",
    doors: "22:00",
    showTime: "23:30",
    venue: "El Brisa — Terraza Principal",
    genre: ["Indie", "Pop"],
    description: "Una noche especial con el cantautor gallego más prometedor del momento. Brisa marina, música en vivo y el mejor ambiente de la costa.",
    price: 12,
    capacity: 300,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    lineup: [
      { name: "DJ Apertura", time: "22:00", role: "opening" },
      { name: "Pablo Ferreiro", time: "23:30", role: "headliner" }
    ]
  },
  {
    slug: "techno-sunrise",
    title: "Techno Sunrise",
    artist: "DJ Suncycle",
    date: "2026-06-21T00:00:00",
    doors: "23:00",
    showTime: "00:30",
    venue: "El Brisa — Pista Interior",
    genre: ["Techno", "Minimal"],
    description: "Una sesión de techno que durará toda la noche hasta el amanecer. El mejor acid techno del norte.",
    price: 15,
    capacity: 200,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1571266028243-d220c6a5d0b1?w=800",
    lineup: [
      { name: "Marco Local", time: "23:00", role: "opening" },
      { name: "Vera Moon", time: "01:00", role: "support" },
      { name: "DJ Suncycle", time: "03:00", role: "headliner" }
    ]
  },
  {
    slug: "noche-flamenca",
    title: "Noche Flamenca",
    artist: "Cuadro Flamenco Brisa",
    date: "2026-07-05T21:00:00",
    doors: "20:30",
    showTime: "21:00",
    venue: "El Brisa — Terraza Principal",
    genre: ["Flamenco", "Fusión"],
    description: "Arte flamenco en estado puro con vistas al mar. Tablao íntimo con carta de tapas y vinos.",
    price: null,
    capacity: 150,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800",
    lineup: [
      { name: "Cuadro Flamenco Brisa", time: "21:00", role: "headliner" }
    ]
  },
  {
    slug: "reggaeton-beach-party",
    title: "Beach Party",
    artist: "DJ Kiko Brisa",
    date: "2026-07-19T23:00:00",
    doors: "22:00",
    showTime: "23:00",
    venue: "El Brisa — Terraza y Playa",
    genre: ["Reggaeton", "Comercial"],
    description: "La fiesta del verano. Arena, mar y los mejores éxitos del momento. Acceso libre hasta las 23h.",
    price: 10,
    capacity: 500,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    lineup: [
      { name: "DJane Luna", time: "22:00", role: "opening" },
      { name: "DJ Kiko Brisa", time: "23:00", role: "headliner" }
    ]
  }
];
Setup Inicial
bash
npx create-next-app@latest el-brisa \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir=false \
  --import-alias="@/*"

cd el-brisa
npm install framer-motion lucide-react
npm run dev
