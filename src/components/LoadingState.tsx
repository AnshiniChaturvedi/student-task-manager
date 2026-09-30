export default function LoadingState() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading tasks</span>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
            <div className="mt-6 h-8 w-1/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
