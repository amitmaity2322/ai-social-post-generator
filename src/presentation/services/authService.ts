import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

interface ErrorResponseBody {
  success: false;
  error: { code: string; message: string };
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

/**
 * The one place client code touches auth. Registration has no Auth.js
 * equivalent (Credentials only handles sign-in verification, not account
 * creation), so signUp calls our own /api/auth/register directly, then signs
 * the new account in immediately so the caller only ever awaits one thing.
 */
export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
        return { error: body?.error.message ?? "Failed to create account." };
      }

      return authService.signIn(email, password);
    } catch (caughtError) {
      return { error: toErrorMessage(caughtError) };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const result = await nextAuthSignIn("credentials", { email, password, redirect: false });
      if (result?.error) return { error: "Invalid email or password." };
      return { error: null };
    } catch (caughtError) {
      return { error: toErrorMessage(caughtError) };
    }
  },

  async signOut(): Promise<void> {
    try {
      await nextAuthSignOut({ redirect: false });
    } catch {
      // Best-effort: if Auth.js is unreachable there's nothing meaningful to recover into.
    }
  },
};
