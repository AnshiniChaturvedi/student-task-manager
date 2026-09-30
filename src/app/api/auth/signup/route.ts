import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { getDb } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";
import { UserDoc } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const db = await getDb();

    const existingUser = await db.collection<UserDoc>("users").findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user: UserDoc = {
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    };

    const result = await db.collection<UserDoc>("users").insertOne(user);

    await createSession(result.insertedId.toString());

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: result.insertedId.toString(),
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}