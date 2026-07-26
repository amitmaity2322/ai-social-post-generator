import { z } from "zod";

export const createTeamInviteSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  role: z.enum(["admin", "member"]).default("member"),
});

export type CreateTeamInviteInput = z.infer<typeof createTeamInviteSchema>;
