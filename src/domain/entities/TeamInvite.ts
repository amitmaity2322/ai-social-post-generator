export type TeamInviteRole = "admin" | "member";
export type TeamInviteStatus = "pending" | "revoked";

export interface TeamInvite {
  id: string;
  ownerId: string;
  email: string;
  role: TeamInviteRole;
  status: TeamInviteStatus;
  createdAt: string;
}
