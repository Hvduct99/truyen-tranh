export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-3 text-sm text-txt-muted">Đang tải...</p>
      </div>
    </div>
  );
}
