import { z } from "zod";
import { TONES } from "@/domain/value-objects/Tone";

export const updateDefaultToneSchema = z.object({
  defaultTone: z.enum(TONES),
});

export type UpdateDefaultToneInput = z.infer<typeof updateDefaultToneSchema>;
