import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import TaskManager from "@/components/TaskManager";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileNav />
        <main className="p-4 sm:p-8">
          <TaskManager />
        </main>
      </div>
    </div>
  );
}
