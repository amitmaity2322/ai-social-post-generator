import { z } from "zod";
import { SUBSCRIPTION_PLANS } from "@/shared/constants/plans";

export const changePlanSchema = z.object({
  plan: z.enum(SUBSCRIPTION_PLANS),
});

export type ChangePlanInput = z.infer<typeof changePlanSchema>;
