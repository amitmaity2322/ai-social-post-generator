"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlanStatusCard } from "./PlanStatusCard";
import { UpgradeModal } from "./UpgradeModal";
import type { SubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";

interface PlanStatusCardWithModalProps {
  subscription: SubscriptionSummary;
  memberSince: string | null;
}

export function PlanStatusCardWithModal({ subscription, memberSince }: PlanStatusCardWithModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PlanStatusCard
        subscription={subscription}
        memberSince={memberSince}
        onUpgradeClick={() => setShowModal(true)}
      />
      <UpgradeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        currentPlan={subscription.billedPlan}
        onSubscribed={() => router.refresh()}
      />
    </>
  );
}
