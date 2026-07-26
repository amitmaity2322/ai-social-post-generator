import { PLAN_LABELS, type SubscriptionPlan } from "@/shared/constants/plans";
import styles from "./PlanBadge.module.css";

interface PlanBadgeProps {
  plan: Extract<SubscriptionPlan, "pro" | "business">;
  locked?: boolean;
  className?: string;
}

export function PlanBadge({ plan, locked = false, className }: PlanBadgeProps) {
  return (
    <span className={[styles.badge, styles[plan], className].filter(Boolean).join(" ")}>
      {locked && <i className="bi-lock-fill" aria-hidden="true" />}
      {PLAN_LABELS[plan]}
    </span>
  );
}
