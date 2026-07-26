import { PLAN_LABELS, TRIAL_PLAN, type SubscriptionPlan } from "@/shared/constants/plans";

export type SubscriptionStatus = "trialing" | "active" | "expired";

export interface SubscriptionSummary {
  status: SubscriptionStatus;
  /** The plan whose feature set actually applies right now - "business" while trialing, otherwise the billed plan. */
  effectivePlan: SubscriptionPlan;
  /** The plan the account is billed for / falls back to once the trial ends. */
  billedPlan: SubscriptionPlan;
  trialEndsAt: string | null;
  /** 0 outside of an active trial. */
  daysRemaining: number;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface SubscriptionStatusInput {
  plan: SubscriptionPlan;
  trialEndsAt: string | null;
}

export function getSubscriptionSummary(
  user: SubscriptionStatusInput,
  now: Date = new Date(),
): SubscriptionSummary {
  const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
  const isTrialing = trialEndsAt !== null && trialEndsAt.getTime() > now.getTime();

  if (isTrialing) {
    const daysRemaining = Math.max(
      1,
      Math.ceil((trialEndsAt!.getTime() - now.getTime()) / DAY_IN_MS),
    );
    return {
      status: "trialing",
      effectivePlan: TRIAL_PLAN,
      billedPlan: user.plan,
      trialEndsAt: user.trialEndsAt,
      daysRemaining,
    };
  }

  const trialLapsedWithoutUpgrade = trialEndsAt !== null && user.plan === "free";
  if (trialLapsedWithoutUpgrade) {
    return {
      status: "expired",
      effectivePlan: "free",
      billedPlan: "free",
      trialEndsAt: user.trialEndsAt,
      daysRemaining: 0,
    };
  }

  return {
    status: "active",
    effectivePlan: user.plan,
    billedPlan: user.plan,
    trialEndsAt: null,
    daysRemaining: 0,
  };
}

/**
 * The plan name shown to the user - "Free Trial" while trialing, regardless of which plan's
 * feature set the trial happens to grant (`effectivePlan`). A trial user must never see "Business
 * Plan" until they've actually purchased Business; only `billedPlan` (what they're paying for,
 * or Free by default) drives the displayed name.
 */
export function getPlanDisplayName(subscription: Pick<SubscriptionSummary, "status" | "billedPlan">): string {
  if (subscription.status === "trialing") return "Free Trial";
  return `${PLAN_LABELS[subscription.billedPlan]} Plan`;
}
