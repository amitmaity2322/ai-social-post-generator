import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { SettingsForm } from "@/presentation/components/settings/SettingsForm";
import { getPlanDisplayName, getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";

export default async function SettingsPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const userRepository = await createUserRepository();
  const profile = sessionUser.email ? await userRepository.findByEmail(sessionUser.email) : null;
  const subscription = getSubscriptionSummary(profile ?? { plan: "free", trialEndsAt: null });
  const defaultTone = profile?.defaultTone ?? "professional";

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="mb-4">
        <h2 className="h4 mb-1">Settings</h2>
        <p className="pg-text-muted mb-0">Manage your profile and content preferences.</p>
      </div>

      <div className="pg-surface p-4 mb-4 d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <div>
          <h3 className="h6 mb-1">Subscription plan</h3>
          <p className="pg-text-muted small mb-0">
            You&apos;re on the <strong>{getPlanDisplayName(subscription)}</strong>.
          </p>
        </div>
        <Link href="/subscription" className="small fw-bold">
          Manage subscription
          <i className="bi-arrow-right ms-1" aria-hidden="true" />
        </Link>
      </div>

      <SettingsForm initialDefaultTone={defaultTone} />
    </div>
  );
}
