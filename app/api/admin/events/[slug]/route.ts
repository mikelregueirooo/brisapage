import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug, updateEvent, deleteEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

interface Ctx { params: { slug: string } }

export function GET(_req: NextRequest, { params }: Ctx) {
  const event = getEventBySlug(params.slug);
  if (!event) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  if (!getEventBySlug(params.slug))
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const { slug: _s, ...data } = body as { slug?: string } & Record<string, unknown>;
  return NextResponse.json(updateEvent(params.slug, data as Parameters<typeof updateEvent>[1]));
}

export function DELETE(_req: NextRequest, { params }: Ctx) {
  const ok = deleteEvent(params.slug);
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
