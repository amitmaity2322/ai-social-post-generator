import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import { MongoUserRepository } from "@/infrastructure/repositories/MongoUserRepository";
import { getMongoDb } from "@/infrastructure/mongodb/client";

export async function createUserRepository(): Promise<UserRepositoryPort> {
  const db = await getMongoDb();
  return new MongoUserRepository(db);
}
