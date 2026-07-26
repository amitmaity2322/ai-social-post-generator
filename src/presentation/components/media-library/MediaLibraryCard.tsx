"use client";

import { useState } from "react";
import { Button } from "@/presentation/components/ui/Button";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import type { Platform } from "@/shared/types/content";
import styles from "./MediaLibraryCard.module.css";

interface MediaLibraryCardProps {
  platform: Platform;
  topic: string;
  imagePrompt: string;
  createdAt: string;
}

export function MediaLibraryCard({
  platform,
  topic,
  imagePrompt,
  createdAt,
}: MediaLibraryCardProps) {
  const [copied, setCopied] = useState(false);
  const meta = PLATFORM_META[platform];

  async function handleCopy() {
    await navigator.clipboard.writeText(imagePrompt);
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
        <span className={styles.date}>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <h3 className={styles.topic}>{topic}</h3>
      <div className={styles.promptBox}>
        <span className={styles.promptLabel}>
          <i className="bi-image" aria-hidden="true" />
          Image prompt
        </span>
        <p className={styles.promptText}>{imagePrompt}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={copied ? "bi-check2" : "bi-clipboard"}
        onClick={handleCopy}
      >
        {copied ? "Copied" : "Copy prompt"}
      </Button>
    </div>
  );
}
