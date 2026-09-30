import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
        No tasks yet. Select Add task to create your first one.
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
