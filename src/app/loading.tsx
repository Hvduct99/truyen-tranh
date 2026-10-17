export default function Loading() {
  return (
    <div className="container-main py-4">
      <div className="card p-4">
        <div className="h-5 w-48 rounded bg-bg-muted animate-pulse mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] rounded-md bg-bg-muted animate-pulse" />
              <div className="mt-2 h-3.5 w-4/5 rounded bg-bg-muted animate-pulse" />
              <div className="mt-1.5 h-3 w-1/2 rounded bg-bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
