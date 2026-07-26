import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";

interface DeletePostDeps {
  postRepository: PostRepositoryPort;
}

export async function deletePost(
  deps: DeletePostDeps,
  userId: string,
  postId: string,
): Promise<void> {
  await deps.postRepository.deleteByIdForUser(postId, userId);
}
