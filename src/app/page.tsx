import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import TaskManager from "@/components/TaskManager";

export default async function HomePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return <TaskManager />;
}