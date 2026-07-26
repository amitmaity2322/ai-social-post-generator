import { z } from "zod";

export const listPostsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(["draft", "final"]).optional(),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
