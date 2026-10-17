import MangaListPage, { parsePage } from "@/components/MangaListPage";
import { getPopularManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";
export const metadata = { title: "Truyện hot | MangaVerse" };

export default async function PopularPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  return <MangaListPage title="Truyện hot nhất" page={page} baseUrl="/popular" load={() => getPopularManga(page)} />;
}
