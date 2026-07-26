import type { GeneratePostResult } from "@/domain/ports/AIProviderPort";
import { parseHashtagsText } from "./parseHashtagsText";

const FIELD_PATTERNS = {
  hook: /^HOOK:\s*(.*)$/im,
  caption: /^CAPTION:\s*([\s\S]*?)(?=\n[A-Z_]+:|$)/im,
  hashtags: /^HASHTAGS:\s*(.*)$/im,
  cta: /^CTA:\s*(.*)$/im,
  imagePrompt: /^IMAGE_PROMPT:\s*(.*)$/im,
};

/**
 * Parses the strict `HOOK:/CAPTION:/HASHTAGS:/CTA:/IMAGE_PROMPT:` format required by
 * buildSocialPostPrompt. Missing fields resolve to empty rather than throwing, since a
 * partially-malformed model response shouldn't fail the whole platform's generation.
 */
export function parseGeneratedPostText(raw: string): GeneratePostResult {
  const hook = raw.match(FIELD_PATTERNS.hook)?.[1]?.trim() ?? "";
  const caption = raw.match(FIELD_PATTERNS.caption)?.[1]?.trim() ?? "";
  const hashtagsLine = raw.match(FIELD_PATTERNS.hashtags)?.[1]?.trim() ?? "";
  const cta = raw.match(FIELD_PATTERNS.cta)?.[1]?.trim() ?? "";
  const imagePrompt = raw.match(FIELD_PATTERNS.imagePrompt)?.[1]?.trim() ?? "";

  return { hook, caption, hashtags: parseHashtagsText(hashtagsLine), cta, imagePrompt };
}
