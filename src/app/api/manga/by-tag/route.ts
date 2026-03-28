import { NextRequest, NextResponse } from "next/server";
import { getMangaByTag } from "@/lib/mangaService";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tagId = searchParams.get("tagId");
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!tagId) {
    return NextResponse.json({ error: "tagId is required" }, { status: 400 });
  }

  try {
    const result = await getMangaByTag(tagId, limit, offset);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
