import { NextResponse } from "next/server";
import { getMangaById } from "@/lib/mangaService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getMangaById(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("getMangaById error:", error);
    return NextResponse.json(
      { error: "Failed to fetch manga details" },
      { status: 500 }
    );
  }
}
