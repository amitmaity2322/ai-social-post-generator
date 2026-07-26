export const TONES = ["professional", "casual", "witty", "bold", "friendly"] as const;

export type Tone = (typeof TONES)[number];

export function isTone(value: string): value is Tone {
  return (TONES as readonly string[]).includes(value);
}
