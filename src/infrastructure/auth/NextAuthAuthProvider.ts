import type { AuthPort, AuthenticatedUser } from "@/domain/ports/AuthPort";
import { auth } from "@/infrastructure/auth/auth";

export class NextAuthAuthProvider implements AuthPort {
  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const session = await auth();
    if (!session?.user?.id) return null;

    return {
      id: session.user.id,
      email: session.user.email ?? null,
      fullName: session.user.name ?? null,
    };
  }
}
