import type { GeneratedPost } from "@/domain/entities/GeneratedPost";
import type { Platform } from "@/domain/value-objects/Platform";
import type { Tone } from "@/domain/value-objects/Tone";

export interface StreamCompletionParams {
  prompt: string;
  model?: string;
  signal?: AbortSignal;
}

export interface GeneratePostParams {
  platform: Platform;
  tone: Tone;
  topic: string;
  details?: string;
  model?: string;
}

export type GeneratePostResult = Omit<GeneratedPost, "id" | "platform" | "tone" | "topic">;

export interface GenerateHashtagsParams {
  topic: string;
  platform?: Platform;
  count?: number;
  model?: string;
}

export interface GenerateImagePromptParams {
  topic: string;
  style?: string;
  model?: string;
}

export interface SummarizeParams {
  text: string;
  maxSentences?: number;
  model?: string;
}

/**
 * The one seam between the app and any LLM vendor. Application code depends only on
 * this interface, never on a concrete provider or its SDK - so generateSocialPost (and
 * anything else) can be tested with a fake implementation, and swapping vendors means
 * writing one new adapter, not touching a single use case.
 */
export interface AIProviderPort {
  streamCompletion(params: StreamCompletionParams): AsyncIterable<string>;
  generatePost(params: GeneratePostParams): Promise<GeneratePostResult>;
  generateHashtags(params: GenerateHashtagsParams): Promise<string[]>;
  generateImagePrompt(params: GenerateImagePromptParams): Promise<string>;
  summarize(params: SummarizeParams): Promise<string>;
}
