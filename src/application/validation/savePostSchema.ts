import { z } from "zod";
import { PLATFORMS } from "@/domain/value-objects/Platform";
import { TONES } from "@/domain/value-objects/Tone";

export const savePostSchema = z.object({
  platform: z.enum(PLATFORMS),
  tone: z.enum(TONES),
  topic: z.string().trim().min(1).max(200),
  hook: z.string().trim().min(1).max(300),
  caption: z.string().trim().min(1).max(3000),
  hashtags: z.array(z.string().trim().min(1).max(50)).max(15),
  cta: z.string().trim().min(1).max(300),
  imagePrompt: z.string().trim().min(1).max(500),
  status: z.enum(["draft", "final"]).default("final"),
});

export type SavePostInput = z.infer<typeof savePostSchema>;
