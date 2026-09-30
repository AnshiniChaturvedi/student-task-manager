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
type FormState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; task: Task };

const defaultFilters: Filters = {
  search: "",
  status: "all",
  priority: "all",
};

// Convert frontend "done" to backend "completed"
function toApiStatus(status: string) {
  return status === "done" ? "completed" : status;
}

// Convert backend "completed" to frontend "done"
function toFrontendTask(task: any): Task {
  return {
    ...task,
    status: task.status === "completed" ? "done" : task.status,
  };
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [form, setForm] = useState<FormState>({ mode: "closed" });

  const loadTasks = useCallback(async () => {
    setLoadState("loading");

    try {
      const loadedTasks = await fetchTasks();
      setTasks(loadedTasks);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const closeForm = useCallback(() => {
    setForm({ mode: "closed" });
  }, []);

  const visibleTasks = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return tasks
      .filter(
        (t) =>
          filters.status === "all" ||
          t.status === filters.status
      )
      .filter(
        (t) =>
          filters.priority === "all" ||
          t.priority === filters.priority
      )
      .filter(
        (t) =>
          !q ||
          [t.title, t.subject, t.description].some((f) =>
            f.toLowerCase().includes(q)
          )
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, filters]);

  // ADD / EDIT TASK
  async function saveTask(values: TaskFormValues) {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        subject: values.subject,
        dueDate: values.dueDate,
        priority: values.priority,
        status: toApiStatus(values.status),
      };

      // EDIT
      if (form.mode === "edit") {
        const id = form.task.id;

        const response = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Could not update task");
        }

        const data = await response.json();

        const updatedTask = toFrontendTask(data.task);

        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? updatedTask : task
          )
        );
      }

      // ADD
      else {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Could not create task");
        }

        const data = await response.json();

        const newTask = toFrontendTask(data.task);

        setTasks((prev) => [newTask, ...prev]);
      }

      closeForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving the task.");
    }
  }

  // DELETE TASK
  async function deleteTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete task");
      }

      setTasks((prev) =>
        prev.filter((t) => t.id !== task.id)
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the task.");
    }
  }

  // COMPLETE TASK
  async function completeTask(task: Task) {
    try {
      const payload = {
        title: task.title,
        description: task.description,
        subject: task.subject,
        dueDate: task.dueDate,
        priority: task.priority,
        status: "completed",
      };

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not complete task");
      }

      const data = await response.json();

      const updatedTask = toFrontendTask(data.task);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? updatedTask : t
        )
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while completing the task.");
    }
  }

  const count = (status: Task["status"]) =>
    tasks.filter((t) => t.status === status).length;

  return (
    <div className="space-y-6">
      <Header onAddTask={() => setForm({ mode: "add" })} />

      {loadState === "loading" && <LoadingState />}

      {loadState === "error" && (
        <ErrorState onRetry={loadTasks} />
      )}

      {loadState === "ready" && (
        <>
          <section
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            aria-label="Summary"
          >
            <StatCard
              label="Total tasks"
              value={tasks.length}
            />

            <StatCard
              label="To do"
              value={count("todo")}
            />

            <StatCard
              label="In progress"
              value={count("in-progress")}
            />

            <StatCard
              label="Completed"
              value={count("done")}
            />
          </section>

          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              message="Add your first task to start planning your study time."
              actionLabel="Add task"
              onAction={() => setForm({ mode: "add" })}
            />
          ) : (
            <section
              aria-label="Tasks"
              className="space-y-4"
            >
              <TaskFilters
                filters={filters}
                onChange={setFilters}
              />

              <p
                className="text-sm text-slate-600"
                aria-live="polite"
              >
                Showing {visibleTasks.length} of{" "}
                {tasks.length} tasks
              </p>

              {visibleTasks.length === 0 ? (
                <EmptyState
                  title="No matching tasks"
                  message="Try a different search or clear the filters."
                  actionLabel="Clear filters"
                  onAction={() =>
                    setFilters(defaultFilters)
                  }
                />
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  onEdit={(task) =>
                    setForm({
                      mode: "edit",
                      task,
                    })
                  }
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
          key={
            form.mode === "edit"
              ? form.task.id
              : "add"
          }
          task={
            form.mode === "edit"
              ? form.task
              : undefined
          }
          onSubmit={saveTask}
          onClose={closeForm}
        />
      )}
    </div>
  );
}