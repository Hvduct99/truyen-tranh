import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { getLatestManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manga mới nhất | MangaVerse",
};

interface LatestPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function LatestPage({ searchParams }: LatestPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 24;
  const offset = (page - 1) * limit;

  const data = await getLatestManga(limit, offset);
  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="container-main pt-20 pb-12">
      <MangaGridSection title="Manga mới cập nhật" items={data.data} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/latest" />
    </div>
  );
}
