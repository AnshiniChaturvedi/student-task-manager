import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import TaskList from "@/components/TaskList";
import { sampleTasks } from "@/data/sampleTasks";

export default function DashboardPage() {
  const tasks = [...sampleTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const count = (status: string) => tasks.filter((t) => t.status === status).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 space-y-6 p-4 sm:p-8">
        <Header />
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
          <StatCard label="Total tasks" value={tasks.length} />
          <StatCard label="To do" value={count("todo")} />
          <StatCard label="In progress" value={count("in-progress")} />
          <StatCard label="Done" value={count("done")} />
        </section>
        <section aria-label="Tasks">
          <TaskList tasks={tasks} />
        </section>
      </main>
    </div>
  );
}
