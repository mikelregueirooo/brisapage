import { NextRequest, NextResponse } from "next/server";
import { addVote, getVotes } from "@/lib/votes";
import type { VoteOption } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }
  const votes = await getVotes(slug);
  return NextResponse.json(votes);
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; option?: VoteOption };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, option } = body;
  if (!slug || !option) {
    return NextResponse.json({ error: "Missing slug or option" }, { status: 400 });
  }

  const validOptions: VoteOption[] = ["yes", "maybe", "no"];
  if (!validOptions.includes(option)) {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 });
  }

  const updated = await addVote(slug, option);
  return NextResponse.json(updated, { status: 201 });
}
