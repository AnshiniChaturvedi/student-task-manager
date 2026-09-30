export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string; // "YYYY-MM-DD"
  priority: Priority;
  status: Status;
}

// What the Add/Edit form works with (the id is created separately).
export type TaskFormValues = Omit<Task, "id">;
