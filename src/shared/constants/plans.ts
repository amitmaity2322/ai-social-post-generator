export const SUBSCRIPTION_PLANS = ["free", "pro", "business"] as const;

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export function isSubscriptionPlan(value: string): value is SubscriptionPlan {
  return (SUBSCRIPTION_PLANS as readonly string[]).includes(value);
}

/** How many platforms (counted in catalog order) each plan unlocks. */
export const PLAN_PLATFORM_LIMITS: Record<SubscriptionPlan, number> = {
  free: 3,
  pro: 8,
  business: 12,
};

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
};

export const PLAN_MONTHLY_PRICE: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 19,
  business: 49,
};

/** Length of the automatic trial every new account starts with. */
export const TRIAL_DAYS = 15;

/** Plan whose feature set a trial grants access to - the top tier, so the trial showcases everything. */
export const TRIAL_PLAN: SubscriptionPlan = "business";

/** Sentinel used across the *_LIMITS records below to mean "no cap". */
export const UNLIMITED = -1;

export function isUnlimited(limit: number): boolean {
  return limit === UNLIMITED;
}

/** AI-generated posts per calendar month. */
export const PLAN_POST_LIMITS: Record<SubscriptionPlan, number> = {
  free: 10,
  pro: 200,
  business: UNLIMITED,
};

/** AI credits per calendar month - approximated at 1 credit per generated post (see getSubscriptionOverview). */
export const PLAN_AI_CREDIT_LIMITS: Record<SubscriptionPlan, number> = {
  free: 50,
  pro: 1000,
  business: UNLIMITED,
};

/** Team seats, owner included. */
export const PLAN_TEAM_MEMBER_LIMITS: Record<SubscriptionPlan, number> = {
  free: 1,
  pro: 5,
  business: 20,
};

/** Storage allowance in megabytes. */
export const PLAN_STORAGE_LIMITS_MB: Record<SubscriptionPlan, number> = {
  free: 250,
  pro: 5_000,
  business: 50_000,
};
