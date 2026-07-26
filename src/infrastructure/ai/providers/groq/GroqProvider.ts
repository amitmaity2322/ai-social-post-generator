import Groq, { APIError } from "groq-sdk";
import type {
  AIProviderPort,
  StreamCompletionParams,
  GeneratePostParams,
  GeneratePostResult,
  GenerateHashtagsParams,
  GenerateImagePromptParams,
  SummarizeParams,
} from "@/domain/ports/AIProviderPort";
import { AIGenerationError } from "@/domain/errors/AIGenerationError";
import { getGroqEnv } from "@/shared/config/env";
import { buildSocialPostPrompt } from "@/infrastructure/ai/prompts/buildSocialPostPrompt";
import { parseGeneratedPostText } from "@/infrastructure/ai/prompts/parseGeneratedPostText";
import { buildHashtagsPrompt } from "@/infrastructure/ai/prompts/buildHashtagsPrompt";
import { parseHashtagsText } from "@/infrastructure/ai/prompts/parseHashtagsText";
import { buildImagePromptRequest } from "@/infrastructure/ai/prompts/buildImagePromptRequest";
import { buildSummarizePrompt } from "@/infrastructure/ai/prompts/buildSummarizePrompt";
import { cleanPlainTextResponse } from "@/infrastructure/ai/prompts/cleanPlainTextResponse";

/** Wall-clock limit per request. The SDK retries a timed-out request itself (see maxRetries). */
const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Retries on network errors, 5xx responses, and timeouts - never on 4xx (bad prompt,
 * bad API key, etc, where retrying can't help). This is the SDK's own retry loop, not
 * hand-rolled: it already respects `Retry-After` headers and backs off correctly, which
 * a bespoke AbortController+setTimeout loop would be more likely to get subtly wrong.
 */
const DEFAULT_MAX_RETRIES = 3;

function toAIGenerationError(error: unknown): AIGenerationError {
  if (error instanceof AIGenerationError) return error;

  if (error instanceof APIError) {
    return new AIGenerationError(
      `Groq request failed (${error.status ?? "unknown"}): ${error.message}`,
    );
  }

  return new AIGenerationError(error instanceof Error ? error.message : "Groq request failed");
}

/**
 * Singleton facade over the Groq SDK - the only file in the app allowed to import
 * `groq-sdk`. Everything else (use cases, routes) depends on AIProviderPort and calls
 * generatePost / generateHashtags / generateImagePrompt / summarize, or the lower-level
 * streamCompletion used for the SSE generate-post endpoint.
 */
export class GroqProvider implements AIProviderPort {
  private static instance: GroqProvider | null = null;

  private readonly client: Groq;
  private readonly defaultModel: string;

  private constructor() {
    const env = getGroqEnv();
    this.client = new Groq({
      apiKey: env.GROQ_API_KEY,
      timeout: DEFAULT_TIMEOUT_MS,
      maxRetries: DEFAULT_MAX_RETRIES,
    });
    this.defaultModel = env.GROQ_MODEL;
  }

  static getInstance(): GroqProvider {
    GroqProvider.instance ??= new GroqProvider();
    return GroqProvider.instance;
  }

  private async complete(prompt: string, model?: string, signal?: AbortSignal): Promise<string> {
    try {
      const response = await this.client.chat.completions.create(
        {
          model: model ?? this.defaultModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          stream: false,
        },
        { signal },
      );

      const content = response.choices[0]?.message?.content;
      if (!content) throw new AIGenerationError("Groq returned an empty response");
      return content;
    } catch (error) {
      throw toAIGenerationError(error);
    }
  }

  async *streamCompletion({
    prompt,
    model,
    signal,
  }: StreamCompletionParams): AsyncIterable<string> {
    let stream;
    try {
      stream = await this.client.chat.completions.create(
        {
          model: model ?? this.defaultModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          stream: true,
        },
        { signal },
      );
    } catch (error) {
      throw toAIGenerationError(error);
    }

    try {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) yield delta;
      }
    } catch (error) {
      throw toAIGenerationError(error);
    }
  }

  async generatePost(params: GeneratePostParams): Promise<GeneratePostResult> {
    const raw = await this.complete(buildSocialPostPrompt(params), params.model);
    return parseGeneratedPostText(raw);
  }

  async generateHashtags(params: GenerateHashtagsParams): Promise<string[]> {
    const raw = await this.complete(buildHashtagsPrompt(params), params.model);
    return parseHashtagsText(raw);
  }

  async generateImagePrompt(params: GenerateImagePromptParams): Promise<string> {
    const raw = await this.complete(buildImagePromptRequest(params), params.model);
    return cleanPlainTextResponse(raw);
  }

  async summarize(params: SummarizeParams): Promise<string> {
    const raw = await this.complete(buildSummarizePrompt(params), params.model);
    return cleanPlainTextResponse(raw);
  }
}
