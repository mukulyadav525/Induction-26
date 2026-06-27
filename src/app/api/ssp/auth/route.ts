import { NextRequest, NextResponse } from "next/server";
import { verifyPanelPassword } from "@/lib/panelAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    console.log(password);
    const valid = await verifyPanelPassword(password);
    if (!valid) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request" },
      { status: 400 },
    );
  }
}
