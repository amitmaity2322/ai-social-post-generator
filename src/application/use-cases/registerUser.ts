import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";
import { ConflictError } from "@/domain/errors/ConflictError";
import type { RegisterInput } from "@/application/validation/registerSchema";

interface RegisterUserDeps {
  userRepository: UserRepositoryPort;
}

export async function registerUser(deps: RegisterUserDeps, input: RegisterInput): Promise<User> {
  const existing = await deps.userRepository.findByEmail(input.email);
  if (existing) throw new ConflictError("An account with this email already exists.");

  return deps.userRepository.create(input);
}
