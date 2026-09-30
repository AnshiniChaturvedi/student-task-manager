interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-10 text-center">
      <h2 className="text-lg font-semibold text-rose-800">Tasks did not load</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-rose-700">
        Check your connection and try again. Your tasks are safe.
      </p>
      <button type="button" onClick={onRetry} className="btn-secondary mt-4">
        Try again
      </button>
    </div>
  );
}
