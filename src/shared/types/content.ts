export type Platform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "x"
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "threads"
  | "snapchat"
  | "reddit"
  | "bluesky"
  | "whatsapp";

export type Tone = "professional" | "casual" | "witty" | "bold" | "friendly";

export type PostStatus = "draft" | "final";

export interface PlatformOption {
  value: Platform;
  label: string;
  icon: string;
}

export interface ToneOption {
  value: Tone;
  label: string;
  description: string;
}

export interface GeneratedPost {
  id: string;
  platform: Platform;
  tone: Tone;
  topic: string;
  caption: string;
  hook: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
}

export interface HistoryItem {
  id: string;
  platform: Platform;
  topic: string;
  caption: string;
  status: PostStatus;
  createdAt: string;
}

export interface GenerateRequest {
  topic: string;
  details?: string;
  platforms: Platform[];
  tone: Tone;
}

/**
 * The wire contract with POST /api/posts/generate's SSE stream, defined on the
 * frontend's own terms rather than imported from the backend's use case - a
 * fetch() call is a serialization boundary, not a shared-type guarantee.
 */
export type GenerationStreamEvent =
  | { type: "chunk"; platform: Platform; variantIndex: number; delta: string }
  | { type: "platform_complete"; platform: Platform; variantIndex: number; post: GeneratedPost }
  | { type: "platform_error"; platform: Platform; variantIndex: number; message: string }
  | { type: "stream_error"; message: string }
  | { type: "done" };
