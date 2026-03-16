import { NextResponse } from "next/server";
import { getFeaturedManga } from "@/lib/mangaService";

export async function GET() {
  try {
    const data = await getFeaturedManga();
    return NextResponse.json(data);
  } catch (error) {
    console.error("getFeaturedManga error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured manga" },
      { status: 500 }
    );
  }
}
