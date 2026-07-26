import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";
import type { UpdateConnectedPlatformsInput } from "@/application/validation/updateConnectedPlatformsSchema";

interface UpdateConnectedPlatformsDeps {
  userRepository: UserRepositoryPort;
}

export async function updateConnectedPlatforms(
  deps: UpdateConnectedPlatformsDeps,
  userId: string,
  input: UpdateConnectedPlatformsInput,
): Promise<User> {
  return deps.userRepository.updateConnectedPlatforms(userId, input.platforms);
}
