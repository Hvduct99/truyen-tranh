import { NextRequest, NextResponse } from "next/server";
import { searchManga } from "@/lib/mangaService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q");
    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);

    if (!q) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const data = await searchManga(q, limit, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error("searchManga error:", error);
    return NextResponse.json(
      { error: "Failed to search manga" },
      { status: 500 }
    );
  }
}
