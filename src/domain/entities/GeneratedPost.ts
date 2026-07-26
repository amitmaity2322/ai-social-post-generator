import type { Platform } from "@/domain/value-objects/Platform";
import type { Tone } from "@/domain/value-objects/Tone";

export interface GeneratedPost {
  id: string;
  platform: Platform;
  tone: Tone;
  topic: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
}
