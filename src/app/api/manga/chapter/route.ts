import { NextRequest, NextResponse } from "next/server";
import { getChapterDetail } from "@/lib/mangaService";

export async function GET(request: NextRequest) {
  const apiUrl = request.nextUrl.searchParams.get("apiUrl");
  if (!apiUrl) {
    return NextResponse.json({ error: "apiUrl is required" }, { status: 400 });
  }
  try {
    const result = await getChapterDetail(apiUrl);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
