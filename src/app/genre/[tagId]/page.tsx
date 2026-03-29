import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { getMangaByTag, getMangaTags } from "@/lib/api";

export const dynamic = "force-dynamic";

interface GenreDetailPageProps {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: GenreDetailPageProps) {
  const { tagId } = await params;
  const tags = await getMangaTags();
  const tag = tags.find((t) => t.id === tagId);
  return {
    title: `${tag?.name || "Thể loại"} | MangaVerse`,
  };
}

export default async function GenreDetailPage({
  params,
  searchParams,
}: GenreDetailPageProps) {
  const { tagId } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = 24;
  const offset = (page - 1) * limit;

  const [data, tags] = await Promise.all([
    getMangaByTag(tagId, limit, offset),
    getMangaTags(),
  ]);

  const tag = tags.find((t) => t.id === tagId);
  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="container-main pt-20 pb-12">
      <MangaGridSection
        title={tag?.name || "Thể loại"}
        items={data.data}
      />
      {data.data.length === 0 && (
        <div className="card p-8 text-center mt-4">
          <p className="text-txt-muted text-sm">Không tìm thấy manga nào.</p>
        </div>
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl={`/genre/${tagId}`}
      />
    </div>
  );
}
