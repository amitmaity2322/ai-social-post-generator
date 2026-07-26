"use client";

import { useState } from "react";
import { Button } from "@/presentation/components/ui/Button";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import type { GeneratedPost } from "@/shared/types/content";
import styles from "./PostCard.module.css";

export type PostSaveState = "idle" | "saving" | "saved";

interface PostCardProps {
  post: GeneratedPost;
  onSave?: (post: GeneratedPost) => void;
  saveState?: PostSaveState;
  onSaveDraft?: (post: GeneratedPost) => void;
  draftSaveState?: PostSaveState;
}

export function PostCard({
  post,
  onSave,
  saveState = "idle",
  onSaveDraft,
  draftSaveState = "idle",
}: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const meta = PLATFORM_META[post.platform];

  async function handleCopy() {
    const text = [
      post.hook,
      post.caption,
      post.hashtags.map((tag) => `#${tag}`).join(" "),
      post.cta,
    ]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`pg-surface ${styles.card}`}>
      <div className={styles.header}>
        <span className={styles.platform}>
          <i className={meta.icon} aria-hidden="true" />
          {meta.label}
        </span>
        <div className="d-flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={copied ? "bi-check2" : "bi-clipboard"}
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          {onSaveDraft && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                draftSaveState === "saved" ? "bi-file-earmark-check" : "bi-file-earmark-post"
              }
              isLoading={draftSaveState === "saving"}
              disabled={draftSaveState === "saved" || saveState === "saved"}
              onClick={() => onSaveDraft(post)}
            >
              {draftSaveState === "saved"
                ? "Saved as draft"
                : draftSaveState === "saving"
                  ? "Saving..."
                  : "Save as draft"}
            </Button>
          )}
          {onSave && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={saveState === "saved" ? "bi-bookmark-check-fill" : "bi-bookmark-plus"}
              isLoading={saveState === "saving"}
              disabled={saveState === "saved" || draftSaveState === "saved"}
              onClick={() => onSave(post)}
            >
              {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      <p className={styles.hook}>{post.hook}</p>
      <p className={styles.caption}>{post.caption}</p>
      <p className={styles.hashtags}>{post.hashtags.map((tag) => `#${tag}`).join(" ")}</p>

      <div className={styles.cta}>
        <i className="bi-megaphone" aria-hidden="true" />
        {post.cta}
      </div>

      <div className={styles.imagePrompt}>
        <span className={styles.imagePromptLabel}>
          <i className="bi-image" aria-hidden="true" /> Image prompt
        </span>
        <p>{post.imagePrompt}</p>
      </div>
    </div>
  );
}
