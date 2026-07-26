import { z } from "zod";
import { PLATFORMS } from "@/domain/value-objects/Platform";
import { TONES } from "@/domain/value-objects/Tone";

export const generatePostSchema = z.object({
  topic: z.string().trim().min(3, "Topic must be at least 3 characters").max(200),
  details: z.string().trim().max(1000).optional(),
  platforms: z
    .array(z.enum(PLATFORMS))
    .min(1, "Select at least one platform")
    .max(PLATFORMS.length),
  tone: z.enum(TONES),
});

export type GeneratePostInput = z.infer<typeof generatePostSchema>;
