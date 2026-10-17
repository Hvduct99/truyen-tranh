import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import ErrorBox from "@/components/ErrorBox";
import { MangaListResponse } from "@/types/manga";

/** Shared layout for paginated list pages (hot, latest, completed, genre, search). */
export default async function MangaListPage({
  title,
  load,
  page,
  baseUrl,
  emptyText = "Không có truyện nào.",
}: {
  title: string;
  load: () => Promise<MangaListResponse>;
  page: number;
  baseUrl: string;
  emptyText?: string;
}) {
  let data: MangaListResponse;
  try {
    data = await load();
  } catch (error) {
    console.error(`${title} error:`, error);
    return <ErrorBox message="Không thể tải dữ liệu từ MangaDex. Vui lòng thử lại sau." />;
  }

  return (
    <div className="container-main py-4">
      <div className="card p-3 sm:p-4">
        {data.items.length > 0 ? (
          <MangaGridSection title={title} items={data.items} columns={6} />
        ) : (
          <>
            <h1 className="section-title mb-3">{title}</h1>
            <p className="py-10 text-center text-sm text-txt-muted">{emptyText}</p>
          </>
        )}
      </div>
      <Pagination currentPage={page} totalPages={Math.ceil(data.total / data.perPage)} baseUrl={baseUrl} />
    </div>
  );
}

export function parsePage(raw?: string) {
  const n = parseInt(raw || "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
