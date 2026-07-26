import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";
import type { UpdateBrandKitInput } from "@/application/validation/updateBrandKitSchema";

interface UpdateBrandKitDeps {
  userRepository: UserRepositoryPort;
}

export async function updateBrandKit(
  deps: UpdateBrandKitDeps,
  userId: string,
  input: UpdateBrandKitInput,
): Promise<User> {
  return deps.userRepository.updateBrandKit(userId, input);
}
