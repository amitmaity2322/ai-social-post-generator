import { UsageMeter } from "./UsageMeter";
import { buttonClassNames } from "@/presentation/components/ui";
import type { SubscriptionOverview } from "@/application/use-cases/getSubscriptionOverview";
import styles from "./UsageOverview.module.css";

interface UsageOverviewProps {
  usage: SubscriptionOverview["usage"];
  showUpgradeButton: boolean;
  onUpgradeClick: () => void;
}

export function UsageOverview({ usage, showUpgradeButton, onUpgradeClick }: UsageOverviewProps) {
  return (
    <div className="pg-surface p-4">
      <div className={styles.header}>
        <div>
          <h3 className="h6 mb-1">Usage overview</h3>
          <p className="pg-text-muted small mb-0">How much of your plan you&apos;ve used this month.</p>
        </div>
        {showUpgradeButton && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className={buttonClassNames({ variant: "primary", size: "sm" })}
          >
            <i className="bi-rocket-takeoff me-2" aria-hidden="true" />
            Upgrade plan
          </button>
        )}
      </div>

      <div className={styles.grid}>
        <UsageMeter
          icon="bi-magic"
          label="Posts generated"
          used={usage.posts.used}
          limit={usage.posts.limit}
        />
        <UsageMeter
          icon="bi-lightning-charge-fill"
          label="AI credits used"
          used={usage.aiCredits.used}
          limit={usage.aiCredits.limit}
        />
        <UsageMeter
          icon="bi-grid-fill"
          label="Social platforms"
          used={usage.platforms.used}
          limit={usage.platforms.limit}
        />
        <UsageMeter
          icon="bi-people-fill"
          label="Team members"
          used={usage.teamMembers.used}
          limit={usage.teamMembers.limit}
        />
        <UsageMeter
          icon="bi-hdd-fill"
          label="Storage used"
          used={usage.storageMb.used}
          limit={usage.storageMb.limit}
          unit="MB"
        />
      </div>
    </div>
  );
}
