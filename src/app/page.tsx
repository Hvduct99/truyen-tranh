import HeroSection from "@/components/HeroSection";
import MangaGridSection from "@/components/MangaGridSection";
import { getFeaturedManga, getLatestManga, getPopularManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, popular, latest] = await Promise.all([
    getFeaturedManga(),
    getPopularManga(10),
    getLatestManga(10),
  ]);

  return (
    <div className="pt-16 pb-12">
      <div className="mt-6">
        <HeroSection featured={featured.data.slice(0, 5)} />
      </div>
      <div className="container-main space-y-10">
        <MangaGridSection
          title="Phổ biến"
          items={popular.data}
          href="/popular"
        />
        <MangaGridSection
          title="Mới cập nhật"
          items={latest.data}
          href="/latest"
        />
      </div>
    </div>
  );
}
