import { NextRequest, NextResponse } from "next/server";
import { verifyPanelPassword } from "@/lib/panelAuth";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  DbNotice,
} from "@/lib/noticesDb";

export async function GET(request: NextRequest) {
  try {
    const password = request.nextUrl.searchParams.get("password") ?? "";
    const valid = await verifyPanelPassword(password);
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notices = await getAllNotices();
    return NextResponse.json({ notices });
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
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data: Omit<DbNotice, "id" | "created_at" | "updated_at"> = {
      title: body.title ?? "",
      message: body.message ?? "",
      severity: body.severity ?? "info",
      is_active: body.is_active ?? true,
      sort_order: Number(body.sort_order ?? 0),
    };

    const created = await createNotice(data);
    return NextResponse.json({ notice: created }, { status: 201 });
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
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const allowedFields = ["title", "message", "severity", "is_active", "sort_order"];
    const updates: Partial<Omit<DbNotice, "id" | "created_at" | "updated_at">> = {};
    for (const field of allowedFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    const updated = await updateNotice(id, updates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ notice: updated });
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
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const deleted = await deleteNotice(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
