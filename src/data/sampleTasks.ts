import { Task } from "@/types/task";

// Temporary data for the UI. Replaced by MongoDB data later.
export const sampleTasks: Task[] = [
  { id: "1", title: "Solve rotational motion problems", description: "Complete exercise set 4, questions 1 to 25.", subject: "Physics", dueDate: "2026-10-03", priority: "high", status: "in-progress" },
  { id: "2", title: "Revise organic reaction mechanisms", description: "Alkyl halides and alcohols summary sheet.", subject: "Chemistry", dueDate: "2026-10-06", priority: "medium", status: "todo" },
  { id: "3", title: "Finish integration worksheet", description: "Definite integrals and area under curves.", subject: "Mathematics", dueDate: "2026-09-29", priority: "high", status: "todo" },
  { id: "4", title: "Review last mock test errors", description: "Write down every mistake and its fix.", subject: "Mock Test", dueDate: "2026-09-28", priority: "low", status: "done" },
  { id: "5", title: "Memorise periodic table trends", description: "Ionisation energy and electronegativity exceptions.", subject: "Chemistry", dueDate: "2026-10-08", priority: "low", status: "todo" },
  { id: "6", title: "Practise vectors and 3D geometry", description: "Chapter test prep, 20 mixed questions.", subject: "Mathematics", dueDate: "2026-10-05", priority: "medium", status: "in-progress" },
];
