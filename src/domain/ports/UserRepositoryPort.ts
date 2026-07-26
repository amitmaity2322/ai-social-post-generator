import type { User } from "@/domain/entities/User";
import type { SubscriptionPlan } from "@/shared/constants/plans";
import type { Tone } from "@/domain/value-objects/Tone";
import type { Platform } from "@/domain/value-objects/Platform";

export interface CreateUserParams {
  email: string;
  password: string;
  fullName: string;
}

export interface BrandKitInput {
  brandVoice: string;
  brandColor: string;
  logoUrl: string;
}

/**
 * Password hashing/verification is deliberately internal to implementations of
 * this port, not a separate PasswordHasherPort - bcrypt is a fixed algorithm
 * tied to how the stored hash is shaped, not a swappable vendor the way Groq
 * or the database itself are. Application code never sees a password hash.
 */
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  create(params: CreateUserParams): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  updatePlan(userId: string, plan: SubscriptionPlan): Promise<User>;
  updateDefaultTone(userId: string, tone: Tone): Promise<User>;
  updateBrandKit(userId: string, brandKit: BrandKitInput): Promise<User>;
  updateConnectedPlatforms(userId: string, platforms: Platform[]): Promise<User>;
}
