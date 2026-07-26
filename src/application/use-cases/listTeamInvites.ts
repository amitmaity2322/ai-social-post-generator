import type { TeamRepositoryPort } from "@/domain/ports/TeamRepositoryPort";
import type { TeamInvite } from "@/domain/entities/TeamInvite";

interface ListTeamInvitesDeps {
  teamRepository: TeamRepositoryPort;
}

export async function listTeamInvites(
  deps: ListTeamInvitesDeps,
  ownerId: string,
): Promise<TeamInvite[]> {
  return deps.teamRepository.listPendingByOwner(ownerId);
}
