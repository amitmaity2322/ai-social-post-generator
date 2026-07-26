import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";
import type { SavedPost } from "@/domain/entities/SavedPost";

interface ListPostHistoryDeps {
  postRepository: PostRepositoryPort;
}

export async function listPostHistory(
  deps: ListPostHistoryDeps,
  userId: string,
  limit: number,
): Promise<SavedPost[]> {
  return deps.postRepository.listByUser(userId, limit);
}
