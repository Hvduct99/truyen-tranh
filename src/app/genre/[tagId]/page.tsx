import Link from "next/link";
import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { getMangaByGenre } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface GenreDetailPageProps {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: GenreDetailPageProps) {
  const { tagId } = await params;
  return {
    title: `${tagId} | MangaVerse`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: GenreDetailPageProps) {
  const { tagId } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));

  try {
    const data = await getMangaByGenre(tagId, page);
    const totalPages = Math.ceil(data.totalItems / data.totalItemsPerPage);

    return (
      <div className="container-main pt-20 pb-12">
        <MangaGridSection title={tagId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} items={data.items} />
        {data.items.length === 0 && (
          <div className="card p-8 text-center mt-4">
            <p className="text-txt-muted text-sm">Không tìm thấy truyện nào.</p>
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/genre/${tagId}`} />
      </div>
    );
  } catch (error) {
    console.error("Genre detail error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải dữ liệu.</p>
          <Link href="/genre" className="btn-primary mt-4 inline-flex">Quay lại</Link>
        </div>
      </div>
    );
  }
}
