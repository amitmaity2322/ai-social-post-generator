import type { Platform } from "@/domain/value-objects/Platform";

interface BuildHashtagsPromptParams {
  topic: string;
  platform?: Platform;
  count?: number;
}

export function buildHashtagsPrompt({
  topic,
  platform,
  count = 6,
}: BuildHashtagsPromptParams): string {
  return `Generate ${count} relevant, discoverable social media hashtags about: "${topic}".
${platform ? `Target platform: ${platform}.` : ""}

Respond using EXACTLY this format, with no extra commentary before or after:

HASHTAGS: <comma-separated hashtags, no # symbol>`;
}
