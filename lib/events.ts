import { prisma } from "./prisma";
import type { Event, LineupArtist } from "@/types";
import type { Event as PrismaEvent } from "@prisma/client";

// ─── Serialization helpers ────────────────────────────────────────────────────
function fromDB(row: PrismaEvent): Event {
  return {
    slug: row.slug,
    title: row.title,
    artist: row.artist,
    date: row.date,
    doors: row.doors,
    showTime: row.showTime,
    venue: row.venue,
    genre: JSON.parse(row.genre) as string[],
    description: row.description,
    price: row.price,
    capacity: row.capacity,
    isSoldOut: row.isSoldOut,
    imageUrl: row.imageUrl,
    lineup: JSON.parse(row.lineup) as LineupArtist[],
    allowsRegistration: row.allowsRegistration,
  };
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Read ──────────────────────────────────────────────────────────────────────
export async function getEvents(): Promise<Event[]> {
  const rows = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return rows.map(fromDB);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const row = await prisma.event.findUnique({ where: { slug } });
  return row ? fromDB(row) : null;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createEvent(data: Omit<Event, "slug">): Promise<Event> {
  const base = toSlug(`${data.artist}-${data.title}`);
  let slug = base;
  let n = 2;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  const row = await prisma.event.create({
    data: {
      slug,
      title: data.title,
      artist: data.artist,
      date: data.date,
      doors: data.doors,
      showTime: data.showTime,
      venue: data.venue,
      genre: JSON.stringify(data.genre),
      description: data.description,
      price: data.price,
      capacity: data.capacity,
      isSoldOut: data.isSoldOut,
      imageUrl: data.imageUrl,
      allowsRegistration: data.allowsRegistration ?? false,
      lineup: JSON.stringify(data.lineup),
    },
  });
  return fromDB(row);
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateEvent(
  slug: string,
  data: Partial<Omit<Event, "slug">>
): Promise<Event | null> {
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (!existing) return null;
  const row = await prisma.event.update({
    where: { slug },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.artist !== undefined && { artist: data.artist }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.doors !== undefined && { doors: data.doors }),
      ...(data.showTime !== undefined && { showTime: data.showTime }),
      ...(data.venue !== undefined && { venue: data.venue }),
      ...(data.genre !== undefined && { genre: JSON.stringify(data.genre) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
      ...(data.isSoldOut !== undefined && { isSoldOut: data.isSoldOut }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.allowsRegistration !== undefined && {
        allowsRegistration: data.allowsRegistration,
      }),
      ...(data.lineup !== undefined && { lineup: JSON.stringify(data.lineup) }),
    },
  });
  return fromDB(row);
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteEvent(slug: string): Promise<boolean> {
  try {
    await prisma.event.delete({ where: { slug } });
    return true;
  } catch {
    return false;
  }
}
