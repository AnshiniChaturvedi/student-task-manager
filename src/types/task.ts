export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string; // ISO date, e.g. "2026-10-05"
  priority: Priority;
  status: Status;
}
