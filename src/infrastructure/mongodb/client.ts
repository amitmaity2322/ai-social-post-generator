import { MongoClient } from "mongodb";
import { getMongoEnv } from "@/shared/config/env";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Genuinely `async`, not just Promise-returning: this makes a missing
 * MONGODB_URI surface as a rejected promise, not a synchronous throw. That
 * matters because auth.ts constructs the adapter with this promise at module
 * import time (Auth.js needs its config synchronously) - a synchronous throw
 * there would crash on import alone, before any request or env var exists.
 */
async function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(getMongoEnv().MONGODB_URI);

  if (process.env.NODE_ENV === "development") {
    // Cached on globalThis so Next.js Fast Refresh (which re-evaluates this
    // module on every edit) reuses the same connection instead of opening a
    // new one per hot-reload.
    global._mongoClientPromise ??= client.connect();
    return global._mongoClientPromise;
  }

  return client.connect();
}

let clientPromise: Promise<MongoClient> | undefined;

/** Used directly by the Auth.js MongoDB adapter, which wants the raw client promise. */
export function getMongoClientPromise(): Promise<MongoClient> {
  clientPromise ??= createClientPromise();
  return clientPromise;
}

/** Used by our own repositories, which want a Db handle, not the client itself. */
export async function getMongoDb() {
  const client = await getMongoClientPromise();
  return client.db();
}
