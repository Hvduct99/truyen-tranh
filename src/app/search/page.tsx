import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { searchManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  try {
    const result = query
      ? await searchManga(query, page)
      : { items: [], totalItems: 0, currentPage: 1, totalItemsPerPage: 24 };

    const totalPages = Math.ceil(result.totalItems / result.totalItemsPerPage);

    return (
      <div className="container-main pt-20 pb-12">
        {query ? (
          <>
            <MangaGridSection title={`Kết quả cho "${query}"`} items={result.items} />
            {result.items.length === 0 && (
              <div className="card p-8 text-center mt-4">
                <p className="text-txt-secondary">Không tìm thấy kết quả nào.</p>
              </div>
            )}
            <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/search?q=${encodeURIComponent(query)}`} />
          </>
        ) : (
          <div className="card p-10 text-center">
            <svg className="w-12 h-12 text-txt-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <h1 className="text-xl font-semibold text-txt">Tìm kiếm truyện</h1>
            <p className="mt-2 text-sm text-txt-muted">Nhập tên truyện: One Piece, Naruto, Solo Leveling...</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Search page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải dữ liệu.</p>
        </div>
      </div>
    );
  }
}
