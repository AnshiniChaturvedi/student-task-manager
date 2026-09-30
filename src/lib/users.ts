import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function findUserByEmail(email: string) {
  const db = await getDb();

  return db.collection<UserDoc>("users").findOne({
    email: email.toLowerCase(),
  });
}

export async function findUserById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const db = await getDb();

  return db.collection<UserDoc>("users").findOne({
    _id: new ObjectId(id),
  });
}