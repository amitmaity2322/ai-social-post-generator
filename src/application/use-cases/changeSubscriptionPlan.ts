import type { UserRepositoryPort } from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";
import type { ChangePlanInput } from "@/application/validation/changePlanSchema";

interface ChangeSubscriptionPlanDeps {
  userRepository: UserRepositoryPort;
}

export async function changeSubscriptionPlan(
  deps: ChangeSubscriptionPlanDeps,
  userId: string,
  input: ChangePlanInput,
): Promise<User> {
  return deps.userRepository.updatePlan(userId, input.plan);
}
