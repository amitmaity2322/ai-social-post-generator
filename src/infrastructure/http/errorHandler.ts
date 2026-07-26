import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError } from "@/domain/errors/DomainError";
import { ValidationError } from "@/domain/errors/ValidationError";
import { NotFoundError } from "@/domain/errors/NotFoundError";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { RateLimitExceededError } from "@/domain/errors/RateLimitExceededError";
import { AIGenerationError } from "@/domain/errors/AIGenerationError";
import { ConflictError } from "@/domain/errors/ConflictError";
import { PlanRestrictionError } from "@/domain/errors/PlanRestrictionError";
import { errorResponseBody } from "./responseFormatter";

type DomainErrorConstructor = abstract new (...args: never[]) => DomainError;

const STATUS_BY_ERROR = new Map<DomainErrorConstructor, number>([
  [ValidationError, 400],
  [UnauthorizedError, 401],
  [NotFoundError, 404],
  [ConflictError, 409],
  [PlanRestrictionError, 403],
  [RateLimitExceededError, 429],
  [AIGenerationError, 502],
]);

export function mapErrorToResponse(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join("; ");
    return NextResponse.json(errorResponseBody("VALIDATION_ERROR", message), { status: 400 });
  }

  if (error instanceof DomainError) {
    const status =
      STATUS_BY_ERROR.get(error.constructor as unknown as DomainErrorConstructor) ?? 400;
    return NextResponse.json(errorResponseBody(error.code, error.message), { status });
  }

  console.error(error);
  return NextResponse.json(
    errorResponseBody("INTERNAL_ERROR", "Something went wrong. Please try again."),
    {
      status: 500,
    },
  );
}
