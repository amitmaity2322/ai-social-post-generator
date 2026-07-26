import type { NextRequest } from "next/server";
import { mapErrorToResponse } from "./errorHandler";

type RouteHandler<Context> = (request: NextRequest, context: Context) => Promise<Response>;

/**
 * Composable replacement for Next's Edge `middleware.ts`: the Groq and Supabase SDKs
 * require the Node runtime, which root middleware can't run on. Wrapping each handler
 * gets the same "cross-cutting concern" benefit (centralized error handling here)
 * without losing Node APIs.
 */
export function withApiHandler<Context = unknown>(
  handler: RouteHandler<Context>,
): RouteHandler<Context> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return mapErrorToResponse(error);
    }
  };
}
