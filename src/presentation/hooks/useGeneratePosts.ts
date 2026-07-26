"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { streamGeneratePosts } from "@/presentation/services/postGenerationService";
import { POST_VARIANTS_PER_PLATFORM } from "@/shared/constants/generation";
import type { GenerateRequest, GeneratedPost, Platform } from "@/shared/types/content";

export interface PlatformStreamState {
  status: "streaming" | "complete" | "error";
  bufferedText: string;
  post?: GeneratedPost;
  errorMessage?: string;
}

type PlatformVariants = PlatformStreamState[];

interface UseGeneratePostsResult {
  isGenerating: boolean;
  platformStates: Partial<Record<Platform, PlatformVariants>>;
  error: string | null;
  generate: (request: GenerateRequest) => Promise<void>;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function emptyVariant(): PlatformStreamState {
  return { status: "streaming", bufferedText: "" };
}

function updateVariant(
  variants: PlatformVariants,
  variantIndex: number,
  update: (current: PlatformStreamState) => PlatformStreamState,
): PlatformVariants {
  const next = [...variants];
  next[variantIndex] = update(next[variantIndex] ?? emptyVariant());
  return next;
}

export function useGeneratePosts(): UseGeneratePostsResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [platformStates, setPlatformStates] = useState<Partial<Record<Platform, PlatformVariants>>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const generate = useCallback(async (request: GenerateRequest) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setError(null);
    setIsGenerating(true);
    setPlatformStates(
      Object.fromEntries(
        request.platforms.map((platform) => [
          platform,
          Array.from({ length: POST_VARIANTS_PER_PLATFORM }, emptyVariant),
        ]),
      ),
    );

    try {
      for await (const event of streamGeneratePosts(request, controller.signal)) {
        if (event.type === "chunk") {
          setPlatformStates((current) => ({
            ...current,
            [event.platform]: updateVariant(
              current[event.platform] ?? [],
              event.variantIndex,
              (variant) => ({
                status: "streaming",
                bufferedText: variant.bufferedText + event.delta,
              }),
            ),
          }));
        } else if (event.type === "platform_complete") {
          setPlatformStates((current) => ({
            ...current,
            [event.platform]: updateVariant(
              current[event.platform] ?? [],
              event.variantIndex,
              (variant) => ({
                status: "complete",
                bufferedText: variant.bufferedText,
                post: event.post,
              }),
            ),
          }));
        } else if (event.type === "platform_error") {
          setPlatformStates((current) => ({
            ...current,
            [event.platform]: updateVariant(
              current[event.platform] ?? [],
              event.variantIndex,
              (variant) => ({
                status: "error",
                bufferedText: variant.bufferedText,
                errorMessage: event.message,
              }),
            ),
          }));
        } else if (event.type === "stream_error") {
          setError(event.message);
        }
      }
    } catch (caughtError) {
      if (!isAbortError(caughtError)) {
        setError(caughtError instanceof Error ? caughtError.message : "Failed to generate posts");
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { isGenerating, platformStates, error, generate };
}
