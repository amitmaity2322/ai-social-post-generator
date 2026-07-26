import type { TeamInviteItem, TeamInviteRole } from "@/shared/types/team";

interface ErrorResponseBody {
  success: false;
  error: { code: string; message: string };
}

/** The one place in the app allowed to know GET/POST /api/team/invites's wire format. */
export async function listInvites(): Promise<TeamInviteItem[]> {
  const response = await fetch("/api/team/invites");

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }

  const body = (await response.json()) as { success: true; data: TeamInviteItem[] };
  return body.data;
}

export async function createInvite(email: string, role: TeamInviteRole): Promise<TeamInviteItem> {
  const response = await fetch("/api/team/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }

  const body = (await response.json()) as { success: true; data: TeamInviteItem };
  return body.data;
}

/** The one place in the app allowed to know DELETE /api/team/invites/[id]'s wire format. */
export async function revokeInvite(id: string): Promise<void> {
  const response = await fetch(`/api/team/invites/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}
