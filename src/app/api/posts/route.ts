import type { NextRequest } from "next/server";
import { createPostRepository } from "@/composition/postComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { savePostSchema } from "@/application/validation/savePostSchema";
import { listPostsQuerySchema } from "@/application/validation/listPostsQuerySchema";
import { savePost } from "@/application/use-cases/savePost";
import { listPostHistory } from "@/application/use-cases/listPostHistory";
import { listDraftPosts } from "@/application/use-cases/listDraftPosts";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { successResponse } from "@/infrastructure/http/responseFormatter";
import { withApiHandler } from "@/infrastructure/http/withApiHandler";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to save a post.");

  const body = await request.json();
  const input = savePostSchema.parse(body);

  const postRepository = await createPostRepository();
  const saved = await savePost({ postRepository }, user.id, input);

  return successResponse(saved, 201);
});

export const GET = withApiHandler(async (request: NextRequest) => {
  const user = await createAuthProvider().getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to view your history.");

  const { limit, status } = listPostsQuerySchema.parse({
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
    status: request.nextUrl.searchParams.get("status") ?? undefined,
  });

  const postRepository = await createPostRepository();
  const posts =
    status === "draft"
      ? await listDraftPosts({ postRepository }, user.id, limit)
      : await listPostHistory({ postRepository }, user.id, limit);

  return successResponse(posts);
});
