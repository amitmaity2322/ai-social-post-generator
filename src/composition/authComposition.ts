import type { AuthPort, AuthenticatedUser } from "@/domain/ports/AuthPort";
import { NextAuthAuthProvider } from "@/infrastructure/auth/NextAuthAuthProvider";

export function createAuthProvider(): AuthPort {
  return new NextAuthAuthProvider();
}

/**
 * Used by route-group layouts to gate/display auth state. Treats a missing or
 * invalid environment (MongoDB/Auth.js not configured yet) as "no user"
 * rather than throwing, so marketing and auth pages still render before
 * real credentials are configured - the same lazy-failure principle
 * shared/config/env.ts already applies to build-time env parsing.
 */
export async function getCurrentUserForLayout(): Promise<AuthenticatedUser | null> {
  try {
    return await createAuthProvider().getCurrentUser();
  } catch {
    return null;
  }
}
