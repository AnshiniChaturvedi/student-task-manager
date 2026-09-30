import { Task } from "@/types/task";
import { formatDate, isOverdue } from "@/lib/date";
import Badge from "./Badge";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const done = task.status === "done";
  const overdue = !done && isOverdue(task.dueDate);

  return (
    <article className={`flex flex-col rounded-xl border border-slate-200 bg-white p-4 ${done ? "opacity-75" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className={`font-semibold ${done ? "text-slate-500 line-through" : ""}`}>{task.title}</h3>
        <Badge value={task.priority} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-medium text-brand">{task.subject}</span>
        <span className={overdue ? "font-medium text-rose-600" : "text-slate-600"}>
          {overdue ? "Overdue: " : "Due "}
          {formatDate(task.dueDate)}
        </span>
        <Badge value={task.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-sm">
        <button
          type="button"
          onClick={() => onComplete(task)}
          disabled={done}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          {done ? "Completed" : "Complete"}
        </button>
        <button type="button" onClick={() => onEdit(task)} className="rounded-lg px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
          Edit
        </button>
        <button type="button" onClick={() => onDelete(task)} className="rounded-lg px-3 py-1.5 font-medium text-rose-600 hover:bg-rose-50">
          Delete
        </button>
      </div>
    </article>
  );
}
