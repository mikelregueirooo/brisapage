import { prisma } from "./prisma";
import type { Registration } from "@/types";

function fromDB(row: {
  id: string;
  eventSlug: string;
  name: string;
  email: string;
  registeredAt: Date;
}): Registration {
  return {
    name: row.name,
    email: row.email,
    slug: row.eventSlug,
    registeredAt: row.registeredAt.toISOString(),
  };
}

export async function getRegistrations(slug: string): Promise<Registration[]> {
  const rows = await prisma.registration.findMany({
    where: { eventSlug: slug },
    orderBy: { registeredAt: "asc" },
  });
  return rows.map(fromDB);
}

export async function getRegistrationCount(slug: string): Promise<number> {
  return prisma.registration.count({ where: { eventSlug: slug } });
}

export async function addRegistration(
  slug: string,
  name: string,
  email: string
): Promise<{ ok: true; registration: Registration } | { ok: false; error: string }> {
  const emailNorm = email.trim().toLowerCase();
  try {
    const row = await prisma.registration.create({
      data: { eventSlug: slug, name: name.trim(), email: emailNorm },
    });
    return { ok: true, registration: fromDB(row) };
  } catch (e: unknown) {
    // Unique constraint violation → already registered
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { ok: false, error: "Este email ya está inscrito en el evento." };
    }
    throw e;
  }
}
