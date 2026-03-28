import MangaGridSection from "@/components/MangaGridSection";
import Pagination from "@/components/Pagination";
import { getPopularManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manga phổ biến | MangaVerse",
};

interface PopularPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PopularPage({ searchParams }: PopularPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 24;
  const offset = (page - 1) * limit;

  const data = await getPopularManga(limit, offset);
  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="container-main pt-20 pb-12">
      <MangaGridSection title="Manga phổ biến" items={data.data} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/popular" />
    </div>
  );
}
