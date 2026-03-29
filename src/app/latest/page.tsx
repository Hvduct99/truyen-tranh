import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { getLatestManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Truyện mới nhất | MangaVerse",
};

interface LatestPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function LatestPage({ searchParams }: LatestPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  try {
    const data = await getLatestManga(page);
    const totalPages = Math.ceil(data.totalItems / data.totalItemsPerPage);

    return (
      <div className="container-main pt-20 pb-12">
        <MangaGridSection title="Truyện mới cập nhật" items={data.items} />
        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/latest" />
      </div>
    );
  } catch (error) {
    console.error("Latest page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }
}
