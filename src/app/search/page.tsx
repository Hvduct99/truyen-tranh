import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { searchManga } from "@/lib/api";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 24;
  const offset = (page - 1) * limit;

  const result = query
    ? await searchManga(query, limit, offset)
    : { data: [], total: 0, offset: 0, limit };

  const totalPages = Math.ceil(result.total / limit);

  return (
    <div className="container-main pt-20 pb-12">
      {query ? (
        <>
          <MangaGridSection
            title={`Kết quả cho "${query}"`}
            items={result.data}
          />
          {result.data.length === 0 && (
            <div className="card p-8 text-center mt-4">
              <p className="text-txt-secondary">Không tìm thấy kết quả nào.</p>
              <p className="text-sm text-txt-muted mt-1">
                Thử tìm kiếm với từ khóa khác.
              </p>
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/search?q=${encodeURIComponent(query)}`}
          />
        </>
      ) : (
        <div className="card p-10 text-center">
          <svg
            className="w-12 h-12 text-txt-muted mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <h1 className="text-xl font-semibold text-txt">Tìm kiếm manga</h1>
          <p className="mt-2 text-sm text-txt-muted">
            Nhập tên truyện: One Piece, Naruto, Berserk, Solo Leveling...
          </p>
        </div>
      )}
    </div>
  );
}
