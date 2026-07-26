import type { NextRequest } from "next/server";
import { updateBrandKitSchema } from "@/application/validation/updateBrandKitSchema";
import { updateBrandKit } from "@/application/use-cases/updateBrandKit";
import { createUserRepository } from "@/composition/userComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const PATCH = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to update your brand kit.");

  const body = await request.json();
  const input = updateBrandKitSchema.parse(body);

  const userRepository = await createUserRepository();
  const updated = await updateBrandKit({ userRepository }, user.id, input);

  return successResponse(updated);
});
