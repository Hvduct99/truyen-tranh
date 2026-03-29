import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container-main py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-semibold text-xs">M</span>
              </div>
              <span className="text-sm font-semibold text-txt">MangaVerse</span>
            </Link>
            <p className="mt-2 text-xs text-txt-muted leading-5 max-w-md">
              Đọc truyện tranh online miễn phí. Dữ liệu từ OTruyen API.
              Ứng dụng không lưu trữ nội dung truyện.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-txt-muted">
            <Link href="/popular" className="hover:text-txt transition-colors">Phổ biến</Link>
            <Link href="/latest" className="hover:text-txt transition-colors">Mới nhất</Link>
            <Link href="/genre" className="hover:text-txt transition-colors">Thể loại</Link>
            <Link href="/history" className="hover:text-txt transition-colors">Lịch sử</Link>
            <Link href="/bookmark" className="hover:text-txt transition-colors">Yêu thích</Link>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-xs text-txt-muted">
          Nguồn dữ liệu: OTruyen API &middot; Next.js + Tailwind CSS
        </div>
      </div>
    </footer>
  );
}
