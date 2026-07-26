import { z } from "zod";
import { PLATFORMS } from "@/domain/value-objects/Platform";

export const updateConnectedPlatformsSchema = z.object({
  platforms: z.array(z.enum(PLATFORMS)).max(PLATFORMS.length),
});

export type UpdateConnectedPlatformsInput = z.infer<typeof updateConnectedPlatformsSchema>;
