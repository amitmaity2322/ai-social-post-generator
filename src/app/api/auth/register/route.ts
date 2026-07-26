import type { NextRequest } from "next/server";
import { registerSchema } from "@/application/validation/registerSchema";
import { registerUser } from "@/application/use-cases/registerUser";
import { createUserRepository } from "@/composition/userComposition";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const input = registerSchema.parse(body);

  const userRepository = await createUserRepository();
  const user = await registerUser({ userRepository }, input);

  return successResponse(user, 201);
});
