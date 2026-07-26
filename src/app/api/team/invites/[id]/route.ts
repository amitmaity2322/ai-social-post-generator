import type { NextRequest } from "next/server";
import { revokeTeamInvite } from "@/application/use-cases/revokeTeamInvite";
import { createTeamRepository } from "@/composition/teamComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const DELETE = withApiHandler<RouteContext>(
  async (request: NextRequest, context: RouteContext) => {
    const { id } = await context.params;

    const user = await createAuthProvider().getCurrentUser();
    if (!user) throw new UnauthorizedError("You must be signed in to revoke an invite.");

    const teamRepository = await createTeamRepository();
    await revokeTeamInvite({ teamRepository }, user.id, id);

    return successResponse({ id });
  },
);
