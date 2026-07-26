export type TeamInviteRole = "admin" | "member";

export interface TeamInviteItem {
  id: string;
  email: string;
  role: TeamInviteRole;
  createdAt: string;
}
