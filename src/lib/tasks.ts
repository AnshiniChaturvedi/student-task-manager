import { ObjectId, WithId } from "mongodb";

// Values accepted by the API. Note: the API uses "completed" for a finished task.
export const PRIORITIES = ["low", "medium", "high"] as const;
export const STATUSES = ["todo", "in-progress", "completed"] as const;

export type ApiPriority = (typeof PRIORITIES)[number];
export type ApiStatus = (typeof STATUSES)[number];

// Shape of a document in the "tasks" collection.
export interface TaskDoc {
  userId: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  priority: ApiPriority;
  status: ApiStatus;
  createdAt: Date;
}

// Shape returned to the client.
export function serializeTask(doc: WithId<TaskDoc>) {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    description: doc.description,
    subject: doc.subject,
    dueDate: doc.dueDate,
    priority: doc.priority,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
}

// Returns an ObjectId, or null when the id is not a valid MongoDB id.
export function parseObjectId(id: string): ObjectId | null {
  return /^[a-fA-F0-9]{24}$/.test(id) ? new ObjectId(id) : null;
}
type TaskInput = Omit<TaskDoc, "createdAt" | "userId">;
type ValidationResult =
  | { ok: true; data: TaskInput }
  | { ok: false; errors: string[] };

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Validates a request body.
// POST: priority/status are optional (default "medium" / "todo").
// PUT (full update): priority and status are required too.
export function validateTaskBody(body: unknown, mode: "create" | "update"): ValidationResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, errors: ["Request body must be a JSON object."] };
  }
  const b = body as Record<string, unknown>;
  const errors: string[] = [];

  const text = (field: string, required: boolean, max: number): string => {
    const value = b[field];
    if (value === undefined || value === null) {
      if (required) errors.push(`${field} is required.`);
      return "";
    }
    if (typeof value !== "string") {
      errors.push(`${field} must be a string.`);
      return "";
    }
    const trimmed = value.trim();
    if (required && trimmed === "") errors.push(`${field} is required.`);
    if (trimmed.length > max) errors.push(`${field} must be at most ${max} characters.`);
    return trimmed;
  };

  const title = text("title", true, 200);
  const description = text("description", false, 2000);
  const subject = text("subject", true, 100);
  const dueDate = text("dueDate", true, 10);
  if (dueDate && !isValidDate(dueDate)) {
    errors.push("dueDate must be a valid date in YYYY-MM-DD format.");
  }

  const enumField = <T extends string>(
    field: string,
    allowed: readonly T[],
    fallback: T,
    required: boolean
  ): T => {
    const value = b[field];
    if (value === undefined || value === null) {
      if (required) errors.push(`${field} is required.`);
      return fallback;
    }
    if (typeof value !== "string" || !allowed.includes(value as T)) {
      errors.push(`${field} must be one of: ${allowed.join(", ")}.`);
      return fallback;
    }
    return value as T;
  };

  const strict = mode === "update";
  const priority = enumField("priority", PRIORITIES, "medium", strict);
  const status = enumField("status", STATUSES, "todo", strict);

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { title, description, subject, dueDate, priority, status } };
}
