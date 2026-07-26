import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import { PLAN_PLATFORM_LIMITS } from "@/shared/constants/plans";
import type { Platform } from "@/shared/types/content";
import { GeneratePageClient } from "./GeneratePageClient";

export default async function GeneratePage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const userRepository = await createUserRepository();
  const profile = sessionUser.email ? await userRepository.findByEmail(sessionUser.email) : null;
  const defaultTone = profile?.defaultTone ?? "professional";
  const { effectivePlan } = getSubscriptionSummary(
    profile ?? { plan: "free", trialEndsAt: null },
  );

  const orderedPlatforms = Object.keys(PLATFORM_META) as Platform[];
  const allowedPlatforms = orderedPlatforms.slice(0, PLAN_PLATFORM_LIMITS[effectivePlan]);

  return <GeneratePageClient allowedPlatforms={allowedPlatforms} initialTone={defaultTone} />;
}
