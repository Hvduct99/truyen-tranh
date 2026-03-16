import MangaGridSection from "@/components/MangaGridSection";
import { getLatestManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manga moi nhat | MangaVerse Vietnam",
};

export default async function LatestPage() {
  const latest = await getLatestManga(24);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <MangaGridSection
        title="Manga moi cap nhat"
        eyebrow="Latest chapters"
        description="Cac bo truyen vua co chapter moi duoc dang tai."
        items={latest.data}
      />
    </div>
  );
}
