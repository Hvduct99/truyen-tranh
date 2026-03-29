import HeroSection from "@/components/HeroSection";
import MangaGridSection from "@/components/MangaGridSection";
import { getHomeManga, getLatestManga } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const [home, latest] = await Promise.all([
      getHomeManga(),
      getLatestManga(1),
    ]);

    return (
      <div className="pt-16 pb-12">
        <div className="mt-6">
          <HeroSection featured={home.items.slice(0, 5)} />
        </div>
        <div className="container-main space-y-10">
          <MangaGridSection
            title="Mới cập nhật"
            items={home.items.slice(0, 10)}
            href="/latest"
          />
          <MangaGridSection
            title="Truyện mới"
            items={latest.items.slice(0, 10)}
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
