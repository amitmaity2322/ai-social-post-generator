import type { PostRepositoryPort } from "@/domain/ports/PostRepositoryPort";
import type { TeamRepositoryPort } from "@/domain/ports/TeamRepositoryPort";
import type { User } from "@/domain/entities/User";
import { getSubscriptionSummary, type SubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { getAllowedPlatformsForPlan } from "@/domain/value-objects/planPlatformAccess";
import {
  PLAN_AI_CREDIT_LIMITS,
  PLAN_POST_LIMITS,
  PLAN_STORAGE_LIMITS_MB,
  PLAN_TEAM_MEMBER_LIMITS,
} from "@/shared/constants/plans";

interface GetSubscriptionOverviewDeps {
  postRepository: PostRepositoryPort;
  teamRepository: TeamRepositoryPort;
}

export interface UsageMetric {
  used: number;
  limit: number;
}

export interface SubscriptionOverview {
  subscription: SubscriptionSummary;
  usage: {
    posts: UsageMetric;
    aiCredits: UsageMetric;
    platforms: UsageMetric;
    teamMembers: UsageMetric;
    storageMb: UsageMetric;
  };
  /** True when a persistent "Upgrade plan" CTA should be shown: free/trial/expired, or any metered usage at 80%+. */
  shouldPromptUpgrade: boolean;
}

const UPGRADE_PROMPT_THRESHOLD = 0.8;

function isNearLimit(metric: UsageMetric): boolean {
  if (metric.limit < 0) return false; // unlimited
  return metric.limit > 0 && metric.used / metric.limit >= UPGRADE_PROMPT_THRESHOLD;
}

function startOfMonthUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Storage and per-generation AI credit spend aren't tracked anywhere yet (no file storage or
 * per-call metering exists in this app), so both are estimated from real post counts: 1 AI
 * credit per generated post, and ~2MB of storage per post (covers an image prompt's worth of
 * assets). Posts, platforms, and team seats are all real counts.
 */
export async function getSubscriptionOverview(
  deps: GetSubscriptionOverviewDeps,
  user: User,
): Promise<SubscriptionOverview> {
  const now = new Date();
  const monthStart = startOfMonthUTC(now);
  const subscription = getSubscriptionSummary(user, now);
  const { effectivePlan } = subscription;

  const [postsThisMonth, totalPosts, platformsCovered, pendingInvites] = await Promise.all([
    deps.postRepository.countByUserSince(user.id, monthStart),
    deps.postRepository.countByUser(user.id),
    deps.postRepository.distinctPlatformsByUser(user.id),
    deps.teamRepository.listPendingByOwner(user.id),
  ]);

  const storageEstimateMb = Math.min(PLAN_STORAGE_LIMITS_MB[effectivePlan], totalPosts * 2);

  const usage = {
    posts: { used: postsThisMonth, limit: PLAN_POST_LIMITS[effectivePlan] },
    aiCredits: { used: postsThisMonth, limit: PLAN_AI_CREDIT_LIMITS[effectivePlan] },
    platforms: {
      used: platformsCovered.length,
      limit: getAllowedPlatformsForPlan(effectivePlan).length,
    },
    teamMembers: { used: 1 + pendingInvites.length, limit: PLAN_TEAM_MEMBER_LIMITS[effectivePlan] },
    storageMb: { used: storageEstimateMb, limit: PLAN_STORAGE_LIMITS_MB[effectivePlan] },
  };

  const shouldPromptUpgrade =
    subscription.status !== "active" ||
    subscription.effectivePlan === "free" ||
    Object.values(usage).some(isNearLimit);

  return { subscription, usage, shouldPromptUpgrade };
}
