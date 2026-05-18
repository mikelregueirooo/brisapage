import { NextRequest, NextResponse } from "next/server";
import { addRegistration, getRegistrationCount } from "@/lib/registrations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const count = await getRegistrationCount(slug);
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; name?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, name, email } = body;
  if (!slug || !name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "El email no tiene un formato válido." }, { status: 422 });
  }

  const result = await addRegistration(slug, name, email);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ count: 1, message: "Inscripción completada." }, { status: 201 });
}
