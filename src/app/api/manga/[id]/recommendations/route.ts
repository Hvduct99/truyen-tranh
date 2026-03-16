import { NextResponse } from "next/server";
import { getMangaRecommendations } from "@/lib/mangaService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getMangaRecommendations(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("getRecommendations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
