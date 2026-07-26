import type { SubscriptionPlan } from "@/shared/constants/plans";
import type { Tone } from "@/domain/value-objects/Tone";
import type { Platform } from "@/domain/value-objects/Platform";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  plan: SubscriptionPlan;
  defaultTone: Tone;
  /** Free-text brand personality/voice, appended to every generation prompt when non-empty. */
  brandVoice: string;
  brandColor: string;
  logoUrl: string;
  connectedPlatforms: Platform[];
  createdAt: string;
  /** ISO timestamp the trial ends, or null once it's been converted/cleared by an explicit plan change. */
  trialEndsAt: string | null;
}
