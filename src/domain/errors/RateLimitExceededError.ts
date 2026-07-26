import { DomainError } from "./DomainError";

export class RateLimitExceededError extends DomainError {
  readonly code = "RATE_LIMIT_EXCEEDED";

  constructor(message = "Too many requests. Please try again shortly.") {
    super(message);
  }
}
