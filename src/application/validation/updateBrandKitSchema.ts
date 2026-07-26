import { z } from "zod";

export const updateBrandKitSchema = z.object({
  brandVoice: z.string().trim().max(500),
  brandColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #6d28d9"),
  logoUrl: z.union([z.literal(""), z.string().trim().url()]),
});

export type UpdateBrandKitInput = z.infer<typeof updateBrandKitSchema>;
