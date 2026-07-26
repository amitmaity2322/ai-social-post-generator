import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";
import type { SavedPost } from "@/domain/entities/SavedPost";

interface PublishDraftPostDeps {
  postRepository: PostRepositoryPort;
}

export async function publishDraftPost(
  deps: PublishDraftPostDeps,
  userId: string,
  postId: string,
): Promise<SavedPost> {
  return deps.postRepository.updateStatus(postId, userId, "final");
}
