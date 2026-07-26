import type { AIProviderPort } from "@/domain/ports/AIProviderPort";
import type { GeneratedPost } from "@/domain/entities/GeneratedPost";
import type { Platform } from "@/domain/value-objects/Platform";
import { AIGenerationError } from "@/domain/errors/AIGenerationError";
import { buildSocialPostPrompt } from "@/infrastructure/ai/prompts/buildSocialPostPrompt";
import { parseGeneratedPostText } from "@/infrastructure/ai/prompts/parseGeneratedPostText";
import { mergeAsyncIterables } from "@/shared/utils/mergeAsyncIterables";
import { POST_VARIANTS_PER_PLATFORM } from "@/shared/constants/generation";
import type { GeneratePostInput } from "@/application/validation/generatePostSchema";

export type GenerationEvent =
  | { type: "chunk"; platform: Platform; variantIndex: number; delta: string }
  | { type: "platform_complete"; platform: Platform; variantIndex: number; post: GeneratedPost }
  | { type: "platform_error"; platform: Platform; variantIndex: number; message: string };

interface GenerateSocialPostDeps {
  aiProvider: AIProviderPort;
}

type PlatformStreamResult = { ok: true; delta: string } | { ok: false; message: string };

async function* safePlatformStream(
  iterable: AsyncIterable<string>,
): AsyncGenerator<PlatformStreamResult> {
  try {
    for await (const delta of iterable) {
      yield { ok: true, delta };
    }
  } catch (error) {
    yield { ok: false, message: error instanceof Error ? error.message : "Generation failed" };
  }
}

/** Composite source key, since each platform now runs `POST_VARIANTS_PER_PLATFORM` drafts in parallel. */
function sourceKey(platform: Platform, variantIndex: number): string {
  return `${platform}:${variantIndex}`;
}

function parseSourceKey(key: string): { platform: Platform; variantIndex: number } {
  const [platform, variantIndex] = key.split(":");
  return { platform: platform as Platform, variantIndex: Number(variantIndex) };
}

export async function* generateSocialPost(
  deps: GenerateSocialPostDeps,
  input: GeneratePostInput,
  brandVoice?: string,
): AsyncGenerator<GenerationEvent> {
  const sources = input.platforms.flatMap((platform) =>
    Array.from({ length: POST_VARIANTS_PER_PLATFORM }, (_, variantIndex) => ({
      key: sourceKey(platform, variantIndex),
      iterable: safePlatformStream(
        deps.aiProvider.streamCompletion({
          prompt: buildSocialPostPrompt({
            platform,
            tone: input.tone,
            topic: input.topic,
            details: input.details,
            variantIndex,
            variantCount: POST_VARIANTS_PER_PLATFORM,
            brandVoice,
          }),
        }),
      ),
    })),
  );

  const buffers = new Map<string, string>(sources.map(({ key }) => [key, ""]));
  const failedKeys = new Set<string>();

  try {
    for await (const { key, value } of mergeAsyncIterables(sources)) {
      const { platform, variantIndex } = parseSourceKey(key);
      if (value.ok) {
        buffers.set(key, (buffers.get(key) ?? "") + value.delta);
        yield { type: "chunk", platform, variantIndex, delta: value.delta };
      } else {
        failedKeys.add(key);
        yield { type: "platform_error", platform, variantIndex, message: value.message };
      }
    }
  } catch (error) {
    throw new AIGenerationError(error instanceof Error ? error.message : "AI generation failed");
  }

  for (const platform of input.platforms) {
    for (let variantIndex = 0; variantIndex < POST_VARIANTS_PER_PLATFORM; variantIndex++) {
      const key = sourceKey(platform, variantIndex);
      if (failedKeys.has(key)) continue;

      const parsed = parseGeneratedPostText(buffers.get(key) ?? "");
      yield {
        type: "platform_complete",
        platform,
        variantIndex,
        post: {
          id: crypto.randomUUID(),
          platform,
          tone: input.tone,
          topic: input.topic,
          ...parsed,
        },
      };
    }
  }
}
