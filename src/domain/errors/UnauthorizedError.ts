import { DomainError } from "./DomainError";

export class UnauthorizedError extends DomainError {
  readonly code = "UNAUTHORIZED";
}
