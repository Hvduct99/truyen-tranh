import MangaListPage, { parsePage } from "@/components/MangaListPage";
import { getCompletedManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";
export const metadata = { title: "Truyện hoàn thành | MangaVerse" };

export default async function CompletedPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  return <MangaListPage title="Truyện đã hoàn thành" page={page} baseUrl="/completed" load={() => getCompletedManga(page)} />;
}
