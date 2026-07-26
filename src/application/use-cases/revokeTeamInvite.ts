import type { TeamRepositoryPort } from "@/domain/ports/TeamRepositoryPort";

interface RevokeTeamInviteDeps {
  teamRepository: TeamRepositoryPort;
}

export async function revokeTeamInvite(
  deps: RevokeTeamInviteDeps,
  ownerId: string,
  inviteId: string,
): Promise<void> {
  await deps.teamRepository.revoke(inviteId, ownerId);
}
