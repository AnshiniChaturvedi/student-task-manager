import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
}

export default function TaskList({ tasks, onEdit, onDelete, onComplete }: TaskListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onComplete={onComplete} />
      ))}
    </div>
  );
}
