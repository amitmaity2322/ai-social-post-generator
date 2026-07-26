"use client";

import Link from "next/link";
import styles from "./PlatformSelector.module.css";
import type { Platform, PlatformOption } from "@/shared/types/content";

const PLATFORM_OPTIONS: PlatformOption[] = [
  { value: "instagram", label: "Instagram", icon: "bi-instagram" },
  { value: "facebook", label: "Facebook", icon: "bi-facebook" },
  { value: "linkedin", label: "LinkedIn", icon: "bi-linkedin" },
  { value: "x", label: "X", icon: "bi-twitter-x" },
  { value: "tiktok", label: "TikTok", icon: "bi-tiktok" },
  { value: "youtube", label: "YouTube", icon: "bi-youtube" },
  { value: "pinterest", label: "Pinterest", icon: "bi-pinterest" },
  { value: "threads", label: "Threads", icon: "bi-threads" },
  { value: "snapchat", label: "Snapchat", icon: "bi-snapchat" },
  { value: "reddit", label: "Reddit", icon: "bi-reddit" },
  { value: "bluesky", label: "Bluesky", icon: "bi-bluesky" },
  { value: "whatsapp", label: "WhatsApp", icon: "bi-whatsapp" },
];

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  allowedPlatforms: Platform[];
}

export function PlatformSelector({ selected, onChange, allowedPlatforms }: PlatformSelectorProps) {
  const allowedSet = new Set(allowedPlatforms);
  const isFullyUnlocked = allowedPlatforms.length >= PLATFORM_OPTIONS.length;

  function toggle(platform: Platform) {
    if (!allowedSet.has(platform)) return;

    if (selected.includes(platform)) {
      onChange(selected.filter((item) => item !== platform));
    } else {
      onChange([...selected, platform]);
    }
  }

  return (
    <div>
      <span className={styles.label}>Platforms</span>
      <div className={styles.grid}>
        {PLATFORM_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.value);
          const isAllowed = allowedSet.has(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              disabled={!isAllowed}
              title={isAllowed ? undefined : "Upgrade your plan to unlock this platform"}
              className={[
                styles.option,
                isSelected ? styles.optionSelected : "",
                !isAllowed ? styles.optionLocked : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isSelected}
            >
              {!isAllowed && <i className={`bi-lock-fill ${styles.lockIcon}`} aria-hidden="true" />}
              <i className={option.icon} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      {!isFullyUnlocked && (
        <p className={styles.upgradeHint}>
          Showing platforms available on your plan.{" "}
          <Link href="/settings">Upgrade to unlock more</Link>.
        </p>
      )}
    </div>
  );
}
