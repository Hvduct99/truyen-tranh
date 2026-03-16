import HeroSection from "@/components/HeroSection";
import MangaGridSection from "@/components/MangaGridSection";
import StatStrip from "@/components/StatStrip";
import { getFeaturedManga, getLatestManga, getPopularManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, popular, latest] = await Promise.all([
    getFeaturedManga(),
    getPopularManga(8),
    getLatestManga(8),
  ]);

  return (
    <div className="pb-20 pt-24 md:pt-28">
      <HeroSection featured={featured.data.slice(0, 4)} />
      <StatStrip />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <MangaGridSection
          title="Manga pho bien nhat"
          eyebrow="Top followed"
          description="Nhung bo truyen duoc theo doi nhieu nhat tren MangaDex."
          items={popular.data}
          href="/popular"
        />
        <MangaGridSection
          title="Moi cap nhat"
          eyebrow="Latest updates"
          description="Cac bo truyen vua co chapter moi, cap nhat lien tuc."
          items={latest.data}
          href="/latest"
        />
      </div>
    </div>
  );
}
