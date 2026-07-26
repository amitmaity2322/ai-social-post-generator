import type { TeamRepositoryPort } from "@/domain/ports/TeamRepositoryPort";
import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { TeamInvite } from "@/domain/entities/TeamInvite";
import { ConflictError } from "@/domain/errors/ConflictError";
import { PlanRestrictionError } from "@/domain/errors/PlanRestrictionError";
import { NotFoundError } from "@/domain/errors/NotFoundError";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { PLAN_LABELS, PLAN_TEAM_MEMBER_LIMITS } from "@/shared/constants/plans";
import type { CreateTeamInviteInput } from "@/application/validation/createTeamInviteSchema";

interface CreateTeamInviteDeps {
  teamRepository: TeamRepositoryPort;
  userRepository: UserRepositoryPort;
}

export async function createTeamInvite(
  deps: CreateTeamInviteDeps,
  ownerId: string,
  ownerEmail: string,
  input: CreateTeamInviteInput,
): Promise<TeamInvite> {
  const owner = await deps.userRepository.findByEmail(ownerEmail);
  if (!owner) throw new NotFoundError("Account not found.");

  const existing = await deps.teamRepository.findPendingByOwnerAndEmail(ownerId, input.email);
  if (existing) throw new ConflictError("There's already a pending invite for this email.");

  const { effectivePlan } = getSubscriptionSummary(owner);
  const limit = PLAN_TEAM_MEMBER_LIMITS[effectivePlan];
  const pendingInvites = await deps.teamRepository.listPendingByOwner(ownerId);
  const seatsUsed = 1 + pendingInvites.length; // owner counts as a seat

  if (seatsUsed >= limit) {
    throw new PlanRestrictionError(
      `Your ${PLAN_LABELS[effectivePlan]} plan includes ${limit} team seat${limit === 1 ? "" : "s"}. Upgrade to invite more teammates.`,
    );
  }

  return deps.teamRepository.createInvite(ownerId, input.email, input.role);
}
