import { DomainError } from "./DomainError";

export class AIGenerationError extends DomainError {
  readonly code = "AI_GENERATION_ERROR";
}
