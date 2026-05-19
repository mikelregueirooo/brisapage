import type { Event } from "@/types";

// ─── Seed data ────────────────────────────────────────────────────────────────
const seedEvents: Event[] = [
  {
    slug: "pablo-ferreiro-verano",
    title: "Noche de Verano",
    artist: "Pablo Ferreiro",
    date: "2026-06-14T23:00:00",
    doors: "22:00",
    showTime: "23:30",
    venue: "El Brisa — Terraza Principal",
    genre: ["Indie", "Pop"],
    description:
      "Una noche especial con el cantautor gallego más prometedor del momento. Brisa marina, música en vivo y el mejor ambiente de la costa.",
    price: 12,
    capacity: 300,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    lineup: [
      { name: "DJ Apertura", time: "22:00", role: "opening" },
      { name: "Pablo Ferreiro", time: "23:30", role: "headliner" },
    ],
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
    description:
      "Una sesión de techno que durará toda la noche hasta el amanecer. El mejor acid techno del norte.",
    price: 15,
    capacity: 200,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1571266028243-d220c6a5d0b1?w=800",
    lineup: [
      { name: "Marco Local", time: "23:00", role: "opening" },
      { name: "Vera Moon", time: "01:00", role: "support" },
      { name: "DJ Suncycle", time: "03:00", role: "headliner" },
    ],
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
    description:
      "Arte flamenco en estado puro. Tablao íntimo con la mejor música en directo.",
    price: null,
    capacity: 150,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800",
    lineup: [{ name: "Cuadro Flamenco Brisa", time: "21:00", role: "headliner" }],
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
    description:
      "La fiesta del verano. Arena, mar y los mejores éxitos del momento. Acceso libre hasta las 23h.",
    price: 10,
    capacity: 500,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    lineup: [
      { name: "DJane Luna", time: "22:00", role: "opening" },
      { name: "DJ Kiko Brisa", time: "23:00", role: "headliner" },
    ],
  },
  {
    slug: "karaoke-night",
    title: "Karaoke Night",
    artist: "El Brisa Karaoke",
    date: "2026-08-02T21:00:00",
    doors: "20:30",
    showTime: "21:00",
    venue: "El Brisa — Terraza Principal",
    genre: ["Karaoke", "Pop", "Fiesta"],
    description:
      "¡Coge el micrófono y demuestra lo que vales! Una noche de karaoke épica con los mejores hits en español e inglés. Inscríbete, sube al escenario y gana premios.",
    price: null,
    capacity: 120,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    lineup: [
      { name: "Apertura de barra", time: "20:30", role: "opening" },
      { name: "Karaoke abierto", time: "21:00", role: "headliner" },
      { name: "Final y premios", time: "23:30", role: "support" },
    ],
    allowsRegistration: true,
  },
];

// ─── Mutable in-memory store ───────────────────────────────────────────────────
let store: Event[] = [...seedEvents];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getEvents(): Event[] {
  return [...store];
}

export function getEventBySlug(slug: string): Event | undefined {
  return store.find((e) => e.slug === slug);
}

export function createEvent(data: Omit<Event, "slug">): Event {
  const base = toSlug(`${data.artist}-${data.title}`);
  let slug = base;
  let n = 2;
  while (store.some((e) => e.slug === slug)) slug = `${base}-${n++}`;
  const event: Event = { ...data, slug };
  store.push(event);
  return { ...event };
}

export function updateEvent(
  slug: string,
  data: Partial<Omit<Event, "slug">>
): Event | null {
  const idx = store.findIndex((e) => e.slug === slug);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...data };
  return { ...store[idx] };
}

export function deleteEvent(slug: string): boolean {
  const prev = store.length;
  store = store.filter((e) => e.slug !== slug);
  return store.length < prev;
}

export const events = seedEvents;
