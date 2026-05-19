import { NextRequest, NextResponse } from "next/server";
import { addVote, getVotes } from "@/lib/votes";
import type { VoteOption } from "@/types";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  return NextResponse.json(getVotes(slug));
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; option?: VoteOption };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { slug, option } = body;
  if (!slug || !option) return NextResponse.json({ error: "Missing slug or option" }, { status: 400 });
  const valid: VoteOption[] = ["yes", "maybe", "no"];
  if (!valid.includes(option)) return NextResponse.json({ error: "Invalid option" }, { status: 400 });
  return NextResponse.json(addVote(slug, option), { status: 201 });
}
