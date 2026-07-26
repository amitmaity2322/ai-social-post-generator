import { parseSSEStream } from "@/shared/utils/parseSSEStream";
import type {
  GenerateRequest,
  GeneratedPost,
  GenerationStreamEvent,
  HistoryItem,
  PostStatus,
} from "@/shared/types/content";

interface ErrorResponseBody {
  success: false;
  error: { code: string; message: string };
}

/**
 * The one place in the app allowed to know POST /api/posts/generate's wire
 * format. Hooks and components call this - never fetch("/api/posts/generate")
 * directly - so a future change to the endpoint has exactly one call site to update.
 */
export async function* streamGeneratePosts(
  request: GenerateRequest,
  signal?: AbortSignal,
): AsyncGenerator<GenerationStreamEvent> {
  const response = await fetch("/api/posts/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }

  for await (const frame of parseSSEStream(response)) {
    switch (frame.event) {
      case "chunk":
      case "platform_complete":
      case "platform_error":
        yield frame.data as GenerationStreamEvent;
        break;
      case "error":
        yield { type: "stream_error", message: (frame.data as { message: string }).message };
        break;
      case "done":
        yield { type: "done" };
        break;
    }
  }
}

/**
 * The one place in the app allowed to know POST /api/posts's wire format,
 * mirroring streamGeneratePosts above.
 */
export async function savePost(post: GeneratedPost, status: PostStatus = "final"): Promise<void> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      platform: post.platform,
      tone: post.tone,
      topic: post.topic,
      hook: post.hook,
      caption: post.caption,
      hashtags: post.hashtags,
      cta: post.cta,
      imagePrompt: post.imagePrompt,
      status,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}

/** The one place in the app allowed to know GET /api/posts's wire format. */
export async function listPosts(status?: PostStatus): Promise<HistoryItem[]> {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(`/api/posts${query}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }

  const body = (await response.json()) as { success: true; data: HistoryItem[] };
  return body.data;
}

/** The one place in the app allowed to know DELETE /api/posts/[id]'s wire format. */
export async function deletePostById(id: string): Promise<void> {
  const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}

/** The one place in the app allowed to know PATCH /api/posts/[id]'s wire format (publishing a draft). */
export async function publishPostById(id: string): Promise<void> {
  const response = await fetch(`/api/posts/${id}`, { method: "PATCH" });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}
