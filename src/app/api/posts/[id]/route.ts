import type { NextRequest } from "next/server";
import { createPostRepository } from "@/composition/postComposition";
import { createAuthProvider } from "@/composition/authComposition";
import { deletePost } from "@/application/use-cases/deletePost";
import { publishDraftPost } from "@/application/use-cases/publishDraftPost";
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
    if (!user) throw new UnauthorizedError("You must be signed in to delete a post.");

    const postRepository = await createPostRepository();
    await deletePost({ postRepository }, user.id, id);

    return successResponse({ id });
  },
);

/** Only action supported today is publishing a draft (moves it from Drafts into History). */
export const PATCH = withApiHandler<RouteContext>(
  async (request: NextRequest, context: RouteContext) => {
    const { id } = await context.params;

    const user = await createAuthProvider().getCurrentUser();
    if (!user) throw new UnauthorizedError("You must be signed in to update a post.");

    const postRepository = await createPostRepository();
    const post = await publishDraftPost({ postRepository }, user.id, id);

    return successResponse(post);
  },
);
