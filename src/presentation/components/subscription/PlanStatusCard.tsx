import { buttonClassNames } from "@/presentation/components/ui";
import { TRIAL_DAYS, TRIAL_PLAN } from "@/shared/constants/plans";
import { PLAN_FEATURES } from "@/shared/constants/planFeatures";
import { getPlanDisplayName, type SubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import styles from "./PlanStatusCard.module.css";

interface PlanStatusCardProps {
  subscription: SubscriptionSummary;
  memberSince: string | null;
  onUpgradeClick: () => void;
}

const PLAN_ICON: Record<string, string> = {
  free: "bi-stars",
  pro: "bi-award-fill",
  business: "bi-gem",
  trial: "bi-hourglass-split",
};

const TRIAL_FEATURE_HIGHLIGHTS = PLAN_FEATURES[TRIAL_PLAN].features.slice(0, 4);

export function PlanStatusCard({ subscription, memberSince, onUpgradeClick }: PlanStatusCardProps) {
  const { status, billedPlan, daysRemaining } = subscription;
  const isBusiness = billedPlan === "business" && status === "active";
  const iconKey = status === "trialing" ? "trial" : billedPlan;
  const trialElapsedPct = Math.min(
    100,
    Math.max(0, ((TRIAL_DAYS - daysRemaining) / TRIAL_DAYS) * 100),
  );

  return (
    <div className={`pg-surface ${styles.card}`}>
      <div className={styles.top}>
        <div className={styles.planIdentity}>
          <span className={`${styles.planIcon} ${styles[iconKey]}`}>
            <i className={PLAN_ICON[iconKey]} aria-hidden="true" />
          </span>
          <div>
            <div className={styles.planNameRow}>
              <h3 className={styles.planName}>{getPlanDisplayName(subscription)}</h3>
            </div>
            <p className={styles.statusText}>
              {status === "trialing" && (
                <>
                  <i className="bi-hourglass-split me-1" aria-hidden="true" />
                  Full access to every trial feature
                </>
              )}
              {status === "active" && (
                <>
                  <i className="bi-check-circle-fill me-1 text-success" aria-hidden="true" />
                  Subscription active
                </>
              )}
              {status === "expired" && (
                <>
                  <i className="bi-exclamation-triangle-fill me-1" aria-hidden="true" />
                  Your trial has ended
                </>
              )}
            </p>
          </div>
        </div>

        {!isBusiness && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className={buttonClassNames({ variant: "primary", className: "shimmer-btn" })}
          >
            <i className="bi-rocket-takeoff me-2" aria-hidden="true" />
            {status === "expired" ? "Upgrade to Pro or Business" : "Upgrade plan"}
          </button>
        )}
      </div>

      {status === "trialing" && (
        <>
          <div className={styles.trialProgress}>
            <div className={styles.trialProgressHeader}>
              <span>Trial period</span>
              <span className={styles.trialDaysLeft}>
                {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left
              </span>
            </div>
            <div className={styles.trialTrack}>
              <div className={styles.trialFill} style={{ width: `${trialElapsedPct}%` }} />
            </div>
          </div>

          <div className={styles.trialFeatures}>
            <span className={styles.trialFeaturesLabel}>What&apos;s included in your trial</span>
            <ul className={styles.trialFeaturesList}>
              {TRIAL_FEATURE_HIGHLIGHTS.map((feature) => (
                <li key={feature}>
                  <i className="bi-check-circle-fill" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {status === "expired" && (
        <div className={styles.expiredNotice}>
          Upgrade to Pro or Business to keep the full feature set you had during your trial.
          You&apos;re on the Free plan until you upgrade.
        </div>
      )}

      {memberSince && (
        <p className={styles.memberSince}>
          <i className="bi-calendar3 me-1" aria-hidden="true" />
          Member since {memberSince}
        </p>
      )}
    </div>
  );
}
