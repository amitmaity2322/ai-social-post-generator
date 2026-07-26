"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlanStatusCard } from "./PlanStatusCard";
import { UsageOverview } from "./UsageOverview";
import { UpgradeModal } from "./UpgradeModal";
import { buttonClassNames } from "@/presentation/components/ui";
import type { SubscriptionOverview } from "@/application/use-cases/getSubscriptionOverview";
import {
  PLAN_LABELS,
  PLAN_MONTHLY_PRICE,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlan,
} from "@/shared/constants/plans";
import { PLAN_FEATURES } from "@/shared/constants/planFeatures";
import styles from "./SubscriptionManager.module.css";

interface SubscriptionManagerProps {
  overview: SubscriptionOverview;
  memberSince: string | null;
}

export function SubscriptionManager({ overview, memberSince }: SubscriptionManagerProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState<SubscriptionPlan | undefined>(undefined);
  const [justSubscribedTo, setJustSubscribedTo] = useState<SubscriptionPlan | null>(null);

  const { subscription, usage, shouldPromptUpgrade } = overview;
  const currentPlan = subscription.billedPlan;

  function openModal(plan?: SubscriptionPlan) {
    setModalPlan(plan);
    setShowModal(true);
  }

  function handleSubscribed(plan: SubscriptionPlan) {
    setJustSubscribedTo(plan);
    router.refresh();
  }

  return (
    <div className="d-flex flex-column gap-4">
      {justSubscribedTo && (
        <div className={styles.successBanner}>
          <i className="bi-check-circle-fill" aria-hidden="true" />
          <span>
            {justSubscribedTo === "free" ? (
              <>
                Your <strong>15-day free trial</strong> has started — full trial access is unlocked
                immediately.
              </>
            ) : (
              <>
                You&apos;re now on the <strong>{PLAN_LABELS[justSubscribedTo]}</strong> plan. Every{" "}
                {PLAN_LABELS[justSubscribedTo]} feature is unlocked immediately, no trial required.
              </>
            )}
          </span>
          <button
            type="button"
            className={styles.successDismiss}
            onClick={() => setJustSubscribedTo(null)}
            aria-label="Dismiss"
          >
            <i className="bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      )}

      <PlanStatusCard
        subscription={subscription}
        memberSince={memberSince}
        onUpgradeClick={() => openModal()}
      />

      <UsageOverview
        usage={usage}
        showUpgradeButton={shouldPromptUpgrade}
        onUpgradeClick={() => openModal()}
      />

      <div className="pg-surface p-4">
        <h3 className="h6 mb-1">Compare plans</h3>
        <p className="pg-text-muted small mb-3">
          Free includes a 15-day trial. Pro and Business skip the trial and activate instantly
          after a quick checkout.
        </p>
        <div className={styles.planGrid}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan === currentPlan;
            return (
              <div
                key={plan}
                className={[styles.planCard, isCurrent ? styles.planCardCurrent : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCurrent && <span className={styles.currentTag}>Your plan</span>}
                <span className={styles.planCardName}>{PLAN_LABELS[plan]}</span>
                <span className={styles.planCardPrice}>
                  {PLAN_MONTHLY_PRICE[plan] === 0 ? "Free" : `£${PLAN_MONTHLY_PRICE[plan]}/mo`}
                </span>
                <p className={styles.planCardTagline}>{PLAN_FEATURES[plan].tagline}</p>
                <ul className={styles.planCardFeatures}>
                  {PLAN_FEATURES[plan].features.slice(0, 4).map((feature) => (
                    <li key={feature}>
                      <i className="bi-check-circle-fill" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openModal(plan)}
                  disabled={isCurrent}
                  className={buttonClassNames({
                    variant: isCurrent ? "outline" : "primary",
                    size: "sm",
                    fullWidth: true,
                  })}
                >
                  {isCurrent
                    ? "Current plan"
                    : plan === "free"
                      ? "Start free trial"
                      : `Choose ${PLAN_LABELS[plan]}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <UpgradeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        currentPlan={currentPlan}
        initialSelection={modalPlan}
        onSubscribed={handleSubscribed}
      />
    </div>
  );
}
