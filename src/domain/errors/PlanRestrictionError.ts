import { DomainError } from "./DomainError";

export class PlanRestrictionError extends DomainError {
  readonly code = "PLAN_RESTRICTION";
}
