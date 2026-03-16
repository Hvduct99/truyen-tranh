import MangaGridSection from "@/components/MangaGridSection";
import { getPopularManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manga pho bien | MangaVerse Vietnam",
};

export default async function PopularPage() {
  const popular = await getPopularManga(24);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <MangaGridSection
        title="Manga pho bien"
        eyebrow="Most followed"
        description="Nhung bo truyen duoc yeu thich va theo doi nhieu nhat tren MangaDex."
        items={popular.data}
      />
    </div>
  );
}
