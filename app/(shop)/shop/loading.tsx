export default function ShopLoading() {
  return (
    <div className="flex flex-1">
      <div className="hidden lg:block w-72 p-6 space-y-6">
        <div className="h-8 w-32 rounded bg-muted animate-pulse" />
        <div className="h-40 rounded bg-muted animate-pulse" />
        <div className="h-40 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex-1 p-6">
        <div className="h-8 w-56 rounded bg-muted animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
