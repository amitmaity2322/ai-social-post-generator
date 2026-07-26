import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";
import type { SavedPost } from "@/domain/entities/SavedPost";
import type { SavePostInput } from "@/application/validation/savePostSchema";

interface SavePostDeps {
  postRepository: PostRepositoryPort;
}

export async function savePost(
  deps: SavePostDeps,
  userId: string,
  input: SavePostInput,
): Promise<SavedPost> {
  const { status, ...post } = input;
  return deps.postRepository.save(userId, { id: crypto.randomUUID(), ...post }, status);
}
