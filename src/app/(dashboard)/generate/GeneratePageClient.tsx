"use client";

import { useState } from "react";
import { GeneratorForm } from "@/presentation/components/generator/GeneratorForm";
import { PostCard, type PostSaveState } from "@/presentation/components/posts/PostCard";
import { StreamingPostPreview } from "@/presentation/components/generator/StreamingPostPreview";
import { VariantTabs } from "@/presentation/components/generator/VariantTabs";
import { useGeneratePosts } from "@/presentation/hooks/useGeneratePosts";
import { useToast } from "@/presentation/hooks/useToast";
import { savePost } from "@/presentation/services/postGenerationService";
import type { GeneratedPost, Platform, Tone } from "@/shared/types/content";

interface GeneratePageClientProps {
  allowedPlatforms: Platform[];
  initialTone: Tone;
}

export function GeneratePageClient({ allowedPlatforms, initialTone }: GeneratePageClientProps) {
  const { isGenerating, platformStates, error, generate } = useGeneratePosts();
  const { showToast } = useToast();
  const [activeVariant, setActiveVariant] = useState<Partial<Record<Platform, number>>>({});
  const [saveStates, setSaveStates] = useState<Record<string, PostSaveState>>({});
  const [draftSaveStates, setDraftSaveStates] = useState<Record<string, PostSaveState>>({});

  const platforms = Object.keys(platformStates) as Platform[];

  function handleGenerate(request: Parameters<typeof generate>[0]) {
    setActiveVariant({});
    setSaveStates({});
    setDraftSaveStates({});
    generate(request);
  }

  async function handleSave(post: GeneratedPost) {
    setSaveStates((current) => ({ ...current, [post.id]: "saving" }));
    try {
      await savePost(post, "final");
      setSaveStates((current) => ({ ...current, [post.id]: "saved" }));
      showToast("success", "Post saved. It now counts toward your dashboard totals.");
    } catch (caughtError) {
      setSaveStates((current) => ({ ...current, [post.id]: "idle" }));
      showToast(
        "error",
        caughtError instanceof Error ? caughtError.message : "Failed to save post",
      );
    }
  }

  async function handleSaveDraft(post: GeneratedPost) {
    setDraftSaveStates((current) => ({ ...current, [post.id]: "saving" }));
    try {
      await savePost(post, "draft");
      setDraftSaveStates((current) => ({ ...current, [post.id]: "saved" }));
      showToast("success", "Saved to Drafts. Publish it anytime from there.");
    } catch (caughtError) {
      setDraftSaveStates((current) => ({ ...current, [post.id]: "idle" }));
      showToast(
        "error",
        caughtError instanceof Error ? caughtError.message : "Failed to save draft",
      );
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <GeneratorForm
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          allowedPlatforms={allowedPlatforms}
          initialTone={initialTone}
        />
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
      <div className="col-12 col-lg-7">
        {platforms.length === 0 ? (
          <div className="pg-surface p-5 text-center pg-text-muted">
            <i
              className="bi-magic d-block mb-2"
              style={{ fontSize: "1.75rem" }}
              aria-hidden="true"
            />
            Your generated posts will appear here.
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {platforms.map((platform) => {
              const variants = platformStates[platform];
              if (!variants) return null;

              const activeIndex = activeVariant[platform] ?? 0;
              const active = variants[activeIndex];

              return (
                <div key={platform}>
                  {variants.length > 1 && (
                    <VariantTabs
                      variants={variants}
                      activeIndex={activeIndex}
                      onSelect={(index) =>
                        setActiveVariant((current) => ({ ...current, [platform]: index }))
                      }
                    />
                  )}

                  {!active ? null : active.status === "complete" && active.post ? (
                    <PostCard
                      post={active.post}
                      onSave={handleSave}
                      saveState={saveStates[active.post.id]}
                      onSaveDraft={handleSaveDraft}
                      draftSaveState={draftSaveStates[active.post.id]}
                    />
                  ) : active.status === "error" ? (
                    <div className="alert alert-danger mb-0" role="alert">
                      <strong className="text-capitalize">{platform}</strong> suggestion{" "}
                      {activeIndex + 1} failed to generate: {active.errorMessage}
                    </div>
                  ) : (
                    <StreamingPostPreview platform={platform} rawText={active.bufferedText} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
