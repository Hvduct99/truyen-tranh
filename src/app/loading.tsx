export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-6 text-center backdrop-blur-xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300" />
        <p className="mt-4 text-sm uppercase tracking-[0.28em] text-slate-400">Đang tải manga</p>
      </div>
    </div>
  );
}
