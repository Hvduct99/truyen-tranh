import MangaGridSection from "@/components/MangaGridSection";
import { getLatestManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manga mới nhất | MangaVerse Vietnam",
};

export default async function LatestPage() {
  const latest = await getLatestManga(24, 1);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <MangaGridSection
        title="Manga mới và đáng chú ý"
        eyebrow="Fresh releases"
        description="Dùng để giữ nhịp cập nhật nội dung trên website, đồng thời tạo cảm giác site luôn sống và chuyển động."
        items={latest.data}
      />
    </div>
  );
}
