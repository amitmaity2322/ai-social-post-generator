import type { TeamRepositoryPort } from "@/domain/ports/TeamRepositoryPort";
import { MongoTeamRepository } from "@/infrastructure/repositories/MongoTeamRepository";
import { getMongoDb } from "@/infrastructure/mongodb/client";

export async function createTeamRepository(): Promise<TeamRepositoryPort> {
  const db = await getMongoDb();
  return new MongoTeamRepository(db);
}
