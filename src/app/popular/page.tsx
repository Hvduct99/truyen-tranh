import MangaGridSection from "@/components/MangaGridSection";
import { getPopularManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manga phổ biến | MangaVerse Vietnam",
};

export default async function PopularPage() {
  const popular = await getPopularManga(24, 1);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <MangaGridSection
        title="Manga phổ biến"
        eyebrow="Most followed"
        description="Tập manga đang có độ chú ý cao, phù hợp để làm trang landing cho người dùng mới vào site."
        items={popular.data}
      />
    </div>
  );
}
