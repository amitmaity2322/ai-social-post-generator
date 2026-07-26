import type { NextRequest } from "next/server";
import { createTeamInviteSchema } from "@/application/validation/createTeamInviteSchema";
import { createTeamInvite } from "@/application/use-cases/createTeamInvite";
import { listTeamInvites } from "@/application/use-cases/listTeamInvites";
import { createTeamRepository } from "@/composition/teamComposition";
import { createUserRepository } from "@/composition/userComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user?.email) throw new UnauthorizedError("You must be signed in to invite teammates.");

  const body = await request.json();
  const input = createTeamInviteSchema.parse(body);

  const [teamRepository, userRepository] = await Promise.all([
    createTeamRepository(),
    createUserRepository(),
  ]);
  const invite = await createTeamInvite({ teamRepository, userRepository }, user.id, user.email, input);

  return successResponse(invite, 201);
});

export const GET = withApiHandler(async () => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to view your team.");

  const teamRepository = await createTeamRepository();
  const invites = await listTeamInvites({ teamRepository }, user.id);

  return successResponse(invites);
});
