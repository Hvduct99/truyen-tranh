import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-bg-dark text-white/70">
      <div className="container-main py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white font-bold">M</span>
              <span className="text-lg font-bold text-white">
                Manga<span className="text-accent">Verse</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6">
              Đọc truyện tranh online miễn phí, ưu tiên bản dịch tiếng Việt. Dữ liệu và hình ảnh từ{" "}
              <a href="https://mangadex.org" target="_blank" rel="noreferrer" className="text-white hover:text-accent">
                MangaDex
              </a>{" "}
              cùng các nhóm dịch. Trang web không lưu trữ nội dung truyện.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link href="/popular" className="hover:text-white">Truyện hot</Link>
            <Link href="/latest" className="hover:text-white">Mới cập nhật</Link>
            <Link href="/completed" className="hover:text-white">Hoàn thành</Link>
            <Link href="/genre" className="hover:text-white">Thể loại</Link>
            <Link href="/history" className="hover:text-white">Lịch sử đọc</Link>
            <Link href="/bookmark" className="hover:text-white">Theo dõi</Link>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/50">
          © {new Date().getFullYear()} MangaVerse · Nguồn dữ liệu: MangaDex
        </div>
      </div>
    </footer>
  );
}
