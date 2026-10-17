import MangaListPage, { parsePage } from "@/components/MangaListPage";
import { searchManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim();
  return { title: q ? `Tìm "${q}" | MangaVerse` : "Tìm kiếm | MangaVerse" };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const page = parsePage(sp.page);

  if (!query) {
    return (
      <div className="container-main py-10">
        <div className="card p-10 text-center">
          <h1 className="text-xl font-bold text-txt">Tìm kiếm truyện</h1>
          <p className="mt-2 text-sm text-txt-muted">Nhập tên truyện tiếng Việt hoặc tiếng Anh: Đảo Hải Tặc, Solo Leveling, Spy x Family...</p>
        </div>
      </div>
    );
  }

  return (
    <MangaListPage
      title={`Kết quả cho "${query}"`}
      page={page}
      baseUrl={`/search?q=${encodeURIComponent(query)}`}
      load={() => searchManga(query, page)}
      emptyText="Không tìm thấy truyện nào. Thử tên tiếng Anh hoặc tên gốc xem sao."
    />
  );
}
