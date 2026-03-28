import { NextResponse } from "next/server";
import { getMangaTags } from "@/lib/mangaService";

export async function GET() {
  try {
    const tags = await getMangaTags();
    return NextResponse.json(tags);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
