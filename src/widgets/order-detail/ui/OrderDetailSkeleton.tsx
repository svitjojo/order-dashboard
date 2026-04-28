export function OrderDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 p-6">
      <div className="h-5 w-24 rounded bg-muted" />
      <div className="h-8 w-56 rounded bg-muted" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-48 rounded-lg bg-muted" />
        <div className="h-48 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
