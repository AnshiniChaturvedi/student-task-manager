import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { TaskDoc, parseObjectId, serializeTask, validateTaskBody } from "@/lib/tasks";
import { errorResponse, readJson, serverError } from "@/lib/apiResponse";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/tasks/[id] -> one task
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const _id = parseObjectId(id);
  if (!_id) return errorResponse("Invalid task id.", 400);

  try {
    const db = await getDb();
    const doc = await db.collection<TaskDoc>("tasks").findOne({ _id });
    if (!doc) return errorResponse("Task not found.", 404);
    return NextResponse.json({ task: serializeTask(doc) });
  } catch (err) {
    return serverError("GET /api/tasks/[id]", err);
  }
}

// PUT /api/tasks/[id] -> update a task (createdAt is never changed)
export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const _id = parseObjectId(id);
  if (!_id) return errorResponse("Invalid task id.", 400);

  const body = await readJson(request);
  if (body === undefined) return errorResponse("Request body must be valid JSON.", 400);

  const result = validateTaskBody(body, "update");
  if (!result.ok) return errorResponse("Validation failed.", 400, result.errors);

  try {
    const db = await getDb();
    const updated = await db
      .collection<TaskDoc>("tasks")
      .findOneAndUpdate({ _id }, { $set: result.data }, { returnDocument: "after" });
    if (!updated) return errorResponse("Task not found.", 404);
    return NextResponse.json({ task: serializeTask(updated) });
  } catch (err) {
    return serverError("PUT /api/tasks/[id]", err);
  }
}

// DELETE /api/tasks/[id] -> delete a task
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const _id = parseObjectId(id);
  if (!_id) return errorResponse("Invalid task id.", 400);

  try {
    const db = await getDb();
    const { deletedCount } = await db.collection<TaskDoc>("tasks").deleteOne({ _id });
    if (deletedCount === 0) return errorResponse("Task not found.", 404);
    return NextResponse.json({ message: "Task deleted.", id });
  } catch (err) {
    return serverError("DELETE /api/tasks/[id]", err);
  }
}
