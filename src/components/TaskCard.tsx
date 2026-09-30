import { Task } from "@/types/task";
import Badge from "./Badge";

export default function TaskCard({ task }: { task: Task }) {
  const due = new Date(task.dueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold">{task.title}</h3>
        <Badge value={task.priority} />
      </div>
      <p className="mt-1 text-sm text-slate-600">{task.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-medium text-brand">{task.subject}</span>
        <span className="text-slate-600">Due {due}</span>
        <Badge value={task.status} />
      </div>
      <div className="mt-3 flex gap-3 text-sm">
        <button type="button" className="font-medium text-slate-700 hover:text-brand">
          Edit
        </button>
        <button type="button" className="font-medium text-slate-700 hover:text-rose-600">
          Delete
        </button>
      </div>
    </article>
  );
}
