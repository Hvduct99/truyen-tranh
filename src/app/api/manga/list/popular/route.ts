import { NextRequest, NextResponse } from "next/server";
import { getPopularManga } from "@/lib/mangaService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Number(searchParams.get("limit") || 24);
    const page = Number(searchParams.get("page") || 1);

    const data = await getPopularManga(limit, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error("getPopularManga error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular manga" },
      { status: 500 }
    );
  }
}
