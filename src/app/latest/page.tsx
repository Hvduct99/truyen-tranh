import MangaListPage, { parsePage } from "@/components/MangaListPage";
import { getLatestUpdates } from "@/lib/mangaService";

export const dynamic = "force-dynamic";
export const metadata = { title: "Truyện mới cập nhật | MangaVerse" };

export default async function LatestPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  return <MangaListPage title="Truyện mới cập nhật" page={page} baseUrl="/latest" load={() => getLatestUpdates(page)} />;
}
