import type { Db, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type { TeamRepositoryPort } from "@/domain/ports/TeamRepositoryPort";
import type { TeamInvite, TeamInviteRole } from "@/domain/entities/TeamInvite";
import { NotFoundError } from "@/domain/errors/NotFoundError";

interface TeamInviteDocument {
  ownerId: string;
  email: string;
  role: TeamInviteRole;
  createdAt: Date;
}

function toTeamInvite(doc: WithId<TeamInviteDocument>): TeamInvite {
  return {
    id: doc._id.toString(),
    ownerId: doc.ownerId,
    email: doc.email,
    role: doc.role,
    status: "pending",
    createdAt: doc.createdAt.toISOString(),
  };
}

export class MongoTeamRepository implements TeamRepositoryPort {
  constructor(private readonly db: Db) {}

  private get collection() {
    return this.db.collection<TeamInviteDocument>("teamInvites");
  }

  async createInvite(ownerId: string, email: string, role: TeamInviteRole): Promise<TeamInvite> {
    const createdAt = new Date();
    const { insertedId } = await this.collection.insertOne({ ownerId, email, role, createdAt });

    return {
      id: insertedId.toString(),
      ownerId,
      email,
      role,
      status: "pending",
      createdAt: createdAt.toISOString(),
    };
  }

  async listPendingByOwner(ownerId: string): Promise<TeamInvite[]> {
    const docs = await this.collection.find({ ownerId }).sort({ createdAt: -1 }).toArray();
    return docs.map(toTeamInvite);
  }

  async findPendingByOwnerAndEmail(ownerId: string, email: string): Promise<TeamInvite | null> {
    const doc = await this.collection.findOne({ ownerId, email });
    return doc ? toTeamInvite(doc) : null;
  }

  // Scoped by ownerId AND _id together, same reasoning as MongoPostRepository.deleteByIdForUser.
  async revoke(id: string, ownerId: string): Promise<void> {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Invite not found");

    const result = await this.collection.deleteOne({ _id: new ObjectId(id), ownerId });
    if (result.deletedCount === 0) throw new NotFoundError("Invite not found");
  }
}
