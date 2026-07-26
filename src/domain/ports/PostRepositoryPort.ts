import type { GeneratedPost } from "@/domain/entities/GeneratedPost";
import type { SavedPost, PostStatus } from "@/domain/entities/SavedPost";
import type { Platform } from "@/domain/value-objects/Platform";

export interface PlatformCount {
  platform: Platform;
  count: number;
}

export interface DailyCount {
  /** ISO calendar date, e.g. "2026-07-25" (UTC). */
  date: string;
  count: number;
}

/**
 * Every method here except listByUserWithStatus/countDraftsByUser considers
 * "final" posts only (drafts are excluded from totals, history, analytics,
 * and the calendar) - a draft isn't finished content yet.
 */
export interface PostRepositoryPort {
  save(userId: string, post: GeneratedPost, status: PostStatus): Promise<SavedPost>;
  listByUser(userId: string, limit: number): Promise<SavedPost[]>;
  listByUserWithStatus(userId: string, status: PostStatus, limit: number): Promise<SavedPost[]>;
  deleteByIdForUser(id: string, userId: string): Promise<void>;
  updateStatus(id: string, userId: string, status: PostStatus): Promise<SavedPost>;
  countByUser(userId: string): Promise<number>;
  countDraftsByUser(userId: string): Promise<number>;
  countByUserSince(userId: string, since: Date): Promise<number>;
  distinctPlatformsByUser(userId: string): Promise<Platform[]>;
  countByPlatformForUser(userId: string): Promise<PlatformCount[]>;
  countByUserPerDay(userId: string, since: Date, until: Date): Promise<DailyCount[]>;
  listByUserInRange(userId: string, since: Date, until: Date): Promise<SavedPost[]>;
}
