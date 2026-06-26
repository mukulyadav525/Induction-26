import { NextRequest, NextResponse } from "next/server";
import { fetchScheduleRows } from "@/lib/fetchScheduleRows";
import { Track } from "@/lib/scheduleEngine";

export async function GET(request: NextRequest) {
  const trackParam = request.nextUrl.searchParams.get("track")?.toUpperCase();
  const track: Track = trackParam === "PG" ? "PG" : "BTECH";
  const result = await fetchScheduleRows(track);
  return NextResponse.json(result);
}
