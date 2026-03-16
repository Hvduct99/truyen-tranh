import HeroSection from "@/components/HeroSection";
import MangaGridSection from "@/components/MangaGridSection";
import StatStrip from "@/components/StatStrip";
import { getFeaturedManga, getLatestManga, getPopularManga } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, popular, latest] = await Promise.all([
    getFeaturedManga(),
    getPopularManga(8, 1),
    getLatestManga(8, 1),
  ]);

  return (
    <div className="pb-20 pt-24 md:pt-28">
      <HeroSection featured={featured.data.slice(0, 4)} />
      <StatStrip />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <MangaGridSection
          title="Kinh điển phải đọc"
          eyebrow="Bộ sưu tập tuyển chọn"
          description="One Piece, Naruto, One Punch-Man, Jujutsu Kaisen và thêm nhiều tượng đài manga được tuyển tay cho trang chủ."
          items={featured.data}
          href="/search?q=one%20piece"
        />
        <MangaGridSection
          title="Đang được theo dõi mạnh"
          eyebrow="Top publishing"
          description="Danh sách lấy từ Jikan, phù hợp để làm mặt tiền homepage có độ tin cậy và nhịp cập nhật ổn định."
          items={popular.data}
          href="/popular"
        />
        <MangaGridSection
          title="Manga mới nổi bật"
          eyebrow="Xu hướng mới"
          description="Hiển thị manga có mốc khởi chạy mới hơn để giao diện luôn có cảm giác tươi và sống."
          items={latest.data}
          href="/latest"
        />
      </div>
    </div>
  );
}
