"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Task, TaskFormValues } from "@/types/task";
import { fetchTasks } from "@/lib/mockApi";
import Header from "./Header";
import StatCard from "./StatCard";
import TaskFilters, { Filters } from "./TaskFilters";
import TaskList from "./TaskList";
import TaskFormModal from "./TaskFormModal";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

type LoadState = "loading" | "error" | "ready";
type FormState = { mode: "closed" } | { mode: "add" } | { mode: "edit"; task: Task };

const defaultFilters: Filters = { search: "", status: "all", priority: "all" };

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [form, setForm] = useState<FormState>({ mode: "closed" });

  const loadTasks = useCallback(async () => {
    setLoadState("loading");
    try {
      setTasks(await fetchTasks());
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const closeForm = useCallback(() => setForm({ mode: "closed" }), []);

  const visibleTasks = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks
      .filter((t) => filters.status === "all" || t.status === filters.status)
      .filter((t) => filters.priority === "all" || t.priority === filters.priority)
      .filter((t) => !q || [t.title, t.subject, t.description].some((f) => f.toLowerCase().includes(q)))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, filters]);

  function saveTask(values: TaskFormValues) {
    if (form.mode === "edit") {
      const id = form.task.id;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...values } : t)));
    } else {
      setTasks((prev) => [...prev, { id: Date.now().toString(), ...values }]);
    }
    closeForm();
  }

  function deleteTask(task: Task) {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }
  }

  function completeTask(task: Task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "done" } : t)));
  }

  const count = (status: Task["status"]) => tasks.filter((t) => t.status === status).length;

  return (
    <div className="space-y-6">
      <Header onAddTask={() => setForm({ mode: "add" })} />

      {loadState === "loading" && <LoadingState />}
      {loadState === "error" && <ErrorState onRetry={loadTasks} />}

      {loadState === "ready" && (
        <>
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
            <StatCard label="Total tasks" value={tasks.length} />
            <StatCard label="To do" value={count("todo")} />
            <StatCard label="In progress" value={count("in-progress")} />
            <StatCard label="Completed" value={count("done")} />
          </section>

          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              message="Add your first task to start planning your study time."
              actionLabel="Add task"
              onAction={() => setForm({ mode: "add" })}
            />
          ) : (
            <section aria-label="Tasks" className="space-y-4">
              <TaskFilters filters={filters} onChange={setFilters} />
              <p className="text-sm text-slate-600" aria-live="polite">
                Showing {visibleTasks.length} of {tasks.length} tasks
              </p>
              {visibleTasks.length === 0 ? (
                <EmptyState
                  title="No matching tasks"
                  message="Try a different search or clear the filters."
                  actionLabel="Clear filters"
                  onAction={() => setFilters(defaultFilters)}
                />
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  onEdit={(task) => setForm({ mode: "edit", task })}
                  onDelete={deleteTask}
                  onComplete={completeTask}
                />
              )}
            </section>
          )}
        </>
      )}

      {form.mode !== "closed" && (
        <TaskFormModal
          key={form.mode === "edit" ? form.task.id : "add"}
          task={form.mode === "edit" ? form.task : undefined}
          onSubmit={saveTask}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
