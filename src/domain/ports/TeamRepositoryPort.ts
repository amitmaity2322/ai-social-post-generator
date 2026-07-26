import type { TeamInvite, TeamInviteRole } from "@/domain/entities/TeamInvite";

export interface TeamRepositoryPort {
  createInvite(ownerId: string, email: string, role: TeamInviteRole): Promise<TeamInvite>;
  listPendingByOwner(ownerId: string): Promise<TeamInvite[]>;
  findPendingByOwnerAndEmail(ownerId: string, email: string): Promise<TeamInvite | null>;
  revoke(id: string, ownerId: string): Promise<void>;
}
