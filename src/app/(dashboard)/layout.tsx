import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { createPostRepository } from "@/composition/postComposition";
import { getAllowedPlatformsForPlan } from "@/domain/value-objects/planPlatformAccess";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { DashboardShell } from "@/presentation/components/layout/DashboardShell";

export default async function DashboardGroupLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserForLayout();

  if (!user) redirect("/login");

  const [userRepository, postRepository] = await Promise.all([
    createUserRepository(),
    createPostRepository(),
  ]);

  const [profile, usedPlatforms] = await Promise.all([
    user.email ? userRepository.findByEmail(user.email) : null,
    postRepository.distinctPlatformsByUser(user.id),
  ]);

  const subscription = getSubscriptionSummary(profile ?? { plan: "free", trialEndsAt: null });
  const platformsAllowed = getAllowedPlatformsForPlan(subscription.effectivePlan).length;

  return (
    <DashboardShell
      user={user}
      subscription={subscription}
      platformsUsed={usedPlatforms.length}
      platformsAllowed={platformsAllowed}
    >
      {children}
    </DashboardShell>
  );
}
