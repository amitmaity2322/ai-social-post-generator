import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";
import type { UpdateDefaultToneInput } from "@/application/validation/updateDefaultToneSchema";

interface UpdateDefaultToneDeps {
  userRepository: UserRepositoryPort;
}

export async function updateDefaultTone(
  deps: UpdateDefaultToneDeps,
  userId: string,
  input: UpdateDefaultToneInput,
): Promise<User> {
  return deps.userRepository.updateDefaultTone(userId, input.defaultTone);
}
