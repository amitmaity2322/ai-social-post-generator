import type { GeneratedPost } from "./GeneratedPost";

export type PostStatus = "draft" | "final";

export interface SavedPost extends GeneratedPost {
  userId: string;
  status: PostStatus;
  createdAt: string;
}
