import { NextResponse } from "next/server";

import { getDb } from "@/lib/mongodb";
import {
  TaskDoc,
  serializeTask,
  validateTaskBody,
} from "@/lib/tasks";
import {
  errorResponse,
  readJson,
  serverError,
} from "@/lib/apiResponse";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Unauthorized.", 401);
    }

    const db = await getDb();

    const docs = await db
      .collection<TaskDoc>("tasks")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      tasks: docs.map(serializeTask),
    });
  } catch (err) {
    return serverError("GET /api/tasks", err);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Unauthorized.", 401);
    }

    const body = await readJson(request);

    if (body === undefined) {
      return errorResponse(
        "Request body must be valid JSON.",
        400
      );
    }

    const result = validateTaskBody(body, "create");

    if (!result.ok) {
      return errorResponse(
        "Validation failed.",
        400,
        result.errors
      );
    }

    const db = await getDb();

    const doc: TaskDoc = {
      userId,
      ...result.data,
      createdAt: new Date(),
    };

    const { insertedId } = await db
      .collection<TaskDoc>("tasks")
      .insertOne(doc);

    return NextResponse.json(
      {
        task: serializeTask({
          _id: insertedId,
          ...doc,
        }),
      },
      { status: 201 }
    );
  } catch (err) {
    return serverError("POST /api/tasks", err);
  }
}