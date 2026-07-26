/**
 * Response parser for single-string completions (image prompts, summaries): trims
 * whitespace and strips wrapping quotes models sometimes add despite being told not to.
 */
export function cleanPlainTextResponse(raw: string): string {
  return raw
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .trim();
}
