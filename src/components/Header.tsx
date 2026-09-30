interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Your study plan</h1>
        <p className="mt-1 text-sm text-slate-600">Tasks due soonest come first.</p>
      </div>
      <button type="button" onClick={onAddTask} className="btn-primary">
        Add task
      </button>
    </header>
  );
}
