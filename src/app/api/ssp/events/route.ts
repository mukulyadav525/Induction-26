import { NextRequest, NextResponse } from "next/server";
import { verifyPanelPassword } from "@/lib/panelAuth";
import {
  initScheduleTable,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  DbEvent,
} from "@/lib/scheduleDb";

async function guardedRequest(request: NextRequest): Promise<string | null> {
  const body = await request.json();
  const password = typeof body.password === "string" ? body.password : "";
  const valid = await verifyPanelPassword(password);
  if (!valid) return null;
  return JSON.stringify(body);
}

export async function GET() {
  try {
    await initScheduleTable();
    const events = await getAllEvents();
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initScheduleTable();
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const password = typeof body.password === "string" ? body.password : "";
    const valid = await verifyPanelPassword(password);
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data: Omit<DbEvent, "id" | "created_at" | "updated_at"> = {
      track: body.track ?? "ALL",
      day_label: body.day_label ?? "",
      day_index: Number(body.day_index ?? 0),
      time: body.time ?? "",
      end_time: body.end_time ?? "",
      event: body.event ?? "",
      venue: body.venue ?? "",
      speaker: body.speaker ?? "",
      status: body.status ?? "",
      type: body.type ?? "",
      sort_order: Number(body.sort_order ?? 0),
    };

    const created = await createEvent(data);
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initScheduleTable();
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const password = typeof body.password === "string" ? body.password : "";
    const valid = await verifyPanelPassword(password);
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const allowedFields = ["track","day_label","day_index","time","end_time","event","venue","speaker","status","type","sort_order"];
    const updates: Partial<Omit<DbEvent, "id" | "created_at" | "updated_at">> = {};
    for (const field of allowedFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    const updated = await updateEvent(id, updates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event: updated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initScheduleTable();
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const password = typeof body.password === "string" ? body.password : "";
    const valid = await verifyPanelPassword(password);
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const deleted = await deleteEvent(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
