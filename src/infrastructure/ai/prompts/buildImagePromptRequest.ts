interface BuildImagePromptRequestParams {
  topic: string;
  style?: string;
}

export function buildImagePromptRequest({ topic, style }: BuildImagePromptRequestParams): string {
  return `Write a single, descriptive prompt for an AI image generator to illustrate a social media post about: "${topic}".
${style ? `Visual style: ${style}.` : ""}

Respond with ONLY the image prompt text - one paragraph, no preamble, no quotes, no labels.`;
}
