import { Task } from "@/types/task";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error("Could not load tasks");
  }

  const data = await response.json();

  return data.tasks.map((task: Task) => ({
    ...task,
    status: task.status === "completed" ? "done" : task.status,
  }));
}