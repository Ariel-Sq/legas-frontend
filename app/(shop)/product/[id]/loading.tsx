export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square rounded-lg bg-muted animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-10 w-1/3 rounded bg-muted animate-pulse" />
          <div className="h-24 rounded bg-muted animate-pulse" />
          <div className="h-12 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
