export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-lg font-semibold text-white">
            MangaVerse Vietnam
          </p>
          <p className="mt-2 leading-7 text-slate-400">
            Doc truyen tranh online mien phi tu MangaDex. Ung dung nay khong luu
            tru noi dung truyen, chi doc tu API cong khai cua MangaDex.
          </p>
        </div>
        <div className="space-y-2 text-right text-slate-500">
          <p>Nguon: MangaDex API</p>
          <p>Next.js + Tailwind CSS</p>
          <p>Hostinger Business</p>
        </div>
      </div>
    </footer>
  );
}
