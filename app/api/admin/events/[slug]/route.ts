import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug, updateEvent, deleteEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { slug: string };
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const event = await getEventBySlug(params.slug);
  if (!event) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const existing = await getEventBySlug(params.slug);
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { slug: _s, ...data } = body as { slug?: string } & Record<string, unknown>;
  const updated = await updateEvent(params.slug, data as Parameters<typeof updateEvent>[1]);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const ok = await deleteEvent(params.slug);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
