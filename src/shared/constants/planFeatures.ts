import type { SubscriptionPlan } from "./plans";

export interface PlanFeatureSet {
  tagline: string;
  features: string[];
}

/** Single source of truth for plan marketing copy - shown on the landing pricing page and the in-app upgrade flow. */
export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatureSet> = {
  free: {
    tagline: "Best for beginners trying out PostGen AI",
    features: [
      "Up to 3 social platforms",
      "10 AI posts per month",
      "5 image prompts",
      "Basic hashtags generator",
      "Basic calls to action",
      "Community support",
    ],
  },
  pro: {
    tagline: "Best for independent creators and professionals",
    features: [
      "Up to 8 social platforms",
      "Unlimited AI posts generation",
      "Unlimited image prompts",
      "Premium trending hashtags",
      "High-impact hooks builder",
      "Multiple brand content tones",
      "Priority customer support",
    ],
  },
  business: {
    tagline: "Best for marketing teams and agencies",
    features: [
      "12 social platforms coverage",
      "Unlimited AI posts generation",
      "Team collaboration workspace",
      "Custom brand voice training",
      "Full campaigns history",
      "Developer API access",
      "Dedicated account manager",
    ],
  },
};
