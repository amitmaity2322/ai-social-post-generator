import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  // bcrypt silently truncates input beyond 72 bytes - capping here means two
  // different long passwords can never collide by hashing to the same value.
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
