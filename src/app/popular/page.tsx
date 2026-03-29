import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { getCompletedManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Truyện hoàn thành | MangaVerse",
};

interface PopularPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PopularPage({ searchParams }: PopularPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  try {
    const data = await getCompletedManga(page);
    const totalPages = Math.ceil(data.totalItems / data.totalItemsPerPage);

    return (
      <div className="container-main pt-20 pb-12">
        <MangaGridSection title="Truyện hoàn thành" items={data.items} />
        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/popular" />
      </div>
    );
  } catch (error) {
    console.error("Popular page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }
}
