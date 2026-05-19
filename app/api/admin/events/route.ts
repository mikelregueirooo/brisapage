import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/events";
import { getVotes } from "@/lib/votes";
import { getRegistrationCount } from "@/lib/registrations";
import type { Event } from "@/types";

export const dynamic = "force-dynamic";

export function GET() {
  const events = getEvents();
  const enriched = events.map((e) => {
    const votes = getVotes(e.slug);
    return {
      ...e,
      voteTotal: votes.yes + votes.maybe + votes.no,
      registrationCount: e.allowsRegistration ? getRegistrationCount(e.slug) : 0,
    };
  });
  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  let body: Omit<Event, "slug">;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const required: (keyof typeof body)[] = ["title", "artist", "date", "venue", "description"];
  for (const field of required) {
    if (!body[field] && body[field] !== 0)
      return NextResponse.json({ error: `Campo obligatorio: ${field}` }, { status: 422 });
  }
  const event = createEvent({
    ...body,
    genre: body.genre ?? [],
    lineup: body.lineup ?? [],
    capacity: body.capacity ?? 0,
    isSoldOut: body.isSoldOut ?? false,
    doors: body.doors ?? "22:00",
    showTime: body.showTime ?? "23:00",
    price: body.price ?? null,
    imageUrl: body.imageUrl ?? "",
    allowsRegistration: body.allowsRegistration ?? false,
  });
  return NextResponse.json(event, { status: 201 });
}
