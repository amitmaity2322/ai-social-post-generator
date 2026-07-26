import type { NextRequest } from "next/server";
import { updateConnectedPlatformsSchema } from "@/application/validation/updateConnectedPlatformsSchema";
import { updateConnectedPlatforms } from "@/application/use-cases/updateConnectedPlatforms";
import { createUserRepository } from "@/composition/userComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const PATCH = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to update integrations.");

  const body = await request.json();
  const input = updateConnectedPlatformsSchema.parse(body);

  const userRepository = await createUserRepository();
  const updated = await updateConnectedPlatforms({ userRepository }, user.id, input);

  return successResponse(updated);
});
