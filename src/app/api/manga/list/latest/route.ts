import { NextRequest, NextResponse } from "next/server";
import { getLatestManga } from "@/lib/mangaService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Number(searchParams.get("limit") || 24);
    const offset = Number(searchParams.get("offset") || 0);

    const data = await getLatestManga(limit, offset);
    return NextResponse.json(data);
  } catch (error) {
    console.error("getLatestManga error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest manga" },
      { status: 500 }
    );
  }
}
