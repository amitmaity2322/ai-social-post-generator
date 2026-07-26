import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { getAllowedPlatformsForPlan } from "@/domain/value-objects/planPlatformAccess";
import { IntegrationsGrid } from "@/presentation/components/integrations/IntegrationsGrid";
import { PLATFORMS } from "@/domain/value-objects/Platform";

export default async function IntegrationsPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const userRepository = await createUserRepository();
  const profile = sessionUser.email ? await userRepository.findByEmail(sessionUser.email) : null;
  const { effectivePlan } = getSubscriptionSummary(profile ?? { plan: "free", trialEndsAt: null });

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Integrations</h2>
        <p className="pg-text-muted mb-0">
          Track which platforms you post to. This is a manual connection tracker — it doesn&apos;t
          publish on your behalf yet, since that requires each platform&apos;s own developer
          credentials.
        </p>
      </div>

      <IntegrationsGrid
        allPlatforms={[...PLATFORMS]}
        allowedPlatforms={getAllowedPlatformsForPlan(effectivePlan)}
        initialConnected={profile?.connectedPlatforms ?? []}
      />
    </div>
  );
}
