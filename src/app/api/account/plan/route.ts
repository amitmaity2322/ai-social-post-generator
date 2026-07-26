import type { NextRequest } from "next/server";
import { changePlanSchema } from "@/application/validation/changePlanSchema";
import { changeSubscriptionPlan } from "@/application/use-cases/changeSubscriptionPlan";
import { createUserRepository } from "@/composition/userComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const PATCH = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to change your plan.");

  const body = await request.json();
  const input = changePlanSchema.parse(body);

  const userRepository = await createUserRepository();
  const updated = await changeSubscriptionPlan({ userRepository }, user.id, input);

  return successResponse(updated);
});
