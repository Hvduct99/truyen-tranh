import HeroSection from "@/components/HeroSection";
import MangaGridSection from "@/components/MangaGridSection";
import { getFeaturedManga, getLatestManga, getPopularManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
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
  } catch (error) {
    console.error("Home page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }
}
