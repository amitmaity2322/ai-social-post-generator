"use client";

import { useState } from "react";
import Link from "next/link";
import type { SubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import styles from "./TrialBanner.module.css";

interface TrialBannerProps {
  subscription: SubscriptionSummary;
}

export function TrialBanner({ subscription }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (subscription.status === "active") return null;
  if (subscription.status === "trialing" && dismissed) return null;

  const isExpired = subscription.status === "expired";

  return (
    <div className={[styles.banner, isExpired ? styles.expired : styles.trialing].join(" ")}>
      <div className={styles.text}>
        <i className={isExpired ? "bi-exclamation-triangle-fill" : "bi-hourglass-split"} aria-hidden="true" />
        {isExpired ? (
          <span>
            Your 15-day trial has ended. Upgrade to <strong>Pro</strong> or <strong>Business</strong>{" "}
            to keep full access to your generated content and every feature you tried.
          </span>
        ) : (
          <span>
            You have <strong>{subscription.daysRemaining}</strong> day
            {subscription.daysRemaining === 1 ? "" : "s"} left in your free trial with full access
            to every feature.
          </span>
        )}
      </div>
      <div className={styles.actions}>
        <Link href="/subscription" className={styles.cta}>
          {isExpired ? "Upgrade to Pro or Business" : "Upgrade now"}
          <i className="bi-arrow-right ms-1" aria-hidden="true" />
        </Link>
        {!isExpired && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className={styles.dismiss}
            aria-label="Dismiss"
          >
            <i className="bi-x-lg" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
