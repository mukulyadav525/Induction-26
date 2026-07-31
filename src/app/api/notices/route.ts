import { NextResponse } from "next/server";
import { getActiveNotices } from "@/lib/noticesDb";

export const revalidate = 5;

export async function GET() {
  try {
    const notices = await getActiveNotices();
    return NextResponse.json({ notices });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
