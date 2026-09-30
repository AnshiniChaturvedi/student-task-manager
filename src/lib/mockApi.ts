import { Task } from "@/types/task";

type ApiTask = Omit<Task, "status"> & {
  status: "todo" | "in-progress" | "completed";
};

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error("Could not load tasks");
  }

  const data: { tasks: ApiTask[] } = await response.json();

  return data.tasks.map((task) => ({
    ...task,
    status: task.status === "completed" ? "done" : task.status,
  }));
}