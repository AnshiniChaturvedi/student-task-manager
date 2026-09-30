import { sampleTasks } from "@/data/sampleTasks";
import { Task } from "@/types/task";

// Set to true to preview the error state.
const SIMULATE_ERROR = false;

// Pretends to be a network request. We will swap this for a real
// fetch("/api/tasks") call when the backend is ready.
export async function fetchTasks(): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (SIMULATE_ERROR) throw new Error("Could not load tasks");
  return sampleTasks;
}
