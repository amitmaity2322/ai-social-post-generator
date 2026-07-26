interface BuildSummarizePromptParams {
  text: string;
  maxSentences?: number;
}

export function buildSummarizePrompt({
  text,
  maxSentences = 3,
}: BuildSummarizePromptParams): string {
  return `Summarize the following text in at most ${maxSentences} sentences. Keep it factual and concise.

Text:
"""
${text}
"""

Respond with ONLY the summary text - no preamble, no labels.`;
}
