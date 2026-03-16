import { NextResponse } from "next/server";
import { getChapterPages } from "@/lib/mangaService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;
    const data = await getChapterPages(chapterId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("getChapterPages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapter pages" },
      { status: 500 }
    );
  }
}
