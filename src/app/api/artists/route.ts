import { NextResponse } from "next/server";
import { getFeaturedArtistReveals } from "@/lib/artistsDb";

export const revalidate = 5;

export async function GET() {
  try {
    const artists = await getFeaturedArtistReveals();
    return NextResponse.json({ artists });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
