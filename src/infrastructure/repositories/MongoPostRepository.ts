import type { Db, WithId, Filter } from "mongodb";
import { ObjectId } from "mongodb";
import type {
  PostRepositoryPort,
  PlatformCount,
  DailyCount,
} from "@/domain/ports/PostRepositoryPort";
import type { GeneratedPost } from "@/domain/entities/GeneratedPost";
import type { SavedPost, PostStatus } from "@/domain/entities/SavedPost";
import type { Platform } from "@/domain/value-objects/Platform";
import type { Tone } from "@/domain/value-objects/Tone";
import { NotFoundError } from "@/domain/errors/NotFoundError";

interface PostDocument {
  userId: string;
  platform: Platform;
  tone: Tone;
  topic: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  createdAt: Date;
  /** Optional so pre-existing documents (saved before drafts existed) still parse - they're treated as final. */
  status?: PostStatus;
}

/** Matches "final" AND documents with no status field at all (pre-existing posts) - only excludes drafts. */
const NOT_DRAFT_FILTER: Filter<PostDocument> = { status: { $ne: "draft" } };

function toSavedPost(doc: WithId<PostDocument>): SavedPost {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    platform: doc.platform,
    tone: doc.tone,
    topic: doc.topic,
    hook: doc.hook,
    caption: doc.caption,
    hashtags: doc.hashtags,
    cta: doc.cta,
    imagePrompt: doc.imagePrompt,
    status: doc.status ?? "final",
    createdAt: doc.createdAt.toISOString(),
  };
}

export class MongoPostRepository implements PostRepositoryPort {
  constructor(private readonly db: Db) {}

  private get collection() {
    return this.db.collection<PostDocument>("savedPosts");
  }

  async save(userId: string, post: GeneratedPost, status: PostStatus): Promise<SavedPost> {
    const createdAt = new Date();

    const { insertedId } = await this.collection.insertOne({
      userId,
      platform: post.platform,
      tone: post.tone,
      topic: post.topic,
      hook: post.hook,
      caption: post.caption,
      hashtags: post.hashtags,
      cta: post.cta,
      imagePrompt: post.imagePrompt,
      createdAt,
      status,
    });

    return {
      id: insertedId.toString(),
      userId,
      platform: post.platform,
      tone: post.tone,
      topic: post.topic,
      hook: post.hook,
      caption: post.caption,
      hashtags: post.hashtags,
      cta: post.cta,
      imagePrompt: post.imagePrompt,
      status,
      createdAt: createdAt.toISOString(),
    };
  }

  async listByUser(userId: string, limit: number): Promise<SavedPost[]> {
    const docs = await this.collection
      .find({ userId, ...NOT_DRAFT_FILTER })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return docs.map(toSavedPost);
  }

  async listByUserWithStatus(
    userId: string,
    status: PostStatus,
    limit: number,
  ): Promise<SavedPost[]> {
    const docs = await this.collection
      .find({ userId, status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return docs.map(toSavedPost);
  }

  // Scoped by userId AND _id together, not _id alone - this is the one
  // authorization check MongoDB has no RLS-style backstop for, so it has to
  // be correct here, in application code, with no second line of defense.
  async deleteByIdForUser(id: string, userId: string): Promise<void> {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Post not found");

    const result = await this.collection.deleteOne({ _id: new ObjectId(id), userId });
    if (result.deletedCount === 0) throw new NotFoundError("Post not found");
  }

  async updateStatus(id: string, userId: string, status: PostStatus): Promise<SavedPost> {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Post not found");

    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: { status } },
      { returnDocument: "after" },
    );

    if (!doc) throw new NotFoundError("Post not found");
    return toSavedPost(doc);
  }

  async countByUser(userId: string): Promise<number> {
    return this.collection.countDocuments({ userId, ...NOT_DRAFT_FILTER });
  }

  async countDraftsByUser(userId: string): Promise<number> {
    return this.collection.countDocuments({ userId, status: "draft" });
  }

  async countByUserSince(userId: string, since: Date): Promise<number> {
    return this.collection.countDocuments({
      userId,
      createdAt: { $gte: since },
      ...NOT_DRAFT_FILTER,
    });
  }

  async distinctPlatformsByUser(userId: string): Promise<Platform[]> {
    return this.collection.distinct("platform", { userId, ...NOT_DRAFT_FILTER });
  }

  async countByPlatformForUser(userId: string): Promise<PlatformCount[]> {
    const results = await this.collection
      .aggregate<{ _id: Platform; count: number }>([
        { $match: { userId, ...NOT_DRAFT_FILTER } },
        { $group: { _id: "$platform", count: { $sum: 1 } } },
      ])
      .toArray();

    return results.map(({ _id, count }) => ({ platform: _id, count }));
  }

  async countByUserPerDay(userId: string, since: Date, until: Date): Promise<DailyCount[]> {
    const results = await this.collection
      .aggregate<{ _id: string; count: number }>([
        { $match: { userId, createdAt: { $gte: since, $lte: until }, ...NOT_DRAFT_FILTER } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    return results.map(({ _id, count }) => ({ date: _id, count }));
  }

  async listByUserInRange(userId: string, since: Date, until: Date): Promise<SavedPost[]> {
    const docs = await this.collection
      .find({ userId, createdAt: { $gte: since, $lt: until }, ...NOT_DRAFT_FILTER })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(toSavedPost);
  }
}
