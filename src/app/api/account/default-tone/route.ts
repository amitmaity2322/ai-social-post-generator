import type { NextRequest } from "next/server";
import { updateDefaultToneSchema } from "@/application/validation/updateDefaultToneSchema";
import { updateDefaultTone } from "@/application/use-cases/updateDefaultTone";
import { createUserRepository } from "@/composition/userComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const PATCH = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to change your default tone.");

  const body = await request.json();
  const input = updateDefaultToneSchema.parse(body);

  const userRepository = await createUserRepository();
  const updated = await updateDefaultTone({ userRepository }, user.id, input);

  return successResponse(updated);
});
