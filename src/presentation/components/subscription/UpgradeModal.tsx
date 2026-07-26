"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { useToast } from "@/presentation/hooks/useToast";
import { changePlan } from "@/presentation/services/accountService";
import {
  PLAN_LABELS,
  PLAN_MONTHLY_PRICE,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlan,
} from "@/shared/constants/plans";
import { PLAN_FEATURES } from "@/shared/constants/planFeatures";
import styles from "./UpgradeModal.module.css";

interface UpgradeModalProps {
  show: boolean;
  onClose: () => void;
  currentPlan: SubscriptionPlan;
  initialSelection?: SubscriptionPlan;
  onSubscribed: (plan: SubscriptionPlan) => void;
}

export function UpgradeModal({
  show,
  onClose,
  currentPlan,
  initialSelection,
  onSubscribed,
}: UpgradeModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<SubscriptionPlan>(
    initialSelection ?? (currentPlan === "free" ? "pro" : "business"),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // The modal stays mounted between opens (only `show` toggles), so re-sync the selection
  // every time it opens - otherwise it'd keep whatever was selected the first time it mounted.
  useEffect(() => {
    if (show) setSelected(initialSelection ?? (currentPlan === "free" ? "pro" : "business"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  async function handleConfirm() {
    // Free never requires payment or a trial confirmation step - it activates instantly.
    if (selected === "free") {
      setIsSubmitting(true);
      try {
        await changePlan("free");
        showToast(
          "success",
          "Your 15-day free trial has started — full trial access is unlocked immediately.",
        );
        onSubscribed("free");
        onClose();
      } catch (error) {
        showToast("error", error instanceof Error ? error.message : "Failed to update your plan");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Pro/Business are never trial-gated - they're taken straight to checkout, and the plan
    // only activates once payment succeeds there.
    onClose();
    router.push(`/checkout?plan=${selected}`);
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Choose your plan"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isSubmitting}
            disabled={selected === currentPlan}
            leftIcon={selected === "free" ? "bi-rocket-takeoff" : "bi-credit-card-fill"}
          >
            {selected === "free" ? "Start 15-day free trial" : `Continue to payment`}
          </Button>
        </>
      }
    >
      <div className={styles.grid}>
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isActive = plan === selected;
          const isCurrent = plan === currentPlan;
          return (
            <button
              key={plan}
              type="button"
              onClick={() => setSelected(plan)}
              className={[styles.card, isActive ? styles.cardActive : ""].filter(Boolean).join(" ")}
            >
              {isCurrent && <span className={styles.currentTag}>Current plan</span>}
              <span className={styles.planName}>{PLAN_LABELS[plan]}</span>
              <span className={styles.price}>
                {PLAN_MONTHLY_PRICE[plan] === 0 ? "Free" : `£${PLAN_MONTHLY_PRICE[plan]}/mo`}
              </span>
              <span className={styles.planNote}>
                {plan === "free" ? "Includes a 15-day free trial" : "No trial — pay to activate"}
              </span>
              <p className={styles.tagline}>{PLAN_FEATURES[plan].tagline}</p>
              <ul className={styles.features}>
                {PLAN_FEATURES[plan].features.map((feature) => (
                  <li key={feature}>
                    <i className="bi-check-circle-fill" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
