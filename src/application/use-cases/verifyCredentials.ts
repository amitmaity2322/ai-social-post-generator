import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";

interface VerifyCredentialsDeps {
  userRepository: UserRepositoryPort;
}

export async function verifyCredentials(
  deps: VerifyCredentialsDeps,
  email: string,
  password: string,
): Promise<User | null> {
  return deps.userRepository.verifyPassword(email, password);
}
