import type { NextRequest } from "next/server";
import { generatePostSchema } from "@/application/validation/generatePostSchema";
import {
  generateSocialPost,
  type GenerationEvent,
} from "@/application/use-cases/generateSocialPost";
import { getAIProvider } from "@/composition/aiComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { getAllowedPlatformsForPlan } from "@/domain/value-objects/planPlatformAccess";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { PlanRestrictionError } from "@/domain/errors/PlanRestrictionError";
import { enforceRateLimit } from "@/infrastructure/http/rateLimiter";
import { getClientIdentifier } from "@/infrastructure/http/getClientIdentifier";
import { createSSEStream } from "@/infrastructure/http/sse";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request: NextRequest) => {
  enforceRateLimit(getClientIdentifier(request), { limit: 10, windowMs: 60_000 });

  const authUser = await createAuthProvider().getCurrentUser();
  if (!authUser?.email) throw new UnauthorizedError("You must be signed in to generate posts.");

  const userRepository = await createUserRepository();
  const user = await userRepository.findByEmail(authUser.email);
  if (!user) throw new UnauthorizedError("You must be signed in to generate posts.");

  const body = await request.json();
  const input = generatePostSchema.parse(body);

  const { effectivePlan } = getSubscriptionSummary(user);
  const allowedPlatforms = new Set(getAllowedPlatformsForPlan(effectivePlan));
  const disallowed = input.platforms.filter((platform) => !allowedPlatforms.has(platform));
  if (disallowed.length > 0) {
    throw new PlanRestrictionError(
      `Your ${effectivePlan} plan doesn't include: ${disallowed.join(", ")}. Upgrade to unlock more platforms.`,
    );
  }

  const events = generateSocialPost({ aiProvider: getAIProvider() }, input, user.brandVoice);

  const stream = createSSEStream<GenerationEvent>(events, (event) => ({
    event: event.type,
    data: event,
  }));

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
});
