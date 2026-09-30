import { NextResponse } from "next/server";

// Placeholder. GET (list) and POST (create) will be added with MongoDB.
export async function GET() {
  return NextResponse.json({ tasks: [] });
}
