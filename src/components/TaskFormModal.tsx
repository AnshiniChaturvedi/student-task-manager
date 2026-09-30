"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Task, TaskFormValues } from "@/types/task";

interface TaskFormModalProps {
  task?: Task; // present = edit mode, missing = add mode
  onSubmit: (values: TaskFormValues) => void;
  onClose: () => void;
}

const emptyForm: TaskFormValues = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
  priority: "medium",
  status: "todo",
};

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

export default function TaskFormModal({ task, onSubmit, onClose }: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(
    task ? { title: task.title, description: task.description, subject: task.subject, dueDate: task.dueDate, priority: task.priority, status: task.status } : emptyForm
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (!values.title.trim()) found.title = "Enter a title.";
    if (!values.subject.trim()) found.subject = "Enter a subject.";
    if (!values.dueDate) found.dueDate = "Pick a due date.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ ...values, title: values.title.trim(), subject: values.subject.trim(), description: values.description.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
        className="max-h-[92vh] w-full space-y-4 overflow-y-auto rounded-t-2xl bg-white p-6 sm:max-w-lg sm:rounded-2xl"
      >
        <h2 id="form-title" className="text-xl font-bold">{task ? "Edit task" : "Add task"}</h2>

        <Field label="Title" htmlFor="title" error={errors.title}>
          <input id="title" autoFocus value={values.title} onChange={(e) => set("title", e.target.value)} className="field" />
        </Field>

        <Field label="Subject" htmlFor="subject" error={errors.subject}>
          <input id="subject" value={values.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Physics" className="field" />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea id="description" rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} className="field" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
            <input id="dueDate" type="date" value={values.dueDate} onChange={(e) => set("dueDate", e.target.value)} className="field" />
          </Field>
          <Field label="Priority" htmlFor="priority">
            <select id="priority" value={values.priority} onChange={(e) => set("priority", e.target.value as TaskFormValues["priority"])} className="field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Status" htmlFor="status">
            <select id="status" value={values.status} onChange={(e) => set("status", e.target.value as TaskFormValues["status"])} className="field">
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">{task ? "Save changes" : "Add task"}</button>
        </div>
      </form>
    </div>
  );
}
