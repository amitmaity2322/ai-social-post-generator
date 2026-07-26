import { RateLimitExceededError } from "@/domain/errors/RateLimitExceededError";

interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

const buckets = new Map<string, Bucket>();

/**
 * In-memory, per-instance limiter: on Vercel this resets per cold start and isn't
 * shared across instances/regions, so treat it as best-effort abuse mitigation, not a
 * hard guarantee. Upgrade path is a shared store (e.g. Upstash Redis) if that matters.
 */
export function enforceRateLimit(identifier: string, options: RateLimitOptions): void {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  if (bucket.count >= options.limit) {
    throw new RateLimitExceededError();
  }

  bucket.count += 1;
}
