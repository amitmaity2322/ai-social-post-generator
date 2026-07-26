import { PLATFORMS, type Platform } from "@/domain/value-objects/Platform";
import { PLAN_PLATFORM_LIMITS, type SubscriptionPlan } from "@/shared/constants/plans";

/** Platforms unlock in catalog order, so upgrading a plan strictly adds platforms rather than swapping them out. */
export function getAllowedPlatformsForPlan(plan: SubscriptionPlan): Platform[] {
  return PLATFORMS.slice(0, PLAN_PLATFORM_LIMITS[plan]);
}
