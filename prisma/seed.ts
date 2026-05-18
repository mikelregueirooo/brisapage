import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedEvents = [
  {
    slug: "pablo-ferreiro-verano",
    title: "Noche de Verano",
    artist: "Pablo Ferreiro",
    date: "2026-06-14T23:00:00",
    doors: "22:00",
    showTime: "23:30",
    venue: "El Brisa — Terraza Principal",
    genre: JSON.stringify(["Indie", "Pop"]),
    description:
      "Una noche especial con el cantautor gallego más prometedor del momento. Brisa marina, música en vivo y el mejor ambiente de la costa.",
    price: 12,
    capacity: 300,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    lineup: JSON.stringify([
      { name: "DJ Apertura", time: "22:00", role: "opening" },
      { name: "Pablo Ferreiro", time: "23:30", role: "headliner" },
    ]),
    allowsRegistration: false,
  },
  {
    slug: "techno-sunrise",
    title: "Techno Sunrise",
    artist: "DJ Suncycle",
    date: "2026-06-21T00:00:00",
    doors: "23:00",
    showTime: "00:30",
    venue: "El Brisa — Pista Interior",
    genre: JSON.stringify(["Techno", "Minimal"]),
    description:
      "Una sesión de techno que durará toda la noche hasta el amanecer. El mejor acid techno del norte.",
    price: 15,
    capacity: 200,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1571266028243-d220c6a5d0b1?w=800",
    lineup: JSON.stringify([
      { name: "Marco Local", time: "23:00", role: "opening" },
      { name: "Vera Moon", time: "01:00", role: "support" },
      { name: "DJ Suncycle", time: "03:00", role: "headliner" },
    ]),
    allowsRegistration: false,
  },
  {
    slug: "noche-flamenca",
    title: "Noche Flamenca",
    artist: "Cuadro Flamenco Brisa",
    date: "2026-07-05T21:00:00",
    doors: "20:30",
    showTime: "21:00",
    venue: "El Brisa — Terraza Principal",
    genre: JSON.stringify(["Flamenco", "Fusión"]),
    description:
      "Arte flamenco en estado puro con vistas al mar. Tablao íntimo con carta de tapas y vinos.",
    price: null,
    capacity: 150,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800",
    lineup: JSON.stringify([
      { name: "Cuadro Flamenco Brisa", time: "21:00", role: "headliner" },
    ]),
    allowsRegistration: false,
  },
  {
    slug: "reggaeton-beach-party",
    title: "Beach Party",
    artist: "DJ Kiko Brisa",
    date: "2026-07-19T23:00:00",
    doors: "22:00",
    showTime: "23:00",
    venue: "El Brisa — Terraza y Playa",
    genre: JSON.stringify(["Reggaeton", "Comercial"]),
    description:
      "La fiesta del verano. Arena, mar y los mejores éxitos del momento. Acceso libre hasta las 23h.",
    price: 10,
    capacity: 500,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    lineup: JSON.stringify([
      { name: "DJane Luna", time: "22:00", role: "opening" },
      { name: "DJ Kiko Brisa", time: "23:00", role: "headliner" },
    ]),
    allowsRegistration: false,
  },
  {
    slug: "karaoke-night",
    title: "Karaoke Night",
    artist: "El Brisa Karaoke",
    date: "2026-08-02T21:00:00",
    doors: "20:30",
    showTime: "21:00",
    venue: "El Brisa — Terraza Principal",
    genre: JSON.stringify(["Karaoke", "Pop", "Fiesta"]),
    description:
      "¡Coge el micrófono y demuestra lo que vales! Una noche de karaoke épica con los mejores hits en español e inglés. Inscríbete, sube al escenario y gana premios.",
    price: null,
    capacity: 120,
    isSoldOut: false,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    lineup: JSON.stringify([
      { name: "Apertura de barra", time: "20:30", role: "opening" },
      { name: "Karaoke abierto", time: "21:00", role: "headliner" },
      { name: "Final y premios", time: "23:30", role: "support" },
    ]),
    allowsRegistration: true,
  },
];

async function main() {
  console.log("Seeding database...");
  for (const event of seedEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }
  console.log(`Seeded ${seedEvents.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
