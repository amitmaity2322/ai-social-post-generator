import type { Platform } from "@/domain/value-objects/Platform";
import type { Tone } from "@/domain/value-objects/Tone";
import { PLATFORM_GUIDANCE, TONE_GUIDANCE } from "./platformGuidance";

interface BuildSocialPostPromptParams {
  platform: Platform;
  tone: Tone;
  topic: string;
  details?: string;
  /** 0-based index of this draft among `variantCount` parallel drafts, used to nudge the model toward distinct options instead of near-duplicates. */
  variantIndex?: number;
  variantCount?: number;
  /** Free-text brand personality from the user's Brand Kit, e.g. "witty but never sarcastic, always mention sustainability". */
  brandVoice?: string;
}

export function buildSocialPostPrompt({
  platform,
  tone,
  topic,
  details,
  variantIndex,
  variantCount,
  brandVoice,
}: BuildSocialPostPromptParams): string {
  const variantGuidance =
    variantCount && variantCount > 1
      ? `\nThis is option ${(variantIndex ?? 0) + 1} of ${variantCount}. Give it a distinctly different hook, angle, and structure than the other options - it should read as a genuinely separate choice, not a reworded duplicate.\n`
      : "";

  return `You are a social media copywriter. Write a ${platform} post about: "${topic}".
${details ? `Additional context: ${details}` : ""}
${variantGuidance}
Platform style: ${PLATFORM_GUIDANCE[platform]}
Tone: ${TONE_GUIDANCE[tone]}
${brandVoice ? `Brand voice: ${brandVoice}` : ""}

Respond using EXACTLY this format, with no extra commentary before or after:

HOOK: <one attention-grabbing opening line>
CAPTION: <the main post body>
HASHTAGS: <comma-separated hashtags, no # symbol, 3-6 tags>
CTA: <one clear call to action>
IMAGE_PROMPT: <a descriptive prompt for an image generator to illustrate this post>`;
}
