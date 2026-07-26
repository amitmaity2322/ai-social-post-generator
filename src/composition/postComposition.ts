import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";
import { MongoPostRepository } from "@/infrastructure/repositories/MongoPostRepository";
import { getMongoDb } from "@/infrastructure/mongodb/client";

export async function createPostRepository(): Promise<PostRepositoryPort> {
  const db = await getMongoDb();
  return new MongoPostRepository(db);
}
