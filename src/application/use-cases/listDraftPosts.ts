import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";
import type { SavedPost } from "@/domain/entities/SavedPost";

interface ListDraftPostsDeps {
  postRepository: PostRepositoryPort;
}

export async function listDraftPosts(
  deps: ListDraftPostsDeps,
  userId: string,
  limit: number,
): Promise<SavedPost[]> {
  return deps.postRepository.listByUserWithStatus(userId, "draft", limit);
}
