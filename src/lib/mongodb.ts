import { MongoClient, Db } from "mongodb";

// Reusable MongoDB connection.
// In development, Next.js reloads modules on every change, so the client
// promise is stored on `globalThis` to avoid opening a new connection each time.

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local.");
  }

  if (!globalForMongo._mongoClientPromise) {
    // Fail after 10s instead of the default 30s if Atlas can't be reached.
    const promise = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 }).connect();
    // If the connection fails, log it and clear the cache so the next request can retry.
    promise.catch((err) => {
      console.error("[mongodb] Connection failed:", err instanceof Error ? err.message : err);
      globalForMongo._mongoClientPromise = undefined;
    });
    globalForMongo._mongoClientPromise = promise;
  }
  return globalForMongo._mongoClientPromise;
}

// Returns the database. Uses MONGODB_DB if set, otherwise the database
// named in the connection string.
export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || undefined);
}
