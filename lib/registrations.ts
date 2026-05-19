import type { Registration } from "@/types";

const store: Record<string, Registration[]> = {};

export function getRegistrations(slug: string): Registration[] {
  return store[slug] ?? [];
}

export function getRegistrationCount(slug: string): number {
  return (store[slug] ?? []).length;
}

export function addRegistration(
  slug: string,
  name: string,
  email: string
): { ok: true; registration: Registration } | { ok: false; error: string } {
  const emailNorm = email.trim().toLowerCase();
  const existing = (store[slug] ?? []).some((r) => r.email === emailNorm);
  if (existing) return { ok: false, error: "Este email ya está inscrito en el evento." };

  const registration: Registration = {
    name: name.trim(),
    email: emailNorm,
    slug,
    registeredAt: new Date().toISOString(),
  };
  if (!store[slug]) store[slug] = [];
  store[slug].push(registration);
  return { ok: true, registration };
}
