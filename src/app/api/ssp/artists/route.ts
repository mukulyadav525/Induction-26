import { NextRequest, NextResponse } from "next/server";
import { verifyPanelPassword } from "@/lib/panelAuth";
import {
  getAllArtistReveals,
  createArtistReveal,
  updateArtistReveal,
  deleteArtistReveal,
  DbArtistReveal,
} from "@/lib/artistsDb";
import { DEFAULT_ARTIST_REVEAL_VARIANT } from "@/lib/revealVariants";

export async function GET(request: NextRequest) {
  try {
    const password = request.nextUrl.searchParams.get("password") ?? "";
    const valid = await verifyPanelPassword(password);
    if (!valid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const artists = await getAllArtistReveals();
    return NextResponse.json({ artists });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const password = typeof body.password === "string" ? body.password : "";
    const valid = await verifyPanelPassword(password);
    if (!valid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data: Omit<DbArtistReveal, "id" | "createdAt" | "updatedAt"> = {
      name: body.name ?? "",
      role: body.role ?? "",
      photoUrl: body.photoUrl ?? "",
      badge: body.badge ?? "",
      sortOrder: Number(body.sortOrder ?? 0),
      revealVariant: body.revealVariant ?? DEFAULT_ARTIST_REVEAL_VARIANT,
    };

    const created = await createArtistReveal(data);
    return NextResponse.json({ artist: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const password = typeof body.password === "string" ? body.password : "";
    const valid = await verifyPanelPassword(password);
    if (!valid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const allowedFields = [
      "name",
      "role",
      "photoUrl",
      "badge",
      "sortOrder",
      "revealVariant",
    ];
    const updates: Partial<
      Omit<DbArtistReveal, "id" | "createdAt" | "updatedAt">
    > = {};
    for (const field of allowedFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    const updated = await updateArtistReveal(id, updates);
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ artist: updated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const password = typeof body.password === "string" ? body.password : "";
    const valid = await verifyPanelPassword(password);
    if (!valid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const deleted = await deleteArtistReveal(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
