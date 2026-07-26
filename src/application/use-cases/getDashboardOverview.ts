import type {
  PostRepositoryPort,
  PlatformCount,
  DailyCount,
} from "@/domain/ports/PostRepositoryPort";
import type { SavedPost } from "@/domain/entities/SavedPost";
import type { Platform } from "@/domain/value-objects/Platform";

interface GetDashboardOverviewDeps {
  postRepository: PostRepositoryPort;
}

export interface DailyPostCount {
  /** Short weekday label, e.g. "Mon". */
  day: string;
  /** ISO calendar date, e.g. "2026-07-21" (UTC). */
  date: string;
  count: number;
}

export interface DashboardOverview {
  totalPosts: number;
  postsThisWeek: number;
  postsThisMonth: number;
  platformsCovered: Platform[];
  recentPosts: SavedPost[];
  platformDistribution: PlatformCount[];
  /** Current calendar week, Monday through Sunday, UTC. */
  weeklyPosts: DailyPostCount[];
}

const RECENT_POSTS_LIMIT = 5;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeekUTC(now: Date): Date {
  const day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start;
}

function startOfMonthUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildWeeklyBuckets(weekStart: Date, dailyCounts: DailyCount[]): DailyPostCount[] {
  const countByDate = new Map(dailyCounts.map((entry) => [entry.date, entry.count]));

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const day = new Date(weekStart);
    day.setUTCDate(day.getUTCDate() + index);
    const date = toDateKey(day);
    return { day: WEEKDAY_LABELS[index]!, date, count: countByDate.get(date) ?? 0 };
  });
}

export async function getDashboardOverview(
  deps: GetDashboardOverviewDeps,
  userId: string,
): Promise<DashboardOverview> {
  const now = new Date();
  const rollingWeekStart = new Date(now.getTime() - WEEK_IN_MS);
  const calendarWeekStart = startOfWeekUTC(now);
  const monthStart = startOfMonthUTC(now);

  const [
    totalPosts,
    postsThisWeek,
    postsThisMonth,
    platformsCovered,
    recentPosts,
    platformDistribution,
    dailyCounts,
  ] = await Promise.all([
    deps.postRepository.countByUser(userId),
    deps.postRepository.countByUserSince(userId, rollingWeekStart),
    deps.postRepository.countByUserSince(userId, monthStart),
    deps.postRepository.distinctPlatformsByUser(userId),
    deps.postRepository.listByUser(userId, RECENT_POSTS_LIMIT),
    deps.postRepository.countByPlatformForUser(userId),
    deps.postRepository.countByUserPerDay(userId, calendarWeekStart, now),
  ]);

  const weeklyPosts = buildWeeklyBuckets(calendarWeekStart, dailyCounts);

  return {
    totalPosts,
    postsThisWeek,
    postsThisMonth,
    platformsCovered,
    recentPosts,
    platformDistribution,
    weeklyPosts,
  };
}
