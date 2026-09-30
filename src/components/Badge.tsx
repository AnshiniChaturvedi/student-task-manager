import { Priority, Status } from "@/types/task";

const styles: Record<Priority | Status, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-emerald-100 text-emerald-700",
  todo: "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
};

const labels: Record<Priority | Status, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function Badge({ value }: { value: Priority | Status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[value]}`}>
      {labels[value]}
    </span>
  );
}
