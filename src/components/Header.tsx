export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-brand md:hidden">StudyBoard</p>
        <h1 className="text-2xl font-bold sm:text-3xl">Your study plan</h1>
        <p className="mt-1 text-sm text-slate-600">Tasks due soon come first.</p>
      </div>
      <button
        type="button"
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
      >
        Add task
      </button>
    </header>
  );
}
