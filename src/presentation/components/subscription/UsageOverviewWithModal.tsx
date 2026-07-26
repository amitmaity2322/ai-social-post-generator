"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageOverview } from "./UsageOverview";
import { UpgradeModal } from "./UpgradeModal";
import type { SubscriptionOverview } from "@/application/use-cases/getSubscriptionOverview";

interface UsageOverviewWithModalProps {
  overview: SubscriptionOverview;
}

export function UsageOverviewWithModal({ overview }: UsageOverviewWithModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <UsageOverview
        usage={overview.usage}
        showUpgradeButton={overview.shouldPromptUpgrade}
        onUpgradeClick={() => setShowModal(true)}
      />
      <UpgradeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        currentPlan={overview.subscription.billedPlan}
        onSubscribed={() => router.refresh()}
      />
    </>
  );
}
