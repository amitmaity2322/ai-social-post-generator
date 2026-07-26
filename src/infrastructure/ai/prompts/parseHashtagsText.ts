/**
 * Splits a raw hashtag line (with or without a `HASHTAGS:` label, `#` symbols, or
 * comma separators - models are inconsistent about which) into a clean tag list.
 */
export function parseHashtagsText(raw: string): string[] {
  return raw
    .replace(/^HASHTAGS:\s*/im, "")
    .split(/[,#\n]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}
