import { NextRequest, NextResponse } from "next/server";
import { getChapters } from "@/lib/mangaService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = request.nextUrl;
    const limit = Number(searchParams.get("limit") || 96);
    const offset = Number(searchParams.get("offset") || 0);

    const data = await getChapters(id, limit, offset);
    return NextResponse.json(data);
  } catch (error) {
    console.error("getChapters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
